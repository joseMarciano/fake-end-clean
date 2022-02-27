export class LoginUserError extends Error {
  constructor (message: string) {
    super()
    this.message = message
    this.name = 'LoginUserError'
  }
}
