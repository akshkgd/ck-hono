import type { Context } from 'hono';
import fs from 'fs';
import path from 'path';

export class AdminLogsController {
  private logDir = path.join(process.cwd(), 'logs');

  private ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  // GET /v1/admin/logs/files
  public listFiles = async (c: Context) => {
    try {
      this.ensureLogDir();
      const files = fs.readdirSync(this.logDir)
        .filter(file => file.startsWith('app-') && file.endsWith('.log'))
        .sort((a, b) => b.localeCompare(a)); // Newest first

      return c.json({
        status: 'success',
        data: files,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to list log files',
      }, 400);
    }
  };

  // GET /v1/admin/logs/data
  public getLogData = async (c: Context) => {
    try {
      this.ensureLogDir();
      const file = c.req.query('file');
      if (!file) {
        throw new Error('Log file parameter is required');
      }

      // Prevent directory traversal attacks
      const safeFile = path.basename(file);
      const filePath = path.join(this.logDir, safeFile);

      if (!fs.existsSync(filePath)) {
        throw new Error('Log file not found');
      }

      const q = (c.req.query('q') || '').trim().toLowerCase();
      const level = (c.req.query('level') || 'all').trim().toLowerCase();
      const limit = parseInt(c.req.query('limit') || '100', 10);
      const page = parseInt(c.req.query('page') || '1', 10);

      const fileStats = fs.statSync(filePath);
      const fileSizeKb = fileStats.size / 1024;

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');

      const parsedLogs: any[] = [];
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const logEntry = JSON.parse(trimmed);
          parsedLogs.push(logEntry);
        } catch {
          // If a log line is malformed, include it as a raw debug log
          parsedLogs.push({
            timestamp: new Date(fileStats.mtime).toISOString(),
            level: 'debug',
            message: trimmed,
            meta: {}
          });
        }
      }

      // Reverse logs to show newest first
      parsedLogs.reverse();

      // Apply Filters
      let filteredLogs = parsedLogs;

      if (level !== 'all') {
        filteredLogs = filteredLogs.filter(log => String(log.level).toLowerCase() === level);
      }

      if (q) {
        filteredLogs = filteredLogs.filter(log => {
          const msgMatch = String(log.message).toLowerCase().includes(q);
          const levelMatch = String(log.level).toLowerCase().includes(q);
          const metaMatch = log.meta ? JSON.stringify(log.meta).toLowerCase().includes(q) : false;
          return msgMatch || levelMatch || metaMatch;
        });
      }

      // Pagination
      const totalCount = filteredLogs.length;
      const totalPages = Math.ceil(totalCount / limit);
      const offset = (page - 1) * limit;
      const paginatedLogs = filteredLogs.slice(offset, offset + limit);

      return c.json({
        status: 'success',
        data: {
          logs: paginatedLogs,
          fileSizeKb,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages,
          }
        }
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch log data',
      }, 400);
    }
  };

  // DELETE /v1/admin/logs/:file
  public deleteFile = async (c: Context) => {
    try {
      this.ensureLogDir();
      const file = c.req.param('file');
      if (!file) {
        throw new Error('Log file parameter is required');
      }
      const safeFile = path.basename(file);
      const filePath = path.join(this.logDir, safeFile);

      if (!fs.existsSync(filePath)) {
        throw new Error('Log file not found');
      }

      fs.unlinkSync(filePath);

      return c.json({
        status: 'success',
        message: 'Log file deleted successfully',
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to delete log file',
      }, 400);
    }
  };

  // DELETE /v1/admin/logs/:file/clear
  public clearFile = async (c: Context) => {
    try {
      this.ensureLogDir();
      const file = c.req.param('file');
      if (!file) {
        throw new Error('Log file parameter is required');
      }
      const safeFile = path.basename(file);
      const filePath = path.join(this.logDir, safeFile);

      if (!fs.existsSync(filePath)) {
        throw new Error('Log file not found');
      }

      // Truncate file
      fs.writeFileSync(filePath, '');

      return c.json({
        status: 'success',
        message: 'Log file cleared successfully',
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to clear log file',
      }, 400);
    }
  };

  // GET /v1/admin/logs/:file/download
  public downloadFile = async (c: Context) => {
    try {
      this.ensureLogDir();
      const file = c.req.param('file');
      if (!file) {
        return c.text('Log file parameter is required', 400);
      }
      const safeFile = path.basename(file);
      const filePath = path.join(this.logDir, safeFile);

      if (!fs.existsSync(filePath)) {
        return c.text('Log file not found', 404);
      }

      const fileStream = fs.readFileSync(filePath);
      
      c.header('Content-Type', 'text/plain');
      c.header('Content-Disposition', `attachment; filename="${safeFile}"`);

      return c.body(fileStream);
    } catch (err: any) {
      return c.text(err.message || 'Failed to download log file', 400);
    }
  };
}
