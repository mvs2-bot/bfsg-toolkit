// Startet den fehlerhaften Demo-Shop lokal und führt Scan + Bericht aus.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

// Asynchron starten, sonst blockiert der Aufruf den lokalen Server.
const run = async (...args) => {
  const { stdout } = await promisify(execFile)('node', args);
  process.stdout.write(stdout);
};

const wurzel = path.resolve('test/demo-shop');
const server = http.createServer((req, res) => {
  const datei = path.join(wurzel, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!datei.startsWith(wurzel) || !fs.existsSync(datei)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(datei));
}).listen(8765);

const konfig = {
  kunde: 'Demo-Shop',
  seiten: [
    { name: 'Startseite', url: 'http://localhost:8765/index.html' },
    { name: 'Produktseite', url: 'http://localhost:8765/produkt.html' },
    { name: 'Checkout', url: 'http://localhost:8765/checkout.html' },
  ],
};
fs.writeFileSync('test/demo-konfig.json', JSON.stringify(konfig, null, 2));
try {
  await run('src/scan.mjs', 'test/demo-konfig.json');
  await run('src/report.mjs', path.join('ergebnisse', `demo-shop-${new Date().toISOString().slice(0, 10)}`));
} finally {
  server.close();
}
