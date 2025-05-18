import React, {JSX} from 'react';

// 图标属性接口
interface IconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
}

// 图标尺寸映射
const sizeMap = {
  xs: 'h-4 w-4',
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

// 抽象图标组件
const createIcon = (
  path: JSX.Element | JSX.Element[],
  viewBox = '0 0 24 24'
) => {
  const Icon: React.FC<IconProps> = ({ className = '', size = 'md', color }) => {
    const sizeClass = sizeMap[size];
    const colorClass = color ? '' : 'text-current';
    const style = color ? { color } : undefined;
    
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        className={`${sizeClass} ${colorClass} ${className}`}
        style={style}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {path}
      </svg>
    );
  };
  
  return Icon;
};

// 不同类型的图标
// 词性图标
export const NounIcon = createIcon(<path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />);
export const VerbIcon = createIcon(<path d="M16 6l-8 6 8 6V6z" />);
export const AdjectiveIcon = createIcon(<path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" fill="currentColor" fillOpacity="0.2" />);
export const AdverbIcon = createIcon(<path d="M8 7l4-3 4 3v5.5M6 21l6-6.5 6 6.5" />);

// 操作图标
export const CheckIcon = createIcon(<path d="M20 6L9 17l-5-5" />);
export const CloseIcon = createIcon(<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>);
export const BookmarkIcon = createIcon(<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />);
export const StarIcon = createIcon(<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />);

// 学习相关图标
export const BookIcon = createIcon(<><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></>);
export const PenIcon = createIcon(<path d="M12 19l7-7 3 3-7 7-3-3z" />);
export const SpeakerIcon = createIcon(
  <>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </>
);

// 界面导航图标
export const HomeIcon = createIcon(<><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><polyline points="9 22 9 12 15 12 15 22" /></>);
export const ImportIcon = createIcon(<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>);
export const FlashcardIcon = createIcon(<><rect x="2" y="4" width="20" height="16" rx="2" ry="2" /><path d="M12 8v8" /><path d="M8 12h8" /></>);
export const QuizIcon = createIcon(<><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>);
export const SummaryIcon = createIcon(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>);

// 主题相关图标
export const SunIcon = createIcon(<><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>);
export const MoonIcon = createIcon(<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />);

// 导出所有图标为对象
const Icons = {
  // 词性
  Noun: NounIcon,
  Verb: VerbIcon,
  Adjective: AdjectiveIcon,
  Adverb: AdverbIcon,
  
  // 操作
  Check: CheckIcon,
  Close: CloseIcon,
  Bookmark: BookmarkIcon,
  Star: StarIcon,
  
  // 学习相关
  Book: BookIcon,
  Pen: PenIcon,
  Speaker: SpeakerIcon,
  
  // 界面导航
  Home: HomeIcon,
  Import: ImportIcon,
  Flashcard: FlashcardIcon,
  Quiz: QuizIcon,
  Summary: SummaryIcon,
  
  // 主题
  Sun: SunIcon,
  Moon: MoonIcon,
};

export default Icons;