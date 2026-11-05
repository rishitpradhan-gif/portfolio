import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const context=await browser.newContext({viewport:{width:1440,height:960},recordVideo:{dir:'/tmp/drip-recording',size:{width:1200,height:800}}});
 const page=await context.newPage();await page.goto('https://drip-demo-dashboard.vercel.app/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'START TRACKING',exact:true}).click({timeout:60000});await page.getByRole('button',{name:'Heatmap',exact:true}).waitFor();
 console.log('options',await page.locator('select option').allTextContents());
 await page.locator('select').selectOption({label:'7D'});await page.getByRole('button',{name:'Heatmap',exact:true}).click();await page.waitForTimeout(1500);
 const start=Date.now();await page.screenshot({path:'/tmp/drip-heatmap.png'});await page.waitForTimeout(1800);
 await page.getByRole('button',{name:'Chart',exact:true}).last().click();await page.waitForTimeout(1500);
 for(let i=0;i<30;i++){await page.mouse.move(180+i*35,440+Math.sin(i*.2)*55);await page.waitForTimeout(100)}
 await page.locator('select').selectOption({label:'30D'});await page.waitForTimeout(1000);await page.getByRole('button',{name:'Heatmap',exact:true}).click();await page.waitForTimeout(2500);
 const seconds=(Date.now()-start)/1000;const video=page.video();await context.close();await writeFile('/tmp/drip-recording/info.json',JSON.stringify({path:await video.path(),seconds}));console.log({seconds,path:await video.path()});
}finally{await browser.close()}
