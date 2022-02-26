import request from 'supertest'
import { app } from '../../config/app'
import { randomUUID } from 'crypto'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'
import { middlewaresAdapter } from './middlewaresAdapter'
import { Request, Response } from 'express'
import { noContent, serverError } from '../../../presentation/helper/httpHelper'

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (_httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(noContent())
    }
  }

  return new ControllerStub()
}

describe('middlewaresApdater', () => {
  let randomUrl = ''
  beforeEach(() => {
    randomUrl = '/' + randomUUID()
  })

  test('Should call next() if Controller returns 2xx', async () => {
    const controllerStub = makeControllerStub()

    app.use(middlewaresAdapter(controllerStub))
      .post(randomUrl, (_req: Request, res: Response) => {
        return res.status(200).json(_req.body)
      })

    await request(app)
      .post(randomUrl)
      .send({ message: 'Expect call next function' })
      .expect({ message: 'Expect call next function' })
      .expect(200)
  })

  test('Should not call next() if Controller returns !== 2xx', async () => {
    const controllerStub = makeControllerStub()

    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(new Error('Next function was not called')))

    app.use(middlewaresAdapter(controllerStub))
      .post(randomUrl, (_req: Request, res: Response) => {
        return res.status(200).json({ message: 'Next function was called' })
      })

    await request(app)
      .post(randomUrl)
      .expect({ statusCode: 500, error: 'Next function was not called' })
  })
})
