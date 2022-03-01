export interface RandomStringGenerator {
  generateRandomString: () => Promise<string>
}
