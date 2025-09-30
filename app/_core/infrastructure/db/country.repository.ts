import AbstractRepository from './abstract.repository'
import Country from './country.entity'
import Organisation from '../organisations/organisation.entity'
import User from '../../domain/entities/User'

export class CountryRepository extends AbstractRepository<Country> {
  constructor() {
    super(Country)
  }

  async findAll(): Promise<Country[]> {
    return this.repository.find({
      order: { name: 'asc', id: 'desc' }
    })
  }

  findByName(name: string): Promise<Country | null> {
    return this.repository.findOneBy({ name })
  }

  findByNameOrCode(name: string, code: string): Promise<Country | null> {
    return this.repository
      .createQueryBuilder('countries')
      .where('countries.name = :name OR countries.code = :code', {
        name: name,
        code: code
      })
      .getOne()
  }

  async countOrganisations<T>(value: T): Promise<number> {
    const query = this.getRepository<Organisation>(Organisation)
      .createQueryBuilder('organisations')
      .select('COUNT(organisations.id)')

    if (value instanceof Country) query.where('organisations.country_id = :id', { id: value.id })
    else if (typeof value === 'number') query.where('organisations.country_id = :id', { id: value })
    else if (typeof value === 'string') {
      const country = await this.getOrFail(value)
      query.where('organisations.country_id = :id', { id: country.id })
    }
    return query.getCount()
  }

  async countUsers<T>(value: T): Promise<number> {
    const query = this.getRepository<User>(User)
      .createQueryBuilder('users')
      .select('COUNT(users.id)')

    if (value instanceof Country) query.where('users.country_id = :id', { id: value.id })
    else if (typeof value === 'number') query.where('users.country_id = :id', { id: value })
    else if (typeof value === 'string') {
      const country = await this.getOrFail(value)
      query.where('users.country_id = :id', { id: country.id })
    }
    return query.getCount()
  }
}
