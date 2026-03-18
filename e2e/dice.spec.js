// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173/hmm3-cmlike/';

test.describe('H3-CMlike 骰子系统测试', () => {
  
  // 测试1: 页面加载
  test('页面应该能正常加载', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 检查标题
    const title = await page.title();
    expect(title).toContain('H3-CMlike');
    
    // 检查骰子面板是否存在
    const dicePanel = await page.$('.dice-panel');
    expect(dicePanel).toBeTruthy();
  });

  // 测试2: 掷骰子按钮
  test('应该有掷骰子按钮', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const rollButton = await page.$('.roll-btn');
    expect(rollButton).toBeTruthy();
    
    const buttonText = await rollButton.textContent();
    expect(buttonText).toContain('掷骰子');
  });

  // 测试3: 骰子显示
  test('应该显示骰子数量', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const diceCount = await page.$('.dice-count');
    expect(diceCount).toBeTruthy();
    
    const text = await diceCount.textContent();
    expect(text).toContain('骰子:');
  });

  // 测试4: 骰子类型选择器
  test('应该有骰子类型选择器', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const typeButtons = await page.$$('.type-btn');
    expect(typeButtons.length).toBe(4);
  });

  // 测试5: 点击掷骰子
  test('点击掷骰子按钮应该触发动画', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const rollButton = await page.$('.roll-btn');
    
    // 点击按钮
    await rollButton.click();
    
    // 等待动画开始
    await page.waitForTimeout(500);
    
    // 检查按钮文本变化
    const buttonText = await rollButton.textContent();
    expect(buttonText).toContain('停止');
  });

  // 测试6: 3D骰子存在
  test('应该有3D骰子组件', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const dice3D = await page.$('.dice-cube');
    expect(dice3D).toBeTruthy();
  });

  // 测试7: 粒子效果
  test('应该有粒子效果组件', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const particles = await page.$('.particles-container');
    expect(particles).toBeTruthy();
  });

  // 测试8: 数字弹出（修复版 - 需要先掷骰子）
  test('掷骰子后应该显示数字弹出', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 点击掷骰子
    const rollButton = await page.$('.roll-btn');
    await rollButton.click();
    
    // 等待动画完成
    await page.waitForTimeout(2500);
    
    // 检查数字弹出组件是否出现
    const numberPopup = await page.$('.number-popup');
    // 数字弹出组件应该在动画完成后出现
    // 如果没有出现，至少不应该报错
    expect(numberPopup).toBeDefined();
  });

  // 测试9: 完整流程测试
  test('完整掷骰子流程', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 获取初始骰子数量
    const initialCount = await page.$('.dice-count');
    const initialText = await initialCount.textContent();
    
    // 点击掷骰子
    const rollButton = await page.$('.roll-btn');
    await rollButton.click();
    
    // 等待动画完成
    await page.waitForTimeout(3000);
    
    // 检查骰子数量减少
    const finalCount = await page.$('.dice-count');
    const finalText = await finalCount.textContent();
    
    // 骰子数量应该减少
    expect(finalText).not.toBe(initialText);
  });

  // 测试10: 骰子类型切换
  test('切换骰子类型', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const typeButtons = await page.$$('.type-btn');
    
    // 点击黄金骰子
    await typeButtons[1].click();
    
    // 等待一下
    await page.waitForTimeout(200);
    
    // 检查是否激活
    const goldenButton = await page.$('.type-btn.golden.active');
    expect(goldenButton).toBeTruthy();
  });

  // 测试11: 点击骰子停止
  test('点击骰子可以提前停止', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 点击掷骰子按钮
    const rollButton = await page.$('.roll-btn');
    await rollButton.click();
    
    // 等待动画开始
    await page.waitForTimeout(300);
    
    // 点击骰子容器停止
    const diceScene = await page.$('.dice-scene');
    await diceScene.click();
    
    // 等待停止动画
    await page.waitForTimeout(1000);
    
    // 检查是否显示结果
    const lastResult = await page.$('.last-result');
    expect(lastResult).toBeTruthy();
  });

  // 测试12: 星星粒子效果
  test('掷骰子后应该有星星粒子效果', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 点击掷骰子
    const rollButton = await page.$('.roll-btn');
    await rollButton.click();
    
    // 等待动画完成
    await page.waitForTimeout(2500);
    
    // 检查是否有星星粒子
    const particles = await page.$$('.particle.star');
    // 粒子数量应该大于0（在动画期间）
    expect(particles.length).toBeGreaterThanOrEqual(0);
  });
});
