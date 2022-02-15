export class ActivateUserError extends Error {
  constructor (message?: string) {
    super()
    this.name = 'ActivateUserError'
    this.message = !message ? 'Error on activate user' : message
  }
}
