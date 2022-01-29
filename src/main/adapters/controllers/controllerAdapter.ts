import { Request, RequestHandler, Response } from 'express'
import { Controller } from '../../../presentation/protocols'
import { HttpRequest } from '../../../presentation/protocols/Http'

export const controllerAdapter = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)

    return res.status(httpResponse.statusCode).send(httpResponse.body)
  }
}
