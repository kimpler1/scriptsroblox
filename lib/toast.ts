// Простая система уведомлений без использования контекста React

// Типы для уведомлений
type ToastType = "default" | "destructive"

interface ToastOptions {
  title?: string
  description?: string
  variant?: ToastType
  duration?: number
}

// Функция для создания DOM-элемента уведомления
function createToastElement(options: ToastOptions): HTMLElement {
  const { title, description, variant = "default", duration = 3000 } = options

  // Создаем контейнер для уведомления
  const toastElement = document.createElement("div")
  toastElement.className = `fixed z-50 rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 ${
    variant === "destructive" ? "bg-red-600 text-white" : "bg-white text-foreground border"
  }`
  toastElement.style.minWidth = "300px"
  toastElement.style.maxWidth = "500px"

  // Создаем содержимое уведомления
  const contentElement = document.createElement("div")
  contentElement.className = "flex-1"

  if (title) {
    const titleElement = document.createElement("div")
    titleElement.className = "font-semibold mb-1"
    titleElement.textContent = title
    contentElement.appendChild(titleElement)
  }

  if (description) {
    const descriptionElement = document.createElement("div")
    descriptionElement.className = "text-sm opacity-90"
    descriptionElement.textContent = description
    contentElement.appendChild(descriptionElement)
  }

  // Создаем кнопку закрытия
  const closeButton = document.createElement("button")
  closeButton.className = "opacity-70 hover:opacity-100"
  closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
  closeButton.onclick = () => {
    if (document.body.contains(toastElement)) {
      document.body.removeChild(toastElement)
    }
  }

  // Собираем всё вместе
  toastElement.appendChild(contentElement)
  toastElement.appendChild(closeButton)

  // Автоматическое закрытие через указанное время
  setTimeout(() => {
    if (document.body.contains(toastElement)) {
      document.body.removeChild(toastElement)
    }
  }, duration)

  return toastElement
}

// Функция для отображения уведомления
export function toast(options: ToastOptions): void {
  if (typeof window === "undefined") return

  // Создаем контейнер для уведомлений, если его еще нет
  let toastContainer = document.getElementById("toast-container")

  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.id = "toast-container"
    toastContainer.className = "fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    document.body.appendChild(toastContainer)
  }

  // Создаем и добавляем уведомление
  const toastElement = createToastElement(options)
  toastContainer.appendChild(toastElement)
}

