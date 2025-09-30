import CountryRepository from '../../../domain/repositories/CountryRepository'
import Country from '../../../domain/entities/Country'

export default async function getAllCountries(countryRepo: CountryRepository): Promise<Country[]> {
  const countries = await countryRepo.findAll()
  return countries
}
