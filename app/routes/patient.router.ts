import KoaRouter = require('koa-router')
// import {PatientSchema as Patient} from 'fhir-repo/dist/schemas/PatientSchema.js';
const mongoose = require('mongoose');

export class PatientRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.get('/', async(ctx: any) => {
            let PatientModel: any = mongoose.model('Patient');
            ctx.body = await PatientModel.find({});
        })
    }
}