'use strict';
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright-core');
const root=path.resolve(__dirname,'..'),out=process.env.SITE_CHECK_OUT||path.join(require('node:os').tmpdir(),'kebsik-site-screens'),port=Number(process.env.SITE_CHECK_PORT||4869);
fs.mkdirSync(out,{recursive:true});
const srv=http.createServer((q,r)=>{const u=new URL(q.url,'http://localhost');let f=path.resolve(root,'.'+decodeURIComponent(u.pathname));if(!(f===root||f.startsWith(root+path.sep))){r.writeHead(403);r.end();return;}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);r.end();return;}r.setHeader('content-type',f.endsWith('.png')?'image/png':f.endsWith('.jpg')?'image/jpeg':f.endsWith('.html')?'text/html; charset=utf-8':'text/plain');fs.createReadStream(f).pipe(r);});
(async()=>{await new Promise(r=>srv.listen(port,r));let b;const checks=[];
try{b=await chromium.launch({executablePath:process.env.CHROMIUM||'/usr/bin/chromium'});
for(const lang of ['pl','tr','en','de'])for(const test of [false,true])for(const width of [360,390]){
 const route=(test?'/test/':'/')+(lang==='pl'?'':lang+'/');const p=await b.newPage({viewport:{width,height:844},deviceScaleFactor:1});const errors=[],external=[],bad=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!r.url().startsWith(`http://localhost:${port}`))external.push(r.url());});p.on('response',r=>{if(r.status()>=400)bad.push(r.url());});
 await p.goto(`http://localhost:${port}${route}`,{waitUntil:'networkidle'});await p.locator('img').evaluateAll(xs=>Promise.all(xs.map(x=>x.decode())));
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(bad,[]);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow '+route+width);
 const actions=await p.locator('a.cta').evaluateAll(xs=>xs.map(x=>{const b=x.getBoundingClientRect(),s=getComputedStyle(x);return {h:b.height,w:b.width,color:s.color,background:s.backgroundColor,covered:!x.contains(document.elementFromPoint(b.x+b.width/2,b.y+b.height/2))};}));
 const luminance=s=>{const rgb=s.match(/[\d.]+/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
 for(const a of actions){assert.ok(a.h>=44&&a.w>=44);const a1=luminance(a.color),a2=luminance(a.background);assert.ok((Math.max(a1,a2)+.05)/(Math.min(a1,a2)+.05)>=4.5,'CTA contrast');}
 if(test){assert.equal(actions.length,2);assert.ok(actions.every(a=>!a.covered),'Test CTA covered');assert.equal(await p.locator('script,form,iframe').count(),0);}
 await p.screenshot({path:path.join(out,`${lang}-${test?'test':'home'}-${width}.png`),fullPage:true});
 checks.push({lang,route,width,overflow:false,errors:0,externalRequests:0,brokenResources:0,ctaContrastPassed:true});await p.close();console.log('PASS',route,width);
}
const compatibility=await b.newPage();await compatibility.goto(`http://localhost:${port}/?z=ulotka`,{waitUntil:'networkidle'});assert.equal(new URL(compatibility.url()).pathname,'/');await compatibility.goto(`http://localhost:${port}/#tr`,{waitUntil:'networkidle'});await compatibility.waitForURL(`http://localhost:${port}/tr/`);await compatibility.close();
fs.writeFileSync(path.join(out,'site-browser-checks.json'),JSON.stringify({checks,passed:checks.length,flyerQrUnchanged:true,legacyLanguageLinkWorks:true},null,2)+'\n');
}finally{await b?.close();srv.close();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
