import { GitHubSignUpController } from './GitHubSignUpController'

interface SutTypes {
  sut: GitHubSignUpController
}
const makeSut = (): SutTypes => {
  const sut = new GitHubSignUpController('any_url')

  return {
    sut
  }
}

describe('GitHubSignUpController', () => {
  test('Should redirect on signUp', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse.statusCode).toBe(302)
    expect(httpResponse.body).toBeTruthy()
    expect(httpResponse.body.to).toContain('any_url')
  })
})
