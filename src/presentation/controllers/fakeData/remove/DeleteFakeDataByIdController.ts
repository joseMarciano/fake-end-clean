import { DeleteFakeDataById } from 'src/domain/usecases/fakeData/remove/DeleteFakeDataById'
import { badRequest, noContent, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../protocols'

export class DeleteFakeDataByIdController implements Controller {
  constructor (
    private readonly deleteFakeData: DeleteFakeDataById,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest)

      if (error) return badRequest(error)

      await this.deleteFakeData.deleteById(httpRequest.paths.id)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
