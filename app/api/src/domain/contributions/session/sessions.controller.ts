import {Request, Response, Router} from "express";
import SessionService from "./session.service";
import StatusCodeUtils from "../../../utils/statusCode.utils";
import {validate} from "../../shared/validate.middleware";
import {CreateSessionSchema, UpdateSessionSchema} from "./session.schema";
import AbstractController from "../../shared/abstract.controller";

export default class SessionsController extends AbstractController {
    constructor(private readonly sessionService: SessionService = new SessionService(), private router = Router()) {
        super();
    }

    routes(): Router {

        this.router.delete("/:uid", async (req: Request, res: Response) => {
            const response = await this.sessionService.removeSession({uid: req.params.uid, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, null);
        });

        this.router.get("/:uid", async (req: Request, res: Response) => {
            const response = await this.sessionService.getSession({uid: req.params.uid, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("session"));
        });

        this.router.get("/", async (req: Request, res: Response) => {
            const response = await this.sessionService.getSessions({
                user: res.locals.user,
                association_uid: req.query.assos as string
            });
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("sessions"));
        });

        this.router.post("/", validate(CreateSessionSchema), async (req: Request, res: Response) => {
            const response = await this.sessionService.createSession({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("session"), StatusCodeUtils.CREATED);
        });

        this.router.put("/", validate(UpdateSessionSchema), async (req: Request, res: Response) => {
            const response = await this.sessionService.updateSession({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("session"), StatusCodeUtils.OK);
        });
        return this.router;
    }
}
