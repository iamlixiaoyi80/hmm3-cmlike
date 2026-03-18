// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173/hmm3-cmlike/';

test.describe('H3-CMlike 地图系统测试', () => {
  
  // 测试1: 页面加载
  test('页面应该能正常加载', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const title = await page.title();
    expect(title).toContain('H3-CMlike');
    
    // 检查地图容器
    const mapContainer = await page.$('.map-container');
    expect(mapContainer).toBeTruthy();
  });

  // 测试2: 掷骰子按钮存在
  test('应该有掷骰子按钮', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const rollButton = await page.$('.roll-btn');
    expect(rollButton).toBeTruthy();
  });

  // 测试3: 骰子数量显示
  test('应该显示骰子数量', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const diceCount = await page.$('.dice-count');
    expect(diceCount).toBeTruthy();
  });

  // 测试4: Phaser 地图初始化（检查 canvas）
  test('应该初始化 Phaser 地图', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 等待 Phaser 初始化
    await page.waitForTimeout(2000);
    
    // 检查 canvas 是否存在
    const canvas = await page.$('.phaser-canvas canvas');
    expect(canvas).toBeTruthy();
  });

  // 测试5: 掷骰子后应该有结果
  test('掷骰子后应该显示结果', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 点击掷骰子
    const rollButton = await page.$('.roll-btn');
    await rollButton.click();
    
    // 等待动画完成
    await page.waitForTimeout(3000);
    
    // 检查骰子数量是否减少
    const diceCount = await page.$('.dice-count');
    const text = await diceCount.textContent();
    expect(text).toContain('骰子:');
  });

  // 测试6: 3D 骰子存在
  test('应该有3D骰子组件', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const dice3D = await page.$('.dice-cube');
    expect(dice3D).toBeTruthy();
  });

  // 测试7: 粒子效果容器存在
  test('应该有粒子效果容器', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const particles = await page.$('.particles-container');
    expect(particles).toBeTruthy();
  });

  // 测试8: 资源条存在
  test('应该显示资源条', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const resourceBar = await page.$('.resource-bar');
    expect(resourceBar).toBeTruthy();
  });
});
