import { badRequest, ok, serverError } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'
import InvalidParamError from '../errors/invalid-param-error'
import MissingParamError from '../errors/missing-param-error'
import { AddAccount } from '../../domain/usecases/add-account'

interface SignUpRequestBody {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'password_confirmation'
      ]
      for (const field of requiredFields) {
        if (!httpRequest.body?.[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const {
        name,
        email,
        password,
        password_confirmation
      } = httpRequest.body as SignUpRequestBody
      if (password !== password_confirmation) {
        return badRequest(new InvalidParamError('password_confirmation'))
      }
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
      return badRequest(new Error('Not implemented'))
    } catch (err) {
      return serverError()
    }
  }
}
