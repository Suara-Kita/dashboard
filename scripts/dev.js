const { createServer } = require('net');
const { spawn } = require('child_process');
const { resolve } = require('path');

const START_PORT = 3000;

function findFreePort(port) {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.on('error', () => {
      resolvePort(findFreePort(port + 1));
    });
    server.listen(port, () => {
      server.close(() => resolvePort(port));
    });
  });
}

async function main() {
  const port = await findFreePort(START_PORT);
  const cwd = resolve(__dirname, '..');

  console.log(`> Starting Next.js on port ${port}...`);

  const child = spawn('npx', ['next', 'dev', '-p', String(port)], {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) },
  });

  child.on('close', (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
