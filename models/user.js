const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passwordlocalmongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passwordlocalmongoose);

module.exports = mongoose.model('User', UserSchema);