"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useClient } from "@/hooks/use-client"

export function SiteHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const isClient = useClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isClient]) // Запускаем эффект только на клиенте

  const signOut = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  // Рендерим упрощенную версию на сервере
  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 w-full bg-green-600">
        <div className="container flex h-16 items-center">
          <div className="mr-8">
            <span className="text-2xl font-bold text-white">RobloxScripts</span>
          </div>
          <div className="flex-1"></div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-green-600 shadow-md" : "bg-green-600"
      }`}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">RobloxScripts</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          <Link
            href="/"
            className={`transition-colors hover:text-white/80 ${
              pathname === "/" ? "text-white font-bold" : "text-white/90"
            }`}
          >
            Главная
          </Link>
          <Link
            href="/modes"
            className={`transition-colors hover:text-white/80 ${
              pathname === "/modes" || pathname.startsWith("/modes/") ? "text-white font-bold" : "text-white/90"
            }`}
          >
            Режимы
          </Link>
          <Link
            href="/cheats"
            className={`transition-colors hover:text-white/80 ${
              pathname === "/cheats" || pathname.startsWith("/cheats/") ? "text-white font-bold" : "text-white/90"
            }`}
          >
            Читы
          </Link>
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={`transition-colors hover:text-white/80 ${
                pathname.startsWith("/admin") ? "text-white font-bold" : "text-white/90"
              }`}
            >
              Админ-панель
            </Link>
          )}
        </nav>
        <div className="flex items-center space-x-4 ml-auto">
          {user ? (
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={signOut}
            >
              Выйти
            </Button>
          ) : (
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Войти
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

