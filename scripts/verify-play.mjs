import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const errors=[];try{
 const page=await browser.newPage({viewport:{width:1440,height:1050},deviceScaleFactor:1,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:3000/projects/morphogenesis/',{waitUntil:'networkidle'});
 console.log('lab loaded');await page.getByRole('heading',{name:'Morphogenesis',exact:true,level:1}).waitFor();
 const pattern=page.locator('.pattern-stage canvas');const initial=await pattern.evaluate(c=>c.toDataURL());
 await page.getByRole('button',{name:'Grow pattern',exact:true}).click();await page.waitForFunction(before=>document.querySelector('.pattern-stage canvas').toDataURL()!==before,initial);
 await page.waitForTimeout(2300);await page.getByRole('button',{name:'Pause growth',exact:true}).click();const still=await pattern.evaluate(c=>c.toDataURL());await page.waitForTimeout(200);if(still!==await pattern.evaluate(c=>c.toDataURL()))throw Error('Pattern pause failed');
 await writeFile('public/images/morphogenesis.png',Buffer.from(still.split(',')[1],'base64'));
 const rect=await pattern.boundingBox();await page.mouse.move(rect.x+rect.width*.4,rect.y+rect.height*.4);await page.mouse.down();await page.mouse.move(rect.x+rect.width*.65,rect.y+rect.height*.5,{steps:15});await page.mouse.up();if(still===await pattern.evaluate(c=>c.toDataURL()))throw Error('Painting failed');
 await page.getByRole('slider',{name:'Feed'}).fill('0.045');await page.getByRole('slider',{name:'Decay'}).fill('0.06');
 await page.getByRole('button',{name:'Spots',exact:true}).click();if(await page.getByRole('button',{name:'Spots',exact:true}).getAttribute('aria-pressed')!=='true')throw Error('Preset failed');
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Save pattern as PNG'}).click();if((await download).suggestedFilename()!=='morphogenesis.png')throw Error('Export failed');
 await page.screenshot({path:'/tmp/morphogenesis-desktop.png',fullPage:true});
 console.log('lab checks passed');await page.goto('http://localhost:3000/#offscreen',{waitUntil:'networkidle'});await page.locator('.rally-game').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);await page.getByRole('button',{name:'Play tennis',exact:true}).click();console.log('tennis started');
 const court=page.locator('.game-stage canvas'),box=await court.boundingBox();
 for(let i=0;i<55;i++){const x=await court.evaluate(c=>{const ctx=c.getContext('2d'),d=ctx.getImageData(0,80,800,355).data;for(let j=0;j<d.length;j+=4)if(d[j]===229&&d[j+1]===250&&d[j+2]===128)return (j/4)%800;return 400});await page.mouse.move(box.x+x/800*box.width,box.y+box.height*.8);await page.waitForTimeout(65)}
 const score=Number(await page.locator('.game-scoreboard strong').first().innerText());if(score<1)throw Error('Tennis return collision failed');
 await court.focus();await page.keyboard.press('Space');await page.getByRole('heading',{name:'Catch your breath.'}).waitFor();await page.getByRole('button',{name:'Resume rally',exact:true}).click();await page.getByRole('button',{name:'Pause tennis',exact:true}).click();
 await page.screenshot({path:'/tmp/tennis-desktop.png'});
 await page.setViewportSize({width:390,height:844});await page.locator('.rally-game').scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/tennis-mobile.png'});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Home overflow');
 await page.goto('http://localhost:3000/projects/morphogenesis/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Add seeds'}).click();await page.getByRole('button',{name:'Grow pattern'}).click();await page.screenshot({path:'/tmp/morphogenesis-mobile.png',fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Lab overflow');
 console.log(JSON.stringify({errors,tennisScore:score,painting:true,presets:true,export:true,mobileOverflow:false}));if(errors.length)process.exitCode=1;
}finally{await browser.close()}
