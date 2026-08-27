const API_BASE = 'http://localhost:8008/api/v1';
const WS_BASE = 'ws://localhost:8008/api/v1';

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...(options.headers || {}) },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'API request failed');
    }
    return await res.json();
  } catch (error) {
    console.warn(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export function createEmergencyWebSocket(onMessage, onError) {
  let ws = null;
  let retryTimer = null;

  function connect() {
    try {
      ws = new WebSocket(`${WS_BASE}/ws/emergency`);
      ws.onopen = () => {
        console.log('⚡ Connected to Project M.R WebSocket State Engine (:8008)');
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error('WS Parse Error:', e);
        }
      };
      ws.onerror = (err) => {
        if (onError) onError(err);
      };
      ws.onclose = () => {
        retryTimer = setTimeout(connect, 3000);
      };
    } catch (err) {
      retryTimer = setTimeout(connect, 3000);
    }
  }

  connect();

  return {
    send: (msg) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg));
      }
    },
    close: () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (ws) ws.close();
    }
  };
}
