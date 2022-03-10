export class AddResourceError extends Error {
  constructor (message?: string) {
    super()
    this.name = 'AddResourceError'
    this.message = !message ? 'Error on add Resource' : message
  }
}
