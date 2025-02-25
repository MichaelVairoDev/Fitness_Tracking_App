const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // Verificar si hay token en el header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }

    const token = authHeader.split(' ')[1];

    // Verificar si es un token de Firebase o JWT
    if (token.length > 500) {
      // Token de Firebase
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
          id: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || '',
          picture: decodedToken.picture || ''
        };
        next();
      } catch (error) {
        console.error('Error al verificar token de Firebase:', error);
        return res.status(401).json({ message: 'Token no válido' });
      }
    } else {
      // Token JWT
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        console.error('Error al verificar JWT:', error);
        return res.status(401).json({ message: 'Token no válido' });
      }
    }
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { authMiddleware }; 