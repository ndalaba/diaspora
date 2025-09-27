import {Request, Response, Router} from "express";
import UserService from "./user.service";
import {uploadFile} from "../../utils/file.utils";
import StatusCodeUtils from "../../utils/statusCode.utils";
import {validate} from "../shared/validate.middleware";
import {CreateUserSchema, UpdateUserSchema} from "./user.schema";
import AbstractController from "../shared/abstract.controller";

export default class UsersController extends AbstractController {
    constructor(private readonly userService: UserService = new UserService(), private router = Router()) {
        super();
    }

    routes(): Router {
        this.router.get("/sections", async (req: Request, res: Response) => {
            const response = await this.userService.filterWithSections({
                user: res.locals.user, ...req.query,
                association_uid: req.query.assos as string
            });
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("users"));
        });

        this.router.delete("/:uid", async (req: Request, res: Response) => {
            const response = await this.userService.removeUser(req.params.uid, res.locals.user);
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, null);
        });

        this.router.get("/:uid", async (req: Request, res: Response) => {
            const response = await this.userService.getUser(req.params.uid);
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("user"));
        });

        this.router.get("/", async (req: Request, res: Response) => {
            const response = await this.userService.filterUsers({
                user: res.locals.user, ...req.query,
                association_uid: req.query.assos as string
            });
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("users"));
        });

        this.router.post("/image", uploadFile("users").single("image"), async (req: Request, res: Response) => {
            console.log(req.body);
            const response = await this.userService.updateUserImage({
                uid: req.body.uid,
                image: "users/" + req.file?.filename,
                user: res.locals.user
            });
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("user"));

        });

        this.router.post("/", validate(CreateUserSchema), async (req: Request, res: Response) => {
            const response = await this.userService.createUser({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("user"), StatusCodeUtils.CREATED);
        });

        this.router.put("/", validate(UpdateUserSchema), async (req: Request, res: Response) => {
            const response = await this.userService.updateUser({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("user"), StatusCodeUtils.OK);
        });

        return this.router;
    }
}
