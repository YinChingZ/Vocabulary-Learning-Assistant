# 词汇学习助手 (Vocabulary Learning Assistant)

一个现代化、交互性强的词汇学习应用，帮助用户高效记忆和掌握单词。采用间隔重复算法优化学习效果，提供多种学习模式和直观的进度追踪。

## 📚 核心功能

- **词汇导入**：支持批量导入词汇，兼容多种格式（基础格式、带词性、带例句）
- **闪卡学习**：交互式记忆卡片，支持单词释义、例句、语音朗读
- **多样化测验**：填空题、选择题、拖拽匹配等多种题型
- **学习统计**：直观展示学习进度、记忆曲线和需要重点复习的单词
- **间隔重复算法**：基于SM-2算法智能安排复习计划，提高记忆效率

## 🛠️ 技术栈

- **前端框架**：React 19
- **路由管理**：React Router 7
- **状态管理**：React Context API
- **样式方案**：Tailwind CSS
- **动画实现**：Framer Motion
- **图表可视化**：Recharts
- **拖拽功能**：@hello-pangea/dnd
- **开发语言**：TypeScript
- **数据存储**：LocalStorage

## ✨ 特色

- **响应式设计**：完美适配桌面和移动设备
- **深色/浅色主题**：支持自动或手动切换
- **语音合成**：支持单词发音，帮助掌握正确读音
- **动态统计**：实时更新学习进度和记忆状态
- **离线可用**：所有数据存储在本地，无需网络连接
- **精美动画**：流畅的交互动效提升用户体验


## 📖 使用流程

1. 导入页：批量导入词汇或逐个添加
2. 闪卡页：通过卡片正反面快速记忆单词
3. 测验页：通过多种题型测试记忆效果
4. 总结页：查看学习统计和复习建议


**项目设计**

按照用户使用的典型流程，以下内容分为**导入页**、**闪卡页**、**测验页**、**总结页**四个页面的设计与技术实现细节。

---

## 1. 导入页（Import Page）

### 功能与流程

* 用户粘贴或上传“词语 – 释义”列表（100–120 项）
* 可选输入：助记短语、例句
* 点击“生成闪卡”后，数据保存在 LocalStorage（或后端）

### 技术实现

* **输入组件**：使用 React `<textarea>` 并绑定状态，通过正则或 `.split('\n')` 解析行。
* **助记/例句输入**：额外表单字段，可批量或单词级补充。
* **数据存储**：

  * 前端无后端方案：使用 `localStorage.setItem('cards', JSON.stringify(cards))`
  * 有后端方案：POST `/api/cards/import`，后端存储 PostgreSQL。
* **图标与助记占位**：导入完成后，为缺少助记或例句的卡片显示“生成助记”/“生成例句”按钮。

---

## 2. 闪卡页（Flashcard Page）

### 页面布局

* 居中单张卡片，宽度最大 `w-full max-w-md`，高度自适应内容。
* 底部两按钮：✅“记住了”  ❌“再看一次”

### 元素呈现

* **正面（Front）**：词语 + 发音按钮 🔈

  * 播放：Web Speech API (`SpeechSynthesisUtterance`)
* **背面（Back）**：

  * 释义 + 助记短语 + 简单图标（Heroicons 映射词性） + 例句
  * 同根/同义词标签切换

### 交互与动画

* **翻转动画**：`framer-motion` 3D 旋转（rotateY）、opacity 过渡

  ```jsx
  <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }}>…</motion.div>
  ```
* **手势与键盘**：

  * 左右滑动或摇一摇标记“记住了”/“再看一次”
  * 键盘左右←→、空格或 Enter 触发同样效果
* **图标与样式**：Tailwind `rounded-lg shadow-sm p-4 bg-card`

---

## 3. 测验页（Quiz Page）

### 页面布局

* 顶部：当前题号／总题数
* 中部：题干（释义或例句）
* 底部：输入框或选项网格

### 题型与技术

