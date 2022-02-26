import { noContent } from '../../../presentation/helper/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'
import request from 'supertest'
import { app } from '../../config/app'
import { middlewaresAdapter } from './middlewaresAdapter'
import { Request, Response } from 'express'

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (_httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(noContent())
    }
  }

  return new ControllerStub()
}

describe('middlewaresApdater', () => {
  test('Should call next() if Controller returns 2xx', async () => {
    const controllerStub = makeControllerStub()

    app.use(middlewaresAdapter(controllerStub))
      .post('/fake-request', (_req: Request, res: Response) => {
        return res.status(200).json(_req.body)
      })

    await request(app)
      .post('/fake-request')
      .send({ message: 'Expect call next function' })
      .expect({ message: 'Expect call next function' })
      .expect(200)
  })
})
