import { UserRepository } from '../../../infrastructure/db/user.repository'
import Response from '../../../utils/response.utils'
import { tryCatch } from '../../../utils/functions.utils'
import { NotAllowedError } from '../../../utils/errors.utils'
import User from '../../entities/User'
import { removeFile } from '../../../utils/file.utils'
import { CreateUserDto, FilterUserDto, GetUserDto, UpdateUserDto } from './user.schema'
import { CountryRepository } from '../../../infrastructure/db/country.repository'
import Country from '../countries/country.entity'
import { UpdateImage } from '../shared/shared.schema'
import OrganisationRepository, {
  OrganisationMemberRepository
} from '../organisations/organisation.repository'
import Organisation, { OrganisationMember } from '../organisations/organisation.entity'
import * as bcrypt from 'bcrypt'

export default class UserService {
  constructor(
    private readonly userRepo: UserRepository = new UserRepository(),
    private readonly organisationRepo: OrganisationRepository = new OrganisationRepository(),
    private readonly organisationMemberRepo: OrganisationMemberRepository = new OrganisationMemberRepository(),
    private readonly countryRepo: CountryRepository = new CountryRepository()
  ) {}

  async updateUserImage(dto: UpdateImage): Promise<Response> {
    return tryCatch(
      async () => {
        const response = new Response()
        let user = (await this.userRepo.getOrFail(dto.uid)) as User
        if (!this.canUpdate(user, dto.user, response)) return response

        if (dto.image !== undefined) {
          removeFile(user.image)
          user.image = dto.image
        }

        user = (await this.userRepo.save(user)) as User
        return response.addData('user', user)
      },
      dto.uid,
      'update user image'
    )
  }

  async deleteUser(dto: GetUserDto): Promise<Response> {
    return tryCatch(async () => {
      const user = (await this.userRepo.getOrFail(dto.uid)) as User
      if (!user.canManage(dto.user)) throw new NotAllowedError('Not allowed')
      removeFile(user.image)
      await this.userRepo.remove(user)
      return new Response()
    }, dto.uid)
  }

  async createUser(dto: CreateUserDto): Promise<Response> {
    return tryCatch(async () => {
      const emailExist = async (email: string): Promise<boolean> =>
        (await this.userRepo.findOneByEmail(email)) instanceof User

      const response = new Response()

      if (await emailExist(dto.email)) return response.addError('email_exist', 'Email already used')

      let user = new User(dto)
      user.creator = dto.user
      user.image = 'users/user.png'
      user.password = await bcrypt.hash(user.password, 6)
      user = (await this.userRepo.save(user)) as User
      let organisation: Organisation = null
      if (dto.organisation_uid !== undefined && dto.organisation_uid !== '') {
        organisation = (await this.organisationRepo.getOrFail(dto.organisation_uid)) as Organisation
        const organisationMember = new OrganisationMember({
          member: user,
          organisation: organisation
        })
        await this.organisationMemberRepo.save(organisationMember)
      }
      return new Response().addData('user', user)
    }, dto.email)
  }

  async updateUser(dto: UpdateUserDto): Promise<Response> {
    return tryCatch(
      async () => {
        const response = new Response()

        const country = (await this.countryRepo.findOrFail(dto.country_id)) as Country

        let user = (await this.userRepo.getOrFail(dto.uid)) as User
        if (!this.canUpdate(user, dto.user, response)) return response

        user.country = country
        user.city = dto.city
        user.firstName = dto.firstName
        user.lastName = dto.lastName
        user.profession = dto.profession
        user.about = dto.about
        user.address = dto.address
        user.email = dto.email
        user.phone = dto.phone

        user = (await this.userRepo.save(user)) as User

        return response.addData('user', user)
      },
      dto.uid,
      'update-user'
    )
  }

  async getUser(uid: string): Promise<Response> {
    return tryCatch(async (_) => {
      const user = await this.userRepo.getOrFail(uid)
      return new Response().addData('user', user)
    }, uid)
  }

  async filterUsers(dto: FilterUserDto): Promise<Response> {
    return tryCatch(async (_) => {
      const organisation = (await this.organisationRepo.getOrFail(dto.organisation_uid)) as Organisation
      dto.organisation_id = organisation.id
      const users = await this.userRepo.filter(dto)
      return new Response().addData('users', users)
    })
  }

  async filterWithSections(dto: FilterUserDto): Promise<Response> {
    return tryCatch(async (_) => {
      const organisation = (await this.organisationRepo.getOrFail(dto.organisation_uid)) as Organisation
      dto.organisation_id = organisation.id
      const users = await this.userRepo.filterWithSections(dto)
      return new Response().addData('users', users)
    })
  }

  async removeUser(uid: string, current: User): Promise<Response> {
    return tryCatch(async (_) => {
      const user = (await this.userRepo.getOrFail(uid)) as User
      if (!user.canManage(current)) throw new NotAllowedError('Operation not allowed')
      await this.userRepo.remove(user)
      return new Response()
    }, 'Remove user :' + uid)
  }

  private canUpdate(user: User, loggedUser: User, response: Response): boolean {
    if (!user.canManage(loggedUser)) {
      response.addError('denied', 'User cannot be updated.')
      return false
    }
    return true
  }
}
