import {Request, Response, Router} from "express";
import ContributionService from "./contribution.service";
import StatusCodeUtils from "../../../utils/statusCode.utils";
import {validate} from "../../shared/validate.middleware";
import {CreateContributionSchema, UpdateContributionSchema} from "./contribution.schema";
import AbstractController from "../../shared/abstract.controller";

export default class ContributionsController extends AbstractController {
    constructor(private readonly contributionService: ContributionService = new ContributionService(), private router = Router()) {
        super();
    }

    routes(): Router {

        this.router.delete("/:uid", async (req: Request, res: Response) => {
            const response = await this.contributionService.removeContribution({
                uid: req.params.uid,
                user: res.locals.user
            });
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, null);
        });

        this.router.get("/:uid", async (req: Request, res: Response) => {
            const response = await this.contributionService.getContribution({
                uid: req.params.uid,
                user: res.locals.user
            });
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("contribution"));
        });

        this.router.get("/", async (req: Request, res: Response) => {
            const response = await this.contributionService.getContributions({
                user: res.locals.user,
                association_uid: req.query.association as string,
                session_uid: req.query.session as string
            });
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("contributions"));
        });

        this.router.post("/", validate(CreateContributionSchema), async (req: Request, res: Response) => {
            const response = await this.contributionService.createContribution({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("contribution"), StatusCodeUtils.CREATED);
        });

        this.router.put("/", validate(UpdateContributionSchema), async (req: Request, res: Response) => {
            const response = await this.contributionService.updateContribution({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("contribution"), StatusCodeUtils.OK);
        });
        return this.router;
    }
}
