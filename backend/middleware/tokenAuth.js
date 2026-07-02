export function tokenAuth(req, res, next) {
  const expectedToken = process.env.API_TOKEN;
  if (!expectedToken) {
    return next();
  }

  const authHeader = req.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.get('x-api-token');

  if (token !== expectedToken) {
    return res.status(401).json({ message: 'Invalid or missing API token' });
  }

  return next();
}
