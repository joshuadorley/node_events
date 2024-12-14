// Complete Events Exercise
const { EventEmitter } = require('events');
const http = require('http');
const fs = require('fs');
const path = require('path');

const NewsLetter = new EventEmitter();

const server = http.createServer((req, res) => {
  const chunks = [];

  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    if (req.method === 'POST' && req.url === '/newsletter_signup') {
      try {
        const body = Buffer.concat(chunks).toString();
        const { name, email } = JSON.parse(body);

        NewsLetter.emit('signup', `${name},${email}\n`);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Signup successful');
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid request data');
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  req.on('error', (err) => {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
});

NewsLetter.on('signup', (contact) => {
  const filePath = path.join(__dirname, 'newsletter.csv');

  fs.appendFile(filePath, contact, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Contact added:', contact);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});