import KoaRouter = require('koa-router')
// import {PatientSchema as Patient} from 'fhir-repo/dist/schemas/PatientSchema.js';
const mongoose = require('mongoose');
const PatientModel: any = mongoose.model('Patient');

export class PatientRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.get('/', async(ctx: any) => {
            ctx.body = await PatientModel.find({});
        });

        this.get('/:id', async(ctx: any) => {
            ctx.body = await PatientModel.findById(ctx.params.id);
            console.log(ctx.body);
        });
    }
}