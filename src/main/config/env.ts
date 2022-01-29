export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/fake-end',
  port: process.env.PORT ?? 8080,
  defaultPath: process.env.DEFAULT_PATH ?? '/api'
}
