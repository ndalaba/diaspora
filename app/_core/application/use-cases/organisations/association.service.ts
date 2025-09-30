import OrganisationRepository, { OrganisationMemberRepository } from './organisation.repository'
import {
  AddMemberDto,
  CreateOrganisationDto,
  FilterOrganisationDto,
  GetOrganisationDto,
  UpdateOrganisationDto
} from './organisation.schema'
import Response from '../../../utils/response.utils'
import { tryCatch } from '../../../utils/functions.utils'
import { NotAllowedError } from '../../../utils/errors.utils'
import { removeFile } from '../../../utils/file.utils'
import { UserRepository } from '../../../infrastructure/db/user.repository'
import { UpdateImage } from '../shared/shared.schema'
import Organisation, { OrganisationMember } from './organisation.entity'
import User from '../../../domain/entities/User'
import { CountryRepository } from '../../../infrastructure/db/country.repository'
import Country from '../countries/country.entity'
import { SectionRepository, UserSectionRepository } from '../sections/section.repository'
import { UserSection } from '../sections/section.entity'

export default class OrganisationService {
  constructor(
    private readonly organisationRepo: OrganisationRepository = new OrganisationRepository(),
    private readonly countryRepo: CountryRepository = new CountryRepository()
  ) {}

  async updateOrganisationLogo(dto: UpdateImage): Promise<Response> {
    const canUpdate = (
      organisation: Organisation,
      loggedUser: User,
      response: Response
    ): boolean => {
      if (!organisation.canManage(loggedUser)) {
        response.addError('denied', 'Organisation cannot be updated.')
        return false
      }
      return true
    }

    return tryCatch(
      async () => {
        const response = new Response()

        let organisation = (await this.organisationRepo.getOrFail(dto.uid)) as Organisation

        if (!canUpdate(organisation, dto.user, response)) return response

        if (dto.image !== undefined) {
          removeFile(organisation.logo)
          organisation.logo = dto.image
        }

        organisation = (await this.organisationRepo.save(organisation)) as Organisation
        return response.addData('organisation', organisation)
      },
      dto.uid,
      'update organisation logo'
    )
  }

  async filterOrganisations(dto: FilterOrganisationDto): Promise<Response> {
    return tryCatch(async () => {
      const organisations = await this.organisationRepo.filter(dto)
      return new Response().addData('organisations', organisations)
    }, 'Filter organisation')
  }

  async getOrganisation(uid: string): Promise<Response> {
    return tryCatch(async () => {
      const organisation = (await this.organisationRepo.getOrFail(uid)) as Organisation
      return new Response().addData('organisation', organisation)
    }, 'Get organisation:' + uid)
  }

  async deleteOrganisation(dto: GetOrganisationDto): Promise<Response> {
    return tryCatch(async () => {
      const organisation = (await this.organisationRepo.getOrFail(dto.uid)) as Organisation
      if (!organisation.canManage(dto.user)) throw new NotAllowedError('Not allowed')
      removeFile(organisation.logo)
      await this.organisationRepo.remove(organisation)
      return new Response()
    }, dto.uid)
  }

  async createOrganisation(dto: CreateOrganisationDto): Promise<Response> {
    return tryCatch(async () => {
      const country = (await this.countryRepo.findOrFail(+dto.country_id)) as Country

      let organisation = new Organisation(dto)
      organisation.user = dto.user
      organisation.country = country
      organisation.logo = 'organisations/assoss.svg'
      organisation = (await this.organisationRepo.save(organisation)) as Organisation

      return new Response().addData('organisation', organisation)
    }, dto.name)
  }

