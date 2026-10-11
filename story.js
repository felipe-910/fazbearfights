// Roteiro linear editável. "Nome|texto" = fala; "|texto" = narração; "!comando" = ação (stage n, flag x, unflag x, black, clear, wait ms, go mapa x y, npc id x y, sfx nome, cin 0/1, end).
// As cenas ficam em sc1.js, sc2.js e sc3.js.
const msg=t=>['|'+t];
const HX={1:['hall',2],6:['hall',7],11:['hall',12],14:['hall',15],18:['hall',19],22:['hall',23],26:['hall',27],31:['pizza',32],35:['mall',36],40:['hall',41],42:['garage',43]};
const SX={4:['home',5],8:['junk',9],12:['home',13],16:['home',17],20:['home',21],24:['home',25]};
const M=()=>G.map;
let Story={adv:[],
goal:{0:'Olhe o quarto e, por fim, o espelho (E)',1:'Vá para a escola (porta ao sul)',2:'Fale com a Abby (corredor)',3:'Vá ao refeitório (porta no fundo do corredor)',4:'Volte para casa (porta ao sul)',6:'Vá para a escola (porta ao sul)',7:'Vá ao refeitório e fale com a Lydia',8:'Volte para casa pelo ferro-velho (porta ao sul)',9:'Examine o braço no porta-malas (E)',11:'Vá para a escola (porta ao sul)',12:'Volte para casa (porta ao sul)',14:'Vá para a escola (porta ao sul)',15:'Fale com a Jillian (corredor)',16:'Volte para casa (porta ao sul)',18:'Vá para a escola (porta ao sul)',19:'Fale com a Abby (corredor)',20:'Volte para casa (porta ao sul)',22:'Vá para a escola (porta ao sul)',23:f=>f.mason1?'Fale com a Abby':'Fale com o Mason (corredor)',24:'Volte para casa (porta ao sul)',26:'Vá para a escola (porta ao sul)',27:f=>f.lydia?'Fale com a Abby':'Vá ao refeitório (porta no fundo do corredor)',28:'Fale com o Mason na saída da escola',29:'Entre em casa (a porta da frente)',31:'Saia para a pizzaria (porta ao sul)',34:'Fale com a mãe (E)',35:'Saia para o shopping (porta ao sul)',36:'Entre na loja BEAUTY (porta rosa, no centro)',37:'Entre na loja FASHION (porta à esquerda)',38:'Volte para casa (porta ao sul)',40:'Vá para a escola (porta ao sul)',41:'Vá ao refeitório (porta no fundo do corredor)',42:'Procure a Eleanor na garagem (porta ao sul)',43:'Abra o armário vermelho (E)'},
trig:[{m:'home',s:0,id:'intro'},{m:'school',s:3,id:'lunch1'},{m:'home',s:5,id:'dye'},{m:'home',s:10,id:'clean'},{m:'home',s:11,id:'doubt'},{m:'hall',s:12,id:'schoolpass'},{m:'home',s:13,id:'pendant'},{m:'home',s:14,id:'m1'},{m:'home',s:17,id:'n1'},{m:'home',s:18,id:'m2'},{m:'home',s:21,id:'n2'},{m:'home',s:22,id:'m3'},{m:'home',s:25,id:'n3'},{m:'home',s:26,id:'m4'},{m:'hall',s:27,id:'looks'},{m:'school',s:27,id:'lydia'},{m:'home',s:30,id:'tell1'},{m:'pizza',s:32,id:'pizza1'},{m:'home',s:33,id:'tell2'},{m:'mall',s:36,id:'mall0'},{m:'makeup',s:36,id:'lips'},{m:'store',s:37,id:'dresses'},{m:'home',s:39,id:'dream'},{m:'school',s:41,id:'fall'},{m:'home',s:42,id:'search'}],
exit:{
home:s=>HX[s]?(HX[s][0]=='hall'?{to:'street',tx:4,ty:6}:{to:HX[s][0],tx:9,ty:9,set:HX[s][1]}):{msg:msg("Ainda não é hora de sair.")},
street:s=>({to:'home',tx:9,ty:9}),
street_u:s=>HX[s]&&HX[s][0]=='hall'?{to:'hall',tx:9,ty:9,set:HX[s][1]}:{msg:msg("Não preciso ir para a escola agora.")},
hall:s=>SX[s]?{to:SX[s][0],tx:9,ty:9,set:SX[s][1]}:{msg:msg("Ainda tenho coisas a fazer na escola.")},
hall_u:s=>[3,7,27,41].includes(s)?{to:'school',tx:9,ty:9}:{msg:msg("Não preciso ir ao refeitório agora.")},
school:s=>({to:'hall',tx:9,ty:4}),
junk:s=>({msg:msg(s==9?"Tem algo naquele ferro-velho que eu preciso ver...":"Melhor ir para casa.")}),
garage:s=>({msg:msg(s>=43?"Não posso sair daqui sem a Eleanor.":"Ainda não.")}),
mall:s=>s==38?{to:'home',tx:9,ty:9,set:39}:{msg:msg("Ainda não terminei por aqui.")},
mall_u:s=>s==37?{to:'store',tx:9,ty:9}:{msg:msg(s==36?"Primeiro a loja de maquiagem, com as meninas.":"Ainda não é hora de entrar na loja.")},
mall_v:s=>({msg:msg("Essa loja está fechada hoje.")}),
mall_w:s=>s==36?{to:'makeup',tx:9,ty:10}:{msg:msg("Já terminei na loja de maquiagem.")},
store:s=>({to:'mall',tx:5,ty:4}),
makeup:s=>s>=37?{to:'mall',tx:11,ty:4}:{msg:msg("Elas estão me esperando aqui dentro.")},
pizza:s=>({msg:msg("Ainda não quero ir embora.")}),
yard:s=>s==29?{to:'home',tx:9,ty:9,set:30}:{msg:msg("Ainda não quero sair.")}},
tile:{
b:s=>s<10?"A cama da Sarah. Desfeita, como sempre.":"A cama onde Sarah dorme ouvindo a canção da Eleanor.",
p:s=>s==0?"Pôsteres de modelos e atrizes, todas com a mesma pele sem poros. Sarah os colou um por um, anos atrás, quando ainda achava que ficar bonita era só questão de tempo.":"Pôsteres de modelos. Perfeitas demais para parecerem reais.",
t:s=>M()=='home'?(s==0?"Na escrivaninha: revistas de moda abertas, potes de maquiagem baratos e, por baixo de tudo, recortes sobre cirurgia plástica. Nariz, queixo, maçãs do rosto. Sarah sublinhou os preços.":"A escrivaninha, cheia de revistas e potinhos."):"Uma mesa. Nada de útil aqui.",
e:s=>M()=='home'?(s==0?"Na estante, livros de escola, uma foto do irmão, que agora mora longe, na faculdade, e um cartão-postal antigo, de alguém que quase nunca está por perto. A casa é pequena e, às vezes, silenciosa demais.":"Uma estante com livros e fotos."):M()=='garage'?"Prateleiras com caixas e ferramentas velhas.":"Prateleiras com coisas guardadas.",
m:s=>M()=='makeup'?"Um espelho de balcão rodeado de luzes. Dessa vez, Sarah não desvia o olhar.":s==0?Story.sc.mirror:s<26?"O espelho mostra uma Sarah um pouco diferente a cada manhã.":s<42?"Uma garota perfeita. Perfeita demais, talvez.":"O vidro reflete só metal velho.",
c:s=>({home:"O balcão da cozinha. Nada de útil agora.",school:"O balcão da cantina. Hoje não.",makeup:"O balcão de provas: amostras abertas de batons, paletas de sombra e esponjas.",store:"O caixa. A funcionária vigia tudo.",pizza:"O balcão da pizzaria, com o forno ao fundo.",mall:"Um balcão de informações. Fechado."}[M()]||"Um balcão. Nada de especial."),
x:s=>M()=='garage'?"Pneus velhos e caixas empilhadas.":"Carcaça de carro enferrujada.",
X:s=>s==9?Story.sc.find:"Mais uma carcaça enferrujada.",
l:"Armários trancados. Cheiram a tênis e livro velho.",
k:"Uma lixeira cheia.",
f:s=>M()=='garage'?"Um freezer velho, zumbindo.":"Uma geladeira. Nada que eu queira agora.",
g:"Um galpão trancado.",
v:"Uma vitrine. Os vestidos parecem de outro mundo.",
a:s=>M()=='makeup'?"Uma planta de vaso, o único verde nesta loja toda rosa.":"Uma planta de vaso.",
h:s=>M()=='makeup'?"Um puff rosa. Não é hora de sentar.":"Um banco. Não é hora de sentar.",
q:s=>M()=='makeup'?"Prateleiras cheias de esmaltes e frascos de perfume em fileiras perfeitas.":"Cabides com roupas.",
j:s=>M()=='makeup'?"Cortinas vermelhas, para provar maquiagem sem plateia.":"Provadores com cortinas vermelhas.",
o:s=>M()=='makeup'?"Um expositor giratório de batons, com todas as cores que existem.":"Um forno de pizza de pedra, ainda quente.",
d:"Porta de funcionários. Trancada.",
R:s=>s==43?Story.sc.cabinet:"Um armário vermelho de ferramentas.",
y:s=>M()=='yard'?"O jardim da frente. Daqui, a casa parece menor do que Sarah gostaria.":"Mais um canto do cenário."},
talk(id,s,f){
 if(id=='mom')return s==34?Story.sc.momride:s<26?["Mãe|Já tomou café, filha? Não saia sem comer."]:["Mãe|Você está tão diferente, filha. Me conta mais depois?"];
 if(id=='abby')return s==2?Story.sc.abby1:s==19?Story.sc.reconcile:s==23&&f.mason1?Story.sc.abby3:s==27&&f.lydia?Story.sc.fight:s==41?["Abby|Come alguma coisa, Sarah."]:["Abby|A gente se fala depois, tá?"];
 if(id=='mason')return s==23&&!f.mason1?Story.sc.mason1:s==28?Story.sc.date1:["Mason|Oi, Sarah."];
 if(id=='jillian')return s==15?Story.sc.nails:["Jillian|Oi, Sarah."];
 if(id=='lydia')return s==7?Story.sc.salad:s==27?["Lydia|Senta, Sarah. Sem drama."]:["Lydia|Hmm? Ah. Oi."];
 if(id=='eleanor')return s<14?["Eleanor|Descanse, Sarah. Vinte e quatro horas passam depressa."]:["Eleanor|Está tudo bem. Fique perto de mim.","Eleanor|Nunca tire o pingente."];
 if(id=='tabitha')return["Tabitha|Oi."];
 if(id=='emma')return["Emma|Oi, Sarah."];
 if(id=='clerk')return["Funcionária|Posso ajudar? Se for só olhar, por favor, não bagunce as peças."];
 return["Garota|..."]},
pal(){const f=G.flags,s=G.stage;let p={skin:'#f0c8a8',hair:'#7a4a2a',shirt:'#d86aa0',pants:'#4a4a8a'};
 if(s>=27)p={skin:'#f6d6bc',hair:'#b8782e',shirt:'#e0508a',pants:'#3a3a6a'};else if(s>=22)p={skin:'#f4d2b8',hair:'#8a5a30',shirt:'#e060a0',pants:'#4a4a8a'};
 if(f.green)p.hair='#4fae4a';
 if(f.rusty){p.pants='#8a8a92';p.shirt='#9a7a70'}
 if(s>=43){p.skin='#8c8c8c';p.hair='#5a3a2a'}
 return p},
sc:{}};
