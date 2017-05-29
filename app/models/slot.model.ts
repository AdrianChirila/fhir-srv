import {MODELS} from "./models";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slotSchema = new Schema({
    id: String,
    status: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
});
export const SlotModel = mongoose.model(MODELS.SLOT, slotSchema);
// module.exports = mongoose.model('User', userSchema);
