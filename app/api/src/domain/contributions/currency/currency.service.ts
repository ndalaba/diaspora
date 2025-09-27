import CurrencyRepository from "./currency.repository";
import AssociationRepository from "../../associations/association.repository";
import { CreateCurrencyDto, GetCurrenciesDto, GetCurrencyDto, UpdateCurrencyDto } from "./currency.schema";
import Response from "../../../utils/response.utils";
import { tryCatch } from "../../../utils/functions.utils";
import { NotAllowedError } from "../../../utils/errors.utils";
import Currency from "./currency.entity";
import Association from "../../associations/association.entity";

export default class CurrencyService {
  constructor(private readonly currencyRepo: CurrencyRepository = new CurrencyRepository(), private readonly associationRepo: AssociationRepository = new AssociationRepository()) {
  }

  async updateCurrency(dto: UpdateCurrencyDto): Promise<Response> {

    const isCurrencyValid = async (associationId: number): Promise<boolean> => {
      const currency = await this.currencyRepo.findByCode(dto.code, associationId);
      return currency == null || currency.uid === dto.uid;
    };

    return tryCatch(async () => {

      let currency = await this.currencyRepo.getOrFail(dto.uid) as Currency;

      if (!currency.canManage(dto.user)) throw new NotAllowedError("Not allowed");

      if (!await isCurrencyValid(currency.association.id)) return new Response().addError("currencyExist", "Currency is already created");

      currency.hydrate(dto);
      currency = await this.currencyRepo.save(currency) as Currency;
      return new Response().addData("currency", currency);
    }, dto.name);
  }


  async getCurrencies(dto: GetCurrenciesDto): Promise<Response> {
    return tryCatch(async () => {
      const association = await this.associationRepo.getOrFail(dto.association_uid) as Association;

      if (!association.canManage(dto.user)) throw new NotAllowedError("Not allowed");

      const currencies = await this.currencyRepo.findByAssociation(association.id);

      return new Response().addData("currencies", currencies);
    }, dto.association_uid);
  }

  async getCurrency(dto: GetCurrencyDto): Promise<Response> {
    return tryCatch(async () => {
      const currency = await this.currencyRepo.getOrFail(dto.uid) as Currency;

      if (!currency.canManage(dto.user)) throw new NotAllowedError("Not allowed");

      return new Response().addData("currency", currency);
    }, dto.uid);
  }

  async removeCurrency(dto: GetCurrencyDto): Promise<Response> {

    const canBeDeleted = async (currencyId: number): Promise<boolean> => await this.currencyRepo.countAmounts<number>(currencyId) == 0;

    return tryCatch(async () => {
      const currency = await this.currencyRepo.getOrFail(dto.uid) as Currency;

      if (!currency.canManage(dto.user)) throw new NotAllowedError("Not allowed");

      if (!await canBeDeleted(currency.id)) return new Response().addError("hasAmounts", "Currency has amounts");

      await this.currencyRepo.remove(currency);

      return new Response();
    }, dto.uid);
  }

  async createCurrency(dto: CreateCurrencyDto): Promise<Response> {
    const isCurrencyValid = async (associationId: number): Promise<boolean> => {
      const currency = await this.currencyRepo.findByCode(dto.code, associationId);
      return currency == null;
    };

    return tryCatch(async () => {

      const association = await this.associationRepo.getOrFail(dto.association_uid) as Association;

      if (!association.canManage(dto.user)) throw new NotAllowedError("Not allowed");

      if (!await isCurrencyValid(association.id)) return new Response().addError("currencyExist", "Currency is already created");

      let currency = new Currency(dto);
      currency.association = association;
      currency = await this.currencyRepo.save(currency) as Currency;
      return new Response().addData("currency", currency);

    }, dto.name);
  }
}