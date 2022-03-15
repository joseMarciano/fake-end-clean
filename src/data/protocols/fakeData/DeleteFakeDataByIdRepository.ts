export interface DeleteFakeDataByIdRepository {
  deleteById: (id: string) => Promise<void>
}
