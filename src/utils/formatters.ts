/**
 * 格式化日期为YYYY-MM-DD格式
 * @param date 日期对象或时间戳
 * @returns 格式化的日期字符串
 */
export const formatDate = (date: Date | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 格式化日期时间为YYYY-MM-DD HH:MM:SS格式
 * @param date 日期对象或时间戳
 * @returns 格式化的日期时间字符串
 */
export const formatDateTime = (date: Date | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 格式化相对时间(如：3天前，2小时前)
 * @param date 日期对象或时间戳
 * @returns 相对时间字符串
 */
export const formatRelativeTime = (date: Date | number): string => {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years}年前`;
  if (months > 0) return `${months}个月前`;
  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  
  return '刚刚';
};

/**
 * 格式化数字，添加千位分隔符
 * @param num 要格式化的数字
 * @param decimals 小数位数，默认为0
 * @returns 格式化的数字字符串
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('zh-CN', { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * 格式化百分比
 * @param value 百分比值(0-1之间的小数)
 * @param decimals 小数位数，默认为0
 * @returns 格式化的百分比字符串
 */
export const formatPercent = (value: number, decimals: number = 0): string => {
  return (value * 100).toFixed(decimals) + '%';
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数，默认为2
 * @returns 格式化的文件大小字符串
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * 格式化学习时长
 * @param minutes 分钟数
 * @returns 格式化的时长字符串
 */
export const formatStudyTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  }
};

/**
 * 首字母大写
 * @param str 输入字符串
 * @returns 首字母大写的字符串
 */
export const capitalizeFirst = (str: string): string => {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 截断文本，超过长度添加省略号
 * @param text 要截断的文本
 * @param maxLength 最大长度
 * @returns 截断后的文本
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};