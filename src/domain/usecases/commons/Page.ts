export interface Pageable {
  offset: number
  limit: number
}

export interface Page<T> {
  offset: number
  limit: number
  total: number
  hasNext: boolean
  content: T[]
}

export const PageUtils = {
  buildPage<T> (pageable: Pageable, total: number, arrayResults: T[] = []): Page<T> {
    const hasNext = total - ((pageable.offset || 1) * pageable.limit) > 0
    return {
      total,
      content: arrayResults,
      limit: pageable.limit,
      offset: pageable.offset,
      hasNext
    }
  }
}
