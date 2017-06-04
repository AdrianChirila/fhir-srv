import {MODELS} from "./models";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let actorSubSchema = new mongoose.Schema(null, {_id: false});
actorSubSchema.add({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.PATIENT
    },
    practitioner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODELS.PRACTITIONER
    }
});

const scheduleSChema = new Schema({
    id: String,
    active: {
        type: Boolean,
        required: true
    },
    actor: actorSubSchema,
});
export const ScheduleModel = mongoose.model(MODELS.SCHEDULE, scheduleSChema);
// module.exports = mongoose.model('User', userSchema);
