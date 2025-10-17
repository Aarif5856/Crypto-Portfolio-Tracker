// Utility to clear tutorial state for testing
export const clearTutorialState = () => {
  localStorage.removeItem('crypto-pro-tutorial-completed');
  console.log('Tutorial state cleared. Refresh the page to see the tutorial again.');
};

// Auto-clear tutorial state in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment the line below to clear tutorial state on page load
  // clearTutorialState();
}
