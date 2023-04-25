/**
 * Function that clears the Local Storage
 */
const clearLocalStorage = () => {
  const localStorageItems = ['user', 'isLoggedIn', 'endPoint', 'access_token'];
  localStorageItems.forEach((item) => {
    localStorage.removeItem(item);
  });
};

// Export service
export const storageService = {
  clearLocalStorage,
};
