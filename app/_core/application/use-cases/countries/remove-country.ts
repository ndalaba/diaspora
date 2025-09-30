import CountryRepository from '../../../domain/repositories/CountryRepository'

export default async function removeCountry(
  id: string,
  countryRepo: CountryRepository
): Promise<void> {
  const usersCount = await countryRepo.countUsers<string>(id)
  const organisationsCount = await countryRepo.countOrganisations<string>(id)

  if (usersCount > 0 || organisationsCount > 0)
    throw new Error(`Country has related users or organisations`)

  await countryRepo.deleteBy('id', id)
}
