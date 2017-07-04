import {MODELS} from "./models";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export var contactPointSubShema: any = new mongoose.Schema(null, { _id: false });
export var addressSubSchema: any = new mongoose.Schema(null, { _id: false });
contactPointSubShema.add({
    system: {
        type: String,
    },
    value: {
        type: String
    }
});
addressSubSchema.add({
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
    county: {
        type: String,
    }
});
const patientSchema = new Schema({
    id: {
        type: String,
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
    // address: [addressSubSchema],
    cnp: {
        type: String
    }
});





patientSchema.pre('save', function(next: any) {
    // do stuff
    next();
});







export const PatientModel = mongoose.model('Patient', patientSchema);



