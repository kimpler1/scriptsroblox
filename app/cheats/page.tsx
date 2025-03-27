import { getAllCheats } from "@/lib/cheats.server"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ShieldCheck, Zap, Cpu, Layers, Plus } from "lucide-react"

export default async function CheatsPage() {
  const cheats = await getAllCheats()

  console.log("Cheats on page:", cheats.length)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Читы для Roblox</h1>

      {/* Cheats Grid */}
      {cheats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {cheats.map((cheat) => {
            // Определяем иконку в зависимости от типа чита
            let icon
            switch (cheat.color) {
              case "purple":
                icon = <ShieldCheck className="h-6 w-6 text-purple-500" />
                break
              case "blue":
                icon = <Cpu className="h-6 w-6 text-blue-500" />
                break
              case "amber":
                icon = <Zap className="h-6 w-6 text-amber-500" />
                break
              case "green":
                icon = <Layers className="h-6 w-6 text-green-500" />
                break
              default:
                icon = <ShieldCheck className="h-6 w-6 text-purple-500" />
            }

            // Обработка полей, которые могут иметь разные имена
            const imageUrl = cheat.image_url || cheat.image || "/placeholder.svg?height=200&width=400"

            return (
              <Card
                key={cheat.id}
                className={`overflow-hidden h-full transition-all hover:shadow-lg border-0 shadow-sm bg-white rounded-xl group hover:border-${cheat.color}-200 border-2 border-transparent`}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={cheat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center">
                      {icon}
                      <h3 className="text-2xl font-bold text-white ml-2">{cheat.name}</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 line-clamp-3 mb-4">{cheat.description}</p>
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Link href={`/cheats/${cheat.id}`}>
                      <Download className="mr-2 h-4 w-4" />
                      Скачать
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Читы не найдены</h2>
            <p className="text-gray-600 mb-6">
              В данный момент нет доступных читов. Добавьте первый чит через админ-панель.
            </p>
            <Link href="/admin/cheats/new">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="mr-2 h-4 w-4" />
                Добавить чит
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

