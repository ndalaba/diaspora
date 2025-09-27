import {Request, Response, Router} from "express";
import {validate} from "../shared/validate.middleware";
import StatusCodeUtils from "../../utils/statusCode.utils";
import SectionService from "./section.service";
import {CreateSectionSchema, UpdateSectionSchema} from "./section.schema";
import AbstractController from "../shared/abstract.controller";
import {adminMiddleware} from "../../auths/auth.middleware";


export default class SectionsController extends AbstractController {
    constructor(private readonly sectionService: SectionService = new SectionService(), private readonly router = Router()) {
        super();
    }

    routes(): Router {
        this.router.post("/", adminMiddleware, validate(CreateSectionSchema), async (req: Request, res: Response) => {
            const response = await this.sectionService.createSection(req.body);
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("section"), StatusCodeUtils.CREATED);
        });

        this.router.put("/", adminMiddleware, validate(UpdateSectionSchema), async (req: Request, res: Response) => {
            const response = await this.sectionService.updateSection(req.body);
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("section"), StatusCodeUtils.OK);
        });

        this.router.get("/", async (_: Request, res: Response) => {
            const response = await this.sectionService.getSections(res.locals.user);
            return this.successResponse(res, response.getData("sections"));
        });

        this.router.delete("/:uid", adminMiddleware, async (req: Request, res: Response) => {
            const response = await this.sectionService.deleteSection(req.params.uid);
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, null, StatusCodeUtils.OK);

        });
        return this.router;
    }
}