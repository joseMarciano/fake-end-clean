import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/cryptography/Encrypter'

export class JwtAdapter implements Encrypter {
  constructor (
    private readonly secretKey: string
  ) {}

  async encrypt (input: any): Promise<string> {
    return await Promise.resolve(jwt.sign(input, this.secretKey))
  }
}
