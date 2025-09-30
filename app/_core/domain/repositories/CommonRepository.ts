import AbstractEntity from '../entities/AbstractEntity'

export default interface CommonRepository<T extends AbstractEntity> {
  findOrFail(id: number): Promise<T>
  deleteBy(field: string, value: unknown): Promise<void>
  remove(obj: T): Promise<void>
  findOneBy(key: string, value: unknown): Promise<T>
  save(obj: T): Promise<T>
}
