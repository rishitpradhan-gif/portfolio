import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'no-preference'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.bringToFront();await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
 await page.getByRole('heading',{name:'Rishit Pradhan.'}).waitFor();
 const sections=await page.locator('main>section').evaluateAll(nodes=>nodes.map(node=>node.id||'hero'));
 if(sections.join(',')!=='home,about,research,work,offscreen')throw Error('Wrong section order: '+sections);
 if(await page.locator('a[href*="ucbmun"]').count())throw Error('UCBMUN link remains');
 if(await page.getByText('Nexus',{exact:true}).count())throw Error('Nexus remains');
 await page.waitForFunction(()=>Boolean(document.querySelector('.aero-fish')?.style.transform));
 const fishBefore=await page.locator('.aero-fish').first().getAttribute('style');await page.waitForFunction(previous=>document.querySelector('.aero-fish')?.getAttribute('style')!==previous,fishBefore,{timeout:10000});
 await page.screenshot({path:'/tmp/portfolio-emerald-hero.png'});
 await page.getByRole('button',{name:'Unzip DNA strands'}).click();await page.getByRole('button',{name:'Join DNA strands'}).click();
 await page.locator('#research').scrollIntoViewIfNeeded();for(const institution of ['UCSF','CDPH','LBNL / JGI']){const row=page.locator('.research-summary').filter({hasText:institution});await row.click();if(await row.getAttribute('aria-expanded')!=='true')throw Error('Research did not expand: '+institution);}
 await page.screenshot({path:'/tmp/portfolio-research.png'});
 await page.locator('#work').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.documentElement.dataset.chapter==='work');await page.getByRole('tab',{name:'Try DreamIT preview',exact:true}).click();await page.getByRole('button',{name:'Add player',exact:true}).click();await page.getByText('4 demo players',{exact:true}).waitFor();
 await page.locator('.real-project-dreamit .island-scene').focus();await page.keyboard.press('ArrowRight');
 await page.getByRole('tab',{name:'Try Drip preview',exact:true}).click();
 const bpmBefore=Number(await page.locator('.real-project-drip .bpm-readout strong').innerText());await page.getByRole('slider',{name:'Simulated activity level'}).fill('90');const bpmAfter=Number(await page.locator('.real-project-drip .bpm-readout strong').innerText());if(bpmAfter<=bpmBefore)throw Error('Wearable data did not respond');
 await page.waitForTimeout(1000);await page.screenshot({path:'/tmp/portfolio-award-projects.png'});
 await page.locator('.real-project-drip').getByRole('button',{name:'Quick preview',exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Play tennis',exact:true}).click();await page.getByRole('button',{name:'Pause tennis',exact:true}).click();
 await page.screenshot({path:'/tmp/portfolio-offscreen.png'});
 await page.setViewportSize({width:390,height:844});await page.goto('http://localhost:3000');await page.waitForTimeout(300);await page.screenshot({path:'/tmp/portfolio-emerald-mobile.png'});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 await page.locator('#work').scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/portfolio-projects-mobile.png'});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://localhost:3000/#home',{waitUntil:'networkidle'});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForFunction(()=>window.scrollY===0);await page.waitForTimeout(800);const still=await page.locator('.aero-fish').first().getAttribute('style');await page.waitForTimeout(200);const reducedStill=still===await page.locator('.aero-fish').first().getAttribute('style');
 await page.getByRole('link',{name:'01 About me',exact:true}).click();await page.waitForFunction(()=>document.documentElement.dataset.chapter==='about');if(await page.getByRole('link',{name:'01 About me',exact:true}).getAttribute('aria-current')!=='location')throw Error('Chapter navigation did not activate');
 await page.goto('http://localhost:3000/projects/dreamit/',{waitUntil:'networkidle'});await page.getByRole('heading',{name:'DreamIT',exact:true,level:1}).waitFor();await page.locator('.project-photo img').evaluate(img=>img.decode());await page.screenshot({path:'/tmp/portfolio-dreamit-case.png'});if(await page.locator('.case-story section').count()!==3)throw Error('Missing project details');await page.getByRole('link',{name:'Next project Drip'}).click();await page.getByRole('heading',{name:'Drip',exact:true,level:1}).waitFor();await page.waitForFunction(()=>document.querySelector('.drip-recording video')?.readyState>=1);await page.screenshot({path:'/tmp/portfolio-drip-case-mobile.png'});if(await page.locator('a[href="https://drip-demo-dashboard.vercel.app/"]').count()<1)throw Error('Missing Drip demo link');const caseOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(caseOverflow)throw Error('Project page overflows on mobile');
 const duplicateIds=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(n=>n.id);return ids.filter((id,index)=>ids.indexOf(id)!==index)});
 console.log(JSON.stringify({errors,sections,mobileOverflow:overflow,reducedStill,duplicateIds,fish:await page.locator('.aero-fish').count()}));if(errors.length||overflow||!reducedStill||duplicateIds.length)process.exitCode=1;
}finally{await browser.close()}
