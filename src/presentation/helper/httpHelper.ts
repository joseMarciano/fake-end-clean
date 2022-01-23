import { HttpResponse } from '../protocols'

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error.name
  }
}

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: error.name
  }
}
