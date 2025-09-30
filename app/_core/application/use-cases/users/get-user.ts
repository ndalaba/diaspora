import { UserRepository } from '../../../domain/repositories/UserRepository'
import User from '../../../domain/entities/User'

export default async function getUser(id: string, userRepo: UserRepository): Promise<User> {
  return await userRepo.findOrFail(id)
}
