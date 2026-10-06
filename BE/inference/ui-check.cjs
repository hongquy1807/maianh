const {chromium}=require('./runtime/browser/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3000/html/Korean.html');
 await page.locator('[data-mode="chatbot"]').click();
 await page.locator('#chatInput').fill('<img src=x onerror=alert(1)>');await page.locator('#chatSend').click();
 await page.getByText('Bạn cần đăng nhập để trò chuyện.',{exact:true}).waitFor();
 if(await page.locator('#chatMessages img').count())throw Error('HTML injection');
 await page.locator('#chatReset').click();
 if(await page.locator('#chatMessages .message.user').count())throw Error('Reset failed');
 await page.screenshot({path:'BE/inference/runtime/ui-check.png',fullPage:true});
 if(errors.length)throw Error(JSON.stringify(errors));
 console.log('Browser PASS: no page errors, login required, literal text rendering, reset');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
