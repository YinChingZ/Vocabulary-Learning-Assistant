/**
 * 语音播放工具
 * 封装Web Speech API的语音合成功能
 */

// 语音选项类型定义
export interface SpeechOptions {
  voice?: string;        // 语音名称
  rate?: number;         // 语速，0.1-10，默认1
  pitch?: number;        // 音调，0-2，默认1
  volume?: number;       // 音量，0-1，默认1
  lang?: string;         // 语言，例如'en-US'、'zh-CN'
}

// 默认语音选项
const defaultOptions: SpeechOptions = {
  rate: 1,
  pitch: 1,
  volume: 1,
  lang: 'en-US'
};

/**
 * 播放文本语音
 * @param text 要播放的文本
 * @param options 语音选项
 */
export const playSpeech = (text: string, options: SpeechOptions = {}): void => {
  // 合并默认选项和用户选项
  const speechOptions = { ...defaultOptions, ...options };
  
  // 检查浏览器是否支持语音合成
  if ('speechSynthesis' in window) {
    // 创建语音合成对象
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 设置语音选项
    utterance.rate = speechOptions.rate || 1;
    utterance.pitch = speechOptions.pitch || 1;
    utterance.volume = speechOptions.volume || 1;
    utterance.lang = speechOptions.lang || 'en-US';
    
    // 如果指定了特定的语音，则设置
    if (speechOptions.voice) {
      const voices = window.speechSynthesis.getVoices();
      
      // 查找指定的语音
      const selectedVoice = voices.find(voice => 
        voice.name === speechOptions.voice || 
        voice.voiceURI === speechOptions.voice
      );
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        console.warn(`未找到语音: ${speechOptions.voice}`);
      }
    }
    
    // 播放语音
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('当前浏览器不支持语音合成API');
  }
};

/**
 * 获取所有可用的语音列表
 */
export const getAvailableVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    // 如果浏览器不支持语音合成，返回空数组
    if (!('speechSynthesis' in window)) {
      console.warn('当前浏览器不支持语音合成API');
      resolve([]);
      return;
    }
    
    // 尝试立即获取语音列表
    let voices = window.speechSynthesis.getVoices();
    
    // 如果语音列表已加载，直接返回
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    
    // 如果语音列表未加载，监听onvoiceschanged事件
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };
  });
};

/**
 * 停止当前所有语音播放
 */
export const stopSpeech = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * 暂停当前语音播放
 */
export const pauseSpeech = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
};

/**
 * 恢复已暂停的语音播放
 */
export const resumeSpeech = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
};

/**
 * 检查浏览器是否支持语音合成
 */
export const isSpeechSupported = (): boolean => {
  return 'speechSynthesis' in window;
};