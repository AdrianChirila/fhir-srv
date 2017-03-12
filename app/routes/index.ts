import {OrganizationRouter} from "./organization.router";
export  {OrganizationRouter} from "./organization.router"
import KoaRouter = require('koa-router')

export class ApiRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.use('/Organization', new OrganizationRouter(null).routes());
    }
}