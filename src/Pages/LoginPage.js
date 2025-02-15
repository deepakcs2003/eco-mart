import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import summaryApi from '../Common';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async (response) => {
    const credential = response.credential;
    const backendResponse = await fetch(summaryApi.logIn.url, {
      method: summaryApi.logIn.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: credential }),
    });

    const data = await backendResponse.json();
    console.log("user data is her",data);
    if (data.success) {
      navigate('/'); // Redirect after successful login
      // window.location.reload(); // Refresh to update UI
    } else {
      console.error('Google login failed:', data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Login with Google</h1>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.error('Google Login Failed')}
        />
      </div>
    </div>
  );
};

export default LoginPage;
