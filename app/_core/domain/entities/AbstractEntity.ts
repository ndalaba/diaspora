import { generateUid } from '../../utils/string.utils'

export default abstract class AbstractEntity {
  id?: number
  uid: string
  createdAt: Date
  updatedAt: Date

  constructor(props: Partial<AbstractEntity>) {
    Object.assign(this, props)

    this.uid = props.uid ?? generateUid()
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }

  is(uid: string): boolean {
    return this.uid === uid
  }

  touch(): this {
    this.updatedAt = new Date()
    return this
  }

  hydrate(object: Partial<this>): this {
    Object.assign(this, object)
    this.touch()
    return this
  }

  toString(): string {
    return `${this.constructor.name} (uid:${this.uid})`
  }
}
