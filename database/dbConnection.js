import mongoose from 'mongoose';
import config from 'config';
import logger from '../logging/logger'

let dbConnection

const getDBConnection = async () => {
    try {
        const connectionOptions = {
            user: process.env.APPS_MONGODB_USER,
            pass: process.env.APPS_MONGODB_PASSWORD,
            dbName: process.env.APPS_MONGODB_DB,
            useNewUrlParser: config.get('mongodb_settings.use_new_url_parser'),
        }

        // Establish a mongoose connection to mongodb
        dbConnection = await mongoose.connect(process.env.APPS_MONGODB_URL, connectionOptions, (error) => {
            if (error) {
                logger.error('Could not establish connection to database', {meta: error})
                return
            }

            logger.info('MongoDB connection was successful')
        })
    } catch (err) {
        logger.error('Error connecting to the database', {meta: err})
    }

    return dbConnection
}

// Initializing the models and registering them to their models
require("./models/user")


// Exporting the connection
exports.dbConnection = () => getDBConnection();