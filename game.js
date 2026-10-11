const VW=320,VH=192,SC=2,DIR={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]},SOLID='bpmtcxlekfgXvahqjodRynTsSH';
const cv=document.getElementById('c'),cx=cv.getContext('2d');cx.imageSmoothingEnabled=false;
const tl=document.createElement('canvas');tl.width=VW*SC;tl.height=VH*SC;const tc=tl.getContext('2d',{willReadFrequently:true}),TX=[];
function mw(s,z){tc.font='bold '+z*SC+'px monospace';return tc.measureText(s).width/SC}
function T2(s,x,y,c,z,al){TX.push([s,x,y,c,z,al||'left'])}
function flush(){if(!TX.length)return;tc.clearRect(0,0,tl.width,tl.height);tc.textBaseline='top';for(const[s,x,y,c,z,al]of TX){tc.font='bold '+z*SC+'px monospace';tc.textAlign=al;tc.fillStyle=c;tc.fillText(s,x*SC,y*SC)}TX.length=0;const d=tc.getImageData(0,0,tl.width,tl.height),a=d.data;for(let i=3;i<a.length;i+=4)a[i]=a[i]>110?255:0;tc.putImageData(d,0,0);cx.setTransform(1,0,0,1,0,0);cx.drawImage(tl,0,0);cx.setTransform(SC,0,0,SC,0,0)}
const G={cin:0,mode:'intro',t:0,sel:1,note:0,map:'home',stage:0,flags:{},done:{},dark:0,fade:0,fadeTo:0,npcPos:{},p:{x:0,y:0,dir:'down',f:0,st:0}},keys={};
function setStage(n){G.stage=n;G.dark=Story.dark?Story.dark(n):Math.min(.5,Math.max(0,n-10)*.014);Aud.tension(G.dark)}
function loadMap(id,tx,ty,silent){G.map=id;build(Maps[id]);G.p.x=tx*T+8;G.p.y=ty*T+14;Aud.sfx('door');if(!silent&&G.mode=='play')runTrig()}
function runTrig(){const t=Story.trig.find(t=>t.m==G.map&&t.s==G.stage&&!G.done[t.id]&&(!t.f||G.flags[t.f]));if(t){G.done[t.id]=1;Scn.run(Story.sc[t.id])}}
function useStory(k){if(k=='ctw'){Maps=CTW.Maps;Npcs=CTW.Npcs;Story=CTW.Story;Save.k=Save.keys[2]}else{Maps=TBB.Maps;Npcs=TBB.Npcs;Story=TBB.Story;Save.k=Save.keys[1]}G.story=k}
function startStory(i){useStory(i==2?'ctw':'tbb');newGame()}
function newGame(){Object.assign(G,{cin:0,stage:0,flags:{},done:{},npcPos:{},fade:0,fadeTo:0,mode:'play'});setStage(0);const s=Story.start||{map:'home',tx:9,ty:5};document.body.classList.add('playing');loadMap(s.map,s.tx,s.ty)}
function cont(i){useStory(i==2?'ctw':'tbb');document.body.classList.add('playing');const s=Save.get();if(!s)return;Object.assign(G,{cin:0,flags:s.flags,done:s.done,npcPos:s.npcPos||{},mode:'play',fade:0,fadeTo:0});setStage(s.stage);loadMap(s.map,0,0,true);G.p.x=s.x;G.p.y=s.y;runTrig()}
function npcs(){return Maps[G.map].npcs.filter(n=>n.s(G.stage,G.flags)).map(n=>{const o=G.npcPos[n.id];return o?{...n,x:o[0],y:o[1]}:n})}
function tileAt(x,y){const r=Maps[G.map].g[y];return r&&r[x]||'#'}
function blocked(x,y){const ns=npcs();for(const[ox,oy]of[[-5,-5],[5,-5],[-5,0],[5,0]]){const tx=Math.floor((x+ox)/T),ty=Math.floor((y+oy)/T),c=tileAt(tx,ty);if(c=='#'||SOLID.includes(c)||ns.some(n=>n.x==tx&&n.y==ty))return true}return false}
function press(k){Aud.init();if(k=='m'||k=='M')return Aud.toggle();
if(G.mode=='intro'){if(k=='Enter'||k=='click'||k==' ')G.mode='menu'}
else if(G.mode=='menu'){if(k=='ArrowUp')G.sel=(G.sel+2)%3;else if(k=='ArrowDown')G.sel=(G.sel+1)%3;else if(k=='Enter'||k==' '||k=='click'){if(G.sel!=1)G.note=2;else startStory(1)}else if((k=='c'||k=='C')&&Save.has(G.sel))cont(G.sel)}
else if(G.mode=='end'){if(k=='Enter'||k=='click'){G.mode='menu';document.body.classList.remove('playing')}}
else if(G.mode=='scene'){if([' ','Enter','e','E','click'].includes(k))Dlg.adv()}
else if(k=='e'||k=='E'||k=='Enter')interact()}
function target(){const p=G.p,d=DIR[p.dir],ns=npcs();for(const o of[0,-7,7]){const tx=p.x+d[0]*12+(d[1]?o:0),ty=p.y-6+d[1]*12+(d[0]?o:0);
const n=ns.find(n=>Math.abs(n.x*T+8-tx)<10&&Math.abs(n.y*T+8-ty)<10);if(n)return{n};
const c=tileAt(Math.floor(tx/T),Math.floor(ty/T));if(Story.tile[c])return{c}}
if(G.map=='junk'&&G.stage==9){const a=Maps.junk.arm;if(Math.hypot(p.x-a[0],p.y-6-a[1])<28)return{c:'X'}}return null}
function interact(){const t=target();if(!t)return;Aud.sfx('use');
if(t.n)return Scn.run(Story.talk(t.n.id,G.stage,G.flags)||[Npcs[t.n.id].n+'|...']);
let o=Story.tile[t.c];if(typeof o=='function')o=o(G.stage);if(o)Scn.run(typeof o=='string'?['|'+o]:o)}
function upd(dt){if(G.mode=='intro'){G.t+=dt;if(G.t>7.4)G.mode='menu'}if(G.note>0)G.note-=dt;Dlg.upd(dt);Scn.upd(dt);G.fade+=(G.fadeTo-G.fade)*Math.min(1,dt*4);if(G.mode!='play')return;
const p=G.p;let dx=0,dy=0;if(keys.ArrowLeft||keys.a||keys.A)dx--;if(keys.ArrowRight||keys.d||keys.D)dx++;if(keys.ArrowUp||keys.w||keys.W)dy--;if(keys.ArrowDown||keys.s||keys.S)dy++;
if(dx||dy){if(dx)p.dir=dx<0?'left':'right';else p.dir=dy<0?'up':'down';const s=(G.flags.rusty?36:55)*dt/((dx&&dy)?1.41:1);
if(!blocked(p.x+dx*s,p.y))p.x+=dx*s;if(!blocked(p.x,p.y+dy*s))p.y+=dy*s;p.f+=dt*7;p.st+=dt;if(p.st>.3){p.st=0;Aud.sfx('step')}}
const ec=tileAt(Math.floor(p.x/T),Math.floor((p.y-1)/T));if(ec=='D'||ec=='U'||ec=='V'||ec=='W'){const fn=Story.exit[G.map+(ec=='U'?'_u':ec=='V'?'_v':ec=='W'?'_w':'')],r=fn?fn(G.stage,G.flags):{msg:msg("Agora não.")};
if(r.msg){const bx=DIR[p.dir][0],by=DIR[p.dir][1];for(let i=0;i<48;i++){p.x-=bx;p.y-=by;const c=tileAt(Math.floor(p.x/T),Math.floor((p.y-1)/T));if('DUVW'.indexOf(c)<0&&!blocked(p.x,p.y))break}Scn.run(r.msg)}else{if(r.set!=null)setStage(r.set);loadMap(r.to,r.tx,r.ty);G.fade=1;G.fadeTo=0;runTrig()}}}
function spr(x,y,pal,dir,f,idle){const b=Math.floor(f)%2,r=idle?0:1;cx.fillStyle='rgba(0,0,0,.35)';cx.fillRect(x-5,y-1,10,2);
cx.fillStyle=pal.pants;cx.fillRect(x-4,y-5,3,5-(b&&r?1:0));cx.fillRect(x+1,y-5,3,5-(!b&&r?1:0));cx.fillStyle=pal.shirt;cx.fillRect(x-4,y-10,8,6);
cx.fillStyle=pal.skin;cx.fillRect(x-4,y-17,8,7);cx.fillStyle=pal.hair;
if(dir=='up')cx.fillRect(x-4,y-17,8,7);else{cx.fillRect(x-4,y-18,8,3);if(dir=='left')cx.fillRect(x+1,y-17,3,5);if(dir=='right')cx.fillRect(x-4,y-17,3,5)}
cx.fillStyle='#222';if(dir=='down'){cx.fillRect(x-2,y-14,1,2);cx.fillRect(x+1,y-14,1,2)}else if(dir=='left')cx.fillRect(x-3,y-14,1,2);else if(dir=='right')cx.fillRect(x+2,y-14,1,2);
if(pal.k=='doll'){cx.fillStyle='#e0334c';cx.fillRect(x-3,y-23,6,5);if(dir!='up'){cx.fillRect(x-4,y-12,2,1);cx.fillRect(x+2,y-12,2,1);cx.fillRect(x,y-12,1,1)}}}
const ELE=new Image();ELE.src='assets/eleanor.png';
function eleanor(x,y,dir){cx.fillStyle='rgba(0,0,0,.35)';cx.fillRect(x-6,y-1,12,2);if(ELE.complete&&ELE.naturalWidth)cx.drawImage(ELE,Math.round(x-ELE.naturalWidth/2),y-ELE.naturalHeight+1)}
const PIMG={};for(const k in PORTS){const i=new Image();i.src=PORTS[k];PIMG[k]=i}
function face(n,x,y){cx.fillStyle='#2a1e3a';cx.fillRect(x,y,40,40);const i=PIMG[n=='Eleanor'?'eleanor':n=='Abby'?'abby':n=='Mãe'?'mae':G.stage>=27?'sarah2':'sarah1'];if(i&&i.complete){cx.imageSmoothingEnabled=true;cx.drawImage(i,x,y,40,40);cx.imageSmoothingEnabled=false}}
function tile(c,x,y,m){const X=x*T,Y=y*T,R=(a,b,w,h,col)=>{cx.fillStyle=col;cx.fillRect(X+a,Y+b,w,h)};
if(c=='#'||c=='p'||c=='m'){R(0,0,16,16,m.c[2]);R(0,0,16,3,m.c[3])}else R(0,0,16,16,(x+y)%2?m.c[0]:m.c[1]);
if(c=='b'){R(1,2,14,12,'#e87aa8');R(2,3,5,4,'#fff')}else if(c=='p'){R(3,2,10,12,'#c85a8a');R(6,4,4,3,'#f0c8a8')}else if(c=='m'){R(2,1,12,14,'#a8d8e8');R(3,2,4,12,'#d8f0f8')}
else if(c=='t'){R(0,4,16,10,'#8a5a3a');R(0,4,16,3,'#a8704a')}else if(c=='c'){R(0,3,16,11,'#888890');R(0,3,16,3,'#aaaab4')}
else if(c=='x'){R(0,3,16,11,'#8a4a2a');R(3,5,10,4,'#2a1a14');R(0,12,16,2,'#3a2a20')}else if(c=='r')R(1,1,14,14,'#8a5a9a');else if(c=='D'){R(0,0,16,16,'#2a1a14');R(3,2,10,14,'#6a4a30')}}
function txt(s,x,y,col,font){cx.font=font||'8px monospace';cx.textBaseline='top';cx.textAlign='center';cx.fillStyle=col;cx.fillText(s,x,y);cx.textAlign='left'}
const FRED=new Image();FRED.src='assets/funtime.png';
function fredW(x,y){cx.fillStyle='rgba(0,0,0,.35)';cx.fillRect(x-6,y-1,12,2);if(FRED.complete&&FRED.naturalWidth)cx.drawImage(FRED,Math.round(x-FRED.naturalWidth/2),y-FRED.naturalHeight+1)}
function deco(d){const x=d[1],y=d[2];if(d[0]=='stairs'){['#a07a50','#8a6642','#76563a','#62472f','#4e3926'].forEach((c,i)=>{cx.fillStyle=c;cx.fillRect(x,y+i*3,32,3)});cx.fillStyle='#1a120c';cx.fillRect(x-1,y,1,15);cx.fillRect(x+32,y,1,15)}
else if(d[0]=='heater'){cx.fillStyle='#3a3a44';cx.fillRect(x+1,y+4,14,10);cx.fillStyle='#e8742a';[3,7,11].forEach(o=>cx.fillRect(x+o,y+6,2,6));cx.fillStyle='rgba(255,140,40,'+(.16+.07*Math.sin(performance.now()/300))+')';cx.fillRect(x-6,y-2,28,22)}}
function draw(){cx.fillStyle='#000';cx.fillRect(0,0,VW,VH);
cx.setTransform(SC,0,0,SC,0,0);
if(G.mode=='intro'){const t=G.t,i=t<3.7?0:1,u=t-i*3.7,a=Math.max(0,Math.min(1,u/.8,(3.5-u)/.8)),v=Math.round(255*a),c='rgb('+v+','+v+','+v+')';T2(i?'criado por fmourk._90':'inspirado na franquia criada por Scott Cawthon',160,88,c,i?12:11,'center');flush();return}
if(G.mode=='menu'){T2("Five Nights at Freddy's: Fazbear Frights",160,18,'#8a7aa8',9,'center');T2('Escolha uma história',160,34,'#ffffff',12,'center');
['Into the Pit','To Be Beautiful','Count the Ways'].forEach((n,i)=>{const ok=i==1,s=G.sel==i;T2((s?'> ':'  ')+n+(ok?'':'  (em breve)'),160,66+i*24,ok?(s?'#ff9ac8':'#e8e0f0'):'#5a4a78',ok?14:11,'center')});
if(Save.has(G.sel))T2('Continuar jogo salvo',160,140,'#ffd27a',10,'center');
if(G.note>0)T2('Essa história ainda não está disponível.',160,158,'#ffd27a',9,'center');T2('Jogo de fã, não oficial. Contém temas de terror.',160,171,'#5a4a78',7,'center');T2('desenvolvido por fmourk._90',314,182,'#8a7aa8',7,'right');flush();return}
if(G.mode=='end'){T2('FIM',160,70,'#ff9ac8',24,'center');T2(Story.endText||'Sarah só queria ser bonita.',160,106,'#bdb0d0',10,'center');T2('Enter: voltar ao menu',160,140,'#ffffff',9,'center');flush();return}
if(G.cin){cx.fillStyle='#000';cx.fillRect(0,0,VW,VH);if(G.cin==2&&FRED.complete&&FRED.naturalWidth){const gr=cx.createRadialGradient(160,58,4,160,58,80);gr.addColorStop(0,'rgba(70,100,230,.28)');gr.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gr;cx.fillRect(0,0,VW,VH);cx.drawImage(FRED,160-FRED.naturalWidth*2,8,FRED.naturalWidth*4,FRED.naturalHeight*4)}Dlg.draw();flush();return}
const m=Maps[G.map];if(m.img){if(m.im.complete)cx.drawImage(m.im,0,0,VW,VH)}else for(let y=0;y<H;y++)for(let x=0;x<W;x++)tile(m.g[y][x],x,y,m);
if(m.deco)m.deco.forEach(deco);
if(G.map=='junk'&&G.stage==9){const[AX,AY]=Maps.junk.arm,X=AX-8,Y=AY;cx.fillStyle='#f4f0f0';cx.fillRect(X+6,Y,4,9);cx.fillRect(X+5,Y+9,6,3);cx.fillStyle='#e0334c';cx.fillRect(X+6,Y,4,2);if(Math.floor(performance.now()/400)%2)T2('E',X+8,Y+14,'#ffd27a',8,'center')}
const list=npcs().map(n=>({y:n.y*T+14,f:()=>Npcs[n.id].pal.k=='fred'?fredW(n.x*T+8,n.y*T+14):Npcs[n.id].pal.k=='doll'&&!G.flags.copy?eleanor(n.x*T+8,n.y*T+14,n.d):spr(n.x*T+8,n.y*T+14,n.id=='eleanor'?{skin:'#f0c8a8',hair:'#7a4a2a',shirt:'#8a7a70',pants:'#4a4a8a'}:Npcs[n.id].pal,n.d,0,1)})),p=G.p;
list.push({y:p.y,f:()=>spr(p.x,p.y,Story.pal(),p.dir,p.f,!(keys.ArrowLeft||keys.ArrowRight||keys.ArrowUp||keys.ArrowDown||keys.a||keys.d||keys.w||keys.s))});
list.sort((a,b)=>a.y-b.y).forEach(o=>o.f());if(G.mode=='play'&&target())T2('E',p.x,p.y-30,'#ffd27a',8,'center');
cx.fillStyle='rgba(20,0,30,'+G.dark+')';cx.fillRect(0,0,VW,VH);
if(G.dark>.2){const g=cx.createRadialGradient(p.x,p.y-8,50,p.x,p.y-8,190);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+G.dark*1.3+')');cx.fillStyle=g;cx.fillRect(0,0,VW,VH)}
Dlg.draw();let gl=Story.goal[G.stage];if(G.story!='ctw'&&G.map=='street'&&gl&&gl.indexOf('escola')>=0)gl='Vá até a escola (porta cinza)';if(typeof gl=='function')gl=gl(G.flags);if(G.mode=='play'&&gl){const s='Objetivo: '+gl;cx.fillStyle='rgba(10,6,18,.78)';cx.fillRect(4,4,mw(s,7)+10,12);T2(s,9,6,'#ffd27a',7)}flush();cx.fillStyle='rgba(0,0,0,'+G.fade+')';cx.fillRect(0,0,VW,VH)}
addEventListener('keydown',e=>{if(e.key.startsWith('Arrow')||e.key==' ')e.preventDefault();if(!keys[e.key])press(e.key);keys[e.key]=1});
addEventListener('keyup',e=>keys[e.key]=0);addEventListener('blur',()=>{for(const k in keys)keys[k]=0});cv.addEventListener('click',e=>{if(G.mode=='menu'){const r=cv.getBoundingClientRect(),vy=(e.clientY-r.top)/r.height*VH;if(vy>=132&&vy<=154&&Save.has(G.sel)){Aud.init();cont(G.sel);return}const i=Math.floor((vy-58)/24);if(i<0||i>2)return;G.sel=i}press('click')});
let last=performance.now();(function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;try{upd(dt);draw()}catch(e){console.error(e)}requestAnimationFrame(loop)})(last);
