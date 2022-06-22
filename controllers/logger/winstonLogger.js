const { Writable } = require('stream')
const winston = require('winston');
require('winston-daily-rotate-file');
const stream = new Writable({
    objectMode: false,
    write: raw => console.log('stream msg>>>', raw.toString()) // phat trực tiếp log tại đây
})

const path = require('path')

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: 'Logger' }),
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        winston.format.printf((info) => {
            return ` ${info.timestamp}:${info.label}:${info.message}`
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
            level: 'info',
            format:  winston.format.printf((info) => {
                return ` ${info.timestamp}:${info.label}:${info.success}:${info.message}`
            }),
            filename: 'inforLogger/info.log',
            maxsize: 1
          }),
        new winston.transports.Stream({ stream }) //stream tai đây
    ]
})

module.exports = logger;