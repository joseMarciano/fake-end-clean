import { BcryptAdapter } from '../../../infra/cryptography/bcrypt/BcryptAdapter'

export const makeBcryptAdapter = (): BcryptAdapter => {
  return new BcryptAdapter(12)
}
