/**
 * 通用类型定义
 * 定义了基础数据结构、API响应类型和可复用接口
 */

// ID类型
export type ID = string | number;

// 基本响应状态
export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// API基础响应结构
export interface ApiResponse<T = any> {
  status: ResponseStatus;
  message?: string;
  data?: T;
  errors?: string[];
  timestamp?: number;
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 分页响应结构
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 基础模型接口
export interface BaseModel {
  id: ID;
  createdAt?: number | string;
  updatedAt?: number | string;
}

// 可选择项目接口
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
}

// 日期范围类型
export interface DateRange {
  startDate: Date | number | string;
  endDate: Date | number | string;
}

// 主题类型
export type ThemeType = 'light' | 'dark' | 'system';

// 尺寸枚举
export enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

// 键值对类型
export type KeyValuePair<T = any> = {
  [key: string]: T;
};

// 事件处理函数类型
export type EventHandler<E = Event> = (event: E) => void;

// 简单回调函数类型
export type Callback<T = void> = (...args: any[]) => T;

// 错误处理结构
export interface ErrorInfo {
  code?: string;
  message: string;
  details?: any;
}

// 本地存储键类型(类型安全)
export enum StorageKey {
  VOCABULARY = 'vocabulary',
  PROGRESS = 'progress',
  SETTINGS = 'settings',
  THEME = 'theme',
  USER_PREFERENCES = 'userPreferences'
}