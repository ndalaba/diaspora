import AbstractEntity from './AbstractEntity'
import User, { Role } from './User'
import Country from './Country'

export default class Organisation extends AbstractEntity {
  name!: string
  author!: User
  about?: string
  address?: string
  phone?: string
  email?: string
  logo?: string
  city?: string
  country?: Country
  members?: User[]

  constructor(props: Partial<Organisation>) {
    super(props)
    Object.assign(this, props)
  }

  isOwner(id: string): boolean {
    return this.author.id === id
  }

  canManage(user: User): boolean {
    return this.isOwner(user.id) || user.hasAnyRole([Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN])
  }

  hasMember(user: User): boolean {
    return this.members?.includes(user) || false
  }
}
