import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/cryptography/Decrypter'
import { Encrypter } from '../../../data/protocols/cryptography/Encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secretKey: string
  ) {}

  async encrypt (input: any): Promise<string> {
    return await Promise.resolve(jwt.sign(input, this.secretKey))
  }

  async decrypt (input: string): Promise<any> {
    return await Promise.resolve(jwt.decode(input))
  }
}
