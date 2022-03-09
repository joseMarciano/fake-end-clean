export interface DeleteProjectByIdRepository {
  deleteById: (id: string) => Promise<void>
}
