const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registro de usuario
const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Por favor, proporcione todos los campos requeridos' });
    }

    // Verificar si el usuario ya existe en Firebase
    const userRecord = await admin.auth().getUserByEmail(email).catch(() => null);
    
    if (userRecord) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear usuario en Firebase
    const newUser = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Crear perfil adicional en Firestore
    await admin.firestore().collection('users').doc(newUser.uid).set({
      name,
      email,
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      height: 0,
      weight: 0,
      age: 0,
      gender: '',
      fitnessGoals: [],
      dietaryPreferences: []
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: newUser.uid, email, name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      id: newUser.uid,
      name,
      email,
      token
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, proporcione email y contraseña' });
    }

    // Verificar credenciales con Firebase
    const userCredential = await admin.auth().getUserByEmail(email).catch(() => null);
    
    if (!userCredential) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Obtener datos adicionales del usuario desde Firestore
    const userDoc = await admin.firestore().collection('users').doc(userCredential.uid).get();
    const userData = userDoc.data() || {};

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: userCredential.uid, 
        email: userCredential.email, 
        name: userCredential.displayName || userData.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      id: userCredential.uid,
      name: userCredential.displayName || userData.name,
      email: userCredential.email,
      token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Obtener perfil de usuario
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener datos del usuario desde Firestore
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userData = userDoc.data();
    
    res.json({
      id: userId,
      name: userData.name,
      email: userData.email,
      height: userData.height || 0,
      weight: userData.weight || 0,
      age: userData.age || 0,
      gender: userData.gender || '',
      fitnessGoals: userData.fitnessGoals || [],
      dietaryPreferences: userData.dietaryPreferences || [],
      createdAt: userData.createdAt
    });
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

// Actualizar perfil de usuario
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, height, weight, age, gender, fitnessGoals, dietaryPreferences } = req.body;

    // Actualizar datos en Firestore
    await admin.firestore().collection('users').doc(userId).update({
      ...(name && { name }),
      ...(height && { height }),
      ...(weight && { weight }),
      ...(age && { age }),
      ...(gender && { gender }),
      ...(fitnessGoals && { fitnessGoals }),
      ...(dietaryPreferences && { dietaryPreferences }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Si se actualiza el nombre, también actualizarlo en Firebase Auth
    if (name) {
      await admin.auth().updateUser(userId, {
        displayName: name
      });
    }

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil de usuario:', error);
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

// Obtener todos los usuarios (solo para admin)
const getAllUsers = async (req, res) => {
  try {
    // Verificar si el usuario es admin
    const userDoc = await admin.firestore().collection('users').doc(req.user.id).get();
    const userData = userDoc.data();
    
    if (!userData || userData.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Obtener todos los usuarios
    const usersSnapshot = await admin.firestore().collection('users').get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers
}; 