import { useState, useEffect, useCallback } from 'react';

// 语音选项接口
export interface SpeechOptions {
  rate?: number;       // 语速，默认1
  pitch?: number;      // 音调，默认1
  volume?: number;     // 音量，默认1
  lang?: string;       // 语言，默认'en-US'
  voice?: string;      // 指定的声音名称或ID
}

// 语音合成状态
export type SpeechStatus = 'idle' | 'speaking' | 'paused' | 'ended' | 'error';

/**
 * 语音合成自定义Hook
 * @param defaultOptions 默认语音选项
 * @returns 语音合成相关函数和状态
 */
const useSpeechSynthesis = (defaultOptions: SpeechOptions = {}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [currentText, setCurrentText] = useState<string>('');
  
  // 默认配置
  const defaultSettings: SpeechOptions = {
    rate: 1,
    pitch: 1,
    volume: 1,
    lang: 'en-US',
    ...defaultOptions
  };

  // 初始化获取可用语音
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.warn('当前浏览器不支持语音合成API');
      return;
    }

    // 获取可用语音
    const getVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // 立即尝试获取
    getVoices();

    // 监听语音列表变化
    window.speechSynthesis.onvoiceschanged = getVoices;

    return () => {
      // 清理监听器
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // 播放文本
  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!('speechSynthesis' in window)) {
      console.warn('当前浏览器不支持语音合成API');
      setStatus('error');
      return;
    }

    // 合并默认选项和用户选项
    const speechOptions = { ...defaultSettings, ...options };

    // 停止当前播放
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    setCurrentText(text);

    // 设置语音选项
    utterance.rate = speechOptions.rate || 1;
    utterance.pitch = speechOptions.pitch || 1;
    utterance.volume = speechOptions.volume || 1;
    utterance.lang = speechOptions.lang || 'en-US';

    // 如果指定了特定的语音，则设置
    if (speechOptions.voice && voices.length > 0) {
      const selectedVoice = voices.find(voice => 
        voice.name === speechOptions.voice || 
        voice.voiceURI === speechOptions.voice
      );
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // 设置事件处理
    utterance.onstart = () => {
      setSpeaking(true);
      setStatus('speaking');
    };

    utterance.onend = () => {
      setSpeaking(false);
      setStatus('ended');
    };

    utterance.onerror = (event) => {
      console.error('语音合成错误:', event);
      setSpeaking(false);
      setStatus('error');
    };

    utterance.onpause = () => {
      setStatus('paused');
    };

    utterance.onresume = () => {
      setStatus('speaking');
    };

    // 播放
    window.speechSynthesis.speak(utterance);
  }, [voices, defaultSettings]);

  // 暂停播放
  const pause = useCallback(() => {
    if ('speechSynthesis' in window && speaking) {
      window.speechSynthesis.pause();
      setStatus('paused');
    }
  }, [speaking]);

  // 恢复播放
  const resume = useCallback(() => {
    if ('speechSynthesis' in window && status === 'paused') {
      window.speechSynthesis.resume();
      setStatus('speaking');
    }
  }, [status]);

  // 停止播放
  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setStatus('idle');
      setCurrentText('');
    }
  }, []);

  // 检查浏览器是否支持语音合成
  const isSupported = 'speechSynthesis' in window;

  return {
    speak,
    pause,
    resume,
    cancel,
    speaking,
    status,
    voices,
    isSupported,
    currentText
  };
};

export default useSpeechSynthesis;