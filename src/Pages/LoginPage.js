import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import summaryApi from '../Common';
import R3 from '../Assist/3R.jpg';

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
    console.log("User Data:", data);

    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user info
      localStorage.setItem('token', data.token); // Store token
      navigate('/'); // Redirect to home
      window.location.reload(); // Refresh UI after login
    } else {
      console.error('Google login failed:', data.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side image - hidden on mobile, visible on md and up */}
      <div className="hidden md:flex md:flex-col md:w-1/2 bg-green-600 items-center justify-center">
        <img 
          src="https://33.media.tumblr.com/cf1d1eb0e6f591ac6cc74b5f7e7ef761/tumblr_nn6lsaqWeY1shalg6o1_500.gif"
          alt="Login illustration" 
          className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
        />
        
      </div>
      
      {/* Login container - full width on mobile, half on desktop */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex flex-col items-center justify-center space-y-6">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.error('Google Login Failed')}
                size="large"
                theme="filled_blue"
                shape="pill"
                text="continue_with"
                useOneTap
              />
              
              <div className="text-sm text-gray-500 text-center mt-4">
                By signing in, you agree to our 
                <a href="#" className="text-indigo-600 hover:text-indigo-800 ml-1">
                  Terms of Service
                </a> and 
                <a href="#" className="text-indigo-600 hover:text-indigo-800 ml-1">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;