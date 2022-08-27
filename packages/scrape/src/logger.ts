// TODO make this common for all packages

import path from "path"
import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"

export const createLogger = (service: string) => {
  const logDir = process.env.LOG_DIR || path.join(__dirname, `..`, `..`, `logs`)
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
    // TODO fix the prod logger
    logger.configure({
      level: `info`,
      transports: [
        new DailyRotateFile({
          filename: path.join(logDir, `${service}-%DATE%.log`),
          datePattern: `YYYY-MM-DD-HH`,
          zippedArchive: false,
          maxSize: `2m`,
          maxFiles: 5,
        })
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