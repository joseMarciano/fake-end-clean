export interface Pageable {
  offset: number
  limit: number
}

export interface Page<T> {
  offset: number
  limit: number
  content: T[]
}
