import {PractitionerModel as Practitioner, ScheduleModel as Schedule} from "../models"
async function ensureScheduleForPractitioner() {
    let practitioners: any [] = await Practitioner.find({});
    for (let index: number = 0; index < practitioners.length; index++) {
        let practitioner: any = practitioners[index];
        let dbSchedule: any = await Schedule.findOne({'actor.practitioner': practitioner._id});
        if (!dbSchedule) {
            dbSchedule = await new Schedule(
                {
                    'active': true,
                    actor: {
                        practitioner: practitioner._id
                    }
                }
            ).save();
            console.log('Schedule was saved!');
        }
    }
}

export async function ensureDataForBooking() {
    await ensureScheduleForPractitioner();
}