import AbstractEntity from "../shared/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Association from "../associations/association.entity";
import User from "../users/user.entity";


@Entity("sections")
export default class Section extends AbstractEntity {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "tinyint" })
  active: boolean = false;

  @OneToMany(() => UserSection, userSection => userSection.section)
  userSections: UserSection[];

  constructor(section: Partial<Section>) {
    super();
    this.new(section);
  }
}

@Entity("section_user")
export class UserSection extends AbstractEntity {

  @ManyToOne(() => Association, (association) => association.sections)
  @JoinColumn({name:"association_id"})
  association: Association;

  @ManyToOne(() => User, (user) => user.sections)
  @JoinColumn({name:"user_id"})
  user: User;

  @ManyToOne(() => Section, section => section.userSections)
  @JoinColumn({name:"section_id"})
  section: Section;

  @Column({ type: "boolean" })
  read: boolean = false;

  @Column({ type: "boolean" })
  write: boolean = false;

  constructor(section: Partial<UserSection>) {
    super();
    this.new(section);
  }
}
