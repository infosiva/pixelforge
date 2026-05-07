export type GameGenre = 'platformer' | 'shooter' | 'puzzle' | 'rpg' | 'arcade' | 'other'
export type GameStatus = 'generating' | 'published' | 'flagged' | 'deleted'
export type AgeRating = '8+' | '12+' | '16+'

export interface Game {
  id: string
  title: string
  description: string
  prompt: string
  htmlUrl: string           // Vercel Blob URL for the full HTML
  thumbnailUrl: string
  genre: GameGenre
  ageRating: AgeRating
  status: GameStatus
  authorId: string
  authorName: string
  remixedFromId?: string
  playCount: number
  likeCount: number
  remixCount: number
  createdAt: string
  publishedAt?: string
}

export interface GameAsset {
  id: string
  gameId: string
  type: 'sprite' | 'background' | 'icon'
  url: string
  prompt: string
}

export interface GenerateRequest {
  prompt: string
  genre: GameGenre
}

export interface GenerateResponse {
  gameId: string
  title: string
  description: string
  htmlUrl: string
  thumbnailUrl: string
  assets: GameAsset[]
}

export interface PlayEvent {
  gameId: string
  score?: number
  durationSeconds: number
}
