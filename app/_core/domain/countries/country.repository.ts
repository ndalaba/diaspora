import AbstractRepository from '../shared/abstract.repository'
import Country from './country.entity'
import Association from '../associations/association.entity'
import User from '../users/user.entity'

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

  async countAssociations<T>(value: T): Promise<number> {
    const query = this.getRepository<Association>(Association)
      .createQueryBuilder('associations')
      .select('COUNT(associations.id)')

    if (value instanceof Country) query.where('associations.country_id = :id', { id: value.id })
    else if (typeof value === 'number') query.where('associations.country_id = :id', { id: value })
    else if (typeof value === 'string') {
      const country = await this.getOrFail(value)
      query.where('associations.country_id = :id', { id: country.id })
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
