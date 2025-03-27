import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Добавляем функцию форматирования даты
export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  // Проверяем, что дата валидна
  if (isNaN(date.getTime())) {
    return "Неизвестная дата"
  }

  // Форматируем дату в локализованную строку
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

