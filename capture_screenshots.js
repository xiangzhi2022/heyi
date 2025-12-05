
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://127.0.0.1:5173'; // 连接到临时开发服务器
const OUTPUT_DIR = path.join(__dirname, 'ui_design_docs');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

const PAGES = [
    { name: '01_Home_Page', url: '/' },
    { name: '02_Marketplace_Page', url: '/marketplace' },
    { name: '03_Ranking_Page_Heat', url: '/ranking?tab=heat' },
    { name: '04_Ranking_Page_Revenue', url: '/ranking?tab=revenue' },
    { name: '05_Ranking_Page_Price', url: '/ranking?tab=price' },
    { name: '06_Asset_Detail_Page', url: '/assets/1' },
    { name: '07_Help_Center', url: '/help' },
];

console.log('脚本开始执行...');

// 自动滚动页面以触发懒加载图片
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100); // 每100ms滚动100px
        });
    });
    // 滚动回顶部，防止截图时头部被遮挡（虽然fullPage通常处理得好，但为了保险）
    await page.evaluate(() => window.scrollTo(0, 0));
    // 给图片一点额外的渲染时间
    await new Promise(r => setTimeout(r, 1000));
}

async function captureScreenshots() {
    console.log('准备启动浏览器...');
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: {
                width: 1920,  // 标准 Full HD 宽度
                height: 1080, // 标准 Full HD 高度
                deviceScaleFactor: 2  // 2倍设备像素比，提升清晰度
            },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('浏览器启动成功 - 使用 1920x1080 分辨率 + 2x 像素比（接近真实用户视口）');
        const page = await browser.newPage();

        console.log(`开始截图，目标地址: ${BASE_URL}`);

        // 截取浅色模式
        console.log('\n📸 开始截取浅色模式...\n');
        for (const pageInfo of PAGES) {
            const targetUrl = `${BASE_URL}${pageInfo.url}`;
            const outputPath = path.join(OUTPUT_DIR, `${pageInfo.name}.png`);

            try {
                console.log(`正在访问: ${pageInfo.name} (${targetUrl})...`);
                await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });

                // 确保是浅色模式
                await page.evaluate(() => {
                    document.documentElement.classList.remove('dark');
                });

                // 执行自动滚动以加载图片
                console.log('  正在滚动页面以加载图片...');
                await autoScroll(page);

                await page.screenshot({ path: outputPath, fullPage: true }); // 截取完整页面
                console.log(`✅ 已保存: ${pageInfo.name}.png`);
            } catch (error) {
                console.error(`❌ 截图失败 ${pageInfo.name}:`, error.message);
            }
        }

        // 截取暗色模式
        console.log('\n🌙 开始截取暗色模式...\n');
        for (const pageInfo of PAGES) {
            const targetUrl = `${BASE_URL}${pageInfo.url}`;
            const outputPath = path.join(OUTPUT_DIR, `${pageInfo.name}_dark.png`);

            try {
                console.log(`正在访问: ${pageInfo.name} [暗色] (${targetUrl})...`);
                await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });

                // 切换到暗色模式
                await page.evaluate(() => {
                    document.documentElement.classList.add('dark');
                });

                // 执行自动滚动以加载图片
                console.log('  正在滚动页面以加载图片...');
                await autoScroll(page);

                await page.screenshot({ path: outputPath, fullPage: true }); // 截取完整页面
                console.log(`✅ 已保存: ${pageInfo.name}_dark.png`);
            } catch (error) {
                console.error(`❌ 截图失败 ${pageInfo.name} [暗色]:`, error.message);
            }
        }

        await browser.close();
        console.log('\n🎉 所有截图已完成！请查看 ui_design_docs 文件夹。');
        console.log(`📊 共生成 ${PAGES.length * 2} 张截图（${PAGES.length} 张浅色 + ${PAGES.length} 张暗色）`);
    } catch (error) {
        console.error('❌ 发生严重错误:', error);
    }
}

captureScreenshots();

