import {AnyZodObject, ZodError} from "zod";
import {NextFunction, Request, Response as ExpressResponse} from "express";
import Response from "../../utils/response.utils";
import StatusCode from "../../utils/statusCode.utils";

export const validate = (schema: AnyZodObject) =>
    async (req: Request, res: ExpressResponse, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body)
            /*await schema.parseAsync({
               body: req.body,
               query: req.query,
               params: req.params,
            });*/
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const response = new Response()
                error.errors.forEach(err => response.addError(err.path.toString(), err.message))
                return res.status(StatusCode.BAD_REQUEST).json({success: false, error: response.jsonErrors()})
            }
        }
    }