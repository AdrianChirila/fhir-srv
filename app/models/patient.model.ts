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
    }
    // birthDate: {
    //     type: Date,
    //     required: true
    // },
    // address: {
    //     type: String,
    //     required: true
    // }
});
export const PatientModel = mongoose.model('Patient', patientSchema);
// module.exports = mongoose.model('User', userSchema);
