import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import AbstractEntity from "../../shared/abstract.entity";
import Association from "../../associations/association.entity";
import User from "../../users/user.entity";
import Session from "../session/session.entity";
import Amount from "../amount/amount.entity";

@Entity("contributions")
export default class Contribution extends AbstractEntity {

    @Column({length: 50, type: "varchar"})
    name: string;

    @Column({type: "text", nullable: true})
    description: string;

    @ManyToOne(() => Association, association => association.contributions)
    @JoinColumn({name: "association_id"})
    association: Association;

    @ManyToOne(() => Session, sess => sess.contributions)
    @JoinColumn({name: "session_id"})
    session: Session;

    @OneToMany(() => Amount, amount => amount.contribution)
    amounts: Set<Amount>;

    constructor(contribution: Partial<Contribution>) {
        super();
        this.new(contribution);
    }

    canManage(user: User): boolean {
        return this.association.canManage(user);
    }

    isOwner(user: User): boolean {
        return this.association.user.is(user);
    }
}
