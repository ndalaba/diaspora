import { TokenRepository, UserRepository } from '../../../domain/repositories/UserRepository'
import User, { Token } from '../../../domain/entities/User'
import { generateUid } from '../../../utils/string.utils'
import dayjs from 'dayjs'

export default async function generateToken(
  email: string,
  userRepo: UserRepository,
  tokenRepo: TokenRepository
): Promise<{ user: User; token: Token }> {
  const user = await userRepo.findOneByEmail(email)

  if (!user) throw new Error('User not found')

  let token = await tokenRepo.findOneByUser(user)

  token.token = generateUid()
  token.expireDate = dayjs().add(24, 'hour').toDate()

  token = await tokenRepo.save(token)
  user.token = token

  await userRepo.save(user)

  return { user, token }
}
