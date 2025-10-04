import { IOrganisationDAO } from '../../domain/dao/organisation'
import { ICountryDAO } from '../../domain/dao/country'
import {
  FilterOrganisationDto,
  GetOrganisationDto,
  UpdateOrganisationDto,
  CreateOrganisationDto,
  CreateOrganisationSchema,
  UpdateOrganisationSchema
} from '../dtos/organisation'
import { NotAllowedError } from '../../utils/errors.utils'
import Organisation from '../../domain/entities/Organisation'
import Country from '../../domain/entities/Country'
import { ValidationError } from '../../utils/errors.utils'

export default class OrganisationUseCase {
  constructor(
    private readonly organisationDao: IOrganisationDAO,
    private readonly countryDao: ICountryDAO
  ) {}

  async filterOrganisations(dto: FilterOrganisationDto): Promise<Organisation[]> {
    return this.organisationDao.filter(dto)
  }

  async getOrganisation(id: string): Promise<Organisation> {
    return this.organisationDao.findOrFail(id)
  }

  async deleteOrganisation(dto: GetOrganisationDto): Promise<void> {
    const organisation = (await this.organisationDao.findOrFail(dto.id)) as Organisation
    if (!organisation.canManage(dto.user)) throw new NotAllowedError('Not allowed')
    //TODO: remove old image
    await this.organisationDao.remove(organisation)
  }

  async createOrganisation(dto: CreateOrganisationDto): Promise<Organisation> {
    const parsed = CreateOrganisationSchema.safeParse(dto)
    if (!parsed.success) throw new ValidationError(parsed.error.message)
    const data = parsed.data

    const country = (await this.countryDao.findOrFail(data.country_id)) as Country

    let organisation = new Organisation(data as Partial<Organisation>)
    organisation.author = dto.user
    organisation.country = country
    organisation.logo = 'organisations/assoss.svg'
    organisation = (await this.organisationDao.save(organisation)) as Organisation

    return organisation
  }

  async updateOrganisation(dto: UpdateOrganisationDto): Promise<Organisation> {
    const parsed = UpdateOrganisationSchema.safeParse(dto)
    if (!parsed.success) throw new ValidationError(parsed.error.message)
    const data = parsed.data

    const country = await this.countryDao.findOrFail(data.country_id)

    let organisation = await this.organisationDao.findOrFail(data.id)
    if (!organisation.canManage(dto.user)) throw new NotAllowedError('Not allowed')

    organisation.country = country
    organisation.name = dto.name
    organisation.about = dto.about || undefined
    organisation.address = dto.address || undefined
    organisation.city = dto.city || undefined
    organisation.email = dto.email || undefined
    organisation.phone = dto.phone || undefined

    organisation = await this.organisationDao.save(organisation)

    return organisation
  }
}
