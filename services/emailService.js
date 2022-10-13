import nodemailer from 'nodemailer'
import config from 'config'
import logger from '../logging/logger'

// Set up the connection object
let emailConfig = {
    credentials: {
        host: process.env.APPS_NODEMAILER_HOST,
        port: process.env.APPS_NODEMAILER_PORT,
        secure: process.env.APPS_NODEMAILER_SECURE,
        auth: {
            user: process.env.APPS_NODEMAILER_USER,
            pass: process.env.APPS_NODEMAILER_PASSWORD,
        },
        tls: {
            rejectUnauthorized: process.env.APPS_NODEMAILER_REJECT_UNAUTHORIZED
        }
    }
}

const transporter = nodemailer.createTransport(emailConfig.credentials)

// verify connection configuration
transporter.verify(error => {
    if (error) logger.error("Error while connecting to email service", {meta: error})
    else logger.info('Email Service is up and ready to go')
})

export default {
    emailEmailConfirmationInstructions: function (email, name, token) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Milstore Support" <support@milstore.id>', // sender address
            to: 'support@milstore.id, ' + email, // list of receivers
            subject: 'Milstore - Confirm Your Email', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Please click the link below to confirm your email address<br><br><button><a href="' + config.get('frontend_urls.email_confirmation_base_url') + '/' + token + '">Confirm Your Email Address</a></button>'
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return logger.error('Error while sending email', {meta: error})

            logger.info('Email sent', {meta: info})
        })
    },

    emailPasswordResetInstructions: function (email, name, token) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Milstore Support" <support@milstore.id>', // sender address
            to: 'support@milstore.id, ' + email, // list of receivers
            subject: 'Milstore - Password Reset', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Please click the link below to reset your password<br><br><button><a href="' + config.get('frontend_urls.password_reset_base_url') + '/' + token + '">Reset Password</a></button>'
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return logger.error('Error while sending email', {meta: error})

            logger.info('Email sent', {meta: info})
        })
    },

    emailPasswordResetConfirmation: function (email, name, token) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Milstore Support" <support@milstore.id>', // sender address
            to: 'support@milstore.id, ' + email, // list of receivers
            subject: 'Milstore - Password Reset Successful', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Your password has been successfully reset.<br><br>'
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return logger.error('Error while sending email', {meta: error})

            logger.info('Email sent', {meta: info})
        })
    }
}