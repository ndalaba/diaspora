import "reflect-metadata";
import {DataSource, DataSourceOptions} from "typeorm";
import * as dotenv from "dotenv";
import User, {Token} from "../domain/users/user.entity";
import Payment from "../domain/contributions/payment/payment.entity";
import Amount from "../domain/contributions/amount/amount.entity";
import Contribution from "../domain/contributions/contribution/contribution.entity";
import Session from "../domain/contributions/session/session.entity";
import Currency from "../domain/contributions/currency/currency.entity";
import Office from "../domain/offices/office.entity";
import Association, {AssociationMember} from "../domain/associations/association.entity";
import Section, {UserSection} from "../domain/sections/section.entity";
import Country from "../domain/countries/country.entity";

dotenv.config();

const ENTITIES = [User, Token, Country, Section, UserSection, Association, AssociationMember, Office, Currency, Session, Contribution, Amount, Payment];

const sqliteOption: DataSourceOptions = {
    type: "better-sqlite3",
    database: "db.sqlite",
    synchronize: true,
    logging: false,
    entities: ENTITIES,
    migrations: ["./build/migrations/*js"]
};

const devOption: DataSourceOptions = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT !== undefined ? +process.env.DB_PORT : 3000,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    //synchronize: true,
    logging: process.env.NODE_ENV === "dev",
    entities: ENTITIES,
    migrations: ["./build/migrations/*js"],
    subscribers: []
};

export default new DataSource(process.env.NODE_ENV === "test" ? sqliteOption : devOption);
