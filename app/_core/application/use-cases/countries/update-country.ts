import { UpdateCountryDto, UpdateCountrySchema } from '../../dtos/countryDto'
import CountryRepository from '../../../domain/repositories/CountryRepository'
import Country from '@/app/_core/domain/entities/Country'
import { AlreadyExistsError, ValidationError } from '../../../utils/errors.utils'

export default async function updateCountry(
  input: UpdateCountryDto,
  countryRepo: CountryRepository
): Promise<Country> {
  const parsed = UpdateCountrySchema.safeParse(input)

  if (!parsed.success) throw new ValidationError(parsed.error.message)

  const existing = await countryRepo.findByNameOrCode(input.name, input.code)

  if (existing && existing.id !== input.id)
    throw new AlreadyExistsError(`Country name or code already used ${input.name} ${input.code}`)

  let country = await countryRepo.findOrFail(input.id)
  country.name = input.name
  country.code = input.code
  country = await countryRepo.save(country)
  return country
}
