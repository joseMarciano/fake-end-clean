import { Request, Response } from 'express'
import { Controller } from '../../../presentation/protocols'
import { HttpRequest } from '../../../presentation/protocols/Http'

export const controllerAdapter = (controller: Controller): any => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.query
    }

    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode === 302) return res.redirect(httpResponse.body.to)

    return res.status(httpResponse.statusCode).send(httpResponse.body)
  }
}
