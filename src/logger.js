import winston from "winston";
import path from "path";
import fs from "fs";
import "winston-daily-rotate-file";
import dotenv from "dotenv";

dotenv.config();

// Setup log directory
const logDirectory = path.resolve(process.env.LOG_PATH || "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Define custom levels
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

const isProduction = process.env.NODE_ENV === "production";
const serviceName = process.env.SERVICE_NAME || "echo-service";
const logLevel = process.env.LOG_LEVEL || (isProduction ? "info" : "debug");

// Format for file logging
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Format for console
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaString = Object.keys(meta).length
      ? JSON.stringify(meta, null, 2)
      : "";
    return `${timestamp ? `[${timestamp}]` : ""} ${level}: ${stack || message} ${
      metaString || ""
    }`;
  })
);

// Create logger
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: logLevel,
  defaultMeta: {
    service: serviceName,
    pid: process.pid,
    env: process.env.NODE_ENV || "development",
  },
  transports: [
    new winston.transports.DailyRotateFile({
      dirname: logDirectory,
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
      format: fileFormat,
    }),
    new winston.transports.DailyRotateFile({
      dirname: logDirectory,
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
      format: fileFormat,
    }),
  ],
});

// Add console output if not in production
if (!isProduction) {
  logger.add(
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.timestamp({ format: "HH:mm:ss" }),
        consoleFormat
      ),
    })
  );
}

export default logger;
