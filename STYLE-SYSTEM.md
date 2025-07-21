# AiOne 样式系统说明

## 样式架构概览

我们将应用的样式系统重新组织，采用符合 Ant Design 设计规范的统一样式管理方案。

## 文件结构

```
src/
├── App.css                          # 主应用样式文件（重定向到 theme.css）
├── styles/
│   └── theme.css                    # 统一主题样式文件
└── components/
    ├── CustomTitleBar.tsx
    └── CustomTitleBar.css           # 组件专用样式（可选）
```

## 样式系统特点

### 1. 符合 Ant Design 设计规范
- 使用 Ant Design 的 CSS 变量命名规范
- 支持主题色系统
- 响应式设计
- 无障碍访问支持

### 2. 主题切换支持
- 亮色主题（`[data-theme="light"]`）
- 暗色主题（`[data-theme="dark"]`）
- 平滑的过渡动画

### 3. CSS 变量系统
```css
/* 主品牌色 */
--ant-primary-color: #11998e;
--ant-primary-color-hover: #38ada9;
--ant-primary-color-active: #0d7377;

/* 背景色 */
--ant-color-bg-container: 动态主题背景
--ant-color-bg-layout: 动态布局背景
--ant-color-text: 动态文本颜色
```

### 4. 组件样式增强
- 所有 Ant Design 组件都有统一的样式增强
- 现代圆角设计
- 精美的阴影效果
- 流畅的交互动画

## 使用指南

### 1. 全局样式
所有全局样式都在 `/src/styles/theme.css` 中管理，包括：
- 基础重置样式
- 应用布局样式
- Ant Design 组件样式增强
- 主题切换样式

### 2. 组件样式
对于需要特殊样式的组件，可以创建对应的 CSS 文件：
```tsx
// CustomTitleBar.tsx
import './CustomTitleBar.css';
```

### 3. 样式类名规范
- 使用 BEM 命名规范
- 组件前缀：如 `.custom-titlebar`
- 状态修饰符：如 `.titlebar-dragging`
- 响应式前缀：如 `.mobile-hidden`

## 主要改进

### 1. 统一管理
- 将分散的样式统一到 `theme.css`
- 消除重复代码
- 提高维护性

### 2. 设计规范
- 遵循 Ant Design Token 系统
- 统一的色彩体系
- 一致的间距和圆角

### 3. 性能优化
- 减少 CSS 文件数量
- 优化选择器性能
- 使用 CSS 变量减少重复

### 4. 开发体验
- 清晰的文件组织
- 详细的代码注释
- 易于扩展的架构

## 扩展指南

### 添加新主题
1. 在 `:root` 中定义新的颜色变量
2. 创建新的主题选择器：`[data-theme="new-theme"]`
3. 更新 ThemeManager 组件

### 添加新组件样式
1. 创建组件对应的 CSS 文件
2. 在组件中导入样式
3. 遵循现有的命名规范

### 自定义 Ant Design 组件
1. 在 `theme.css` 的对应部分添加样式
2. 使用 CSS 变量确保主题一致性
3. 添加必要的状态样式

## 注意事项

1. **优先使用 CSS 变量**：确保主题切换的一致性
2. **避免内联样式**：使用类名或 CSS 变量
3. **保持响应式**：所有样式都应考虑移动端适配
4. **性能考虑**：避免复杂的选择器和深层嵌套

这个样式系统为 AiOne 应用提供了现代、可维护且符合设计规范的样式基础。
