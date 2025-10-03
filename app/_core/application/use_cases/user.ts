import { IUserDAO } from '../../domain/dao/user'
import { ICountryDAO } from '../../domain/dao/country'
import { CreateUserDto, CreateUserSchema, GetUserDto } from '../dtos/user'
import User from '../../domain/entities/User'
import { AlreadyExistsError, NotAllowedError, ValidationError } from '../../utils/errors.utils'
import bcrypt from 'bcrypt'
import { UpdateImage } from '../dtos/common'
import { UpdateUserDto, UpdateUserSchema } from '../dtos/user'

export default class UserUseCase {
  constructor(
    private readonly userDao: IUserDAO,
    private readonly countryDao: ICountryDAO
  ) {}

  async createUser(input: CreateUserDto): Promise<User> {
    const parsedInput = CreateUserSchema.safeParse(input)
    if (!parsedInput.success) throw new ValidationError(parsedInput.error.message)

    const data = parsedInput.data

    const existingUser = await this.userDao.findOneByEmail(data.email)
    if (existingUser) throw new AlreadyExistsError('User email already exists')

    let user = new User(data)
    user.creator = input.user!
    user.image = 'users/user.png'
    user.password = await bcrypt.hash(user.password!, 6)
    user = await this.userDao.save(user)

    return user
  }

  async getUser(id: string): Promise<User> {
    return await this.userDao.findOrFail(id)
  }

  async removeUser(input: GetUserDto): Promise<void> {
    const user = await this.userDao.findOrFail(input.id)
    if (!user.canManage(input.user.id)) throw new NotAllowedError('Operation not allowed')
    //TODO: remove old image

    await this.userDao.remove(user)
  }

  async updateUserImage(input: UpdateImage): Promise<User> {
    const user = await this.userDao.findOrFail(input.id)
    if (!user.canManage(input.user.id)) throw new NotAllowedError('Operation not allowed')

    if (input.image !== undefined) {
      //TODO: remove old image
      user.image = input.image
    }

    await this.userDao.save(user)

    return user
  }

  async updateUser(input: UpdateUserDto): Promise<User> {
    const parsedInput = UpdateUserSchema.safeParse(input)
    if (!parsedInput.success) throw new ValidationError(parsedInput.error.message)

    const data = parsedInput.data

    const country = await this.countryDao.findOrFail(data.country_id!)

    const user = await this.userDao.findOrFail(data.id)
    if (!user.canManage(input.user.id)) throw new NotAllowedError('Operation not allowed')

    user.country = country
    user.city = data.city
    user.name = data.name
    user.profession = data.profession
    user.about = data.about
    user.address = data.address
    user.phone = data.phone

    await this.userDao.save(user)

    return user
  }
}
