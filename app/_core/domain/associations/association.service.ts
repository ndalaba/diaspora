import AssociationRepository, { AssociationMemberRepository } from './association.repository'
import {
  AddMemberDto,
  CreateAssociationDto,
  FilterAssociationDto,
  GetAssociationDto,
  UpdateAssociationDto
} from './association.schema'
import Response from '../../utils/response.utils'
import { tryCatch } from '../../utils/functions.utils'
import { NotAllowedError } from '../../utils/errors.utils'
import { removeFile } from '../../utils/file.utils'
import { UserRepository } from '../users/user.repository'
import { UpdateImage } from '../shared/shared.schema'
import Association, { AssociationMember } from './association.entity'
import User from '../users/user.entity'
import { CountryRepository } from '../countries/country.repository'
import Country from '../countries/country.entity'
import { SectionRepository, UserSectionRepository } from '../sections/section.repository'
import { UserSection } from '../sections/section.entity'

export default class AssociationService {
  constructor(
    private readonly associationRepo: AssociationRepository = new AssociationRepository(),
    private readonly countryRepo: CountryRepository = new CountryRepository()
  ) {}

  async updateAssociationLogo(dto: UpdateImage): Promise<Response> {
    const canUpdate = (association: Association, loggedUser: User, response: Response): boolean => {
      if (!association.canManage(loggedUser)) {
        response.addError('denied', 'Association cannot be updated.')
        return false
      }
      return true
    }

    return tryCatch(
      async () => {
        const response = new Response()

        let association = (await this.associationRepo.getOrFail(dto.uid)) as Association

        if (!canUpdate(association, dto.user, response)) return response

        if (dto.image !== undefined) {
          removeFile(association.logo)
          association.logo = dto.image
        }

        association = (await this.associationRepo.save(association)) as Association
        return response.addData('association', association)
      },
      dto.uid,
      'update association logo'
    )
  }

  async filterAssociations(dto: FilterAssociationDto): Promise<Response> {
    return tryCatch(async () => {
      const associations = await this.associationRepo.filter(dto)
      return new Response().addData('associations', associations)
    }, 'Filter association')
  }

  async getAssociation(uid: string): Promise<Response> {
    return tryCatch(async () => {
      const association = (await this.associationRepo.getOrFail(uid)) as Association
      return new Response().addData('association', association)
    }, 'Get association:' + uid)
  }

  async deleteAssociation(dto: GetAssociationDto): Promise<Response> {
    return tryCatch(async () => {
      const association = (await this.associationRepo.getOrFail(dto.uid)) as Association
      if (!association.canManage(dto.user)) throw new NotAllowedError('Not allowed')
      removeFile(association.logo)
      await this.associationRepo.remove(association)
      return new Response()
    }, dto.uid)
  }

  async createAssociation(dto: CreateAssociationDto): Promise<Response> {
    return tryCatch(async () => {
      const country = (await this.countryRepo.findOrFail(+dto.country_id)) as Country

      let association = new Association(dto)
      association.user = dto.user
      association.country = country
      association.logo = 'associations/assoss.svg'
      association = (await this.associationRepo.save(association)) as Association

      return new Response().addData('association', association)
    }, dto.name)
  }

  async updateAssociation(dto: UpdateAssociationDto): Promise<Response> {
    const canUpdate = (association: Association, loggedUser: User, response: Response): boolean => {
      if (!association.canManage(loggedUser)) {
        response.addError('denied', 'Association cannot be updated.')
        return false
      }
      return true
    }

    return tryCatch(
      async () => {
        const response = new Response()

        const country = (await this.countryRepo.findOrFail(dto.country_id)) as Country

        let association = (await this.associationRepo.getOrFail(dto.uid)) as Association
        if (!canUpdate(association, dto.user, response)) return response

        association.country = country
        association.name = dto.name
        association.about = dto.about
        association.address = dto.address
        association.city = dto.city
        association.email = dto.email
        association.phone = dto.phone

        association = (await this.associationRepo.save(association)) as Association

        return response.addData('association', association)
      },
      dto.uid,
      'update-association'
    )
  }
}

export class AssociationMemberService {
  constructor(
    private readonly associationRepo: AssociationRepository = new AssociationRepository(),
    private readonly userRepo: UserRepository = new UserRepository(),
    private readonly userSectionRepo: UserSectionRepository = new UserSectionRepository(),
    private readonly sectionRepo: SectionRepository = new SectionRepository(),
    private readonly associationMemberRepo: AssociationMemberRepository = new AssociationMemberRepository()
  ) {}

  async setAdmin(dto: AddMemberDto): Promise<Response> {
    const association = (await this.associationRepo.getOrFail(dto.association_uid)) as Association

    if (!association.canManage(dto.user)) throw new NotAllowedError('Not allowed')

    const member = (await this.userRepo.getOrFail(dto.member_uid)) as User
    const memberSections = await this.userSectionRepo.findByMemberAssociation(member, association)
    if (memberSections.length > 0) return new Response().addError('already', 'Member already added')

    const sections = await this.sectionRepo.findPublished()

    const userSections: Partial<UserSection[]> = []
    sections.forEach((mod) =>
      userSections.push(
        new UserSection({
          read: false,
          write: false,
          association: association,
          section: mod,
          user: member
        })
      )
    )
    await this.userSectionRepo.createMany(userSections)

    return new Response()
  }

  async removeAdmin(dto: AddMemberDto): Promise<Response> {
    const association = (await this.associationRepo.getOrFail(dto.association_uid)) as Association

    if (!association.canManage(dto.user)) throw new NotAllowedError('Not allowed')

    const member = (await this.userRepo.getOrFail(dto.member_uid)) as User

    await this.userSectionRepo.removeUserSection(association.id, member.id)

    return new Response()
  }

  async removeMemberToAssociation(dto: AddMemberDto): Promise<Response> {
    return tryCatch(async () => {
      const association = (await this.associationRepo.getOrFail(dto.association_uid)) as Association

      if (!association.canManage(dto.user)) throw new NotAllowedError('Not allowed')

      const member = (await this.userRepo.getOrFail(dto.member_uid)) as User

      const memberAssociation = await this.associationMemberRepo.findByAssociationMember(
        association,
        member
      )
      if (memberAssociation !== null) await this.associationMemberRepo.remove(memberAssociation)

      return new Response()
    }, `${dto.association_uid} ${dto.member_uid}`)
  }

  async addMember(dto: AddMemberDto): Promise<Response> {
    return tryCatch(async () => {
      const response = new Response()

      const association = (await this.associationRepo.getOrFail(dto.association_uid)) as Association

      if (!association.canManage(dto.user)) throw new NotAllowedError('Not allowed')

      const member = (await this.userRepo.getOrFail(dto.member_uid)) as User
      const memberAssociation = await this.associationMemberRepo.findByAssociationMember(
        association,
        member
      )

      if (memberAssociation !== null)
        return response.addError('added', 'Member already added to association.')

      const associationMember = new AssociationMember({
        member: member,
        association: association
      })
      await this.associationMemberRepo.save(associationMember)

      return response
    }, `${dto.association_uid} ${dto.member_uid}`)
  }
}
