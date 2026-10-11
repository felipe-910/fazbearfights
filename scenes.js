const Scn={q:[],i:0,wait:0,done:null,
run(lines,done){G.mode='scene';this.q=lines;this.i=0;this.done=done||null;this.step()},
step(){while(this.i<this.q.length){const l=this.q[this.i++];
if(l[0]=='!'){const[a,...r]=l.slice(1).split(' ');
if(a=='stage')setStage(+r[0]);else if(a=='flag')G.flags[r[0]]=1;else if(a=='unflag')delete G.flags[r[0]];else if(a=='black')G.fadeTo=1;else if(a=='clear')G.fadeTo=0;
else if(a=='wait'){this.wait=+r[0]/1000;return}else if(a=='go')loadMap(r[0],+r[1],+r[2],true);
else if(a=='npc')G.npcPos[r[0]]=[+r[1],+r[2]];else if(a=='sfx')Aud.sfx(r[0]);else if(a=='cin')G.cin=+r[0];else if(a=='end'){G.mode='end';Save.set(null);return}}
else{if(G.fadeTo==1&&!G.cin)G.fadeTo=0;const k=l.indexOf('|');Dlg.show(l.slice(0,k),l.slice(k+1),()=>this.step());return}}
this.finish()},
finish(){const d=this.done;this.done=null;G.mode='play';G.fadeTo=0;G.cin=0;this.checkAdv();Save.store();d&&d();if(G.mode=='play')runTrig()},
checkAdv(){for(const a of Story.adv)if(G.stage==a.from&&a.need.every(f=>G.flags[f])){setStage(a.to);G.mode='scene';Dlg.show('',a.msg,()=>{G.mode='play';Save.store();runTrig()})}},
upd(dt){if(this.wait>0){this.wait-=dt;if(this.wait<=0)this.step()}}};
