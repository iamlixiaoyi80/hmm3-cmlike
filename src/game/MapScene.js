import Phaser from 'phaser'
import { TileType } from '../stores/map.js'

// 地格配置
const TILE_CONFIG = {
  size: 60,
  padding: 10,
  colors: {
    [TileType.CASTLE]: 0x8B4513,
    [TileType.RESOURCE]: 0xFFD700,
    [TileType.CREATURE]: 0x32CD32,
    [TileType.TREASURE]: 0x9400D3,
    [TileType.CHEST]: 0xFF8C00,
    [TileType.ATTACK]: 0xFF4444,
    [TileType.SPECIAL]: 0x00CED1,
    [TileType.EMPTY]: 0x666666
  },
  icons: {
    [TileType.CASTLE]: '🏰',
    [TileType.RESOURCE]: '💰',
    [TileType.CREATURE]: '🐉',
    [TileType.TREASURE]: '💎',
    [TileType.CHEST]: '🎁',
    [TileType.ATTACK]: '⚔️',
    [TileType.SPECIAL]: '✨',
    [TileType.EMPTY]: '·'
  }
}

export class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MapScene' })
    this.tileGraphics = []
    this.tileTexts = []
    this.highlightIndicator = null
  }
  
  create() {
    // 设置背景
    this.cameras.main.setBackgroundColor('#1a1a2a')
    
    // 创建地格
    this.createTiles()
    
    // 创建高亮指示器
    this.createHighlightIndicator()
    
    // 监听窗口大小变化
    this.scale.on('resize', this.handleResize, this)
  }
  
  createTiles() {
    const mapStore = this.game.registry.get('mapStore')
    if (!mapStore) return
    
    const tiles = mapStore.tiles
    const mapSize = tiles.length
    
    // 计算环形布局
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2
    const radiusX = Math.min(centerX - 80, 300)
    const radiusY = Math.min(centerY - 60, 200)
    
    for (let i = 0; i < mapSize; i++) {
      const angle = (i / mapSize) * Math.PI * 2 - Math.PI / 2
      const x = centerX + Math.cos(angle) * radiusX
      const y = centerY + Math.sin(angle) * radiusY
      
      // 创建地格图形
      const tile = tiles[i]
      const graphics = this.add.graphics()
      
      // 绘制地格
      this.drawTile(graphics, x, y, tile.type, i === 0)
      
      // 存储位置信息
      graphics.tileData = { id: i, x, y, type: tile.type }
      this.tileGraphics.push(graphics)
      
      // 创建图标文字
      const icon = this.add.text(x, y, TILE_CONFIG.icons[tile.type], {
        fontSize: '20px'
      }).setOrigin(0.5)
      this.tileTexts.push(icon)
    }
  }
  
  drawTile(graphics, x, y, type, isCastle = false) {
    const size = TILE_CONFIG.size
    const color = TILE_CONFIG.colors[type] || 0x666666
    
    // 清除之前的绘制
    graphics.clear()
    
    // 绘制阴影
    graphics.fillStyle(0x000000, 0.3)
    graphics.fillRoundedRect(x - size/2 + 3, y - size/2 + 3, size, size, 10)
    
    // 绘制地格背景
    graphics.fillStyle(color, 1)
    graphics.fillRoundedRect(x - size/2, y - size/2, size, size, 10)
    
    // 城堡特殊边框
    if (isCastle) {
      graphics.lineStyle(3, 0xFFFFFF, 1)
      graphics.strokeRoundedRect(x - size/2, y - size/2, size, size, 10)
    }
    
    // 绘制高光
    graphics.fillStyle(0xFFFFFF, 0.2)
    graphics.fillRoundedRect(x - size/2 + 5, y - size/2 + 5, size - 10, size/3, 5)
  }
  
  createHighlightIndicator() {
    // 创建高亮圈
    this.highlightIndicator = this.add.graphics()
    this.highlightIndicator.setVisible(false)
  }
  
  // 高亮指定地格
  async highlightTile(tileId) {
    if (tileId < 0 || tileId >= this.tileGraphics.length) return
    
    const tileGraphic = this.tileGraphics[tileId]
    const { x, y } = tileGraphic.tileData
    
    // 显示高亮
    this.highlightIndicator.clear()
    this.highlightIndicator.setVisible(true)
    this.highlightIndicator.lineStyle(4, 0xFFFFFF, 1)
    this.highlightIndicator.strokeCircle(x, y, TILE_CONFIG.size / 2 + 10)
    
    // 脉冲动画
    return new Promise(resolve => {
      this.tweens.add({
        targets: this.highlightIndicator,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 0.5,
        duration: 300,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          resolve()
        }
      })
    })
  }
  
  // 隐藏高亮
  hideHighlight() {
    if (this.highlightIndicator) {
      this.highlightIndicator.setVisible(false)
    }
  }
  
  // 地格触发动画
  async playTileEvent(tileId, eventType) {
    if (tileId < 0 || tileId >= this.tileGraphics.length) return
    
    const tileGraphic = this.tileGraphics[tileId]
    const { x, y } = tileGraphic.tileData
    
    // 创建粒子效果
    const particles = this.add.particles(x, y, 'particle', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      lifespan: 800,
      blendMode: 'ADD',
      emitting: false
    })
    
    // 发射粒子
    particles.explode(20)
    
    // 地格放大动画
    return new Promise(resolve => {
      this.tweens.add({
        targets: tileGraphic,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 200,
        yoyo: true,
        onComplete: () => {
          particles.destroy()
          resolve()
        }
      })
    })
  }
  
  handleResize() {
    // 重新计算布局
    this.tileGraphics.forEach(g => g.destroy())
    this.tileTexts.forEach(t => t.destroy())
    this.tileGraphics = []
    this.tileTexts = []
    this.createTiles()
  }
}

export default MapScene
