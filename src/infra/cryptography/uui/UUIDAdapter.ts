import { RandomStringGenerator } from '../../../data/protocols/cryptography/RandomStringGenerator'
import { v4 } from 'uuid'
export class UUIDAdapter implements RandomStringGenerator {
  async generateRandomString (): Promise<string> {
    return await Promise.resolve(v4())
  }
}
