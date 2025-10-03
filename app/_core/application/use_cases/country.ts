import { ICountryDAO } from '../../domain/dao/country'
import { CreateCountryDto, CreateCountrySchema } from '../dtos/country'
import Country from '../../domain/entities/Country'
import { ValidationError, AlreadyExistsError } from '../../utils/errors.utils'
import { UpdateCountryDto, UpdateCountrySchema } from '../dtos/country'

export default class CountryUseCase {
  constructor(private readonly countryDao: ICountryDAO) {}

  async updateCountry(input: UpdateCountryDto): Promise<Country> {
    const parsed = UpdateCountrySchema.safeParse(input)

    if (!parsed.success) throw new ValidationError(parsed.error.message)

    const existing = await this.countryDao.findByNameOrCode(input.name, input.code)

    if (existing && existing.id !== input.id)
      throw new AlreadyExistsError(`Country name or code already used ${input.name} ${input.code}`)

    let country = await this.countryDao.findOrFail(input.id)
    country.name = input.name
    country.code = input.code
    country = await this.countryDao.save(country)
    return country
  }

  async removeCountry(id: string): Promise<void> {
    const usersCount = await this.countryDao.countUsers<string>(id)
    const organisationsCount = await this.countryDao.countOrganisations<string>(id)

    if (usersCount > 0 || organisationsCount > 0)
      throw new Error(`Country has related users or organisations`)

    await this.countryDao.deleteBy('id', id)
  }

  async createCountry(input: CreateCountryDto): Promise<Country> {
    const parsed = CreateCountrySchema.safeParse(input)

    if (!parsed.success) throw new ValidationError(parsed.error.message)

    const existing = await this.countryDao.findByNameOrCode(input.name, input.code)

    if (existing) throw new AlreadyExistsError(`Country already created ${input.name}`)

    let country = new Country(parsed.data)
    country = await this.countryDao.save(country)
    return country
  }

  async findCountry(id: string): Promise<Country> {
    const country = await this.countryDao.findOrFail(id)
    return country
  }

  async getAllCountries(): Promise<Country[]> {
    const countries = await this.countryDao.findAll()
    return countries
  }
}
