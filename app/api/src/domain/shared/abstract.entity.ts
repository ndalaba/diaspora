import {BaseEntity, Column, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {instanceToPlain} from "class-transformer";
import {generateUid} from "../../utils/string.utils";

export default abstract class AbstractEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 100})
    @Index()
    uid: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;

    is(obj: Partial<AbstractEntity>): boolean {
        return obj.uid === this.uid;
    }

    hydrate(object: Partial<AbstractEntity>): AbstractEntity {
        Object.assign(this, object);
        return this;
    }

    toString(): string {
        return `${this.constructor.name} (uid:${this.uid})`;
    }

    toJSON() {
        return instanceToPlain(this);
    }

    protected new(obj: Partial<AbstractEntity>) {
        Object.assign(this, obj);
        this.uid = generateUid();
    }
}