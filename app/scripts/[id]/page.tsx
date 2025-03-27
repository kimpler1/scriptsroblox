import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Clock, Tag, ChevronLeft, Eye, User } from "lucide-react"
import { fetchScriptById } from "@/app/actions/scripts-actions"
import { CopyButton } from "@/components/copy-button"

export default async function ScriptPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { from?: string }
}) {
  const script = await fetchScriptById(params.id)

  if (!script) {
    return notFound()
  }

  const fromPath = searchParams.from || "/"

  // Обработка полей, которые могут иметь разные имена
  const imageUrl = script.image_url || script.image || "/placeholder.svg?height=300&width=600"
  const createdAt = script.createdAt || script.created_at || new Date().toISOString()
  const createdBy = script.createdBy || script.created_by
  const views = script.views || 0

  // Обработка поля mode, которое может иметь разную структуру
  const modeName = script.mode?.name || script.modeName || "Неизвестный режим"

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={fromPath}>
        <Button variant="outline" size="sm" className="mb-4 flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Назад
        </Button>
      </Link>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
        <div className="relative h-[300px] w-full">
          <Image src={imageUrl || "/placeholder.svg"} alt={script.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge className="bg-green-600 text-white border-0 mb-4">{modeName}</Badge>
            <h1 className="text-4xl font-bold text-white mb-2 truncate">{script.title}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Добавлен: {formatDate(createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>Просмотров: {views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-amber-600" />
                  Описание
                </h2>
                <p className="text-gray-700 mb-6">{script.description}</p>

                {/* Информация о создателе после описания */}
                {createdBy && (
                  <div className="flex items-center text-gray-600 mt-4">
                    <User className="h-4 w-4 mr-1.5" />
                    <span>Добавил: {createdBy}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden sticky top-24">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Tag className="mr-2 h-5 w-5 text-amber-600" />
                Скрипт
              </h3>
              <div className="bg-gray-900 text-gray-200 p-4 rounded-xl mb-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{script.code}</code>
                </pre>
              </div>
              <CopyButton code={script.code} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

