import AbstractEntity from "../../shared/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import User from "../../users/user.entity";
import Amount from "../amount/amount.entity";

@Entity("payments")
export default class Payment extends AbstractEntity {

  @ManyToOne(() => Amount, amount => amount.payments)
  @JoinColumn({ name: "amount_id" })
  amount: Amount;

  @Column({ type: "decimal" })
  payed: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "member_id" })
  member: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  constructor(payment: Partial<Payment>) {
    super();
    this.new(payment);
  }

  canManage(user: User): boolean {
    return this.amount.canManage(user);
  }

  isOwner(user: User): boolean {
    return this.amount.isOwner(user);
  }
}
