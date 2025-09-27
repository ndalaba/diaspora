import AbstractEntity from "../shared/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";
import User from "../users/user.entity";
import Association from "../associations/association.entity";


@Entity("countries")
export default class Country extends AbstractEntity {
  @Column({type:"varchar"})
  name: string;

  @Column({ length: 4,type:"varchar" })
  code: string;

  @OneToMany(() => User, user => user.country)
  users?: User[];

  @OneToMany(() => Association, association => association.country)
  associations?: Association[];

  constructor(country: Partial<Country>) {
    super();
    this.new(country);
  }

}
