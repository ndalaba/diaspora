import DataSource from "../../../../config/ormconfig"
import AbstractRepository from "../../shared/abstract.repository";
import {GetPaymentsDto} from "./payment.schema";
import Payment from "./payment.entity";
import Contribution from "../contribution/contribution.entity";
import Amount from "../amount/amount.entity";

export default class PaymentRepository extends AbstractRepository<Payment> {
    constructor() {
        super(Payment);
    }

    async filter(dto: GetPaymentsDto, contribution: Contribution): Promise<Payment[]> {
        const query = this.repository.createQueryBuilder('payments')
            .innerJoinAndSelect('payments.amount', "amounts")

        if (dto.amountUid !== "") {
            const amount = await DataSource.getRepository(Amount).findOneOrFail({where: {uid: dto.amountUid}})
            query.where("payments.amountId = :amountId", {amountId: amount.id})
        } else {
            query.innerJoinAndSelect("amounts.contribution", 'contribution')
                .where("amounts.contributionId = :contributionId", {contributionId: contribution.id})
        }

        return query.getMany()
    }
}