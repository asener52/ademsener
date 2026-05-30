export type ContentType = 'article' | 'news' | 'announcement' | 'training'

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  type: ContentType
  tags: string[]
  published: boolean
  featured: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string
  body: string
  read: boolean
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  created_at: string
}

export interface AboutInfo {
  id: string
  full_name: string
  title: string
  organization: string
  bio: string
  skills: string[]
  social_links: {
    linkedin?: string
    github?: string
    twitter?: string
    email?: string
  }
  profile_image: string | null
  updated_at: string
}
