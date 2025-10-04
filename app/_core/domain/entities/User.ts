import AbstractEntity from './AbstractEntity'
import Organisation from './Organisation'
import Country from './Country'

export class Role {
  public static ROLE_USER = 10
  public static ROLE_ADMIN = 50
  public static ROLE_SUPER_ADMIN = 100

  static roles(): Array<number> {
    return [Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN, Role.ROLE_USER, Role.ROLE_USER]
  }

  static isValid(role: number): boolean {
    return Role.roles().includes(role)
  }
}

export class Gender {
  public static MALE = 1
  public static FEMALE = 0

  static genders(): Array<number> {
    return [Gender.MALE, Gender.FEMALE]
  }

  static isValid(gender: number): boolean {
    return Gender.genders().includes(gender)
  }
}

export class Token extends AbstractEntity {
  token!: string
  expireDate!: Date
  user!: Partial<User>

  constructor(props: Partial<Token>) {
    super(props)
    Object.assign(this, props)
  }
}

export default class User extends AbstractEntity {
  name!: string
  email!: string
  role!: number
  active: boolean = false
  phone?: string
  profession?: string
  gender?: number
  birthDay?: number
  birthMonth?: number
  birthYear?: number
  address?: string
  city?: string
  about?: string
  lastLogin?: Date
  token?: Token
  password?: string
  organisations?: Organisation[]
  country?: Country
  image?: string

  constructor(props: Partial<User>) {
    super(props)
    Object.assign(this, props)
  }

  hasAnyRole(roles: Array<number>): boolean {
    return roles.includes(this.role)
  }

  hasRole(role: number): boolean {
    return this.role === role
  }

  isAdmin(): boolean {
    return this.hasRole(Role.ROLE_ADMIN) || this.hasRole(Role.ROLE_SUPER_ADMIN)
  }

  isMemberOf(orgId: string): boolean {
    return this.organisations?.some((m) => m.id === orgId) || false
  }

  canManage(id: string): boolean {
    return (
      this.is(id) ||
      this.hasAnyRole([Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN])
    )
  }
}
