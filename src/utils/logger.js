import winston from 'winston';
import env from '../config/config.js';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
}

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'debug'
        }),
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'info'
        }),
        new winston.transports.File({ filename: './errors.log', level: 'error'})
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = env.NODE_ENV === 'development' ? devLogger : prodLogger
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)
    next();
}