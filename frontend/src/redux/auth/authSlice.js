import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  getAuth, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { toast } from 'react-toastify';

// Usuario de prueba
const testUser = {
  id: 'test-user-123',
  email: 'usuario@prueba.com',
  name: 'Usuario de Prueba',
  role: 'user',
  profile: {
    name: 'Usuario de Prueba',
    email: 'usuario@prueba.com',
    role: 'user',
    createdAt: new Date('2023-01-15'),
    height: 175,
    weight: 70,
    age: 30,
    gender: 'masculino',
    fitnessGoals: ['Perder peso', 'Aumentar resistencia', 'Tonificar músculos'],
    dietaryPreferences: ['Equilibrada', 'Alta en proteínas'],
    workoutPreferences: ['Cardio', 'Fuerza', 'Flexibilidad'],
    weeklyWorkouts: 4,
    dailyWaterIntake: 2000,
    sleepHours: 7,
    stressLevel: 'Moderado',
    medicalConditions: [],
    achievements: [
      { id: 1, title: 'Primera semana completada', date: new Date('2023-01-22') },
      { id: 2, title: '10 entrenamientos completados', date: new Date('2023-02-15') },
      { id: 3, title: 'Meta de peso alcanzada', date: new Date('2023-03-10') }
    ],
    stats: {
      totalWorkouts: 45,
      totalMinutes: 1350,
      caloriesBurned: 12500,
      streakDays: 5
    },
    recentWorkouts: [
      { id: 'w1', type: 'Cardio', duration: 45, date: new Date('2023-04-10') },
      { id: 'w2', type: 'Fuerza', duration: 60, date: new Date('2023-04-08') },
      { id: 'w3', type: 'Yoga', duration: 30, date: new Date('2023-04-06') }
    ],
    nutritionLogs: [
      { 
        id: 'n1', 
        date: new Date('2023-04-10'),
        meals: [
          { type: 'Desayuno', calories: 350, protein: 20, carbs: 40, fat: 10 },
          { type: 'Almuerzo', calories: 550, protein: 35, carbs: 50, fat: 15 },
          { type: 'Cena', calories: 450, protein: 30, carbs: 35, fat: 12 }
        ],
        totalWater: 2200,
        totalCalories: 1350
      }
    ],
    progressMeasurements: [
      { date: new Date('2023-01-15'), weight: 75, bodyFat: 22 },
      { date: new Date('2023-02-15'), weight: 73, bodyFat: 21 },
      { date: new Date('2023-03-15'), weight: 71, bodyFat: 20 },
      { date: new Date('2023-04-10'), weight: 70, bodyFat: 19 }
    ]
  }
};

// Estado inicial
const initialState = {
  currentUser: null,
  userProfile: null,
  isLoading: false,
  isInitialized: false,
  error: null
};

// Acción asíncrona para registrar un usuario
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, name }, { rejectWithValue, dispatch }) => {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil con nombre
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Crear perfil en Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role: 'user',
        createdAt: new Date(),
        height: 0,
        weight: 0,
        age: 0,
        gender: '',
        fitnessGoals: [],
        dietaryPreferences: []
      });
      
      // Devolver datos del usuario para el estado
      const userData = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: name,
        photoURL: null,
        role: 'user'
      };
      
      toast.success('¡Registro exitoso! Bienvenido/a a FitnessTrack.');
      
      return userData;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      
      let errorMessage = 'Error al crear la cuenta. Por favor, inténtalo de nuevo.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está en uso. Por favor, utiliza otro.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil. Utiliza al menos 6 caracteres.';
      }
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Acción asíncrona para iniciar sesión
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Verificar si es el usuario de prueba
      if (email === testUser.email && password === '123456') {
        toast.success('¡Inicio de sesión exitoso!');
        return testUser;
      }
      
      // Iniciar sesión en Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Obtener datos adicionales del perfil desde Firestore
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('No se encontró información del usuario');
      }
      
      const userData = docSnap.data();
      
      // Devolver datos combinados
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || userData.name,
        role: userData.role || 'user',
        profile: userData
      };
    } catch (error) {
      const errorMessage = error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
        ? 'Credenciales inválidas'
        : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// Acción asíncrona para cerrar sesión
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Acción asíncrona para verificar la sesión del usuario
export const checkUserSession = createAsyncThunk(
  'auth/checkUserSession',
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      const auth = getAuth();
      
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Obtener datos del perfil
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const userData = docSnap.data();
              
              resolve({
                id: user.uid,
                email: user.email,
                name: user.displayName || userData.name,
                role: userData.role || 'user',
                profile: userData
              });
            } else {
              resolve({
                id: user.uid,
                email: user.email,
                name: user.displayName,
                role: 'user',
                profile: null
              });
            }
          } catch (error) {
            console.error('Error al obtener perfil:', error);
            resolve({
              id: user.uid,
              email: user.email,
              name: user.displayName,
              role: 'user',
              profile: null
            });
          }
        } else {
          resolve(null);
        }
      });
    });
  }
);

// Acción asíncrona para actualizar el perfil
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { currentUser } = getState().auth;
      
      if (!currentUser) {
        throw new Error('No hay usuario autenticado');
      }
      
      // Si es el usuario de prueba, simular actualización
      if (currentUser.id === testUser.id) {
        const updatedProfile = {
          ...testUser.profile,
          ...profileData,
          updatedAt: new Date()
        };
        
        toast.success('Perfil actualizado correctamente');
        return updatedProfile;
      }
      
      // Actualizar en Firestore
      const userRef = doc(db, 'users', currentUser.id);
      
      // Preparar datos a actualizar con timestamp
      const dataToUpdate = {
        ...profileData,
        updatedAt: new Date()
      };
      
      await updateDoc(userRef, dataToUpdate);
      
      // Si hay nombre, actualizar también en Firebase Auth
      if (profileData.name) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.name
        });
      }
      
      // Obtener perfil actualizado
      const updatedDocSnap = await getDoc(userRef);
      
      if (!updatedDocSnap.exists()) {
        throw new Error('No se encontró información del usuario');
      }
      
      const updatedUserData = updatedDocSnap.data();
      
      toast.success('Perfil actualizado correctamente');
      
      return updatedUserData;
    } catch (error) {
      toast.error('Error al actualizar perfil: ' + error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Crear slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      if (action.payload) {
        toast.error(action.payload);
      }
    },
    updateUserData: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload
      };
    },
    // Acción para iniciar sesión con el usuario de prueba directamente
    loginTestUser: (state) => {
      state.currentUser = testUser;
      state.userProfile = testUser.profile;
      state.error = null;
      toast.success('¡Inicio de sesión con usuario de prueba exitoso!');
    }
  },
  extraReducers: (builder) => {
    builder
      // Registro de usuario
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Inicio de sesión
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.userProfile = action.payload.profile;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Cierre de sesión
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.currentUser = null;
        state.userProfile = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Verificación de sesión
      .addCase(checkUserSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.currentUser = action.payload;
        state.userProfile = action.payload?.profile || null;
      })
      .addCase(checkUserSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload;
      })
      
      // Actualización de perfil
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { login, logout, setLoading, setError, updateUserData, loginTestUser } = authSlice.actions;

export default authSlice.reducer; 