import AbstractEntity from '../entities/AbstractEntity'

export interface IDao<T extends AbstractEntity> {
  findOrFail(id: string): Promise<T>
  deleteBy(field: string, value: unknown): Promise<void>
  remove(obj: T): Promise<void>
  findOneBy(key: string, value: unknown): Promise<T>
  save(obj: T): Promise<T>
}
