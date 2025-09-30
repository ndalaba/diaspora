import { UpdateImage } from '../../dtos/commonDto'
import { UserRepository } from '../../../domain/repositories/UserRepository'
import User from '../../../domain/entities/User'
import { NotAllowedError } from '../../../utils/errors.utils'

export default async function updateUserImage(
  input: UpdateImage,
  userRepo: UserRepository
): Promise<User> {
  const user = await userRepo.findOrFail(input.id)
  if (!user.canManage(input.user.id)) throw new NotAllowedError('Operation not allowed')

  if (input.image !== undefined) {
    //TODO: remove old image
    user.image = input.image
  }

  await userRepo.save(user)

  return user
}
