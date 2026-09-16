import { useEffect, useState } from 'react'
import Header from './components/Header'
import SceneBackground from './components/SceneBackground'
import Hero from './components/Hero'
import Stats from './components/Stats'
import FeaturedProducts from './components/FeaturedProducts'
import HowItWorks from './components/HowItWorks'
import ContactSupport from './components/ContactSupport'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [progress, setProgress] = useState(0)
  const [glow, setGlow] = useState({ x: 0, y: 0, visible: false })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? (doc.scrollTop / max) * 100 : 0)
    }
    const onMove = (e: MouseEvent) => {
      setGlow({ x: e.clientX, y: e.clientY, visible: true })
    }
    const onLeave = () => setGlow((g) => ({ ...g, visible: false }))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <div
        className="store-progress-bar"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
      <div
        className={`store-cursor-glow${glow.visible ? ' is-visible' : ''}`}
        style={{ left: glow.x, top: glow.y }}
        aria-hidden="true"
      />
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
      <main>
        <SceneBackground />
        <Hero />
        <Stats />
        <FeaturedProducts />
        <HowItWorks />
        <ContactSupport />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
