import Payment from "./payment.entity";
import PaymentRepository from "./payment.repository";
import {CreatePaymentDto, GetPaymentDto, GetPaymentsDto, UpdatePaymentDto} from "./payment.schema";
import AmountRepository from "../amount/amount.repository";
import {UserRepository} from "../../users/user.repository";
import Response from "../../../utils/response.utils";
import {tryCatch} from "../../../utils/functions.utils";
import {NotAllowedError} from "../../../utils/errors.utils";
import ContributionRepository from "../contribution/contribution.repository";
import Contribution from "../contribution/contribution.entity";
import Amount from "../amount/amount.entity";
import User from "../../users/user.entity";

export default class PaymentService {
    constructor(private readonly paymentRepo: PaymentRepository = new PaymentRepository(),
                private readonly contributionRepo: ContributionRepository = new ContributionRepository(),
                private readonly userRepo: UserRepository = new UserRepository(),
                private readonly amountRepo: AmountRepository = new AmountRepository()) {
    }

    async getPayment(dto: GetPaymentDto): Promise<Response> {

        return tryCatch(async () => {
            const payment = await this.paymentRepo.getOrFail(dto.uid) as Payment
            if (!payment.canManage(dto.user)) throw new NotAllowedError()

            return new Response().addData("payment", payment)
        }, dto.uid)
    }

    async getPayments(dto: GetPaymentsDto): Promise<Response> {

        return tryCatch(async () => {

            const contribution = await this.contributionRepo.getOrFail(dto.contributionUid) as Contribution
            if (!contribution.canManage(dto.user)) throw new NotAllowedError()

            const payments = await this.paymentRepo.filter(dto, contribution)

            return new Response().addData("payments", payments)

        }, `${dto.contributionUid} ${dto.amountUid}`)

    }

    async deletePayment(dto: GetPaymentDto): Promise<Response> {

        return tryCatch(async () => {
            const payment = await this.paymentRepo.getOrFail(dto.uid) as Payment

            if (!payment.canManage(dto.user)) throw new NotAllowedError()

            await this.paymentRepo.remove(payment)

            return new Response()
        }, dto.uid)
    }

    async createPayment(dto: CreatePaymentDto): Promise<Response> {

        return tryCatch(async () => {

            const amount = await this.amountRepo.getOrFail(dto.amountUid) as Amount

            if (!amount.canManage(dto.user)) throw new NotAllowedError()

            const member = await this.userRepo.getOrFail(dto.memberUid) as User

            let payment = new Payment(dto)
            payment.member = member
            payment.user = dto.user
            payment = await this.paymentRepo.save(payment) as Payment
            return new Response().addData('payment', payment)

        }, dto.memberUid)
    }

    async updatePayment(dto: UpdatePaymentDto): Promise<Response> {

        return tryCatch(async () => {

            let payment = await this.paymentRepo.getOrFail(dto.uid) as Payment

            if (!payment.canManage(dto.user)) throw new NotAllowedError()

            const amount = await this.amountRepo.getOrFail(dto.amountUid) as Amount
            const member = await this.userRepo.getOrFail(dto.memberUid) as User

            payment.hydrate(dto)
            payment.amount = amount
            payment.member = member

            payment = await this.paymentRepo.save(payment) as Payment
            return new Response().addData("payment", payment)
        }, dto.uid)
    }
}