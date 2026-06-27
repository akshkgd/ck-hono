import fs from 'fs';
import path from 'path';

class CustomLogger {
  private logDir: string;
  private currentLogFile: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    this.currentLogFile = this.getLogFilePath();
    this.cleanupOldLogs();
  }

  private getLogFilePath(): string {
    const today = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `app-${today}.log`);
  }

  private cleanupOldLogs() {
    try {
      if (!fs.existsSync(this.logDir)) return;
      const files = fs.readdirSync(this.logDir);
      const now = new Date();
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      // Set to midnight to compare only dates
      fourteenDaysAgo.setHours(0, 0, 0, 0);

      for (const file of files) {
        // Match files like app-YYYY-MM-DD.log
        const match = file.match(/^app-(\d{4}-\d{2}-\d{2})\.log$/);
        if (!match) continue;

        const fileDateStr = match[1];
        const fileDate = new Date(fileDateStr);
        fileDate.setHours(0, 0, 0, 0);

        if (fileDate < fourteenDaysAgo) {
          const filePath = path.join(this.logDir, file);
          fs.unlinkSync(filePath);
        }
      }
    } catch (err) {
      console.error('Failed to cleanup old logs:', err);
    }
  }

  private write(level: string, message: string, meta: any = {}) {
    try {
      const logFile = this.getLogFilePath();
      if (logFile !== this.currentLogFile) {
        this.currentLogFile = logFile;
        this.cleanupOldLogs();
      }

      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        meta,
      };

      const logString = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(this.currentLogFile, logString);

      // Stream to stdout/stderr in development/production console
      if (level === 'error' || level === 'critical') {
        console.error(logString.trim());
      } else {
        console.log(logString.trim());
      }
    } catch (err) {
      console.error('Logging write failed:', err);
    }
  }

  public info(message: string, meta?: any) {
    this.write('info', message, meta);
  }

  public warn(message: string, meta?: any) {
    this.write('warning', message, meta);
  }

  public error(message: string, meta?: any) {
    this.write('error', message, meta);
  }

  public debug(message: string, meta?: any) {
    this.write('debug', message, meta);
  }
}

export const logger = new CustomLogger();
