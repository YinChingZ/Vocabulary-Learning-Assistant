import { useState, useEffect } from 'react';

/**
 * 本地存储hook，提供类似useState的API，但会将数据持久化到localStorage中
 * @param key 存储的键名
 * @param initialValue 初始值
 * @returns [存储的值, 更新值的函数]
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 初始化状态，尝试从localStorage获取值，如果没有则使用initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // 从localStorage获取值
      const item = window.localStorage.getItem(key);
      // 如果存在则解析并返回，否则返回initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // 如果发生错误（如解析错误），记录错误并返回initialValue
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // 当键名改变时，重新尝试从localStorage获取值
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage on key change:`, error);
      setStoredValue(initialValue);
    }
  }, [key]);

  // 更新状态并同步更新localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 允许传入函数以获取当前值（类似于useState的用法）
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 更新React状态
      setStoredValue(valueToStore);
      
      // 更新localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // 触发存储事件，以便同一浏览器的其他标签页可以监听到变化
      window.dispatchEvent(new StorageEvent('storage', {
        key: key,
        newValue: JSON.stringify(valueToStore),
      }));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;