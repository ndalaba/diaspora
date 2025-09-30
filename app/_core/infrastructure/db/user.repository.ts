import DataSource from '../../core/db'
import AbstractRepository from './abstract.repository'
import User, { Token } from '../../domain/entities/User'
import { FilterUserDto } from '../../domain/bkp/users/user.schema'

export class UserRepository extends AbstractRepository<User> {
  constructor() {
    super(User)
  }

  getOrFail(uid: string): Promise<User> {
    const query = this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.country', 'countries')
      .leftJoinAndSelect('users.creator', 'creator')
      .where('users.uid = :uid', { uid: uid })
    return query.getOneOrFail()
  }

  async findOneBy(key: string, value: any): Promise<User> {
    if (value == null) return null
    return await this.repository.findOne({ where: { [key]: value } })
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.findOneBy('email', email)
  }

  filter(dto: FilterUserDto): Promise<User[]> {
    const query = this.repository
      .createQueryBuilder('users')
      .innerJoin(
        'organisation_members',
        'organisation_members',
        'organisation_members.user_id = users.id'
      )
      .innerJoin(
        'organisations',
        'organisations',
        'organisation_members.organisation_id = organisations.id'
      )
      .leftJoinAndSelect('users.country', 'countries')
    if (dto.email && dto.email.trim().length)
      query.andWhere('users.email LIKE :email', { email: `'%${dto.email}%'` })

    if (dto.phone && dto.phone.trim().length)
      query.andWhere('users.phone LIKE :phone', { phone: `'%${dto.phone}%'` })

    if (dto.firstName && dto.firstName.trim().length)
      query.andWhere('users.firstName LIKE :firstName', {
        firstName: `'%${dto.firstName}%'`
      })

    if (dto.lastName && dto.lastName.trim().length)
      query.andWhere('users.lastName LIKE :lastName', {
        lastName: `'%${dto.lastName}%'`
      })

    if (dto.city && dto.city.trim().length)
      query.andWhere('users.city LIKE :city', { city: `'%${dto.city}%'` })

    if (dto.country_id && +dto.country_id !== 0) {
      query
        .innerJoinAndSelect('users.country', 'countries')
        .andWhere('users.country_id = :country_id', {
          country_id: dto.country_id
        })
    }

    query.andWhere('organisations.id = :organisation_id', {
      organisation_id: dto.organisation_id
    })

    return query.getMany()
  }

  filterWithSections(dto: FilterUserDto): Promise<User[]> {
    const query = this.repository
      .createQueryBuilder('users')
      .innerJoin(
        'organisation_members',
        'organisation_members',
        'organisation_members.user_id = users.id'
      )
      .innerJoin(
        'organisations',
        'organisations',
        'organisation_members.organisation_id = organisations.id'
      )
      .innerJoinAndSelect('users.sections', 'sections')

    query.andWhere('organisations.id = :organisation_id', {
      organisation_id: dto.organisation_id
    })

    return query.getMany()
  }
}

export class TokenRepository {
  getRepository() {
    return DataSource.getRepository(Token)
  }

  save(token: Token): Promise<Token> {
    return token.save()
  }

  async findOneByToken(token: string): Promise<Token> {
    if (token == undefined) return null
    return await this.getRepository().findOne({
      relations: { user: true },
      where: { token }
    })
  }

  async findOneByUser(user: User): Promise<Token> {
    return await this.getRepository().findOne({
      relations: {
        user: true
      },
      where: {
        user: { id: user.id }
      }
    })
  }
}
