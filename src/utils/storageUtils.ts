import { StorageKey } from '../types/common';

/**
 * 检查存储可用性
 * @param storageType 存储类型，默认为localStorage
 * @returns 存储是否可用
 */
export const isStorageAvailable = (storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): boolean => {
  const storage = window[storageType];
  try {
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn(`${storageType}不可用，错误:`, e);
    return false;
  }
};

/**
 * 从存储中获取数据
 * @param key 存储键
 * @param defaultValue 默认值
 * @param storageType 存储类型，默认为localStorage
 * @returns 存储的值或默认值
 */
export const getStorageItem = <T>(
  key: StorageKey | string,
  defaultValue: T,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
): T => {
  try {
    if (!isStorageAvailable(storageType)) {
      return defaultValue;
    }
    
    const storage = window[storageType];
    const item = storage.getItem(key);
    
    if (item === null) {
      return defaultValue;
    }
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`获取${key}时出错:`, error);
    return defaultValue;
  }
};

/**
 * 将数据保存到存储
 * @param key 存储键
 * @param value 要存储的值
 * @param storageType 存储类型，默认为localStorage
 * @returns 操作是否成功
 */
export const setStorageItem = <T>(
  key: StorageKey | string,
  value: T,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
): boolean => {
  try {
    if (!isStorageAvailable(storageType)) {
      return false;
    }
    
    const storage = window[storageType];
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`保存${key}时出错:`, error);
    return false;
  }
};

/**
 * 从存储中移除数据
 * @param key 存储键
 * @param storageType 存储类型，默认为localStorage
 * @returns 操作是否成功
 */
export const removeStorageItem = (
  key: StorageKey | string,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
): boolean => {
  try {
    if (!isStorageAvailable(storageType)) {
      return false;
    }
    
    const storage = window[storageType];
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`移除${key}时出错:`, error);
    return false;
  }
};

/**
 * 清除所有存储数据
 * @param storageType 存储类型，默认为localStorage
 * @returns 操作是否成功
 */
export const clearStorage = (
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
): boolean => {
  try {
    if (!isStorageAvailable(storageType)) {
      return false;
    }
    
    const storage = window[storageType];
    storage.clear();
    return true;
  } catch (error) {
    console.error(`清除${storageType}时出错:`, error);
    return false;
  }
};

/**
 * 获取存储已使用的空间大小(字节)
 * @param storageType 存储类型，默认为localStorage
 * @returns 已使用空间大小(字节)
 */
export const getStorageUsage = (
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
): number => {
  try {
    if (!isStorageAvailable(storageType)) {
      return 0;
    }
    
    const storage = window[storageType];
    let total = 0;
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) {
        const value = storage.getItem(key) || '';
        total += key.length + value.length;
      }
    }
    
    return total;
  } catch (error) {
    console.error(`计算${storageType}使用量时出错:`, error);
    return 0;
  }
};

/**
 * 批量设置多个存储项
 * @param items 键值对对象
 * @param storageType 存储类型，默认为localStorage
 * @returns 操作是否全部成功
 */
export const setMultipleItems = (
  items: Record<string, any>,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
): boolean => {
  let allSuccess = true;
  
  for (const [key, value] of Object.entries(items)) {
    const success = setStorageItem(key, value, storageType);
    if (!success) {
      allSuccess = false;
    }
  }
  
  return allSuccess;
};