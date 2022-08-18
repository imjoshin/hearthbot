// TODO make this common for all packages

import path from "path"
import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"

export const createLogger = (service: string) => {
  const logDir = path.join(__dirname, `..`, `..`, `logs`)
  const logger = winston.createLogger({
    level: `info`,
    format: winston.format.combine(
      winston.format.timestamp(), 
      winston.format.json()
    ),
    defaultMeta: { service },
    transports: [
      new winston.transports.File({ filename: path.join(logDir, `${service}.error.log`), level: `error` }),
      new winston.transports.File({ filename: path.join(logDir, `${service}.log`) }),
    ],
  })

  if (process.env.NODE_ENV === `production`) {
    logger.configure({
      level: `verbose`,
      transports: [
        new DailyRotateFile()
      ]
    })
  } else {
    logger.add(new winston.transports.Console({
      format: winston.format.printf(({ level, message, service, timestamp }) => {
        return `${timestamp} {${service}} [${level}]: ${message}`
      }),
    }))
  }

  return logger
}