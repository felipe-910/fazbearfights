const Aud={ctx:null,vol:.5,mute:false,d:null,
init(){if(this.ctx){if(this.ctx.state=='suspended')try{this.ctx.resume()}catch(e){}return}try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);this.setVol(this.vol);
const o=this.ctx.createOscillator(),g=this.ctx.createGain(),f=this.ctx.createBiquadFilter();o.type='sawtooth';o.frequency.value=55;f.frequency.value=160;g.gain.value=.04;o.connect(f);f.connect(g);g.connect(this.master);o.start();this.d={o,g}}catch(e){}},
setVol(v){this.vol=v;if(this.master)this.master.gain.value=this.mute?0:v;document.getElementById('mute').textContent='Som: '+(this.mute?'desligado':'ligado')},
toggle(){this.mute=!this.mute;this.setVol(this.vol)},
tension(d){if(this.d){this.d.o.frequency.value=55-d*25;this.d.g.gain.value=.04+d*.1}},
beep(f,t,type,v){if(!this.ctx)return;const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type||'square';o.frequency.value=f;g.gain.setValueAtTime(v||.12,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+t);o.connect(g);g.connect(this.master);o.start();o.stop(c.currentTime+t)},
sfx(n){const b=(...a)=>this.beep(...a),m={step:()=>b(90,.05,'triangle',.1),talk:()=>b(300+Math.random()*60,.03,'square',.04),use:()=>b(520,.1),door:()=>b(120,.3,'sawtooth',.1),scare:()=>{b(70,.9,'sawtooth',.2);b(73,.9,'square',.08)},blade:()=>{b(1100,.18,'sawtooth',.2);setTimeout(()=>b(90,.6,'square',.22),110)},lull:()=>[392,330,262,330].forEach((f,i)=>setTimeout(()=>b(f,.5,'sine',.15),i*450))};(m[n]||(()=>{}))()}};
document.getElementById('mute').onclick=()=>{Aud.init();Aud.toggle()};
document.getElementById('vol').oninput=e=>{Aud.init();Aud.setVol(+e.target.value)};
