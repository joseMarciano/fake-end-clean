import { JwtAdapter } from '../../../infra/cryptography/jwt/JwtAdapter'

export const makeJwtAdapter = (secretKey?: string): JwtAdapter => {
  return new JwtAdapter(secretKey ?? process.env.JWT_SECRET_KEY as string)
}
