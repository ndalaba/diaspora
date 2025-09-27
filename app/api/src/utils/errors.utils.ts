export default class Errors {

    constructor(protected readonly errors: Map<string, any> = new Map<string, any>()) {
        this.errors = errors
    }

    getErrors(): Map<string, string> {
        return this.errors
    }

    addError(name: string, message: any): this {
        this.errors.set(name, message)
        return this
    }

    hasError(): boolean {
        return this.errors.size > 0
    }

    jsonErrors() {
        return Array.from(this.errors, ([name, value]) => ({name, value}))
        //return Object.fromEntries(this.errors)
    }

    arrayErrors() {
        return Object.fromEntries(this.errors)
    }
}

export class NotFoundError extends Error {
    constructor(m: string = "Not found") {
        super(m);
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
}

export class NotAllowedError extends Error {
    constructor(m: string = "Not allowed") {
        super(m);
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
}