export class UpdateAccessTokenError extends Error {
  constructor (message?: string) {
    super()
    this.name = 'UpdateAccessTokenError'
    this.message = !message ? 'Error on update accessToken' : message
  }
}
