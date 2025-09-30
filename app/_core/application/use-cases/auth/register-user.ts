import * as bcrypt from 'bcrypt'
import { CreateUserDto, CreateUserSchema } from '../../dtos/userDto'
import { UserRepository, TokenRepository } from '../../../domain/repositories/UserRepository'
import User, { Token } from '../../../domain/entities/User'
import { generateUid } from '@/app/_core/utils/string.utils'
import dayjs from 'dayjs'

export default async function registerUser(
  dto: CreateUserDto,
  userRepo: UserRepository,
  tokenRepo: TokenRepository
): Promise<User> {
  const parsed = CreateUserSchema.safeParse(dto)

  if (!parsed.success) throw new Error(parsed.error.message)

  const existing = await userRepo.findOneByEmail(dto.email)

  if (existing) throw new Error(`Email already used ${dto.email}`)

  let user = new User(dto)
  user.password = await bcrypt.hash(user.password!, 6)

  user = await userRepo.save(user)

  let token = new Token({
    token: generateUid(),
    user,
    expireDate: dayjs().add(24, 'hour').toDate()
  })
  token = await tokenRepo.save(token)
  user.token = token

  return user
}
