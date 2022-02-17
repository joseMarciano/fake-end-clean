import { JwtAdapter } from '../../../infra/cryptography/jwt/JwtAdapter'

export const makeJwtAdapter = (): JwtAdapter => {
  return new JwtAdapter(process.env.JWT_SECRET_KEY as string)
}
