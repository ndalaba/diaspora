import AbstractRepository from "../shared/abstract.repository";
import Section, {UserSection} from "./section.entity";
import Association from "../associations/association.entity";
import User from "../users/user.entity";

export class SectionRepository extends AbstractRepository<Section> {

    constructor() {
        super(Section);
    }

    async findAll(): Promise<Section[]> {
        return this.repository.find({
            order: {name: "asc", id: "desc"}
        });
    }

    async findPublished(): Promise<Section[]> {
        return this.repository.find({
            where: {active: true},
            order: {name: "asc", id: "desc"}
        });
    }

    findByName(name: string): Promise<Section | null> {
        return this.repository.findOneBy({name});
    }
}

export class UserSectionRepository extends AbstractRepository<UserSection> {

    constructor() {
        super(UserSection);
    }

    async createMany(userSections: UserSection[]): Promise<void> {
        await this.repository.createQueryBuilder()
            .insert()
            .into(UserSection)
            .values(userSections).execute();
    }

    async removeUserSection(associationId: number, userId: number): Promise<void> {
        await this.repository.createQueryBuilder("q")
            .delete()
            .from(UserSection)
            .where("association_id = :associationId AND user_id = :userId", {associationId, userId})
            .execute();
    }

    findByMemberAssociation(user: User, association: Association): Promise<UserSection[]> {
        const query = this.repository.createQueryBuilder("q")
            .where("q.association_id = :associationId AND q.user_id = :userId", {
                associationId: association.id,
                userId: user.id
            });
        return query.getMany();
    }
}
