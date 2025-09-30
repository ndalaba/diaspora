import { TokenRepository, UserRepository } from '../../../domain/repositories/UserRepository'
import User, { Token } from '../../../domain/entities/User'

export default async function verifyToken(
  value: string,
  userRepo: UserRepository,
  tokenRepo: TokenRepository
): Promise<{ user: User; token: Token }> {
  const token = await tokenRepo.findOneByToken(value)
  if (!token) throw new Error('Token not found')

  if (token.expireDate < new Date()) throw new Error('Token expired')

  const user = token.user as User
  user.active = true
  await userRepo.save(user)

  return { user, token }
}
