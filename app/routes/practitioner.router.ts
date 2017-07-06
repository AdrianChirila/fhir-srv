import KoaRouter = require('koa-router')
import {PractitionerModel} from "../models/practitioner.model";
const mongoose = require('mongoose');

export class PractitionerRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.get('/', async(ctx: any) => {
            console.log('xxx', ctx.state);
            ctx.status = 200;
        });
        this.put('/', async(ctx: any) => {
            console.log('xxxx', ctx.state);
            ctx.body = await PractitionerModel.findByIdAndUpdate(ctx.state.practitioner, ctx.request.body, {new:true});
            ctx.status = 200;
        });
    }
}