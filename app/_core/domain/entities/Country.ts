import AbstractEntity from './AbstractEntity'
import User from './User'
import Organisation from './Organisation'

export default class Country extends AbstractEntity {
  name!: string

  code!: string

  users?: User[]

  organisations?: Organisation[]

  constructor(props: Partial<Country>) {
    super(props)
    Object.assign(this, props)
  }
}
