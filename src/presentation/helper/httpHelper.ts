import { HttpResponse } from '../protocols'

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: getDefaultErrorStructure(error)
  }
}

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: getDefaultErrorStructure(error)
  }
}

export const ok = (body: any): HttpResponse => {
  return {
    statusCode: 200,
    body
  }
}

function getDefaultErrorStructure (error: Error): any {
  return {
    message: error.message,
    error: error.name
  }
}
