import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, verifyUser as verifyLocalUser } from '../utils/db';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import emailjs from '@emailjs/browser';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tempOTP, setTempOTP] = useState(null);

  useEffect(() => {
    // Check local session
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    const result = await verifyLocalUser(email, password);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('current_user', JSON.stringify(result.user));
    }
    return result;
  };

  const loginWithGoogle = async () => {
    if (!auth) return { success: false, message: "Firebase is not configured." };
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      
      // Auto-register in our cloud DB if new, or just sign in
      let dbResult = await registerUser(email, 'google-sso-placeholder');
      if (!dbResult.success && dbResult.message === 'User already exists.') {
        // Assume verified
        dbResult = { success: true, user: { email, role: 'user' } };
      }
      
      if (dbResult.success) {
        setUser(dbResult.user);
        localStorage.setItem('current_user', JSON.stringify(dbResult.user));
      }
      return dbResult;
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  const sendOTP = async (email) => {
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setTempOTP(otp);

    // Provide a fallback mock if EmailJS is not configured
    if (!import.meta.env.VITE_EMAILJS_SERVICE_ID) {
      console.log(`[MOCK EMAIL] Sent OTP to ${email}: ${otp}`);
      return { success: true, message: "Mock OTP sent (check console). Please configure EmailJS." };
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          otp_code: otp,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      return { success: true, message: "OTP sent to your email." };
    } catch (error) {
      console.error('EmailJS Error:', error);
      return { success: false, message: "Failed to send OTP email." };
    }
  };

  const verifyOTP = async (email, enteredOTP) => {
    if (enteredOTP === tempOTP) {
      const result = await registerUser(email, 'otp-verified');
      let finalResult = result;
      if (!result.success && result.message === 'User already exists.') {
        finalResult = { success: true, user: { email, role: 'user' } };
      }
      
      if (finalResult.success) {
        setUser(finalResult.user);
        localStorage.setItem('current_user', JSON.stringify(finalResult.user));
        setTempOTP(null);
      }
      return finalResult;
    }
    return { success: false, message: 'Invalid OTP code.' };
  };

  const logout = async () => {
    if (auth) {
      try { await firebaseSignOut(auth); } catch(e) {}
    }
    setUser(null);
    localStorage.removeItem('current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, sendOTP, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
