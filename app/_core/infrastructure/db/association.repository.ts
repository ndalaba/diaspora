import AbstractRepository from '../shared/abstract.repository'
import { FilterOrganisationDto } from './organisation.schema'
import Organisation, { OrganisationMember } from './organisation.entity'
import User from '../../entities/User'

export default class OrganisationRepository extends AbstractRepository<Organisation> {
  constructor() {
    super(Organisation)
  }

  getOrFail(uid: string): Promise<Organisation> {
    const query = this.repository
      .createQueryBuilder('organisations')
      .innerJoinAndSelect('organisations.country', 'countries')
      .innerJoinAndSelect('organisations.user', 'users')
      .where('organisations.uid = :uid', { uid: uid })
    return query.getOneOrFail()
  }

  findByName(name: string): Promise<Organisation[]> {
    const query = this.repository
      .createQueryBuilder('organisations')
      .leftJoinAndSelect('organisations.country', 'countries')

    query.andWhere('organisations.name LIKE :name', { name: `'%${name}%'` })
    return query.getMany() as Promise<Organisation[]>
  }

  filter(dto: FilterOrganisationDto): Promise<Organisation[]> {
    const query = this.repository
      .createQueryBuilder('organisations')
      .innerJoinAndSelect('organisations.country', 'countries')

    if (dto.city && dto.city.trim().length)
      query.andWhere('organisations.city LIKE :city', {
        city: `'%${dto.city}%'`
      })

    if (dto.name && dto.name.trim().length)
      query.andWhere('organisations.name LIKE :name', {
        name: `'%${dto.name}%'`
      })

    if (dto.user_id && +dto.user_id !== 0)
      query.andWhere('organisations.user_id = :user_id', {
        user_id: dto.user_id
      })

    if (dto.country_id && +dto.country_id !== 0)
      query.andWhere('organisations.country_id = :country_id', {
        country_id: dto.country_id
      })

    return query.getMany()
  }
}

export class OrganisationMemberRepository extends AbstractRepository<OrganisationMember> {
  constructor() {
    super(OrganisationMember)
  }

  getOrFail(uid: string): Promise<OrganisationMember> {
    const query = this.repository
      .createQueryBuilder('organisationMembers')
      .innerJoinAndSelect('organisationMembers.member', 'users')
      .innerJoinAndSelect('organisationMembers.organisation', 'organisation')
      .where('organisationMembers.uid = :uid', { uid: uid })
    return query.getOneOrFail()
  }

  findByOrganisationMember(organisation: Organisation, member: User): Promise<OrganisationMember> {
    const query = this.repository
      .createQueryBuilder('organisationMembers')
      .innerJoinAndSelect('organisationMembers.member', 'users')
      .innerJoinAndSelect('organisationMembers.organisation', 'organisation')
      .where('organisationMembers.user_id = :user_id', { user_id: member.id })
      .andWhere('organisationMembers.organisation_id = :organisation_id', {
        organisation_id: organisation.id
      })

    return query.getOne()
  }
}