1. **填空（Type-In）**

   * `<input>` 监听 `onSubmit`，自动大小写忽略对比答案
2. **二选一（2-Choice）**

   * `<button>` 列表，两项随机位置
3. **拖拽（Drag & Drop）**

   * 使用 `react-beautiful-dnd` 实现词语卡拖至目标定义区

### 即时反馈

* 正确：高亮绿色边框 + 播放朗读
* 错误：高亮红色，显示正确答案并附例句
* 反馈动画：`framer-motion` 的 `whileTap` / `animate` 实现微动效

---

## 4. 总结页（Session Summary Page）

### 信息展示

* 文本统计："本次复习 20 词，记住 15 词，还需复习 5 词"
* **进度条**：Tailwind `h-2 bg-gradient-to-r` 渐变填充
* **折线图**：`recharts` 简易折线，展示正确率变化

### 技术实现

* **进度条**：动态设置 `style={{ width: `\${(remembered/total)\*100}%` }}`
* **图表**：

  ```jsx
  import { LineChart, Line, XAxis, YAxis } from 'recharts';
  <LineChart data={stats} width={300} height={150}><Line dataKey="accuracy" /></LineChart>
  ```

---

---

## 5. 整体美术风格描述

考虑到简洁与美感兼备，整体视觉风格将遵循以下描述体系：

1. **配色体系**

   * **主色**：纯白（#FFFFFF）和深灰（#1F2937）作为背景与文字的主色调，保证极佳的对比度与易读性。
   * **点缀色**：明亮蓝（#3B82F6）用于交互元素（按钮、链接、进度条），提供视觉引导。
   * **辅助色**：浅灰（#F3F4F6）、柔和黄（#FBBF24），用于卡片阴影、提示信息，营造层次感。

2. **排版体系**

   * **主字体**：无衬线字体（如 Inter 或 system-ui），在小屏与大屏均保持清晰。
   * **字号规模**：

     * 标题：24–32px（desktop）/20–24px（mobile）
     * 正文：16px（desktop）/14px（mobile）
   * **行高与字距**：1.5 倍行高，字距轻微放宽（letter-spacing: 0.5px）以增强可读性。

3. **图标与插画风格**

   * 采用线性图标（outline style），线条粗细统一为 2px，角为圆角，保持简约一致感。
   * 插画（若需）：使用单色扁平插画，配合点缀色，避免复杂阴影或渐变。

4. **留白与网格**

   * 充分使用留白增强重点模块的视觉呼吸感。
   * 页面采用 8px 网格（8px 为间距基准），重要容器内边距 16px–24px，模块间距 24px–32px。

5. **微动效与交互**

   * **按钮**：hover 使用 `box-shadow` 由 `shadow-sm` 过渡到 `shadow-md`，duration 200ms。
   * **输入框**：聚焦时下方边框颜色渐变至点缀色，duration 150ms。
   * **卡片翻转**：使用 `framer-motion`，动画曲线为 `ease-in-out`，duration 400ms，保持流畅自然。

6. **整体氛围**

   * 视觉简洁，信息层次分明，让用户专注核心记忆任务。
   * 通过统一的色彩、排版与小范围动效，营造轻快、专业且富有科技感的用户体验。

*以上为整体美术风格的描述体系，便于 UI 设计与规范制定。*

