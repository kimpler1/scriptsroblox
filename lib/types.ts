export interface Mode {
  id: number
  name: string
  description: string
  image?: string
  image_url?: string
  createdBy?: string
  created_by?: string
  createdAt?: string
  created_at?: string
  scriptCount: number
}

export interface Script {
  id: number
  title: string
  description: string
  instructions?: string
  code: string
  image?: string
  image_url?: string
  modeId: number
  mode_id?: number
  mode: {
    id: number
    name: string
  }
  modeName?: string
  views: number
  createdBy?: string
  created_by?: string
  createdAt: string
  created_at?: string
}

export interface User {
  id: number
  username: string
  password?: string
  isAdmin?: boolean
  is_admin: boolean
  createdAt?: string
  created_at?: string
}

export interface Cheat {
  id: number
  name: string
  description: string
  fullDescription: string
  full_description?: string
  image?: string
  image_url?: string
  type: string
  color: string
  downloadUrlPC: string
  download_url_pc?: string
  downloadUrlAPK: string
  download_url_apk?: string
  createdBy?: string
  created_by?: string
  createdAt?: string
  created_at?: string
}

