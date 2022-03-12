export interface DeleteResourceByIdRepository {
  deleteById: (id: string) => Promise<void>
}
