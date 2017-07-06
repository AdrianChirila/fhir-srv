import KoaRouter = require('koa-router')
import {UserModel as User} from "../models";
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
        });
        // this.put('/', async(ctx: any) => {
        //     console.log('State:::', ctx.state);
        //     ctx.body = await PatientModel.findByIdAndUpdate(ctx.state.patient, ctx.request.body);
        //     return 200;
        // });
        this.post('/', async(ctx: any) => {
            let patient: any = ctx.request.body;
            patient['generalPractitioner'] = ctx.state.practitioner;
            let dbPatient: any = await new PatientModel(ctx.request.body).save();
            await new User({
                pid: dbPatient['cnp'],
                password: dbPatient['cnp'],
                role: 'patient',
                'activity.actor.patient': dbPatient._id
            }).save();
            ctx.body = dbPatient;
            ctx.status = 201;
        });
    }
}