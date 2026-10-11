const Dlg={on:false,pages:[],pi:0,name:'',shown:0,cb:null,
portrait(){return['Eleanor','Sarah','Abby','Mãe'].includes(this.name)},
show(name,text,cb){this.name=name;const mx=this.portrait()?218:270,lines=[];let l='';for(const w of text.split(' ')){const t=l?l+' '+w:w;if(mw(t,9)>mx&&l){lines.push(l);l=w}else l=t}lines.push(l);
this.pages=[];for(let i=0;i<lines.length;i+=3)this.pages.push(lines.slice(i,i+3));this.pi=0;this.shown=0;this.cb=cb;this.on=true},
len(){return this.pages[this.pi].join('').length},
upd(dt){if(!this.on)return;if(this.shown<this.len()){const b=Math.floor(this.shown);this.shown=Math.min(this.len(),this.shown+dt*45);if(Math.floor(this.shown)!=b&&b%3==0)Aud.sfx('talk')}},
adv(){if(!this.on)return;if(this.shown<this.len()){this.shown=this.len();return}if(this.pi<this.pages.length-1){this.pi++;this.shown=0;return}this.on=false;const c=this.cb;this.cb=null;c&&c()},
draw(){if(!this.on)return;cx.fillStyle='#0a0612';cx.fillRect(14,132,292,56);cx.strokeStyle='#e8e0f0';cx.lineWidth=1;cx.strokeRect(14.5,132.5,291,55);cx.strokeStyle='#7a5aa8';cx.strokeRect(17.5,135.5,285,49);
let tx=24;if(this.portrait()){face(this.name,22,140);tx=68}
if(this.name){const w=mw(this.name,9)+10;cx.fillStyle='#0a0612';cx.fillRect(22,123,w,13);cx.strokeStyle='#e8e0f0';cx.strokeRect(22.5,123.5,w,12);T2(this.name,27,125,'#ffd27a',9)}
let left=Math.floor(this.shown);this.pages[this.pi].forEach((ln,i)=>{T2(ln.slice(0,Math.max(0,left)),tx,141+i*13,'#ffffff',9);left-=ln.length});
if(this.shown>=this.len()&&Math.floor(performance.now()/400)%2)T2('>',294,174,'#ffd27a',9)}};
