import {MODELS} from "./models";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let actorSubSchema = new mongoose.Schema(null, {_id: false});
let periodSubSchema = new mongoose.Schema(null, {_id: false});
actorSubSchema.add({
    display: String,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.PATIENT
    },
    practitioner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.PRACTITIONER
    }
});

periodSubSchema.add({
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    }
});
const scheduleSChema = new Schema({
    id: String,
    active: {
        type: Boolean,
    },
    comment: {
        type: String
    },
    planningHorizon: periodSubSchema,
    actor: actorSubSchema,
});
export const ScheduleModel = mongoose.model(MODELS.SCHEDULE, scheduleSChema);
// module.exports = mongoose.model('User', userSchema);
