import { useState } from 'react';

function useToast() {
  const [isShowing, setIsShowing] = useState(false);
  const [message, setMessage] = useState('');

  const showToast = (msg) => {
    setMessage(msg);
    setIsShowing(true);
    setTimeout(() => {
      setIsShowing(false);
      setMessage('');
    }, 3000); // Hide after 3 seconds
  };

  return { isShowing, message, showToast };
}

export default useToast;
