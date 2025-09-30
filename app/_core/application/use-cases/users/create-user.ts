import * as bcrypt from 'bcrypt'
import { CreateUserDto, CreateUserSchema } from '../../dtos/userDto'
import { UserRepository } from '../../../domain/repositories/UserRepository'
import User from '../../../domain/entities/User'
import { AlreadyExistsError, ValidationError } from '../../../utils/errors.utils'

export default async function createUser(
  input: CreateUserDto,
  userRepo: UserRepository
): Promise<User> {
  const parsedInput = CreateUserSchema.safeParse(input)
  if (!parsedInput.success) throw new ValidationError(parsedInput.error.message)

  const data = parsedInput.data

  const existingUser = await userRepo.findOneByEmail(data.email)
  if (existingUser) throw new AlreadyExistsError('User email already exists')

  let user = new User(data)
  user.creator = input.user!
  user.image = 'users/user.png'
  user.password = await bcrypt.hash(user.password!, 6)
  user = await userRepo.save(user)

  return user
}
