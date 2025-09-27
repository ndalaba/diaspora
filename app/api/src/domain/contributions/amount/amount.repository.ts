import DataSource from "../../../../config/ormconfig";
import AbstractRepository from "../../shared/abstract.repository";
import Payment from "../payment/payment.entity";
import Amount from "./amount.entity";

export default class AmountRepository extends AbstractRepository<Amount> {
    constructor() {
        super(Amount);
    }

    async getOrFail(uid: string): Promise<Amount> {
        const query = this.repository.createQueryBuilder("amounts")
            .innerJoinAndSelect("amounts.contribution", "contributions")
            .innerJoinAndSelect("amounts.currency", "currencies")
            .where("amounts.uid = :uid", {uid});
        return query.getOneOrFail();
    }

    filterAmounts(contributionId: number, currencyId: number = 0, sessionId: number = 0): Promise<Amount[]> {
        const query = this.repository.createQueryBuilder("amounts")
            .innerJoinAndSelect("amounts.currency", "currencies")
            .innerJoinAndSelect("amounts.contribution", "contributions")
            .innerJoinAndSelect("contributions.session", "sessions");

        if (contributionId !== 0)
            query.where("amounts.contribution_id = :contributionId", {contributionId});
        if (currencyId !== 0)
            query.andWhere("amounts.currency_id = :currencyId", {currencyId});
        if (sessionId !== 0)
            query.andWhere("contributions.session_id = :sessionId", {sessionId});

        return query.orderBy("amounts.created_at", "DESC").limit(20).getMany();
    }

    findByNameAndContribution(name: string, contributionId: number): Promise<Amount> {
        const query = this.repository.createQueryBuilder("amounts");
        query.where("amounts.contribution_id = :contributionId", {contributionId})
            .andWhere("amounts.name = :name", {name});

        return query.getOne();
    }

    async countPayments<T>(value: T): Promise<number> {
        const query = DataSource.getRepository(Payment)
            .createQueryBuilder("payments")
            .select("COUNT(payments.id)");
        if (value instanceof Amount)
            query.where("payments.amountId = :id", {id: value.id});
        else if (value instanceof Number)
            query.where("payments.amountId = :id", {id: value});

        else if (value instanceof String) {
            const amount = await this.getOrFail(value.toString());
            query.where("payments.amountId = :id", {id: amount.id});
        }
        return query.getCount();
    }
}