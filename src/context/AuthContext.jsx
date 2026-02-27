import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user in localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('medimom_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Signup function
  const signup = (email, password, name) => {
    // For hackathon, we'll store in localStorage
    const user = {
      id: Date.now().toString(),
      email,
      name,
      babyName: '',
      babyAge: ''
    };
    
    // Store user
    localStorage.setItem('medimom_user', JSON.stringify(user));
    // Store credentials (in real app, NEVER do this!)
    localStorage.setItem('medimom_credentials', JSON.stringify({ email, password }));
    
    setCurrentUser(user);
    return user;
  };

  // Login function
  const login = (email, password) => {
    // Check against stored credentials
    const savedCreds = localStorage.getItem('medimom_credentials');
    if (savedCreds) {
      const creds = JSON.parse(savedCreds);
      if (creds.email === email && creds.password === password) {
        const user = JSON.parse(localStorage.getItem('medimom_user'));
        setCurrentUser(user);
        return user;
      }
    }
    
    // Demo login for testing
    if (email === 'demo@medimom.com' && password === 'demo123') {
      const demoUser = {
        id: 'demo123',
        email: 'demo@medimom.com',
        name: 'Demo Mom',
        babyName: 'Baby',
        babyAge: '2 weeks'
      };
      setCurrentUser(demoUser);
      return demoUser;
    }
    
    throw new Error('Invalid email or password');
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
  };

  // Update user profile
  const updateProfile = (data) => {
    const updatedUser = { ...currentUser, ...data };
    localStorage.setItem('medimom_user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};