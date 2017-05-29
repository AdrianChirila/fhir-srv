import KoaRouter = require('koa-router')
import {PatientModel} from "../models/patient.model";
import {PractitionerModel} from "../models/practitioner.model";
import {AppointmentModel} from "../models/appointment.model";
import {APPOINTMENT_STATUS, START_WORKING} from "../utils/consts";

export class SlotRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.get('/', async(ctx: any) => {
            console.log('State:::', ctx.state);
            if (ctx.state.patient) {
                let targetPatient: any = await PatientModel.findById(ctx.state.patient);
                let targetPractitioner: any = await PractitionerModel.findById(targetPatient.generalPractitioner);
                let targetAppointments: any = await AppointmentModel.find({
                    'participant.actor.practitioner': targetPractitioner,
                    'status': APPOINTMENT_STATUS.BOOKED
                });
                let response : any = [];
                let today : Date = new Date();
                today.setHours(START_WORKING);
                for(let index: number = 0; index < targetAppointments.length; index ++) {

                }

                ctx.body = targetAppointments;
                ctx.status = 200;
            }
        })
    }
}