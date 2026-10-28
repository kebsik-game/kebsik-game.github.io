"""Check localized crawlable pages and privacy-preserving test links without network access."""
from pathlib import Path
from html.parser import HTMLParser
import json,re,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
BASE='https://kebsik-game.github.io'
LANGS=('pl','tr','en','de')
class Page(HTMLParser):
 def __init__(self):super().__init__();self.tags=[];self.text=[]
 def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
 def handle_data(self,data):self.text.append(data)
def clean(s):return re.sub(r'\s+',' ',s).strip()
checks=[]
for test in (False,True):
 for lang in LANGS:
  route=('/test/' if test else '/')+('' if lang=='pl' else lang+'/')
  file=ROOT/route.lstrip('/')/'index.html';s=file.read_text();p=Page();p.feed(s)
  assert p.tags[0]==('html',{'lang':lang})
  links=[a for t,a in p.tags if t=='link'];canon=[a['href'] for a in links if a.get('rel')=='canonical'];assert canon==[BASE+route]
  alt={a.get('hreflang'):a.get('href') for a in links if a.get('rel')=='alternate'}
  for l in LANGS:assert alt[l]==BASE+('/test/' if test else '/')+('' if l=='pl' else l+'/')
  assert alt['x-default']==BASE+('/test/' if test else '/')
  assert not any(t in ('iframe','form') for t,a in p.tags)
  assert not any(a.get('src') for t,a in p.tags if t=='script')
  scripts=re.findall(r'<script(?:[^>]*)>(.*?)</script>',s,re.S)
  if test:assert not scripts
  else:
   extra=[x for x in scripts if not x.lstrip().startswith('{')]
   assert extra==(['const oldLanguage=location.hash.slice(1);if(["en","de","tr"].includes(oldLanguage))location.replace("/"+oldLanguage+"/");'] if lang=='pl' else [])
  for tag,attrs in p.tags:
   if tag in ('img','script') and attrs.get('src'):
    assert attrs['src'].startswith('/') and (ROOT/attrs['src'].lstrip('/')).is_file()
  emails=re.findall(r'[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}',s);assert set(emails)<= {'kayacidev@gmail.com'}
  if test:
   buttons=[a for t,a in p.tags if t=='a' and a.get('class')=='cta'];assert len(buttons)==2
   assert buttons[0]['href']=='https://groups.google.com/g/kebsik-closed-testing-2026'
   assert buttons[1]['href']=='https://play.google.com/apps/testing/com.kebsik.game'
   assert 'Android' in s and 'iPhone' in s and '14' in s
  else:
   schema=json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>',s,re.S)[1]);game=next(x for x in schema['@graph'] if 'MobileApplication' in x.get('@type',[]));assert game['creativeWorkStatus']=='Beta' and game['identifier']['value']=='com.kebsik.game'
   faq=next(x for x in schema['@graph'] if x.get('@type')=='FAQPage')['mainEntity']
   questions=[clean(re.sub('<.*?>','',x)) for x in re.findall(r'<dt>(.*?)</dt>',s,re.S)]
   answers=[clean(re.sub('<.*?>','',x)) for x in re.findall(r'<dd>(.*?)</dd>',s,re.S)]
   assert questions==[clean(x['name']) for x in faq]
   assert answers==[clean(x['acceptedAnswer']['text']) for x in faq]
  checks.append({'route':route,'passed':True})
sitemap=ET.fromstring((ROOT/'sitemap.xml').read_text());urls=[x.text for x in sitemap.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')];assert len(urls)==len(set(urls))==10
assert all((ROOT/u.removeprefix(BASE).lstrip('/')/ 'index.html').is_file() if u.endswith('/') else (ROOT/u.removeprefix(BASE).lstrip('/')).is_file() for u in urls)
print(json.dumps({'pages':checks,'sitemapUrls':len(urls),'externalScripts':0,'forms':0,'personalEmails':0},ensure_ascii=False,indent=2))
