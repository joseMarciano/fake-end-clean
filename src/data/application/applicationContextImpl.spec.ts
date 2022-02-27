import { ApplicationContext } from '../protocols/application/ApplicationContext'
import { ApplicationContextImpl } from './ApplicationContextImpl'

const makeSut = (): ApplicationContext => {
  return new ApplicationContextImpl()
}

describe('ApplicationContextImpl', () => {
  test('Should throw Error if user is null', async () => {
    const sut = makeSut()
    await expect(sut.getUser()).rejects.toThrowError(new Error('Fail on load ApplicationContext'))
  })
})
