const crypto = require("crypto");

exports.handler = async (event) => {
  const queryStringParameters = event.queryStringParameters || {};
  const { amount, userId, signature } = queryStringParameters;
  const secret = "461e007d2c"; // Tu Secret de Wannads

  // Verifica la firma
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${userId}${amount}`)
    .digest("hex");

  if (signature !== expectedSignature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid signature" }),
    };
  }

  // Simula almacenamiento temporal (en memoria para este ejemplo)
  // En producción, usarías una base de datos o archivo
  const pointsData = { [userId]: { amount, timestamp: Date.now() } };

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Points processed", userId, amount }),
  };
};