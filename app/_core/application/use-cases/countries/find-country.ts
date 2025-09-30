import CountryRepository from '../../../domain/repositories/CountryRepository'
import Country from '../../../domain/entities/Country'

export default async function findCountry(
  id: string,
  countryRepo: CountryRepository
): Promise<Country> {
  const country = await countryRepo.findOrFail(id)
  return country
}
