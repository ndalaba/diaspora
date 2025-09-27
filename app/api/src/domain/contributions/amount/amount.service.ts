import AmountRepository from "./amount.repository";
import { CreateAmountDto, GetAmountDto, GetAmountsDto, UpdateAmountDto } from "./amount.schema";
import ContributionRepository from "../contribution/contribution.repository";
import CurrencyRepository from "../currency/currency.repository";
import Response from "../../../utils/response.utils";
import { tryCatch } from "../../../utils/functions.utils";
import { NotAllowedError } from "../../../utils/errors.utils";
import Currency from "../currency/currency.entity";
import Amount from "./amount.entity";
import Contribution from "../contribution/contribution.entity";
import Session from "../session/session.entity";
import SessionRepository from "../session/session.repository";

export default class AmountService {
  constructor(private readonly amountRepo: AmountRepository = new AmountRepository(),
              private readonly contributionRepo: ContributionRepository = new ContributionRepository(),
              private readonly sessionRepo: SessionRepository = new SessionRepository(),
              private readonly currencyRepo: CurrencyRepository = new CurrencyRepository()) {
  }


  async updateAmount(dto: UpdateAmountDto): Promise<Response> {
    const isAmountValid = async (contributionId: number): Promise<boolean> => {
      const amount = await this.amountRepo.findByNameAndContribution(dto.name, contributionId);
      return amount == null || amount.uid == dto.uid;
    };

    return tryCatch(async () => {
      const currency = await this.currencyRepo.getOrFail(dto.currency_uid) as Currency;
      let amount = await this.amountRepo.getOrFail(dto.uid) as Amount;

      if (!await isAmountValid(amount.contribution.id))
        return new Response().addError("amountExist", "Amount already created");

      amount.hydrate(dto);
      amount.currency = currency;
      amount = await this.amountRepo.save(amount) as Amount;
      return new Response().addData("amount", amount);

    }, dto.name);

  }

  async getAmount(dto: GetAmountDto): Promise<Response> {
    return tryCatch(async () => {
      const amount = await this.amountRepo.getOrFail(dto.uid) as Amount;
      return new Response().addData("amount", amount);
    }, dto.uid);
  }

  async getAmounts(dto: GetAmountsDto): Promise<Response> {
    return tryCatch(async () => {

      let contribution = null;
      if (dto.contribution_uid.trim().length > 0)
        contribution = await this.contributionRepo.getOrFail(dto.contribution_uid) as Contribution;

      let currency = null;
      if (dto.currency_uid.trim().length > 0)
        currency = await this.currencyRepo.getOrFail(dto.currency_uid) as Currency;

      let session = null;
      if (dto.session_uid.trim().length > 0)
        session = await this.sessionRepo.getOrFail(dto.session_uid) as Session;

      const amounts = await this.amountRepo.filterAmounts(contribution !== null ? contribution.id : 0, currency !== null ? currency.id : 0, session !== null ? session.id : 0);

      return new Response().addData("amounts", amounts);
    }, dto.contribution_uid);
  }


  async removeAmount(dto: GetAmountDto): Promise<Response> {

    const canBeDeleted = async (amountId: number): Promise<boolean> => await this.amountRepo.countPayments(amountId) == 0;

    return tryCatch(async () => {
      const amount = await this.amountRepo.getOrFail(dto.uid) as Amount;
      if (!amount.canManage(dto.user)) throw new NotAllowedError("Not allowed");

      if (!await canBeDeleted(amount.id)) return new Response().addError("denied", "Amount can't be deleted.");

      await this.amountRepo.remove(amount);

      return new Response();

    }, dto.uid);

  }

  async createAmount(dto: CreateAmountDto): Promise<Response> {

    const isAmountValid = async (contributionId: number): Promise<boolean> => {
      const amount = await this.amountRepo.findByNameAndContribution(dto.name, contributionId);
      return amount == null;
    };

    return tryCatch(async () => {
      const contribution = await this.contributionRepo.getOrFail(dto.contribution_uid) as Contribution;

      if (!await isAmountValid(contribution.id))
        return new Response().addError("amountExist", "Amount is already created.");

      const currency = await this.currencyRepo.getOrFail(dto.currency_uid) as Currency;

      let amount = new Amount(dto);
      amount.contribution = contribution;
      amount.currency = currency;

      amount = await this.amountRepo.save(amount) as Amount;
      return new Response().addData("amount", amount);

    }, dto.name);
  }
}