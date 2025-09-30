import Country from "../entities/Country";
import CommonRepository from "./CommonRepository";

export default interface CountryRepository extends CommonRepository<Country> {
    findAll(): Promise<Country[]>
    findByName(name: string): Promise<Country | null>
    findByNameOrCode(name: string, code: string): Promise<Country | null>
    countOrganisations<T>(value: T): Promise<number>
    countUsers<T>(value: T): Promise<number>
}