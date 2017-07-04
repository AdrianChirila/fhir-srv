import KoaRouter = require('koa-router');
import {AppointmentModel} from "../models/appointment.model";
import {UserModel} from "../models/user.model";
import {MODELS, ROLES} from "../models/models";
import {APPOINTMENT_STATUS} from "../utils/consts";
import {PatientModel} from "../models/patient.model";
import {PractitionerModel} from "../models/practitioner.model";
import {SlotModel} from "../models/slot.model";
const ObjectId = require('mongoose').Schema.Types.ObjectId;

export class AppointmentRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.get('/', async(ctx: any) => {
            console.log('Get appointment:::', ctx.state);
            let relevantUser: any = await UserModel.findById(ctx.state._id);
            if (!ctx.query.status) {
                ctx.query.status = APPOINTMENT_STATUS.BOOKED;
            }
            if (relevantUser.role == ROLES.PRACTITIONER) {
                ctx.body = await AppointmentModel.find({
                    'participant.actor.practitioner': relevantUser.activity.actor.practitioner,
                    'status': ctx.query.status
                });
            } else {
                let query: any = {
                    'participant.actor.patient': relevantUser.activity.actor.patient
                };

                if (ctx.query['status'].lastIndexOf('||') > -1) {
                    console.log('|| in status', ctx.query['status']);
                    let firstStatus: string = ctx.query['status'].split('||')[0];
                    let secondStatus: string = ctx.query['status'].split('||')[1];
                    let thirdStatus: string = ctx.query['status'].split('||')[2];
                    let orQuery: any = [{status: firstStatus}, {status: secondStatus}];

                    if (thirdStatus) {
                      orQuery.push({status: thirdStatus});
                    }
                    query['$and'] = [
                        {$or: orQuery}
                    ];
                } else {
                    query['status'] = ctx.query.status;
                }
                ctx.body = await AppointmentModel.find(query);
            }

            ctx.status = 200;
        });
        this.put('/:id', async(ctx: any) => {
            console.log('Update appointment');
            let appointment: any = await AppointmentModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new: true});
            let targetSlot: any = appointment.slot;
            console.log('Apointment::::::::', appointment);
            if (appointment.status == 'cancelled') {
                await SlotModel.findByIdAndUpdate(targetSlot, {status: 'free'});
            } else if (appointment.status == 'booked') {
                await SlotModel.findByIdAndUpdate(targetSlot, {status: 'busy'});
            }

            ctx.body = appointment;
            ctx.status = 201;
        });

        this.post('/', async(ctx: any) => {
            console.log('Save appointment');
            console.log('COntext::', ctx.state);
            let targetPatient: any = await PatientModel.findById(ctx.state.patient);
            let targetPractitioner: any = await PractitionerModel.findById(targetPatient.generalPractitioner);
            let body: any = ctx.request.body;
            ctx.body = await AppointmentModel({
                "slot": body.slot,
                "date": body.date,
                "status": APPOINTMENT_STATUS.PENDING,
                participant: [
                    {
                        actor: {
                            display: `${targetPatient.name.family} ${targetPatient.name.given}`,
                            patient: targetPatient._id
                        }
                    },
                    {
                        actor: {
                            display: 'Default practitioner',
                            practitioner: targetPractitioner._id
                        }
                    }
                ]
            }).save();
            await SlotModel.findByIdAndUpdate(body.slot, {status: 'pending'});
            ctx.status= 200;
        });
    }
}










