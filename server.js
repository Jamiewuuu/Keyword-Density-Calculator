#!/usr/bin/env node

/**
 * Simple HTTP Server for What an AI Website and Tools
 * -----------------------------------------------
 * Starts a local server to run the What an AI website and Keyword Density Calculator.
 * Usage: node server.js [port]
 * Port defaults to 8080 if not specified.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.argv[2] ? parseInt(process.argv[2]) : 8080;
const DIRECTORY = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'text/plain';
}

function logRequest(req, res, filePath) {
  const timestamp = new Date().toISOString();
  const status = res.statusCode;
  console.log(`[${timestamp}] ${req.method} ${req.url} - ${status}`);
}

const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // Default to index.html for root path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Remove any directory traversal attempts
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(DIRECTORY, safePath);

  // Security check - ensure file is in the directory
  if (!filePath.startsWith(DIRECTORY)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      logRequest(req, res, filePath);
      return;
    }

    const contentType = getContentType(filePath);
    res.writeHead(200, { 'Content-Type': contentType });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    fileStream.on('close', () => {
      logRequest(req, res, filePath);
    });
    fileStream.on('error', () => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    });
  });
});

server.listen(PORT, 'localhost', () => {
  console.log('='.repeat(60));
  console.log('What an AI - Local Server (Node.js)');
  console.log('='.repeat(60));
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('\nAccess your tools at:');
  console.log(`  Main Website: http://localhost:${PORT}/`);
  console.log(`  Keyword Density Calculator: http://localhost:${PORT}/keyword-density.html`);
  console.log('\nPress Ctrl+C to stop the server');
  console.log('='.repeat(60));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
    console.error(`   Try a different port: node server.js ${PORT + 1}`);
  } else {
    console.error('\n❌ Server error:', err);
  }
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  server.close(() => {
    process.exit(0);
  });
});

// Open browser automatically
const open = () => {
  const { exec } = require('child_process');
  const platform = process.platform;
  let command;

  if (platform === 'darwin') {
    command = `open http://localhost:${PORT}/`;
  } else if (platform === 'win32') {
    command = `start http://localhost:${PORT}/`;
  } else {
    command = `xdg-open http://localhost:${PORT}/`;
  }

  exec(command, (err) => {
    if (err) {
      console.log('Could not open browser automatically.');
      console.log('Please open your browser and navigate to http://localhost:8080/');
    }
  });
};

// Try to open browser
setTimeout(open, 1000);
