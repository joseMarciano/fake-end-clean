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

export const noContent = (): HttpResponse => {
  return {
    statusCode: 204,
    body: null
  }
}

export const forbiden = (error: Error): HttpResponse => {
  return {
    statusCode: 403,
    body: getDefaultErrorStructure(error)
  }
}

export const unauthorized = (error?: Error): HttpResponse => {
  return {
    statusCode: 401,
    body: getDefaultErrorStructure(error as any)
  }
}

function getDefaultErrorStructure (error: Error): any {
  if (!error) return null
  return {
    message: error.message,
    error: error.name
  }
}
