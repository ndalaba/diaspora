import {Request, Response, Router} from "express";
import {validate} from "../shared/validate.middleware";
import StatusCodeUtils from "../../utils/statusCode.utils";
import {AddMemberSchema, CreateAssociationSchema, UpdateAssociationSchema} from "./association.schema";
import {uploadFile} from "../../utils/file.utils";
import AssociationService, {AssociationMemberService} from "./association.service";
import AbstractController from "../shared/abstract.controller";

export default class AssociationsController extends AbstractController {
    constructor(private readonly associationService: AssociationService = new AssociationService(), private router = Router()) {
        super();
    }

    routes(): Router {

        this.router.post("/logo", uploadFile("associations").single("logo"), async (req: Request, res: Response) => {
            console.log(req.body);
            const response = await this.associationService.updateAssociationLogo({
                uid: req.body.uid,
                image: "associations/" + req.file?.filename,
                user: res.locals.user
            });
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("association"));

        });

        this.router.post("/", validate(CreateAssociationSchema), async (req: Request, res: Response) => {
            const response = await this.associationService.createAssociation({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("association"), StatusCodeUtils.CREATED);
        });

        this.router.put("/", validate(UpdateAssociationSchema), async (req: Request, res: Response) => {
            const response = await this.associationService.updateAssociation({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("association"), StatusCodeUtils.OK);
        });

        this.router.get("/:uid", async (req: Request, res: Response) => {
            const response = await this.associationService.getAssociation(req.params.uid);
            return this.successResponse(res, response.getData("association"));
        });

        this.router.get("/", async (_: Request, res: Response) => {
            const response = await this.associationService.filterAssociations({user_id: res.locals.user?.id});
            return this.successResponse(res, response.getData("associations"));
        });

        this.router.delete("/:uid", async (req: Request, res: Response) => {
            const response = await this.associationService.deleteAssociation({
                uid: req.params.uid,
                user: res.locals.user
            });
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, null, StatusCodeUtils.OK);

        });
        return this.router;
    }
}

export class AssociationMemberController extends AbstractController {
    constructor(private readonly associationMemberService: AssociationMemberService = new AssociationMemberService(), private router = Router()) {
        super();
    }

    routes(): Router {

        this.router.post("/set-admin", validate(AddMemberSchema), async (req: Request, res: Response) => {
            const response = await this.associationMemberService.setAdmin({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("association"), StatusCodeUtils.CREATED);
        });

        this.router.post("/remove-admin", validate(AddMemberSchema), async (req: Request, res: Response) => {
            const response = await this.associationMemberService.removeAdmin({...req.body, user: res.locals.user});
            return response.hasError() ? this.errorResponse(res, response.jsonErrors()) : this.successResponse(res, response.getData("association"));
        });

        return this.router;
    }
}