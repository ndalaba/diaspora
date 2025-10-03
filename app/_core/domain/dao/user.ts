import { FilterUserDto } from '../../application/dtos/user'
import User, { Token } from '../entities/User'
import { IDao } from './common'

export interface IUserDAO extends IDao<User> {
  findOneByEmail(email: string): Promise<User>
  filter(dto: FilterUserDto): Promise<User[]>
}

export interface ITokenDAO {
  save(token: Token): Promise<Token>
  findOneByToken(token: string): Promise<Token>
  findOneByUser(user: User): Promise<Token>
}
