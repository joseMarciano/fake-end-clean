export interface DeleteResourceById {
  deleteById: (id: string) => Promise<void>
}
