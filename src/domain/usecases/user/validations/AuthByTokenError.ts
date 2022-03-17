export class AuthByTokenError extends Error {
  constructor (message?: string) {
    super()
    this.name = 'AuthByTokenError'
    this.message = !message ? 'Error on auth user' : message
  }
}
