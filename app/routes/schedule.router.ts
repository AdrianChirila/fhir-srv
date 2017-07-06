import KoaRouter = require('koa-router')
import {ScheduleModel as Schedule, SlotModel as Slot} from "../models";
import {PractitionerModel} from "../models/practitioner.model";
import {ScheduleModel} from "../models/schedule.model";
import {SlotModel} from "../models/slot.model";
const mongoose = require('mongoose');
const PatientModel: any = mongoose.model('Patient');


export class ScheduleRouter extends KoaRouter {
    async deleteSlots(dbSchedule: any) {
        console.log("DB Schedule::", dbSchedule);
        let targetSlots: any[] = await SlotModel.find({schedule: dbSchedule._id});
        console.log('target slots length', targetSlots.length);
        for(let index = 0; index < targetSlots.length; index ++) {
            let currentSlot: any = targetSlots[index];
            let removedSlot: any = await SlotModel.findByIdAndRemove(currentSlot._id);
            console.log('Removed slot:::', removedSlot._id);
        }
        await this. splitAndSaveSlotsByScheduleDate(dbSchedule);
    }
    async splitAndSaveSlotsByScheduleDate(dbSchedule: any) {
        let startHour = dbSchedule.planningHorizon.start.getHours();
        let startMinute = dbSchedule.planningHorizon.start.getMinutes();
        let endHour = dbSchedule.planningHorizon.end.getHours();
        let endMinutes = dbSchedule.planningHorizon.end.getMinutes();
        console.log('1111', startHour, startMinute);
        console.log('2222', endHour, endMinutes);
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
        console.log('xxx', totalMinutes);
        console.log('xxx', numberOfSlots);
        let startDate: Date = dbSchedule.planningHorizon.start;
        for(let index: number = 0; index < numberOfSlots; index ++) {
            console.log('Add slot!');
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
            } else {
                let dbSchedule = await Schedule.find({
                    'actor.practitioner': ctx.state.practitioner,
                });
                ctx.body = dbSchedule;
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
            console.log('Schedules:::', dbSchedule);
            if (!dbSchedule) {

            }
            else {
                let found: boolean = false;
                let targetSchedule: any;
                for(let index: number = 0; index < dbSchedule.length; index ++) {
                    if (dbSchedule[index].planningHorizon.start.getDay() == start.getDay()) {
                        targetSchedule = dbSchedule[index];
                        console.log('XXXXXXXXXXXXXXXX TARGET SCHEDULE', targetSchedule);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    console.log('Split in splots!');
                    let dbSchedule: any = await Schedule(ctx.request.body).save();
                    await this.splitAndSaveSlotsByScheduleDate(dbSchedule);
                } else {
                    let dbSchedule: any = await ScheduleModel.findByIdAndUpdate(targetSchedule._id,ctx.request.body, {new: true});
                    await this.deleteSlots(dbSchedule);
                }
            }
            ctx.body = {messenge: "cf"};
        });
    }
}