import User from '../database/models/user'
import cryptoGen from '../authentication/cryptoGen'
import config from 'config'
import emailService from './emailService'
import httpStatus from 'http-status-codes'
import logger from '../logging/logger'
import utilities from '../utilities'

/**
 * This service performs security related tasks, like signup
 */
export default {
    signup: async function (userObj) {
        try {
            let user = new User({
                email: userObj.email,
                password: cryptoGen.createPasswordHash(userObj.password),
                name: userObj.name,
                emailConfirmationToken: await cryptoGen.generateRandomToken(),
                referral_token: await cryptoGen.generateFriendlyToken(4)
            })

            user = await user.save()

            if (!user)
                return utilities.generateCommonResponse(httpStatus.BAD_REQUEST, 'failed', httpStatus.getStatusText(httpStatus.BAD_REQUEST))

            // If we have gotten here, the request must be successful, so respond accordingly
            logger.info('A new user has signed up', {meta: user})
            emailService.emailEmailConfirmationInstructions(user.email, user.name, user.emailConfirmationToken)
            const responseObj = { email: user.email, name: user.name }
            return utilities.generateCommonResponse(httpStatus.OK, 'successful', responseObj)
        } catch (err) {
            logger.error("Error in signup Service", {meta: err})
            return utilities.generateCommonResponse(httpStatus.BAD_REQUEST, 'failed', err)
        }
    },

    resendEmailAddressConfirmationLink: async function (enail) {
        try {
            // This should only work if there is already an existing emailConfirmationToken. If there is none, it means user already verified
            let user = await User.findOne({ email }).exists('emailConfirmationToken').exex()
            let token = await cryptoGen.generateRandomToken()

            // If a user is found, and they are still unverified, ONLY THEN update the token and send the email
            if (!(user && token))
                return utilities.generateCommonResponse(httpStatus.BAD_REQUEST, 'failed', 'Email is already confirmed or does not exist in our records.')

            // Overwrite the user record with new token.
            user.emailConfirmationToken = token
            user = await user.save()

            // // If the user was not properly saved, stop here and return failure
            if (!user)
                return utilities.generateCommonResponse(httpStatus.INTERNAL_SERVER_ERROR, 'failed', httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR))

            // If we have gotten this far, return success
            emailService.emailEmailConfirmationInstructions(user.email, user.name, user.emailConfirmationToken)
            return utilities.generateCommonResponse(httpStatus.OK, 'successful', true)
        } catch (err) {
            logger.error('Error in resendEmailAddressConfirmationLink Service', {meta: err})
            return utilities.generateCommonResponse(httpStatus.BAD_REQUEST, 'failed', err)
        }
    },

    confirmEmailAddress: async function (token) {
        let result = {}
        try {
            let user = await User.findOne({emailConfirmationToken: token}).exec()

            // If an associated user with the given token is not found, then return failure
            if (!user)
                return utilities.generateCommonResponse(httpStatus.NOT_FOUND, 'failed', httpStatus.getStatusText(httpStatus.NOT_FOUND))

            // Go ahead and confirm the user email
            user.emailConfirmationToken = undefined
            user = await user.save()

            // If the user was not properly saved, stop here and return failure
            if (!user)
                return utilities.generateCommonResponse(httpStatus.INTERNAL_SERVER_ERROR, 'failed', httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR))

            // If we have gotten this far, return success
            return utilities.generateCommonResponse(httpStatus.OK, 'successful', true)
        } catch (err) {
            logger.error('Error in confirmEmailAddress Service', {meta: err})
            return utilities.generateCommonResponse(httpStatus.BAD_REQUEST, 'failed', err)
        }
    },

    forgotPassword: async function (email) {
        
    }
}