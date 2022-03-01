import { UUIDAdapter } from './UUIDAdapter'
import uuid from 'uuid'

jest.mock('uuid', () => ({
  v4 (): string {
    return 'any_uuid'
  }
}))

const makeSut = (): UUIDAdapter => (new UUIDAdapter())

describe('UUIDAdapter', () => {
  test('Should call uuid.v4', async () => {
    const sut = makeSut()

    const v4Spy = jest.spyOn(uuid, 'v4')
    await sut.generateRandomString()

    expect(v4Spy).toHaveBeenCalledTimes(1)
  })
})
