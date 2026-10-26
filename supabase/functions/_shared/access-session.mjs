const enc = new TextEncoder();
const b64 = bytes => btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
const un64 = text => Uint8Array.from(atob(text.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0));
export async function hash(value) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(value)))].map(x => x.toString(16).padStart(2, '0')).join('');
}
export function active(row, now = Date.now()) {
  return !!row && row.status === 'ACTIVE' && (!row.active_until || Date.parse(row.active_until) > now);
}
async function key(secret) {
  if (!secret || secret.length < 32) throw new Error('Missing session signing secret');
  return crypto.subtle.importKey('raw', enc.encode('ism-access-session-v1:' + secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign','verify']);
}
export async function issue(row, secret, now = Date.now()) {
  if (!active(row, now)) throw new Error('Access denied');
  const exp = Math.min(now + 30 * 60 * 1000, row.active_until ? Date.parse(row.active_until) : Infinity);
  const body = b64(enc.encode(JSON.stringify({sub:row.id,aud:'ism-premium',exp,iat:now,nonce:crypto.randomUUID()})));
  return body + '.' + b64(new Uint8Array(await crypto.subtle.sign('HMAC', await key(secret), enc.encode(body))));
}
export async function verify(token, secret, lookup, now = Date.now()) {
  try {
    if (typeof token !== 'string' || token.length > 2048) return null;
    const parts = token.split('.');
    if (parts.length !== 2 || !await crypto.subtle.verify('HMAC', await key(secret), un64(parts[1]), enc.encode(parts[0]))) return null;
    const claims = JSON.parse(new TextDecoder().decode(un64(parts[0])));
    if (claims.aud !== 'ism-premium' || typeof claims.sub !== 'string' || !Number.isFinite(claims.exp) || claims.exp <= now || claims.iat > now || claims.exp - claims.iat > 1800000) return null;
    const row = await lookup(claims.sub);
    return active(row, now) ? row : null;
  } catch { return null; }
}