**项目目录**
src/
├── pages/                          # 页面容器组件
│   ├── ImportPage.tsx              # 导入页面
│   ├── FlashcardPage.tsx           # 闪卡学习页面
│   ├── QuizPage.tsx                # 测验页面
│   ├── SummaryPage.tsx             # 总结页面
│   └── NotFoundPage.tsx            # 404页面
│
├── components/                     # UI组件
│   ├── Import/                     # 导入相关组件
│   │   ├── ImportForm.tsx          # 导入表单
│   │   ├── BulkInputArea.tsx       # 批量输入区域
│   │   ├── FormatHelper.tsx        # 格式辅助提示
│   │   └── ParserUtils.ts          # 解析工具函数
│   │
│   ├── Flashcard/                  # 闪卡相关组件
│   │   ├── Card.tsx                # 卡片组件
│   │   ├── CardFront.tsx           # 卡片正面
│   │   ├── CardBack.tsx            # 卡片背面
│   │   ├── CardControls.tsx        # 卡片控制按钮
│   │   ├── CardAnimation.ts        # 卡片动画效果
│   │   └── SpeechPlayer.ts         # 语音播放功能
│   │
│   ├── Quiz/                       # 测验相关组件
│   │   ├── QuizProgress.tsx        # 进度显示
│   │   ├── TypeInQuiz.tsx          # 填空题组件
│   │   ├── ChoiceQuiz.tsx          # 选择题组件
│   │   ├── DragDropQuiz.tsx        # 拖拽题组件
│   │   └── FeedbackMessage.tsx     # 答题反馈组件
│   │
│   ├── Summary/                    # 总结相关组件
│   │   ├── ProgressBar.tsx         # 进度条
│   │   ├── StatsCard.tsx           # 统计卡片
│   │   ├── StatsChart.tsx          # 统计图表
│   │   └── RevisionList.tsx        # 需复习单词列表
│   │
│   └── common/                     # 通用组件
│       ├── Button.tsx              # 按钮
│       ├── Input.tsx               # 输入框
│       ├── Layout/                 # 布局组件
│       │   ├── MainLayout.tsx      # 主布局
│       │   ├── Header.tsx          # 页头
│       │   └── Footer.tsx          # 页脚
│       ├── Modal.tsx               # 模态框
│       ├── Spinner.tsx             # 加载指示器
│       └── Icons.tsx               # 图标组件
│
├── hooks/                          # 自定义hooks
│   ├── useLocalStorage.ts          # 本地存储hook
│   ├── useSpeechSynthesis.ts       # 语音合成hook
│   ├── useCardProgress.ts          # 卡片进度管理hook
│   └── useQuizGenerator.ts         # 测验生成hook
│
├── context/                        # 全局状态管理
│   ├── VocabularyContext.tsx       # 词汇数据上下文
│   ├── ProgressContext.tsx         # 学习进度上下文
│   ├── SettingsContext.tsx         # 用户设置上下文
│   └── ThemeContext.tsx            # 主题上下文
│
├── router/                         # 路由配置
│   └── index.tsx                   # 路由定义
│
├── styles/                         # 样式相关
│   ├── tailwind.css                # Tailwind入口文件
│   ├── animations.css              # 自定义动画
│   └── theme.ts                    # 主题变量
│
├── types/                          # TypeScript类型定义
│   ├── vocabulary.ts               # 词汇相关类型
│   ├── quiz.ts                     # 测验相关类型
│   ├── progress.ts                 # 进度相关类型
│   └── common.ts                   # 通用类型
│
├── utils/                          # 工具函数
│   ├── cardUtils.ts                # 卡片处理工具
│   ├── quizAlgorithm.ts            # 测验算法
│   ├── storageUtils.ts             # 存储工具
│   ├── formatters.ts               # 格式化工具
│   └── validators.ts               # 验证工具
│
├── constants/                      # 常量定义
│   ├── routes.ts                   # 路由常量
│   ├── storage-keys.ts             # 存储键名
│   └── quiz-settings.ts            # 测验设置常量
│
├── services/                       # 服务层（可选，如有后端）
│   ├── api.ts                      # API客户端
│   └── vocabulary-service.ts       # 词汇服务
│
├── __tests__/                      # 测试文件
│   ├── components/                 # 组件测试
│   ├── hooks/                      # Hook测试
│   └── utils/                      # 工具函数测试
│
├── assets/                         # 静态资源
│   ├── icons/                      # 图标资源
│   ├── images/                     # 图片资源
│   └── sounds/                     # 音效资源
│
├── App.tsx                         # 应用根组件
├── index.tsx                       # 应用入口
├── vite-env.d.ts                   # Vite类型声明
└── README.md                       # 项目说明文档
