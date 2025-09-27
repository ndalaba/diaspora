import DataSource from "../../../../config/ormconfig";
import AbstractRepository from "../../shared/abstract.repository";
import Currency from "./currency.entity";
import Amount from "../amount/amount.entity";

export default class CurrencyRepository extends AbstractRepository<Currency> {
    constructor() {
        super(Currency);
    }

    async getOrFail(uid: string): Promise<Currency> {
        return this.repository.createQueryBuilder("currencies")
            .innerJoinAndSelect("currencies.association", "association")
            .innerJoinAndSelect("association.user", "users")
            .where("currencies.uid = :uid", {uid})
            .getOneOrFail();
    }

    findByAssociation(associationId: number): Promise<Currency[]> {
        return this.repository.createQueryBuilder("currencies")
            .where("currencies.association_id = :association_id", {association_id: associationId})
            .orderBy("currencies.code", "DESC")
            .getMany();
    }

    findByCode(code: string, associationId: number): Promise<Currency> {
        return this.repository
            .createQueryBuilder("currencies")
            .where("currencies.code = :code AND currencies.association_id = :association_id", {
                code,
                association_id: associationId
            })
            .getOne();
    }

    async countAmounts<T>(value: T): Promise<number> {
        const query = DataSource.getRepository(Amount)
            .createQueryBuilder("amounts")
            .select("COUNT(amounts.id)");
        if (value instanceof Currency)
            query.where("amounts.currencyId = :id", {id: value.id});
        else if (value instanceof Number)
            query.where("amounts.currencyId = :id", {id: value});

        else if (value instanceof String) {
            const currency = await this.getOrFail(value.toString());
            query.where("amounts.currencyId = :id", {id: currency.id});
        }
        return query.getCount();
    }
}