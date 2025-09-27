import {Request, Response, Router} from "express";
import AmountService from "./amount.service";
import StatusCodeUtils from "../../../utils/statusCode.utils";
import {validate} from "../../shared/validate.middleware";
import {CreateAmountSchema, UpdateAmountSchema} from "./amount.schema";
import AbstractController from "../../shared/abstract.controller";

export default class AmountsController extends AbstractController {
    constructor(private readonly amountService: AmountService = new AmountService(), private router = Router()) {
        super();
    }

    routes(): Router {

        this.router.delete("/:uid", async (req: Request, res: Response) => {
            const response = await this.amountService.removeAmount({uid: req.params.uid, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, null);
        });

        this.router.get("/:uid", async (req: Request, res: Response) => {
            const response = await this.amountService.getAmount({uid: req.params.uid, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("amount"));
        });

        this.router.get("/", async (req: Request, res: Response) => {
            const response = await this.amountService.getAmounts({
                user: res.locals.user,
                contribution_uid: req.query.contribution as string,
                currency_uid: req.query.currency as string,
                session_uid: req.query.session as string
            });
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("amounts"));
        });

        this.router.post("/", validate(CreateAmountSchema), async (req: Request, res: Response) => {
            const response = await this.amountService.createAmount({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("amount"), StatusCodeUtils.CREATED);
        });

        this.router.put("/", validate(UpdateAmountSchema), async (req: Request, res: Response) => {
            const response = await this.amountService.updateAmount({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("amount"));
        });
        return this.router;
    }
}
