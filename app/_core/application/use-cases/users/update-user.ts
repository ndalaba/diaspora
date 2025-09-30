import { UpdateUserDto, UpdateUserSchema } from '../../dtos/userDto'
import { UserRepository } from '../../../domain/repositories/UserRepository'
import User from '../../../domain/entities/User'
import CountryRepository from '../../../domain/repositories/CountryRepository'
import { NotAllowedError, ValidationError } from '../../../utils/errors.utils'

export default async function updateUser(
  input: UpdateUserDto,
  userRepo: UserRepository,
  countryRepo: CountryRepository
): Promise<User> {
  const parsedInput = UpdateUserSchema.safeParse(input)
  if (!parsedInput.success) throw new ValidationError(parsedInput.error.message)

  const data = parsedInput.data

  const country = await countryRepo.findOrFail(data.country_id!)

  const user = await userRepo.findOrFail(data.id)
  if (!user.canManage(input.user.id)) throw new NotAllowedError('Operation not allowed')

  user.country = country
  user.city = data.city
  user.name = data.name
  user.profession = data.profession
  user.about = data.about
  user.address = data.address
  user.phone = data.phone

  await userRepo.save(user)

  return user
}
