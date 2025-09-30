import * as bcrypt from 'bcrypt'
import { UserRepository, TokenRepository } from '../../../domain/repositories/UserRepository'
import User from '../../../domain/entities/User'

export default async function updatePassword(
  password: string,
  passwordConfirmation: string,
  token: string,
  userRepo: UserRepository,
  tokenRepo: TokenRepository
): Promise<User> {
  const valid = password.trim().length && password === passwordConfirmation

  if (!valid) throw new Error('Invalid password')

  const existingToken = await tokenRepo.findOneByToken(token)

  if (existingToken === null) throw new Error('Invalid token')

  if (existingToken.expireDate < new Date()) throw new Error('Token expired')

  let user = existingToken.user as User
  user.password = await bcrypt.hash(password, 6)
  user = await userRepo.save(user)
  return user
}
