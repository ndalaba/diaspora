import { UserRepository } from '../../../domain/repositories/UserRepository'
import { NotAllowedError } from '../../../utils/errors.utils'
import { GetUserDto } from '../../dtos/userDto'

export default async function removeUser(
  input: GetUserDto,
  userRepo: UserRepository
): Promise<void> {
  const user = await userRepo.findOrFail(input.id)
  if (!user.canManage(input.user.id)) throw new NotAllowedError('Operation not allowed')
  //TODO: remove old image

  await userRepo.remove(user)
}
