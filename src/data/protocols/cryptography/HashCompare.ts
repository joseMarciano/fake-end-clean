export interface HashCompare {
  compare: (data: string, hash: string) => Promise<boolean>
}
