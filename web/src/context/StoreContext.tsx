import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Product, SiteContent } from '../types'
import {
  emptyContent,
  exportContentJson,
  getAdminToken,
  loadCart,
  loadTheme,
  saveCart,
  saveTheme,
} from '../lib/storage'
import {
  changePasswordApi,
  fetchContent,
  importContentApi,
  loginApi,
  logoutApi,
  meApi,
  resetContentApi,
  saveContentApi,
} from '../lib/api'

type StoreContextValue = {
  content: SiteContent
  loading: boolean
  error: string | null
  refreshContent: () => Promise<void>
  setContent: (next: SiteContent) => Promise<void>
  resetContent: () => Promise<void>
  exportJson: () => string
  importJson: (raw: string) => Promise<void>
  cart: CartItem[]
  cartCount: number
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartProducts: { product: Product; quantity: number }[]
  theme: 'dark' | 'light'
  toggleTheme: () => void
  adminAuthed: boolean
  authChecked: boolean
  loginAdmin: (password: string) => Promise<boolean>
  logoutAdmin: () => Promise<void>
  changeAdminPassword: (
    current: string,
    next: string,
  ) => Promise<{ ok: boolean; error?: string }>
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() => emptyContent())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>(() => loadCart())
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadTheme())
  const [adminAuthed, setAdminAuthed] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    saveTheme(theme)
  }, [theme])

  const refreshContent = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchContent()
      setContentState(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cargar el contenido del servidor',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshContent()
  }, [refreshContent])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!getAdminToken()) {
        if (!cancelled) {
          setAdminAuthed(false)
          setAuthChecked(true)
        }
        return
      }
      const ok = await meApi()
      if (!cancelled) {
        setAdminAuthed(ok)
        setAuthChecked(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const setContent = useCallback(async (next: SiteContent) => {
    const saved = await saveContentApi(next)
    setContentState(saved)
  }, [])

  const resetContent = useCallback(async () => {
    const next = await resetContentApi()
    setContentState(next)
  }, [])

  const exportJson = useCallback(() => exportContentJson(content), [content])

  const importJson = useCallback(async (raw: string) => {
    const parsed = JSON.parse(raw) as SiteContent
    if (!parsed || !Array.isArray(parsed.products)) {
      throw new Error('JSON inválido: falta products[]')
    }
    const saved = await importContentApi(parsed)
    setContentState(saved)
  }, [])

  const addToCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId)
      const next = existing
        ? prev.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        : [...prev, { productId, quantity: 1 }]
      saveCart(next)
      return next
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const next = prev.filter((i) => i.productId !== productId)
      saveCart(next)
      return next
    })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      const next =
        quantity <= 0
          ? prev.filter((i) => i.productId !== productId)
          : prev.map((i) =>
              i.productId === productId ? { ...i, quantity } : i,
            )
      saveCart(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    saveCart([])
  }, [])

  const cartProducts = useMemo(() => {
    return cart
      .map((item) => {
        const product = content.products.find((p) => p.id === item.productId)
        if (!product) return null
        return { product, quantity: item.quantity }
      })
      .filter(Boolean) as { product: Product; quantity: number }[]
  }, [cart, content.products])

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart],
  )

  const loginAdmin = useCallback(async (password: string) => {
    try {
      await loginApi(password)
      setAdminAuthed(true)
      return true
    } catch {
      setAdminAuthed(false)
      return false
    }
  }, [])

  const logoutAdmin = useCallback(async () => {
    await logoutApi()
    setAdminAuthed(false)
  }, [])

  const changeAdminPassword = useCallback(
    async (current: string, next: string) => {
      try {
        await changePasswordApi(current, next)
        setAdminAuthed(false)
        return { ok: true }
      } catch (err) {
        return {
          ok: false,
          error:
            err instanceof Error ? err.message : 'No se pudo cambiar la contraseña',
        }
      }
    },
    [],
  )

  const value: StoreContextValue = {
    content,
    loading,
    error,
    refreshContent,
    setContent,
    resetContent,
    exportJson,
    importJson,
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    cartProducts,
    theme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    adminAuthed,
    authChecked,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
