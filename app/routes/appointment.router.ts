import KoaRouter = require('koa-router');
import {AppointmentModel, APPOINTMENT_STATUS} from "../models/appointment.model";
import {decodeToken} from "../utils/auth";
const ObjectId = require('mongoose').Schema.Types.ObjectId;

export class AppointmentRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.get('/', async(ctx: any) => {
            if (!ctx.query.status) {
                ctx.query.status = APPOINTMENT_STATUS.BOOKED;
            }
            ctx.body = await AppointmentModel.find({
                'participant.actor.practitioner': ctx.state._id,
                'status': ctx.query.status
            });
            ctx.status = 200;
        });
        this.put('/:id', async(ctx: any) => {
            console.log('Update appointment');
            ctx.body = await AppointmentModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new: true});
            ctx.status = 201;
        });
    }
}