export class UserNotFoundError extends Error {
  constructor (message?: string) {
    super()
    this.name = 'UserNotFoundError'
    this.message = !message ? 'User not found' : message
  }
}
