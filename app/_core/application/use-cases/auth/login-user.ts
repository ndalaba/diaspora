import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { LoginDto } from '../../dtos/userDto'
import { UserRepository } from '../../../domain/repositories/UserRepository'
import User from '../../../domain/entities/User'
import { LoginSchema } from '../../dtos/userDto'

export default async function loginUser(
  dto: LoginDto,
  userRepo: UserRepository
): Promise<{ user: User; token: string }> {
  const parsed = LoginSchema.safeParse(dto)

  if (!parsed.success) throw new Error(parsed.error.message)

  const user = await userRepo.findOneByEmail(dto.email)

  if (!user || !(await bcrypt.compare(dto.password, user.password!)))
    throw new Error('Invalid credential')

  const token = jwt.sign(user.email, process.env.SECRET_KEY ?? '')

  user.lastLogin = new Date()
  await userRepo.save(user)

  return { user, token }
}
