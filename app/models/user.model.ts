const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
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
export const UserModel = mongoose.model('User', userSchema);
// module.exports = mongoose.model('User', userSchema);
