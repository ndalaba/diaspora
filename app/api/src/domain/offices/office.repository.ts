import Office from "./office.entity";
import AbstractRepository from "../shared/abstract.repository";

export default class OfficeRepository extends AbstractRepository<Office> {
    constructor() {
        super(Office);
    }

    findByAssociation(associationId: number): Promise<Office[]> {
        return this.repository.findBy({association: associationId})
    }

}