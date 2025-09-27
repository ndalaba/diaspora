import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import AbstractEntity from "../../shared/abstract.entity";
import Association from "../../associations/association.entity";
import User from "../../users/user.entity";
import Contribution from "../contribution/contribution.entity";

@Entity("sessions")
export default class Session extends AbstractEntity {

  @Column({type:"varchar"})
  name: string;

  @ManyToOne(() => Association, association => association.sessions)
  @JoinColumn({ name: "association_id" })
  association: Association;

  @OneToMany(() => Contribution, contrib => contrib.session)
  contributions: Set<Contribution>;

  constructor(session: Partial<Session>) {
    super();
    this.new(session);
  }

  canManage(user: User): boolean {
    return this.association.canManage(user);
  }

  isOwner(user: User): boolean {
    return this.association.user.is(user);
  }
}