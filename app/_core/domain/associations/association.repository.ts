import AbstractRepository from '../shared/abstract.repository'
import { FilterAssociationDto } from './association.schema'
import Association, { AssociationMember } from './association.entity'
import User from '../users/user.entity'

export default class AssociationRepository extends AbstractRepository<Association> {
  constructor() {
    super(Association)
  }

  getOrFail(uid: string): Promise<Association> {
    const query = this.repository
      .createQueryBuilder('associations')
      .innerJoinAndSelect('associations.country', 'countries')
      .innerJoinAndSelect('associations.user', 'users')
      .where('associations.uid = :uid', { uid: uid })
    return query.getOneOrFail()
  }

  findByName(name: string): Promise<Association[]> {
    const query = this.repository
      .createQueryBuilder('associations')
      .leftJoinAndSelect('associations.country', 'countries')

    query.andWhere('associations.name LIKE :name', { name: `'%${name}%'` })
    return query.getMany() as Promise<Association[]>
  }

  filter(dto: FilterAssociationDto): Promise<Association[]> {
    const query = this.repository
      .createQueryBuilder('associations')
      .innerJoinAndSelect('associations.country', 'countries')

    if (dto.city && dto.city.trim().length)
      query.andWhere('associations.city LIKE :city', {
        city: `'%${dto.city}%'`
      })

    if (dto.name && dto.name.trim().length)
      query.andWhere('associations.name LIKE :name', {
        name: `'%${dto.name}%'`
      })

    if (dto.user_id && +dto.user_id !== 0)
      query.andWhere('associations.user_id = :user_id', {
        user_id: dto.user_id
      })

    if (dto.country_id && +dto.country_id !== 0)
      query.andWhere('associations.country_id = :country_id', {
        country_id: dto.country_id
      })

    return query.getMany()
  }
}

export class AssociationMemberRepository extends AbstractRepository<AssociationMember> {
  constructor() {
    super(AssociationMember)
  }

  getOrFail(uid: string): Promise<AssociationMember> {
    const query = this.repository
      .createQueryBuilder('associationMembers')
      .innerJoinAndSelect('associationMembers.member', 'users')
      .innerJoinAndSelect('associationMembers.association', 'association')
      .where('associationMembers.uid = :uid', { uid: uid })
    return query.getOneOrFail()
  }

  findByAssociationMember(association: Association, member: User): Promise<AssociationMember> {
    const query = this.repository
      .createQueryBuilder('associationMembers')
      .innerJoinAndSelect('associationMembers.member', 'users')
      .innerJoinAndSelect('associationMembers.association', 'association')
      .where('associationMembers.user_id = :user_id', { user_id: member.id })
      .andWhere('associationMembers.association_id = :association_id', {
        association_id: association.id
      })

    return query.getOne()
  }
}
