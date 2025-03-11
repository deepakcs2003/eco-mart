import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const ErrorMessage = ({ error, message, colors}) => (
  <div className="p-4 rounded-md" style={{ 
    backgroundColor: error ? '#FEE2E2' : colors.neutral2, 
    borderColor: error ? colors.error : colors.secondary,
    color: error ? colors.error : colors.neutral1
  }}>
    <p className="font-medium flex items-center">
      <FaInfoCircle className="mr-2" /> {error || message || "An error occurred"}
    </p>
    <div className="flex justify-center mt-2">
      
    </div>
  </div>
);

export default ErrorMessage;
