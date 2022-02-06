import { BcryptAdapter } from '../../../infra/cryptography/BcryptAdapter'

export const makeBcryptAdapter = (): BcryptAdapter => {
  return new BcryptAdapter(12)
}
