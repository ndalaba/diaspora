import AbstractEntity from "../../shared/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Contribution from "../contribution/contribution.entity";
import Currency from "../currency/currency.entity";
import Payment from "../payment/payment.entity";
import User from "../../users/user.entity";

@Entity("amounts")
export default class Amount extends AbstractEntity {

  @Column({ length: 50, type: "varchar" })
  name: string;

  @Column({ type: "decimal" })
  value: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @ManyToOne(() => Contribution, contrib => contrib.amounts)
  @JoinColumn({ name: "contribution_id" })
  contribution: Contribution;

  @ManyToOne(() => Currency, curr => curr.amounts)
  @JoinColumn({ name: "currency_id" })
  currency: Currency;

  @OneToMany(() => Payment, payment => payment.amount)
  payments: Set<Payment>;

  constructor(amount: Partial<Amount>) {
    super();
    this.new(amount);
  }

  canManage(user: User): boolean {
    return this.contribution.canManage(user);
  }

  isOwner(user: User): boolean {
    return this.contribution.isOwner(user);
  }
}
