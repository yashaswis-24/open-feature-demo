const http = require('node:http');

const PORT = Number(process.env.PORT) || 9099;
const API_KEYS = process.env.API_KEYS_JSON
  ? JSON.parse(process.env.API_KEYS_JSON)
  : { 'dev-api-key': 'ns-dev', 'other-api-key': 'ns-other' };

const FLAGS_BY_NAMESPACE = {
  'ns-dev': {
    'new-dashboard': true,
    'enable-payment': false,
    'show-reports': true,
    'loan-application-flow-v2': true,
  },
  'ns-other': {
    'new-dashboard': false,
    'enable-payment': true,
    'show-reports': false,
    'loan-application-flow-v2': false,
  },
};

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
  });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (error) { reject(error); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method === 'GET' && pathname === '/health') {
    return send(res, 200, { status: 'ok', port: PORT });
  }

  if (req.method !== 'POST') {
    return send(res, 404, { error: 'Not found' });
  }

  const apiKey = req.headers['x-api-key'];
  const namespaceId = apiKey ? API_KEYS[apiKey] : undefined;
  if (!namespaceId) {
    console.log(`401 ${req.method} ${pathname} (${apiKey ? 'unknown' : 'missing'} X-API-Key)`);
    return send(res, 401, { error: 'Unauthorized' });
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: 'Invalid JSON body' });
  }

  const flags = FLAGS_BY_NAMESPACE[namespaceId] || {};
  if (pathname === '/v1/flags/evaluate-all') {
    console.log(`200 evaluate-all namespace=${namespaceId} subject=${body.subjectId || 'n/a'}`);
    return send(res, 200, { values: flags });
  }

  const match = pathname.match(/^\/v1\/flags\/([^/]+)\/evaluate$/);
  if (match) {
    const flagKey = decodeURIComponent(match[1]);
    const value = Object.prototype.hasOwnProperty.call(flags, flagKey)
      ? flags[flagKey]
      : body.defaultValue;
    console.log(`200 evaluate ${flagKey}=${String(value)} namespace=${namespaceId}`);
    return send(res, 200, { value });
  }

  return send(res, 404, { error: 'Unknown endpoint', path: pathname });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock feature-flag API running at http://localhost:${PORT}`);
  console.log('Default API key: dev-api-key (namespace ns-dev)');
});
