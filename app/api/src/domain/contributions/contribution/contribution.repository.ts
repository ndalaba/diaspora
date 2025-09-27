import DataSource from "../../../../config/ormconfig";
import AbstractRepository from "../../shared/abstract.repository";
import Contribution from "./contribution.entity";
import Amount from "../amount/amount.entity";

export default class ContributionRepository extends AbstractRepository<Contribution> {
    constructor() {
        super(Contribution);
    }

    async getOrFail(uid: string): Promise<Contribution> {
        const query = this.repository.createQueryBuilder("contributions")
            .innerJoinAndSelect("contributions.association", "associations")
            .innerJoinAndSelect("contributions.session", "sessions")
            .where("contributions.uid = :uid", {uid});
        return query.getOneOrFail();
    }

    filterContributions(associationId: number, sessionId: number = 0): Promise<Contribution[]> {
        const query = this.repository.createQueryBuilder("contributions")
            .innerJoinAndSelect("contributions.session", "sessions")
            .where("contributions.association_id = :associationId", {associationId});

        if (sessionId !== 0)
            query.andWhere("contributions.session_id = :sessionId", {sessionId});

        return query.orderBy("contributions.created_at", "DESC").limit(20).getMany();

    }

    findByAssociationSessionName(associationId: number, sessionId: number, name: string): Promise<Contribution> {
        const query = this.repository.createQueryBuilder("contributions")
            .where("contributions.association_id = :associationId", {associationId})
            .andWhere("contributions.session_id = :sessionId", {sessionId})
            .andWhere("contributions.name = :name", {name});

        return query.getOne();
    }

    async countAmounts<T>(value: T): Promise<number> {
        const query = DataSource.getRepository(Amount)
            .createQueryBuilder("amounts")
            .select("COUNT(amounts.id)");
        if (value instanceof Contribution)
            query.where("amounts.contributionId = :id", {id: value.id});
        else if (value instanceof Number)
            query.where("amounts.contributionId = :id", {id: value});

        else if (value instanceof String) {
            const contribution = await this.getOrFail(value.toString());
            query.where("amounts.contributionId = :id", {id: contribution.id});
        }
        return query.getCount();
    }
}