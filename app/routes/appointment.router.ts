import KoaRouter = require('koa-router');
import {AppointmentModel} from "../models/appointment.model";
import {UserModel} from "../models/user.model";
import {MODELS, ROLES} from "../models/models";
import {APPOINTMENT_STATUS} from "../utils/consts";
import {PatientModel} from "../models/patient.model";
import {PractitionerModel} from "../models/practitioner.model";
const ObjectId = require('mongoose').Schema.Types.ObjectId;

export class AppointmentRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.get('/', async(ctx: any) => {
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
                ctx.body = await AppointmentModel.find({
                    'participant.actor.patient': relevantUser.activity.actor.patient,
                    'status': ctx.query.status
                });
            }

            ctx.status = 200;
        });
        this.put('/:id', async(ctx: any) => {
            console.log('Update appointment');
            ctx.body = await AppointmentModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new: true});
            ctx.status = 201;
        });

        this.post('/', async(ctx: any) => {
            console.log('Save appointment');
            console.log('COntext::', ctx.state);
            let targetPatient: any = await PatientModel.findById(ctx.state.patient);
            let targetPractitioner: any = await PractitionerModel.findById(targetPatient.generalPractitioner);
            let body: any = ctx.request.body;
            ctx.body = await AppointmentModel({
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
            ctx.status= 200;
        });
    }
}