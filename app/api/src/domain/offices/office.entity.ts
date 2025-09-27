import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import AbstractEntity from "../shared/abstract.entity";
import User from "../users/user.entity";
import Association from "../associations/association.entity";


@Entity("offices")
export default class Office extends AbstractEntity {

    @Column({type: "varchar"})
    name: string;

    @Column({type: "tinyint"})
    position: number;

    @ManyToOne(() => Association, (association) => association.offices)
    @JoinColumn({name: "association_id"})
    association: Association = null;

    @OneToMany(() => User, user => user.office)
    members: Set<User>;

    constructor(office: Partial<Office>) {
        super();
        this.new(office);
    }

    canManage(user: User): boolean {
        return this.association?.canManage(user);
    }

    isOwner(user: User): boolean {
        return this.association?.user.is(user);
    }
}