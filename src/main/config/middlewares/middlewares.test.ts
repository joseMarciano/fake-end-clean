import request from 'supertest'
import { app } from '../app'

describe('middlewares', () => {
  describe('CORS', () => {
    test('Should enable CORS', async () => {
      app.get('/test_cors', (_req, res) => res.send())

      await request(app)
        .get('/test_cors')
        .expect('access-control-allow-origin', '*')
    })
  })
  describe('BodyParser', () => {
    test('Should parse body as json', async () => {
      app.post('/test_body_parser', (req, res) => res.send(req.body))

      await request(app)
        .post('/test_body_parser')
        .send({ name: 'Any_content' })
        .expect({ name: 'Any_content' })
    })
  })
})
