export interface Decrypter {
  decrypt: (input: string) => Promise<any>
}
