import mongoose from 'mongoose'
import validator from 'validator'
import config from 'config'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    referral_token: {
        type: String,
        required: true,
        unique: true
    },
    emailConfirmationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date
})

module.exports = mongoose.model(config.get('mongodb_collections.users'), userSchema)
