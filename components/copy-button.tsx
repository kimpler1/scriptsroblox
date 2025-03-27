"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { toast } from "@/lib/toast"

interface CopyButtonProps {
  code: string
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyScript = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)

    toast({
      title: "Скопировано",
      description: "Код скрипта скопирован в буфер обмена",
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Button
      className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all duration-300 hover:shadow-md"
      onClick={handleCopyScript}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Скопировано!
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Скопировать скрипт
        </>
      )}
    </Button>
  )
}

