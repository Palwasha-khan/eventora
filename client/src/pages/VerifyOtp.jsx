 import React from 'react'
import { useEffect } from 'react';
import { use } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
 
 const VerifyOtp = () => {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const tempEmail = localStorage.getItem('temp_verify_email');
        if (!tempEmail) { navigate('/register');
        }else{
            setEmail(tempEmail);
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post('/auth/verify-otp', { email, otp });
           
            setMessage(response.data?.message || 'Email verified successfully! Redirecting to login...');
            setTimeout(() => {
                localStorage.removeItem('temp_verify_email'); 
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again...');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setMessage('');
        setResending(true);

        try {
            const response = await axios.post('/auth/resend-otp', { email });
            setMessage(response.data?.message || 'A new verification code has been sent!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
     <div className="min-h-screen flex items-center justify-center bg-brand-bg-deep px-4">
        <div className="max-w-md w-full bg-brand-bg-card border border-brand-border rounded-3xl p-8 shadow-2xl text-center">
        <div className="h-14 w-14 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
          ✉️
        </div>
        <h2 className="text-3xl font-black text-brand-text-bright text-center mb-2">Verify Your Email</h2>
        <p className="text-brand-text-muted text-center mb-6 font-medium text-sm">
          We've sent a verification code to your email. Please enter it below.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-brand-danger-border text-brand-danger-text text-sm rounded-xl font-semibold">
            ⚠️ {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-950/40 border border-brand-accent-border text-brand-accent-text text-sm rounded-xl font-semibold">
            ✅ {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              name="otp" 
              required
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full bg-brand-bg-deep border border-brand-border rounded-xl py-3 px-4 text-brand-text-bright focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep font-black py-3 rounded-xl shadow-lg shadow-brand-accent/10 transition-all cursor-pointer mt-2"
          >
           {loading ? 'Verifying...' : 'Verify Email'}
          </button>
 </form>
        <button 
          onClick={handleResendOtp}
          className="mt-6 text-sm text-brand-accent hover:underline cursor-pointer block w-full text-center font-medium"
        >
          Didn't receive the code? Resend OTP
        </button>
          
       
      </div>
    </div>
  );
};

export default VerifyOtp;