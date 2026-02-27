import { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Email/Password signup
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Email/Password login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Sign-In
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    login,
    signup,
    googleSignIn,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};