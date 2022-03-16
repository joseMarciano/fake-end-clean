export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  url?: string
  body?: any
  params?: any
  headers?: any
  paths?: any
}
