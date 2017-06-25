import {MODELS} from "./models";
import {contactPointSubShema, addressSubSchema} from "./patient.model";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const practitionerSchema = new Schema({
    id: String,
    pid: {
        type: String,
        required: true,
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
    password: {
        type: String,
        required: true
    },
    telecom: [contactPointSubShema],
    address: [addressSubSchema],
});
export const PractitionerModel = mongoose.model(MODELS.PRACTITIONER, practitionerSchema);
// module.exports = mongoose.model('User', userSchema);
