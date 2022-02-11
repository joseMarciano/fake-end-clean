export interface Encrypter {
  encrypt: (input: any) => Promise<string>
}
