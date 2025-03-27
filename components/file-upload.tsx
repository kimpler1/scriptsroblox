"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText } from "lucide-react"

interface FileUploadProps {
  value: string
  onChange: (value: string) => void
  label: string
  accept?: string
}

export function FileUpload({ value, onChange, label, accept = "*/*" }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value) {
      // Извлекаем имя файла из base64 строки, если оно есть
      const fileNameMatch = value.match(/filename=(.*?);/)
      if (fileNameMatch && fileNameMatch[1]) {
        setFileName(fileNameMatch[1])
      } else {
        setFileName("Загруженный файл")
      }
    } else {
      setFileName(null)
    }
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      // Добавляем имя файла в base64 строку для последующего извлечения
      const fileData = `data:${file.type};filename=${file.name};base64,${result.split(",")[1]}`
      setFileName(file.name)
      onChange(fileData)
    }
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    setFileName(null)
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
            <Upload className="mr-2 h-4 w-4" />
            Загрузить файл
          </Button>
          {fileName && (
            <Button type="button" variant="outline" size="icon" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        {fileName && (
          <div className="flex items-center p-3 bg-muted/50 rounded-md">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-sm font-medium">{fileName}</span>
          </div>
        )}
      </div>
    </div>
  )
}

