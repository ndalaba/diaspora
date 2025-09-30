import { generateUid } from '../../utils/string.utils'

export default abstract class AbstractEntity {
  id: string
  createdAt: Date
  updatedAt: Date

  constructor(props: Partial<AbstractEntity>) {
    Object.assign(this, props)

    this.id = props.id ?? generateUid()
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }

  is(id: string): boolean {
    return this.id === id
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
    return `${this.constructor.name} (id:${this.id})`
  }
}
