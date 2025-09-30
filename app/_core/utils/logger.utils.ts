import * as dotenv from 'dotenv'
import { createLogger, format, transports } from 'winston'

dotenv.config()

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const loggerUtils = createLogger({
  level: 'debug',
  format: format.combine(format.label({ label: ':)!' }), format.timestamp(), myFormat),
  transports: [
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
      ? new transports.Console()
      : new transports.File({ filename: 'app_log.log' })
  ]
})

export default loggerUtils
