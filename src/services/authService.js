import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth as authStore } from '../stores/auth';

export function initAuthListener() {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        authStore.setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          ...userData
        });
      } else {
        authStore.setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          name: firebaseUser.email,
          roleName: 'Vendedor'
        });
      }
    } else {
      authStore.clear();
    }
  });
}

export async function login(email, password) {
  try {
    authStore.setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);

    if (!result.user.emailVerified) {
      await sendEmailVerification(result.user);
      return { success: true, user: result.user, emailNotVerified: true };
    }

    return { success: true, user: result.user };
  } catch (error) {
    authStore.setError(getErrorMessage(error.code));
    return { success: false, error: getErrorMessage(error.code) };
  }
}

export async function register(email, password, userData) {
  try {
    authStore.setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', result.user.uid), {
      name: userData.name,
      email: email,
      phone: userData.phone || '',
      roleId: userData.roleId || '',
      roleName: userData.roleName || 'Vendedor'
    });
    await sendEmailVerification(result.user);
    return { success: true, user: result.user };
  } catch (error) {
    authStore.setError(getErrorMessage(error.code));
    return { success: false, error: getErrorMessage(error.code) };
  }
}

export async function resendVerificationEmail() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');
    await sendEmailVerification(user);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    authStore.clear();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function changeUserPassword(newPassword) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

function getErrorMessage(code) {
  const messages = {
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'El correo ya está registrado',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/invalid-email': 'Correo electrónico inválido',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/invalid-credential': 'Credenciales inválidas'
  };
  return messages[code] || 'Error de autenticación';
}
