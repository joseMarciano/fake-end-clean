import bcrypt from 'bcrypt'
import { HashCompare } from '../../../data/protocols/cryptography/HashCompare'
import { Hasher } from '../../../data/protocols/cryptography/Hasher'

export class BcryptAdapter implements Hasher, HashCompare {
  constructor (
    private readonly salt: number = 12
  ) {}

  async hash (input: string): Promise<string> {
    return await bcrypt.hash(input, this.salt)
  }

  async compare (data: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(data, hash)
  }
}
