// src/services/authService.js
// Serviço de Autenticação

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Registar novo utilizador
 */
export const registarUtilizador = async (email, password, nome, clube) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: nome });

    await setDoc(doc(db, 'utilizadores', user.uid), {
      nome: nome,
      email: email,
      clube: clube,
      tipo: 'treinador',
      criadoEm: new Date(),
      plano: 'gratuito',
      ativo: true
    });

    return {
      success: true,
      user: user,
      message: 'Conta criada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao registar:', error);
    
    let mensagemErro = 'Erro ao criar conta';
    
    if (error.code === 'auth/email-already-in-use') {
      mensagemErro = 'Este email já está registado';
    } else if (error.code === 'auth/weak-password') {
      mensagemErro = 'A password deve ter pelo menos 6 caracteres';
    } else if (error.code === 'auth/invalid-email') {
      mensagemErro = 'Email inválido';
    }

    return {
      success: false,
      message: mensagemErro,
      error: error
    };
  }
};

/**
 * Login de utilizador
 */
export const loginUtilizador = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'utilizadores', user.uid));
    const userData = userDoc.data();

    return {
      success: true,
      user: user,
      userData: userData,
      message: 'Login efetuado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    
    let mensagemErro = 'Erro ao fazer login';
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      mensagemErro = 'Email ou password incorretos';
    } else if (error.code === 'auth/invalid-email') {
      mensagemErro = 'Email inválido';
    } else if (error.code === 'auth/user-disabled') {
      mensagemErro = 'Esta conta foi desativada';
    } else if (error.code === 'auth/invalid-credential') {
      mensagemErro = 'Credenciais inválidas';
    }

    return {
      success: false,
      message: mensagemErro,
      error: error
    };
  }
};

/**
 * Logout de utilizador
 */
export const logoutUtilizador = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Logout efetuado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return {
      success: false,
      message: 'Erro ao fazer logout',
      error: error
    };
  }
};

/**
 * Recuperar password
 */
export const recuperarPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Email de recuperação enviado!'
    };
  } catch (error) {
    console.error('Erro ao recuperar password:', error);
    
    let mensagemErro = 'Erro ao enviar email';
    
    if (error.code === 'auth/user-not-found') {
      mensagemErro = 'Email não encontrado';
    } else if (error.code === 'auth/invalid-email') {
      mensagemErro = 'Email inválido';
    }

    return {
      success: false,
      message: mensagemErro,
      error: error
    };
  }
};

/**
 * Obter utilizador atual
 */
export const obterUtilizadorAtual = () => {
  return auth.currentUser;
};

/**
 * Verificar se utilizador está autenticado
 */
export const estaAutenticado = () => {
  return auth.currentUser !== null;
};
