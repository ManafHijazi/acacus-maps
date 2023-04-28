/**
 * Function that clears the Local Storage
 */
const clearLocalStorage = () => {
  const localStorageItems = ['user', 'isLoggedIn', 'endPoint', 'accessToken'];
  localStorageItems.forEach((item) => {
    localStorage.removeItem(item);
  });
};

// Export service
export const storageService = {
  clearLocalStorage,
};
