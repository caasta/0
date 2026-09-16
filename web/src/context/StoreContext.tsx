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
  isAdminAuthenticated,
  loadCart,
  loadContent,
  loadTheme,
  resetContent as resetStoredContent,
  saveCart,
  saveContent,
  saveTheme,
  setAdminAuthenticated,
  importContentJson,
  exportContentJson,
} from '../lib/storage'
import { DEFAULT_ADMIN_PASSWORD } from '../data/seed'

type StoreContextValue = {
  content: SiteContent
  setContent: (next: SiteContent) => void
  updateContent: (patch: Partial<SiteContent>) => void
  resetContent: () => void
  exportJson: () => string
  importJson: (raw: string) => void
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
  loginAdmin: (password: string) => boolean
  logoutAdmin: () => void
  changeAdminPassword: (current: string, next: string) => boolean
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() => loadContent())
  const [cart, setCart] = useState<CartItem[]>(() => loadCart())
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadTheme())
  const [adminAuthed, setAdminAuthed] = useState(() => isAdminAuthenticated())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    saveTheme(theme)
  }, [theme])

  const setContent = useCallback((next: SiteContent) => {
    setContentState(next)
    saveContent(next)
  }, [])

  const updateContent = useCallback((patch: Partial<SiteContent>) => {
    setContentState((prev) => {
      const next = { ...prev, ...patch }
      saveContent(next)
      return next
    })
  }, [])

  const resetContent = useCallback(() => {
    const next = resetStoredContent()
    setContentState(next)
  }, [])

  const exportJson = useCallback(() => exportContentJson(content), [content])

  const importJson = useCallback((raw: string) => {
    const next = importContentJson(raw)
    setContentState(next)
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

  const loginAdmin = useCallback(
    (password: string) => {
      const expected = content.admin.password || DEFAULT_ADMIN_PASSWORD
      if (password !== expected) return false
      setAdminAuthenticated(true)
      setAdminAuthed(true)
      return true
    },
    [content.admin.password],
  )

  const logoutAdmin = useCallback(() => {
    setAdminAuthenticated(false)
    setAdminAuthed(false)
  }, [])

  const changeAdminPassword = useCallback(
    (current: string, next: string) => {
      if (current !== content.admin.password) return false
      if (next.trim().length < 4) return false
      const updated = {
        ...content,
        admin: { password: next.trim() },
      }
      setContent(updated)
      return true
    },
    [content, setContent],
  )

  const value: StoreContextValue = {
    content,
    setContent,
    updateContent,
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
