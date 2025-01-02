import winston from "winston";
import path from "path";
import fs from "fs";
import "winston-daily-rotate-file";
import dotenv from 'dotenv'
dotenv.config()
// Ensure the logs directory exists
const logDirectory = path.resolve("logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Define custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    verbose: "cyan",
    debug: "blue",
    silly: "gray",
  },
};

winston.addColors(customLevels.colors);

// Create logger instance
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
      return `${timestamp} [${level.toUpperCase()}]: ${
        stack || message
      } ${metaString}`;
    })
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.DailyRotateFile({
      dirname: logDirectory,
      filename: "application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
    }),
    new winston.transports.DailyRotateFile({
      dirname: logDirectory,
      filename: "errors-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
    }),
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, stack, ...meta }) => {
          const metaString = Object.keys(meta).length
            ? JSON.stringify(meta)
            : "";
          return `[${level.toUpperCase()}]: ${stack || message} ${metaString}`;
        })
      ),
    })
  );
}

export default logger;
