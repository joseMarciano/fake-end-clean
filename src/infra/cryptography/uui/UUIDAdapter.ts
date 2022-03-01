import { RandomStringGenerator } from '../../../data/protocols/cryptography/RandomStringGenerator'
import uuid from 'uuid'
export class UUIDAdapter implements RandomStringGenerator {
  async generateRandomString (): Promise<string> {
    return await Promise.resolve(uuid.v4())
  }
}
