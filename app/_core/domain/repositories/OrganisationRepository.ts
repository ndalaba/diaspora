import CommonRepository from './CommonRepository'
import Organisation from '../entities/Organisation'
import { FilterOrganisationDto } from '../../application/dtos/organisationDto'

export interface OrganisationRepository extends CommonRepository<Organisation> {
  findByName(name: string): Promise<Organisation[]>
  filter(dto: FilterOrganisationDto): Promise<Organisation[]>
}
