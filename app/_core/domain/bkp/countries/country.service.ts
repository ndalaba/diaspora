import { CountryRepository } from './country.repository'
import { CreateCountryDto, UpdateCountryDto } from './country.schema'
import Response from '../../../utils/response.utils'
import { tryCatch } from '../../../utils/functions.utils'
import Country from './country.entity'

export default class CountryService {
  constructor(private readonly countryRepo: CountryRepository = new CountryRepository()) {}

  async getCountries(): Promise<Response> {
    return tryCatch(async () => {
      const countries = await this.countryRepo.findAll()
      return new Response().addData('countries', countries)
    }, 'Get countries')
  }

  async deleteCountry(uid: string): Promise<Response> {
    return tryCatch(async () => {
      const usersCount = await this.countryRepo.countUsers<string>(uid)
      if (usersCount > 0) return new Response().addError('has_users', 'This country has users')

      const associationsCount = await this.countryRepo.countAssociations<string>(uid)
      if (associationsCount > 0)
        return new Response().addError('has_associations', 'This country has associations')

      await this.countryRepo.deleteBy('uid', uid)
      return new Response()
    }, uid)
  }

  async updateCountry(dto: UpdateCountryDto): Promise<Response> {
    return tryCatch(async () => {
      const countryExist = async (): Promise<boolean> => {
        const country = await this.countryRepo.findByNameOrCode(dto.name, dto.code)
        return country instanceof Country && country.uid !== dto.uid
      }

      if (await countryExist())
        return new Response().addError('country_exist', 'Country name or code already used')

      let country = (await this.countryRepo.getOrFail(dto.uid)) as Country
      country.code = dto.code
      country.name = dto.name

      country = (await this.countryRepo.save(country)) as Country

      return new Response().addData('country', country)
    }, dto.uid)
  }

  async createCountry(dto: CreateCountryDto): Promise<Response> {
    return tryCatch(async () => {
      const countryExist = async (): Promise<boolean> => {
        const country = await this.countryRepo.findByNameOrCode(dto.name, dto.code)
        return country instanceof Country
      }
      if (await countryExist())
        return new Response().addError('country_exist', 'Country already created')

      let country = new Country(dto)
      country = (await this.countryRepo.save(country)) as Country

      return new Response().addData('country', country)
    }, dto.name)
  }
}
