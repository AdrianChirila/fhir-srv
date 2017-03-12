import KoaRouter = require('koa-router')

export class OrganizationRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.get('/', async(ctx: any) => {
            ctx.body = {'message': 'OrganizationRouter'};
            ctx.status = 200;
        })
    }
}