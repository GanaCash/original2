let pointsData = {}; // Almacenamiento en memoria (temporal)

exports.handler = async (event) => {
  const { userId } = event.queryStringParameters || {};

  if (!userId || !pointsData[userId]) {
    return {
      statusCode: 200,
      body: JSON.stringify({ amount: 0 }),
    };
  }

  const data = pointsData[userId];
  delete pointsData[userId]; // Limpia después de entregar

  return {
    statusCode: 200,
    body: JSON.stringify({ amount: data.amount }),
  };
};