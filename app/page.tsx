import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Code, Shield, Gamepad2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Добро пожаловать на RobloxScripts</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Ваш надежный источник скриптов, читов и режимов для Roblox. Найдите все необходимое для улучшения вашего
          игрового опыта.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="border-0 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Code className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Скрипты</h2>
            <p className="text-gray-600 mb-6">
              Найдите лучшие скрипты для ваших любимых игр в Roblox. Регулярные обновления и проверенный код.
            </p>
            <Button asChild variant="outline" className="mt-auto">
              <Link href="/modes" className="flex items-center">
                Просмотреть скрипты
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Gamepad2 className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Режимы</h2>
            <p className="text-gray-600 mb-6">
              Исследуйте различные режимы игр Roblox и найдите скрипты, специально разработанные для каждого из них.
            </p>
            <Button asChild variant="outline" className="mt-auto">
              <Link href="/modes" className="flex items-center">
                Просмотреть режимы
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Читы</h2>
            <p className="text-gray-600 mb-6">
              Получите доступ к проверенным читам для Roblox. Безопасные и эффективные решения для улучшения игрового
              процесса.
            </p>
            <Button asChild variant="outline" className="mt-auto">
              <Link href="/cheats" className="flex items-center">
                Просмотреть читы
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

