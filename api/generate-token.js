const { sign } = require('jsonwebtoken');
const crypto = require('crypto');

// Clave privada (almacenada en .env)
const privateKey = "hola7196726";

// Generar token firmado
module.exports = async (req, res) => {
  const { usuario, puntos } = req.body;
  if (!usuario || !puntos) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const tokenData = {
    usuario,
    puntos,
    timestamp: Math.floor(Date.now() / 1000)
  };

  try {
    // Generar firma con ECDSA
    const signObj = crypto.createSign('SHA256');
    signObj.update(JSON.stringify(tokenData));
    const firma = signObj.sign(privateKey, 'base64');

    res.status(200).json({ ...tokenData, firma });
  } catch (error) {
    res.status(500).json({ error: 'Error al firmar el token' });
  }
};
