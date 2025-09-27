import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import AbstractEntity from "../../shared/abstract.entity";
import Association from "../../associations/association.entity";
import User from "../../users/user.entity";
import Amount from "../amount/amount.entity";


@Entity("currencies")
export default class Currency extends AbstractEntity {

  @Column({ length: 10, type: "varchar" })
  code: string;

  @Column({ length: 50, type: "varchar" })
  name: string;

  @ManyToOne(() => Association, association => association.currencies)
  @JoinColumn({ name: "association_id" })
  association: Association;

  @OneToMany(() => Amount, amount => amount.currency)
  amounts: Set<Amount>;

  constructor(currency: Partial<Currency>) {
    super();
    this.new(currency);
  }

  canManage(user: User): boolean {
    return this.association.canManage(user);
  }

  isOwner(user: User): boolean {
    return this.association.user.is(user);
  }
}
