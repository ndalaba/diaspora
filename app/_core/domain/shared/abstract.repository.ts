import DataSource from '../../core/db'
import AbstractEntity from './abstract.entity'
import { EntityTarget, Repository } from 'typeorm'

export default abstract class AbstractRepository<T extends AbstractEntity> {
  protected repository: Repository<T>

  protected constructor(entity: EntityTarget<T>) {
    this.repository = DataSource.getRepository(entity)
  }

  getRepository<R>(entity: EntityTarget<R>): Repository<R> {
    return DataSource.getRepository(entity)
  }

  async save(obj: T): Promise<T> {
    return await obj.save()
  }

  async findOneBy(key: string, value: any): Promise<T> {
    if (value == undefined) return null
    return await this.repository
      .createQueryBuilder('q')
      .where(key + ' = :value', { value })
      .getOne()
  }

  async getOrFail(uid: string): Promise<T> {
    return this.repository.createQueryBuilder('q').where('q.uid = :uid', { uid }).getOneOrFail()
  }

  async findOrFail(id: number): Promise<T> {
    return this.repository.createQueryBuilder('q').where('q.id = :id', { id }).getOneOrFail()
  }

  async deleteBy(field: string, value: any): Promise<void> {
    await this.repository
      .createQueryBuilder('q')
      .where(field + ' = :value', { value })
      .delete()
      .execute()
  }

  async remove(obj: T): Promise<T> {
    return this.repository.remove(obj)
  }
}
