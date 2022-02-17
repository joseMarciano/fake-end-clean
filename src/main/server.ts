/* eslint-disable no-console */
import 'dotenv/config'
import { MongoHelper } from '../infra/db/mongo/mongoHelper'
import { app } from './config/app'

MongoHelper.connect(process.env.MONGO_URL as string)
  .then(async () => await MongoHelper.createCustomCollections())
  .then(startServer)
  .catch(console.error)

function startServer (): void {
  app.listen(process.env.PORT, () => console.log(`Server is running at ${process.env.PORT as string}`))
}
