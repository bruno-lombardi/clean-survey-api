import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'
import { LogControllerDecorator } from './log'

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return await new Promise((resolve) => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        body: {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@email.com'
        },
        statusCode: 200
      }
      return await new Promise((resolve) => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

interface SutTypes {
  controllerStub: Controller
  sut: LogControllerDecorator
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should return the same response of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      body: {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@email.com'
      },
      statusCode: 200
    })
  })
  it('should call LogErrorRepository with correct error if controller returns serverError', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(error)))

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
