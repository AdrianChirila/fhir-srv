import {MODELS} from "./models";
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
    }
});
export const PractitionerModel = mongoose.model(MODELS.PRACTITIONER, practitionerSchema);
// module.exports = mongoose.model('User', userSchema);
