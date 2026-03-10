# H3-CMlike

> 英雄无敌：王国征服 - CMlike 游戏项目

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 技术栈

- Vue 3 + Vite
- Phaser 3 (游戏引擎)
- Pinia (状态管理)
- GSAP (动画)

## 项目结构

```
src/
├── components/     # Vue 组件
│   ├── DicePanel.vue
│   └── ResourceBar.vue
├── game/           # Phaser 游戏逻辑
├── stores/         # Pinia 状态
└── App.vue         # 根组件
```

## MVP 功能

- [x] 骰子系统（可操作）
- [ ] 地图事件
- [ ] 城堡建设
- [ ] 英雄系统
- [ ] 生物系统

## 设计文档

详见 [DESIGN.md](./DESIGN.md)
