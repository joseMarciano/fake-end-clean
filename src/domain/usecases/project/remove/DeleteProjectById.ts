export interface DeleteProjectById {
  deleteById: (id: string) => Promise<void>
}
