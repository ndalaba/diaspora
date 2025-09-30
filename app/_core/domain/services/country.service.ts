import CountryRepository from '../repositories/CountryRepository'
import { CreateCountryDto, CreateCountrySchema } from '../dtos/countryDto'
import Country from '../entities/Country'
import { ValidationError, AlreadyExistsError } from '../../utils/errors.utils'
import { UpdateCountryDto, UpdateCountrySchema } from '../dtos/countryDto'

export default class CountryService {
  constructor(private readonly countryRepo: CountryRepository) {}

  async updateCountry(input: UpdateCountryDto): Promise<Country> {
    const parsed = UpdateCountrySchema.safeParse(input)

    if (!parsed.success) throw new ValidationError(parsed.error.message)

    const existing = await this.countryRepo.findByNameOrCode(input.name, input.code)

    if (existing && existing.id !== input.id)
      throw new AlreadyExistsError(`Country name or code already used ${input.name} ${input.code}`)

    let country = await this.countryRepo.findOrFail(input.id)
    country.name = input.name
    country.code = input.code
    country = await this.countryRepo.save(country)
    return country
  }

  async removeCountry(id: string): Promise<void> {
    const usersCount = await this.countryRepo.countUsers<string>(id)
    const organisationsCount = await this.countryRepo.countOrganisations<string>(id)

    if (usersCount > 0 || organisationsCount > 0)
      throw new Error(`Country has related users or organisations`)

    await this.countryRepo.deleteBy('id', id)
  }

  async createCountry(input: CreateCountryDto): Promise<Country> {
    const parsed = CreateCountrySchema.safeParse(input)

    if (!parsed.success) throw new ValidationError(parsed.error.message)

    const existing = await this.countryRepo.findByNameOrCode(input.name, input.code)

    if (existing) throw new AlreadyExistsError(`Country already created ${input.name}`)

    let country = new Country(parsed.data)
    country = await this.countryRepo.save(country)
    return country
  }

  async findCountry(id: string): Promise<Country> {
    const country = await this.countryRepo.findOrFail(id)
    return country
  }

  async getAllCountries(): Promise<Country[]> {
    const countries = await this.countryRepo.findAll()
    return countries
  }
}
