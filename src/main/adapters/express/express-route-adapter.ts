import { Controller } from '../../../presentation/protocols/controller'
import { Request, Response } from 'express'
import { HttpRequest } from '../../../presentation/protocols/http'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 400) {
      res.status(httpResponse.statusCode).json(httpResponse.body.message)
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
