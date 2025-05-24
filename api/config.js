// api/config.js
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    window.supabaseUrl = '${process.env.SUPABASE_URL}';
    window.supabaseKey = '${process.env.SUPABASE_KEY}';
  `);
};