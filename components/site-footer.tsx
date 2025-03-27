import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-green-50 dark:bg-green-900/20">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left text-green-700 dark:text-green-300">
            &copy; {new Date().getFullYear()} RobloxScripts. Все права защищены.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/cheats"
            className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          >
            Читы
          </Link>
          <Link
            href="/modes"
            className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          >
            Режимы
          </Link>
        </div>
      </div>
    </footer>
  )
}

