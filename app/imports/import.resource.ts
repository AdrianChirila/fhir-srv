import {
    UserModel as Practitioner,
    AppointmentModel as Appointment,
    PatientModel as Patient,
    MODELS
} from "../models"
import {APPOINTMENT_STATUS} from "../models/appointment.model";


const mongoose = require('mongoose');
export async function importResource(entry: any) {
    let resources: any[] = entry.resources;
    for (let index: number = 0; index < resources.length; index++) {
        let currentResource: any = resources[index];
        let Model: any = mongoose.model(entry.type);
        let dbResource: any = await Model.findOne({id: currentResource.id});
        if (!dbResource) {
            await new Model(currentResource).save();
        }
    }
}

export async function createAppointments() {
    let defaultPractitioner: any = await Practitioner.findOne({id: 1});
    let secondPractitioner: any = await Practitioner.findOne({id: 2});
    let firstPatient: any = await Patient.findOne({id: 1});
    let secondPatient: any = await Patient.findOne({id: 2});
    let thirdPatient: any = await Patient.findOne({id: 3});
    let dbAppointments: any = await Appointment.find({});
    if (dbAppointments.length == 0) {
        await Promise.all([
            new Appointment({
                date: new Date(Date.now()),
                status: APPOINTMENT_STATUS.BOOKED,
                participant: [
                    {
                        actor: {
                            display: `${firstPatient.name.family} ${firstPatient.name.given}`,
                            patient: firstPatient._id
                        }
                    },
                    {
                        actor: {
                            display :'Default practitioner',
                            practitioner: defaultPractitioner._id
                        }
                    }
                ]
            }).save(),
            new Appointment({
                date: new Date(Date.now()),
                status: APPOINTMENT_STATUS.BOOKED,
                participant: [
                    {
                        actor: {
                            display: `${secondPatient.name.family} ${secondPatient.name.given}`,
                            patient: secondPatient._id
                        }
                    },
                    {
                        actor: {
                            display :'Default practitioner',
                            practitioner: defaultPractitioner._id
                        }
                    }
                ]
            }).save(),
            new Appointment({
                date: new Date(Date.now()),
                status: APPOINTMENT_STATUS.PENDING,
                participant: [
                    {
                        actor: {
                            display: `${thirdPatient.name.family} ${thirdPatient.name.given}`,
                            patient: thirdPatient._id
                        }
                    },
                    {
                        actor: {
                            display :'Default practitioner',
                            practitioner: defaultPractitioner._id
                        }
                    }
                ]
            }).save(),
            new Appointment({
                date: new Date(Date.now()),
                status: APPOINTMENT_STATUS.BOOKED,
                participant: [
                    {
                        actor: {
                            display: `${secondPatient.name.family} ${secondPatient.name.given}`,
                            patient: secondPatient._id
                        }
                    },
                    {
                        actor: {
                            display :'Default practitioner',
                            practitioner: secondPractitioner._id
                        }
                    }
                ]
            }).save()
        ])
    }
}