import {MODELS} from "./models";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const patientSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        family: {
            type: String,
            required: true
        },
        given: {
            type: String,
            required: true
        }
    },
    generalPractitioner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.PRACTITIONER
    }
});
export const PatientModel = mongoose.model('Patient', patientSchema);