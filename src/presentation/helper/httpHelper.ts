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
export const redirect = (to: string): HttpResponse => {
  return {
    statusCode: 302,
    body: {
      to
    }
  }
}
export const forbiden = (error: Error): HttpResponse => {
  return {
    statusCode: 403,
    body: getDefaultErrorStructure(error)
  }
}

function getDefaultErrorStructure (error: Error): any {
  return {
    message: error.message,
    error: error.name
  }
}
