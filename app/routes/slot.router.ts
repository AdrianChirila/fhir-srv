import KoaRouter = require('koa-router')
import {ScheduleModel as Schedule} from "../models/schedule.model";
import {SlotModel as Slot} from "../models";

export class SlotRouter extends KoaRouter {
    constructor(args: any) {
        super(args);
        this.get('/', async(ctx: any) => {
            console.log('SLot:::', ctx.state);
            let practitionerSchedule: any = await Schedule.findOne({'actor.practitioner': ctx.query.generalPractitioner});
            let scheduleFreeSlots: any = await Slot.find({'schedule': practitionerSchedule._id});
            console.log('Practitioner schedule::', practitionerSchedule);
            ctx.status = 200;
            ctx.body = scheduleFreeSlots;
        });
        this.post('/', async(ctx: any) => {
            console.log('xxxxxxxxxxx');
            //for the moment only one slot per schedule of practitioners
            if (ctx.state.practitioner) {
                console.log('xxx', ctx.request.body.start);
                let practitionerSchedule: any = await Schedule.findOne({'actor.practitioner': ctx.state.practitioner});
                //  {"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})
                //db.posts.find({ '$where': 'this.created_on.toJSON().slice(0, 10) == "2012-07-14"' })
                //db.mydatabase.mycollection.find({$where : function() { return this.date.getMonth() == 11} })
                //$where : function() { return this.start.getDay() == 1},
                let targetDay = new Date(ctx.request.body.start).getDay();
                let dbSlots: any = await Slot.find({'schedule': practitionerSchedule});
                let foundSlot: boolean = false;
                for (let index: number = 0; index < dbSlots.length; index++) {
                    let dbSlot: any = dbSlots[index];
                    if (dbSlot.start.getDay() == targetDay) {
                        foundSlot = true;
                        ctx.body = await Slot.findOneAndUpdate({'schedule': practitionerSchedule}, ctx.request.body, {new: true});
                        break;
                    }
                }
                if (!foundSlot) {
                    let slot: any = Object.assign({}, ctx.request.body);
                    slot['schedule'] = practitionerSchedule._id;
                    ctx.body = await new Slot(slot).save();
                }
                ctx.status = 200;
            }
        });
    }
}