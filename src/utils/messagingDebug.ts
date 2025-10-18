// Debugging utilities for messaging issues
export const clearMessagingState = () => {
  // Clear any potential localStorage/sessionStorage state
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('conversation') || key.includes('message') || key.includes('user')) {
      localStorage.removeItem(key);
    }
  });
  
  const sessionKeys = Object.keys(sessionStorage);
  sessionKeys.forEach(key => {
    if (key.includes('conversation') || key.includes('message') || key.includes('user')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const logCurrentUser = () => {
  const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
  
  if (authToken) {
    try {
      // Decode JWT payload (without verification, just for debugging)
      const payload = JSON.parse(atob(authToken.split('.')[1]));
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
};

export const debugMessagingState = () => {
  logCurrentUser();
  clearMessagingState();
};
