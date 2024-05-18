import { useState, useEffect } from 'react';

const useLocalStorage = (key: string, initialValue: any = '') => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    const item = window.localStorage.getItem(key);
    return item && item !== 'undefined' ? JSON?.parse(item) : initialValue;
  });

  const setValue = (value: any) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  useEffect(() => {
    const handleStorageChange = (event: any) => {
      if (event.key === key) {
        setStoredValue(
          event.newValue ? JSON.parse(event.newValue) : initialValue,
        );
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;
