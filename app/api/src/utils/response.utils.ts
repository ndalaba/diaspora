import Errors from "./errors.utils";

export default class Response extends Errors {

    constructor(private readonly data: Map<string, any> = new Map<string, any>(), errors = new Map<string, string>()) {
        super(errors)
        this.data = data
    }

    addData(name: string, data: any): Response {
        this.data.set(name, data)
        return this
    }

    getData(name: string): any {
        return this.data.get(name)
    }

}
