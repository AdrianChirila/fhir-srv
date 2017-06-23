import KoaRouter = require('koa-router')
import {ScheduleModel as Schedule, SlotModel as Slot} from "../models";
import {PractitionerModel} from "../models/practitioner.model";
import {ScheduleModel} from "../models/schedule.model";
const mongoose = require('mongoose');
const PatientModel: any = mongoose.model('Patient');


export class ScheduleRouter extends KoaRouter {
    async splitAndSaveSlotsByScheduleDate(dbSchedule: any) {
        let startHour = dbSchedule.planningHorizon.start.getHours();
        let startMinute = dbSchedule.planningHorizon.start.getMinutes();
        let endHour = dbSchedule.planningHorizon.end.getHours();
        let endMinutes = dbSchedule.planningHorizon.end.getMinutes();
        let totalMinutes: number;
        let totalHours: number;
        if (startMinute > endMinutes) {
            totalMinutes = startMinute - endMinutes;
            totalHours = endHour - startHour - 1;
        } else {
            totalMinutes = endMinutes - startMinute;
            totalHours = endHour - startHour;
        }
        totalMinutes+= totalHours * 60;
        let numberOfSlots: number = totalMinutes / 15;
        let startDate: Date = dbSchedule.planningHorizon.start;
        for(let index: number = 0; index < numberOfSlots; index ++) {
            let auxDate: Date = new Date(startDate);
            auxDate.setMinutes(startDate.getMinutes() + 15);
            let slot = {
                status: 'free',
                start: startDate,
                end: auxDate,
                schedule: dbSchedule._id
            };
            await new Slot(slot).save();
            startDate.setMinutes(startDate.getMinutes() + 15);
        }
    }

    constructor(args: any) {
        super(args);
        this.get('/', async(ctx: any) => {
            console.log('ctx::', ctx.state);
            if (ctx.state.patient) {
                // let dbPatient:any = await PatientModel.findById(ctx.state.patient);
                let targetSchedules: any = await ScheduleModel.find({'actor.practitioner': ctx.query.generalPractitioner});
                ctx.body = targetSchedules;
            }
            ctx.status = 200;
        });

        this.post('/', async(ctx: any) => {
            let start: any = new Date(ctx.request.body.planningHorizon.start);
            let end: any = new Date(ctx.request.body.planningHorizon.end);
            start.setHours(start.getHours());
            end.setHours(end.getHours());
            //split date schedule in slots!;
            ctx.request.body['actor'] = {
                'practitioner': ctx.state.practitioner
            };
            console.log('xxxx', ctx.request.body);
            //db.mydatabase.mycollection.find({$where : function() { return this.date.getMonth() == 11} })
            let dbSchedule = await Schedule.find({
                'actor.practitioner': ctx.state.practitioner,
            });
            if (!dbSchedule) {

            }
            else {
                let found: boolean = false;
                for(let index: number = 0; index < dbSchedule.length; index ++) {
                    if (dbSchedule[index].planningHorizon.start.getDay() == start.getDay()) {
                        found = true;
                    }
                }
                if (!found) {
                    let dbSchedule: any = await Schedule(ctx.request.body).save();
                    await this.splitAndSaveSlotsByScheduleDate(dbSchedule);
                }
            }
            ctx.body = {messenge: "cf"};
        });
    }
}