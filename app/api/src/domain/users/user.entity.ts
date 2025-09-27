import AbstractEntity from "../shared/abstract.entity";
import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";
import Association, {AssociationMember} from "../associations/association.entity";
import Office from "../offices/office.entity";
import Country from "../countries/country.entity";
import {UserSection} from "../sections/section.entity";

export class Role {
    public static ROLE_USER = 10;
    public static ROLE_ADMIN = 50;
    public static ROLE_SUPER_ADMIN = 100;

    static roles(): Array<number> {
        return [Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN, Role.ROLE_USER, Role.ROLE_USER];
    }

    static isValid(role: number): boolean {
        return Role.roles().includes(role);
    }
}

export class Gender {
    public static MALE = 1;
    public static FEMALE = 0;

    static genders(): Array<number> {
        return [Gender.MALE, Gender.FEMALE];
    }

    static isValid(gender: number): boolean {
        return Gender.genders().includes(gender);
    }
}

@Entity("tokens")
export class Token extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar"})
    token: string;

    @Column({name: "expire_date", type: "datetime"})
    expireDate: Date;

    @OneToOne(() => User, (user) => user.token)
    @JoinColumn({name: "user_id"})
    user: Partial<User>;

    constructor(obj: Partial<Token>) {
        super();
        Object.assign(this, obj);
    }

}


@Entity("users")
export default class User extends AbstractEntity {

    @Column({nullable: false, length: 150, name: "first_name", type: "varchar"})
    firstName: string;

    @Column({nullable: false, length: 150, name: "last_name", type: "varchar"})
    lastName: string;

    @Column({nullable: false, length: 100, unique: true, type: "varchar"})
    email: string;

    @Column({nullable: true, length: 50, type: "varchar"})
    phone: string;

    @Column({nullable: true, length: 100, type: "varchar"})
    profession: string;

    @Column({nullable: false, type: "smallint"})
    role: number = Role.ROLE_USER;

    @Column({nullable: true, type: "tinyint"})
    gender: number;

    @Column({name: "birth_day", nullable: true, type: "smallint"})
    birthDay: number;

    @Column({name: "birth_month", nullable: true, type: "smallint"})
    birthMonth: number;

    @Column({name: "birth_year", nullable: true, type: "smallint"})
    birthYear: number;

    @Column({type: "text", nullable: true})
    address: string;

    @Column({nullable: true, length: 100, type: "varchar"})
    city: string;

    @Column({type: "text", nullable: true})
    about: string;

    @Column({nullable: true, type: "varchar"})
    image?: string;

    @Column({type: "tinyint"})
    active: boolean = false;

    @Column({name: "last_login", nullable: true, type: "datetime"})
    lastLogin: Date;

    @Exclude()
    @OneToOne(() => Token, (token) => token.user)
    token: Token;

    @ManyToOne(() => User)
    creator: User;

    @Exclude()
    @Column({nullable: false, length: 150, type: "varchar"})
    password: string;

    @OneToMany(() => Association, (association) => association.user)
    associations: Association[];

    @OneToMany(() => AssociationMember, (association) => association.member)
    associationMembers: AssociationMember[];

    @ManyToOne(() => Country, (country) => country.users)
    @JoinColumn({name: "country_id"})
    country: Country;

    @ManyToOne(() => Office, office => office.members)
    @JoinColumn({name: "office_id"})
    office: Office;

    @OneToMany(() => UserSection, userSection => userSection.user)
    sections: UserSection[];

    constructor(user?: Partial<User>) {
        super();
        this.new(user);
    }

    hasAnyRole(roles: Array<number>): boolean {
        return roles.includes(this.role);
    }

    hasRole(role: number): boolean {
        return this.role === role;
    }

    isAdmin(): boolean {
        return this.hasRole(Role.ROLE_ADMIN) || this.hasRole(Role.ROLE_SUPER_ADMIN);
    }

    hasCreator(user: User): boolean {
        return this.creator?.is(user);
    }

    canManage(user: User): boolean {
        return this.is(user) || this.hasCreator(user) || user.hasAnyRole([Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN]);
    }
}