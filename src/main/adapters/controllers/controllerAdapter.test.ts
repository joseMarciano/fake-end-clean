import request from 'supertest'
import { app } from '../../../main/config/app'
import { HttpRequest, HttpResponse } from '../../../presentation/protocols'
import { Controller } from '../../../presentation/protocols/Controller'
import { controllerAdapter } from './controllerAdapter'

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve({
        body: {},
        statusCode: 200
      })
    }
  }

  return new ControllerStub()
}

describe('controllerAdapter', () => {
  test('Should call Controller', async () => {
    const controllerStub = makeControllerStub()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    app.all('/', controllerAdapter(controllerStub))

    await request(app)
      .get('/')

    expect(handleSpy).toHaveBeenCalledTimes(1)
  })

  test('Should redirect when statusCode is 302', async () => {
    const controllerStub = makeControllerStub()

    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce({
      body: {},
      statusCode: 302
    })

    app.get('/fake-request', controllerAdapter(controllerStub))

    const response = await request(app)
      .get('/fake-request')

    expect(response.redirect).toBe(true)
  })
})