  async updateOrganisation(dto: UpdateOrganisationDto): Promise<Response> {
    const canUpdate = (
      organisation: Organisation,
      loggedUser: User,
      response: Response
    ): boolean => {
      if (!organisation.canManage(loggedUser)) {
        response.addError('denied', 'Organisation cannot be updated.')
        return false
      }
      return true
    }

    return tryCatch(
      async () => {
        const response = new Response()

        const country = (await this.countryRepo.findOrFail(dto.country_id)) as Country

        let organisation = (await this.organisationRepo.getOrFail(dto.uid)) as Organisation
        if (!canUpdate(organisation, dto.user, response)) return response

        organisation.country = country
        organisation.name = dto.name
        organisation.about = dto.about
        organisation.address = dto.address
        organisation.city = dto.city
        organisation.email = dto.email
        organisation.phone = dto.phone

        organisation = (await this.organisationRepo.save(organisation)) as Organisation

        return response.addData('organisation', organisation)
      },
      dto.uid,
      'update-organisation'
    )
  }
}

export class OrganisationMemberService {
  constructor(
    private readonly organisationRepo: OrganisationRepository = new OrganisationRepository(),
    private readonly userRepo: UserRepository = new UserRepository(),
    private readonly userSectionRepo: UserSectionRepository = new UserSectionRepository(),
    private readonly sectionRepo: SectionRepository = new SectionRepository(),
    private readonly organisationMemberRepo: OrganisationMemberRepository = new OrganisationMemberRepository()
  ) {}

  async setAdmin(dto: AddMemberDto): Promise<Response> {
    const organisation = (await this.organisationRepo.getOrFail(
      dto.organisation_uid
    )) as Organisation

    if (!organisation.canManage(dto.user)) throw new NotAllowedError('Not allowed')

    const member = (await this.userRepo.getOrFail(dto.member_uid)) as User
    const memberSections = await this.userSectionRepo.findByMemberOrganisation(member, organisation)
    if (memberSections.length > 0) return new Response().addError('already', 'Member already added')

    const sections = await this.sectionRepo.findPublished()

    const userSections: Partial<UserSection[]> = []
    sections.forEach((mod) =>
      userSections.push(
        new UserSection({
          read: false,
          write: false,
          organisation: organisation,
          section: mod,
          user: member
        })
      )
    )
    await this.userSectionRepo.createMany(userSections)

    return new Response()
  }

  async removeAdmin(dto: AddMemberDto): Promise<Response> {
    const organisation = (await this.organisationRepo.getOrFail(
      dto.organisation_uid
    )) as Organisation

    if (!organisation.canManage(dto.user)) throw new NotAllowedError('Not allowed')

    const member = (await this.userRepo.getOrFail(dto.member_uid)) as User

    await this.userSectionRepo.removeUserSection(organisation.id, member.id)

    return new Response()
  }

  async removeMemberToOrganisation(dto: AddMemberDto): Promise<Response> {
    return tryCatch(async () => {
      const organisation = (await this.organisationRepo.getOrFail(
        dto.organisation_uid
      )) as Organisation

      if (!organisation.canManage(dto.user)) throw new NotAllowedError('Not allowed')

      const member = (await this.userRepo.getOrFail(dto.member_uid)) as User

      const memberOrganisation = await this.organisationMemberRepo.findByOrganisationMember(
        organisation,
        member
      )
      if (memberOrganisation !== null) await this.organisationMemberRepo.remove(memberOrganisation)

      return new Response()
    }, `${dto.organisation_uid} ${dto.member_uid}`)
  }

  async addMember(dto: AddMemberDto): Promise<Response> {
    return tryCatch(async () => {
      const response = new Response()

      const organisation = (await this.organisationRepo.getOrFail(
        dto.organisation_uid
      )) as Organisation

      if (!organisation.canManage(dto.user)) throw new NotAllowedError('Not allowed')

      const member = (await this.userRepo.getOrFail(dto.member_uid)) as User
      const memberOrganisation = await this.organisationMemberRepo.findByOrganisationMember(
        organisation,
        member
      )

      if (memberOrganisation !== null)
        return response.addError('added', 'Member already added to organisation.')

      const organisationMember = new OrganisationMember({
        member: member,
        organisation: organisation
      })
      await this.organisationMemberRepo.save(organisationMember)

      return response
    }, `${dto.organisation_uid} ${dto.member_uid}`)
  }
}
