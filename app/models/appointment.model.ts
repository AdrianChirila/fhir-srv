import {Schema} from "mongoose";
const mongoose = require('mongoose');
import {MODELS} from "./models";
let participantSubSchema = new mongoose.Schema(null, { _id: false });
participantSubSchema.add({
    actor: {
        display: String,
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: MODELS.PATIENT
        },
        practitioner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: MODELS.PRACTITIONER
        }
    }
});
const appointmentSchema = new Schema({
    id: String,
    status: {
      required: true,
      type: String
    },
    date: {
        type: Date,
        required: true,
    },
    participant: {
        type: [participantSubSchema],
        required: true
    },
    start: {
        type: Date
    },
    end: {
        type: Date
    }
});
export const AppointmentModel = mongoose.model(MODELS.APPOINTMENT, appointmentSchema);