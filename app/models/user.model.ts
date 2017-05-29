import {MODELS} from "./models";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let activitySubSchema = new mongoose.Schema(null, { _id: false });

activitySubSchema.add({
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

const userSchema = new Schema({
    id: String,
    pid: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    activity: {
        type: activitySubSchema,
        required: true
    }
});
export const UserModel = mongoose.model(MODELS.USER, userSchema);
// module.exports = mongoose.model('User', userSchema);
