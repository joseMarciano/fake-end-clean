export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/fake-end',
  port: process.env.PORT ?? 8080,
  defaultPath: process.env.DEFAULT_PATH ?? '/api',
  signUpUrlGitHub: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID ?? '20cbf116d9a6a6412589'}`
}
