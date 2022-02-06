import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/cryptography/Hasher'

export class BcryptAdapter implements Hasher {
  constructor (
    private readonly salt: number = 12
  ) {}

  async hash (input: string): Promise<string> {
    await bcrypt.hash(input, this.salt)
    return ''
  }
}
