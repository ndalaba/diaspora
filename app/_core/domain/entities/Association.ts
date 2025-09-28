import AbstractEntity from '../shared/abstract.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import User, { Role } from '../users/user.entity'
import Office from '../offices/office.entity'
import Session from '../contributions/session/session.entity'
import Currency from '../contributions/currency/currency.entity'
import Contribution from '../contributions/contribution/contribution.entity'
import Country from '../countries/country.entity'
import { UserSection } from '../sections/section.entity'

@Entity('associations')
export default class Association extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'text', nullable: true })
  about: string

  @Column({ type: 'text' })
  address: string

  @Column({ type: 'varchar' })
  phone: string

  @Column({ nullable: true, type: 'varchar' })
  email: string

  @Column({ nullable: true, type: 'varchar' })
  logo?: string

  @Column({ nullable: true, length: 100, type: 'varchar' })
  city?: string

  @ManyToOne(() => User, (user) => user.associations)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Country, (country) => country.associations)
  @JoinColumn({ name: 'country_id' })
  country: Country

  @OneToMany(() => AssociationMember, (associationMember) => associationMember.association)
  associationMembers: AssociationMember[]

  @OneToMany(() => Office, (office) => office.association)
  offices: Set<Office>

  @OneToMany(() => Session, (session) => session.association)
  sessions: Set<Session>

  @OneToMany(() => Currency, (curr) => curr.association)
  currencies: Set<Currency>

  @OneToMany(() => Contribution, (contrib) => contrib.association)
  contributions: Set<Contribution>

  @OneToMany(() => UserSection, (userSection) => userSection.association)
  sections: UserSection[]

  constructor(association: Partial<Association>) {
    super()
    this.new(association)
  }

  isOwner(user: User): boolean {
    return this.user.uid === user.uid
  }

  canManage(user: User): boolean {
    return this.isOwner(user) || user.hasAnyRole([Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN])
  }

  hasMember(user: User): boolean {
    return this.associationMembers.includes(
      new AssociationMember({ member: user, association: this })
    )
  }
}

@Entity('association_members')
export class AssociationMember extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.associationMembers)
  @JoinColumn({ name: 'user_id' })
  member: User

  @ManyToOne(() => Association, (association) => association.associationMembers)
  @JoinColumn({ name: 'association_id' })
  association: Association

  constructor(association: Partial<AssociationMember>) {
    super()
    this.new(association)
  }
}
