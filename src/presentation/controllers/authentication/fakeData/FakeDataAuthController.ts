import { SetUserContext } from '../../../../data/protocols/application/UserContext'
import { SetFakeContext } from '../../../../data/protocols/application/fakeData/ApplicationContextFake'
import { Decrypter } from '../../../../data/protocols/cryptography/Decrypter'
import { FindProjectByIdRepository } from '../../../../data/protocols/project/FindProjectByIdRepository'
import { badRequest, noContent, serverError, unauthorized } from '../../../../presentation/helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../../../presentation/protocols'
import { FindUserByIdRepository } from '../../../../data/protocols/user/FindUserByIdRepository'
import { FindResourceByNameAndProjectIdRepository } from '../../../../data/protocols/resource/FindResourceByNameAndProjectIdRepository'

export class FakeDataAuthController implements Controller {
  constructor (
    private readonly applicationContext: SetUserContext,
    private readonly fakeApplicationContext: SetFakeContext,
    private readonly decrypter: Decrypter,
    private readonly findProjectByIdRepository: FindProjectByIdRepository,
    private readonly findUserByIdRepository: FindUserByIdRepository,
    private readonly findResourceByNameAndProjectIdRepository: FindResourceByNameAndProjectIdRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const projectId = await this.decrypter.decrypt(httpRequest.headers?.authorization)
      if (!projectId) return unauthorized()

      const project = await this.findProjectByIdRepository.findById(projectId, false)
      if (!project) return badRequest(new Error('Project not found'))

      const user = await this.findUserByIdRepository.findById(project.user)
      if (!user) return badRequest(new Error('User not found'))

      await this.applicationContext.setUser(user)

      const url = httpRequest.url?.replace(/^\//, '') ?? ''
      const matchResourceName = url.match(/^[a-zA-Z]+\//)

      if (!matchResourceName) return badRequest(new Error('Resource not found'))

      const resourceName = matchResourceName[0].replace('/', '')

      const resource = await this.findResourceByNameAndProjectIdRepository.findByNameAndProjectId({ name: resourceName, projectId })

      if (!resource) return badRequest(new Error('Resource not found'))

      await this.fakeApplicationContext.setFakeContext({
        project,
        resource
      })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
