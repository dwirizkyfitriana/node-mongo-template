import crypto from 'crypto'
import bCrypt from 'bcrypt'

export default {
    generateRandomToken: function () {
        return new Promise((resolve, reject) => {
            // generate reset token
            crypto.randomBytes(20, (err, buf) => {
                if (err) return reject(err)

                const token = buf.toString('hex')
                resolve(token)
            })
        })
    },

    generateFriendlyToken: function (length = 4) {
        return new Promise((resolve, reject) => {
            // generate reset token
            crypto.randomBytes(length, (err, buf) => {
                if (err) return reject(err)

                const token = buf.toString('hex')
                resolve(token)
            })
        })
    },

    createPasswordHash: function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
    }
}