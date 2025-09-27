import {Request, Response, Router} from "express";
import CurrencyService from "./currency.service";
import StatusCodeUtils from "../../../utils/statusCode.utils";
import {validate} from "../../shared/validate.middleware";
import {CreateCurrencySchema, UpdateCurrencySchema} from "./currency.schema";
import AbstractController from "../../shared/abstract.controller";

export default class CurrenciesController extends AbstractController {
    constructor(private readonly currencyService: CurrencyService = new CurrencyService(), private router = Router()) {
        super()
    }

    routes(): Router {

        this.router.delete("/:uid", async (req: Request, res: Response) => {
            const response = await this.currencyService.removeCurrency({uid: req.params.uid, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, null);
        });

        this.router.get("/:uid", async (req: Request, res: Response) => {
            const response = await this.currencyService.getCurrency({uid: req.params.uid, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("currency"));
        });

        this.router.get("/", async (req: Request, res: Response) => {
            const response = await this.currencyService.getCurrencies({
                user: res.locals.user,
                association_uid: req.query.assos as string
            });
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("currencies"));
        });

        this.router.post("/", validate(CreateCurrencySchema), async (req: Request, res: Response) => {
            const response = await this.currencyService.createCurrency({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("currency"), StatusCodeUtils.CREATED);
        });

        this.router.put("/", validate(UpdateCurrencySchema), async (req: Request, res: Response) => {
            const response = await this.currencyService.updateCurrency({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("currency"));
        });
        return this.router;
    }
}
