import { IDao } from './common'
import Organisation from '../entities/Organisation'
import { FilterOrganisationDto } from '../../application/dtos/organisation'

export interface IOrganisationDAO extends IDao<Organisation> {
  findByName(name: string): Promise<Organisation[]>
  filter(dto: FilterOrganisationDto): Promise<Organisation[]>
}
