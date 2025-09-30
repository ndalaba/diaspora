import { Request, Response, Router } from 'express'
import { validate } from '../../../domain/bkp/shared/validate.middleware'
import { CreateCountrySchema, UpdateCountrySchema } from './country.schema'
import StatusCodeUtils from '../../../utils/statusCode.utils'
import CountryService from '../../../domain/bkp/countries/country.service'
import AbstractController from '../../../domain/bkp/shared/abstract.controller'
import { adminMiddleware } from '../auths/auth.middleware'

export default class CountriesController extends AbstractController {
  constructor(
    private readonly countryService: CountryService = new CountryService(),
    private readonly router = Router()
  ) {
    super()
  }

  routes(): Router {
    this.router.post(
      '/',
      adminMiddleware,
      validate(CreateCountrySchema),
      async (req: Request, res: Response) => {
        const response = await this.countryService.createCountry(req.body)
        return response.hasError()
          ? this.errorResponse(res, response.jsonErrors())
          : this.successResponse(res, response.getData('country'), StatusCodeUtils.CREATED)
      }
    )

    this.router.put(
      '/',
      adminMiddleware,
      validate(UpdateCountrySchema),
      async (req: Request, res: Response) => {
        const response = await this.countryService.updateCountry(req.body)
        return response.hasError()
          ? this.errorResponse(res, response.jsonErrors())
          : this.successResponse(res, response.getData('country'), StatusCodeUtils.OK)
      }
    )

    this.router.get('/', async (_: Request, res: Response) => {
      const response = await this.countryService.getCountries()
      return this.successResponse(res, response.getData('countries'))
    })

    this.router.delete('/:uid', async (req: Request, res: Response) => {
      const response = await this.countryService.deleteCountry(req.params.uid)
      return response.hasError()
        ? this.errorResponse(res, response.jsonErrors())
        : this.successResponse(res, null, StatusCodeUtils.OK)
    })
    return this.router
  }
}
