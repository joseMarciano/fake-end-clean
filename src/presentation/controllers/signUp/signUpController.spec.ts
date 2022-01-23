import { HttpRequest } from 'src/presentation/protocols'
import { SignUpController } from './SignUpController'

interface SutTypes {
  sut: SignUpController
}

const makeSut = (): SutTypes => {
  const sut = new SignUpController()

  return {
    sut
  }
}

describe('SignUpController', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const fakeHttpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(fakeHttpRequest)

    expect(httpResponse).toEqual({
      body: new Error()
    })
  })
})
