import { CreateCountryDto, CreateCountrySchema } from '../../dtos/countryDto'
import CountryRepository from '../../../domain/repositories/CountryRepository'
import Country from '@/app/_core/domain/entities/Country'
import { AlreadyExistsError, ValidationError } from '../../../utils/errors.utils'

export default async function createCountry(
  input: CreateCountryDto,
  countryRepo: CountryRepository
): Promise<Country> {
  const parsed = CreateCountrySchema.safeParse(input)

  if (!parsed.success) throw new ValidationError(parsed.error.message)

  const existing = await countryRepo.findByNameOrCode(input.name, input.code)

  if (existing) throw new AlreadyExistsError(`Country already created ${input.name}`)

  let country = new Country(parsed.data)
  country = await countryRepo.save(country)
  return country
}
