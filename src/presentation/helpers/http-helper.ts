import ServerError from '../errors/server-error'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  body: error,
  statusCode: 400
})

export const serverError = (): HttpResponse => ({
  body: new ServerError(),
  statusCode: 500
})
