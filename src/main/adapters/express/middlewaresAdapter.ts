import { NextFunction, Request, Response } from 'express'
import { Controller, HttpRequest } from '../../../presentation/protocols'

export const middlewaresAdapter = (controller: Controller): any => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      url: req.url,
      body: req.body,
      params: req.query,
      headers: req.headers
    }

    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      req.body = {
        ...req.body,
        ...httpResponse.body
      }

      return next()
    }

    return res.status(httpResponse.statusCode)
      .send({
        statusCode: httpResponse.statusCode,
        error: httpResponse.body?.message
      })
  }
}
