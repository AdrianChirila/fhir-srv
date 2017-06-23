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
    password: {
        type: String,
        required: true
    },
    address: [{
        type: {
            type: String,
        },
        text: {
            type: String,
        },
        city: {
            type: String,
        },
        district: {
            type: String,
        },
        state: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        county: {
            type: String,
        }
    }],
    telecom: [{
        system: {
            type: String,
        },
        value: {
            type: String
        }
    }],
    // telecom: [contactPointSubShema],
    // address: [addressSubSchema]
});
export const PractitionerModel = mongoose.model(MODELS.PRACTITIONER, practitionerSchema);
// module.exports = mongoose.model('User', userSchema);
