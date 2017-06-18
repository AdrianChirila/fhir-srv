import {
    PractitionerModel as Practitioner,
    AppointmentModel as Appointment,
    PatientModel as Patient,
    MODELS
} from "../models"
import {ROLES} from "../models/models";
import {APPOINTMENT_STATUS} from "../utils/consts";


const mongoose = require('mongoose');
export async function importResource(entry: any) {
    let resourceType: string = entry.type;
    let resources: any[] = entry.resources;
    for (let index: number = 0; index < resources.length; index++) {
        let currentResource: any = resources[index];
        let Model: any = mongoose.model(entry.type);
        let dbResource: any = await Model.findOne({id: currentResource.id});
        if (!dbResource) {
            if (resourceType == MODELS.PATIENT) {
                let relevantPractitioner: any = await Practitioner.findOne({id: currentResource.generalPractitioner});
                currentResource.generalPractitioner = relevantPractitioner._id;
                await new Model(currentResource).save();
                continue;
            }
            if (resourceType == MODELS.USER) {
                console.log('Users was not found!');
                if (currentResource.role == ROLES.PRACTITIONER) {
                    console.log('User->Practitioner');
                    let relevantIndividual: any = await Practitioner.findOne({id: currentResource.individual});
                    currentResource['activity'] = {
                        actor: {
                            display: 'General Practitioner',
                            practitioner: relevantIndividual._id
                        }
                    };
                    await new Model(currentResource).save();
                    continue;
                }
                if (currentResource.role == ROLES.PATIENT) {
                    console.log('User->Patient');
                    let relevantIndividual: any = await Patient.findOne({id: currentResource.individual});
                    currentResource['activity'] = {
                        actor: {
                            patient: relevantIndividual._id
                        }
                    };
                    await new Model(currentResource).save();
                    continue;
                }
                continue;
            }
            await new Model(currentResource).save();
        }
    }
}


export async function createAppointments() {
    function prepareDate(startHour: number, endHour: number) {
        let start: Date = new Date()
        let end: Date = new Date();
        start.setHours(startHour);
        end.setHours(endHour);
        return {
            start: start,
            end: end
        }
    }

    let defaultPractitioner: any = await Practitioner.findOne({id: 1});
    let secondPractitioner: any = await Practitioner.findOne({id: 2});
    let firstPatient: any = await Patient.findOne({id: 1});
    let secondPatient: any = await Patient.findOne({id: 2});
    let thirdPatient: any = await Patient.findOne({id: 3});
    let dbAppointments: any = await Appointment.find({});
    let date1: any = prepareDate(9,10);
    let date2: any = prepareDate(12,13);
    let date3: any = prepareDate(15,16);
    if (dbAppointments.length == 0) {
        await Promise.all([
            new Appointment(
                {
                date: new Date(Date.now()),
                status: APPOINTMENT_STATUS.BOOKED,
                start: date1.start,
                end: date1.end,
                participant: [
                    {
                        actor: {
                            display: `${firstPatient.name.family} ${firstPatient.name.given}`,
                            patient: firstPatient._id
                        }
                    },
                    {
                        actor: {
                            display: 'Default practitioner',
                            practitioner: defaultPractitioner._id
                        }
                    }
                ]
            }).save(),
            new Appointment(
                {
                date: new Date(Date.now()),
                status: APPOINTMENT_STATUS.BOOKED,
                start: date2.start,
                end: date2.end,
                participant: [
                    {
                        actor: {
                            display: `${secondPatient.name.family} ${secondPatient.name.given}`,
                            patient: secondPatient._id
                        }
                    },
                    {
                        actor: {
                            display: 'Default practitioner',
                            practitioner: defaultPractitioner._id
                        }
                    }
                ]
            }).save(),
            new Appointment(
                {
                date: new Date(Date.now()),
                status: APPOINTMENT_STATUS.BOOKED,
                start: date3.start,
                end: date3.end,
                participant: [
                    {
                        actor: {
                            display: `${secondPatient.name.family} ${secondPatient.name.given}`,
                            patient: secondPatient._id
                        }
                    },
                    {
                        actor: {
                            display: 'Default practitioner',
                            practitioner: secondPractitioner._id
                        }
                    }
                ]
            }).save()
        ])
    }
}