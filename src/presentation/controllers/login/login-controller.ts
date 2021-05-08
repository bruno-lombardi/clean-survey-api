import InvalidParamError from '../../errors/invalid-param-error'
import MissingParamError from '../../errors/missing-param-error'
import { badRequest } from '../../helpers/http-helper'
import { Controller } from '../../protocols/controller'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../protocols/http'

interface LoginRequestBody {
  email: string
  password: string
}

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body?.[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { email } = httpRequest.body as LoginRequestBody
    const isEmailValid = this.emailValidator.isValid(email)
    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }
    return badRequest(new Error('Not implemented'))
  }
}
