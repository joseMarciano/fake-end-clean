/* eslint-disable no-console */
import { MongoHelper } from '../infra/db/mongo/mongoHelper'
import env from './config/env'
import { app } from './config/app'

MongoHelper.connect(env.mongoUrl)
  .then(async () => await MongoHelper.createCustomCollections())
  .then(startServer)
  .catch(console.error)

function startServer (): void {
  app.listen(env.port, () => console.log(`Server is running at ${env.port}`))
}
