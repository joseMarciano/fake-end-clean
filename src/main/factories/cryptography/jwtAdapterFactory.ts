import { JwtAdapter } from '../../../infra/cryptography/jwt/JwtAdapter'
import env from '../../config/env'

export const makeJwtAdapter = (): JwtAdapter => {
  return new JwtAdapter(env.jwtSecretKey)
}
