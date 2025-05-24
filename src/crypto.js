// Clave pública en formato PEM (debes reemplazarla con la tuya)
const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1...
-----END PUBLIC KEY-----`;

// Convertir PEM a formato que Web Crypto pueda usar
async function importPublicKey(pem) {
  const binaryDerString = atob(pem.split('\n').slice(1, -2).join(''));
  const binaryDer = new Uint8Array(binaryDerString.split('').map(c => c.charCodeAt(0)));
  return await crypto.subtle.importKey(
    'spki',
    binaryDer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['verify']
  );
}

// Verificar firma de un token
async function verifyToken(token) {
  try {
    const { usuario, puntos, timestamp, firma } = token;
    const publicKey = await importPublicKey(publicKeyPem);
    const data = new TextEncoder().encode(JSON.stringify({ usuario, puntos, timestamp }));
    const signature = new Uint8Array(atob(firma).split('').map(c => c.charCodeAt(0)));
    
    return await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      publicKey,
      signature,
      data
    );
  } catch (error) {
    console.error('Error verificando firma:', error);
    return false;
  }
}

export { verifyToken };
