import DataSource from "../../../../config/ormconfig";
import AbstractRepository from "../../shared/abstract.repository";
import Session from "./session.entity";
import Contribution from "../contribution/contribution.entity";

export default class SessionRepository extends AbstractRepository<Session> {
    constructor() {
        super(Session);
    }

    async getOrFail(uid: string): Promise<Session> {
        return this.repository.createQueryBuilder("sessions")
            .innerJoinAndSelect("sessions.association", "association")
            .innerJoinAndSelect("association.user", "users")
            .where("sessions.uid = :uid", {uid})
            .getOneOrFail();
    }

    findByAssociation(associationId: number): Promise<Session[]> {
        return this.repository.createQueryBuilder("sessions")
            .where("sessions.association_id = :association_id", {association_id: associationId})
            .orderBy("sessions.name", "DESC")
            .getMany();
    }

    findByName(name: string, associationId: number): Promise<Session> {
        return this.repository
            .createQueryBuilder("sessions")
            .where("sessions.name = :name AND sessions.association_id = :association_id", {
                name,
                association_id: associationId
            })
            .getOne();
    }

    async countContributions<T>(value: T): Promise<number> {
        const query = DataSource.getRepository(Contribution)
            .createQueryBuilder("contributions")
            .select("COUNT(*)");

        if (value instanceof Session)
            query.where("contributions.session_id = :id", {id: value.id});

        else if (typeof value === "number")
            query.where("contributions.session_id = :id", {id: value});

        else if (typeof value === "string") {
            const country = await this.getOrFail(value);
            query.where("contributions.session_id = :id", {id: country.id});
        }
        return query.getCount();
    }
}