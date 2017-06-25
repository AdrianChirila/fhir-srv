import KoaRouter = require('koa-router')
const mongoose = require('mongoose');
const PatientModel: any = mongoose.model('Patient');

export class PractitionerRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.get('/', async(ctx: any) => {
            console.log('xxx', ctx.state);
            ctx.status = 200;
        });
    }
}