import { UUIDAdapter } from '../../../infra/cryptography/uui/UUIDAdapter'

export const makeUUIDAdapter = (): UUIDAdapter => (new UUIDAdapter())
