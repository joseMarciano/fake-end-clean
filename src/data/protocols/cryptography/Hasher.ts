export interface Hasher {
  hash: (input: string) => Promise<string>
}
