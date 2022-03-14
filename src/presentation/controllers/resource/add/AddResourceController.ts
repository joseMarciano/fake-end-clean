import { AddResourceError } from '../../../../domain/usecases/resource/validations/AddResourceError'
import { AddResource, AddResourceModel } from '../../../../domain/usecases/resource/add/AddResource'
import { badRequest, ok, serverError } from '../../../helper/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../../protocols'

export class AddResourceController implements Controller {
  constructor (
    private readonly addResource: AddResource,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest)

      if (error) return badRequest(error)

      const resourceModel: AddResourceModel = {
        ...httpRequest.body,
        project: httpRequest.paths.projectId
      }

      const result = await this.addResource.add(resourceModel)

      if (result instanceof AddResourceError) return badRequest(result)

      return ok(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
