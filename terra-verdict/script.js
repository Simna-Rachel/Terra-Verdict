// ── AUDIO ──
var actx=null,soundOn=true,ambNodes=[];
function ia(){if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();}
function toggleSound(){
  soundOn=!soundOn;
  document.getElementById('sound-btn').textContent=soundOn?'🔊':'🔇';
  document.getElementById('set-sound').checked=soundOn;
  saveData.settings=saveData.settings||{};saveData.settings.sound=soundOn;saveSave();
  if(!soundOn){ambNodes.forEach(function(n){try{n.stop()}catch(e){}});ambNodes=[];}
  else playAmbient();
}
function playAmbient(){
  ia();if(!soundOn)return;
  try{
    var buf=actx.createBuffer(1,actx.sampleRate*4,actx.sampleRate);
    var d=buf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*0.01;
    var s=actx.createBufferSource();s.buffer=buf;s.loop=true;
    var f=actx.createBiquadFilter();f.type='lowpass';f.frequency.value=260;
    var g=actx.createGain();g.gain.value=0.5;
    s.connect(f);f.connect(g);g.connect(actx.destination);s.start();ambNodes.push(s);
    var osc=actx.createOscillator();osc.type='sine';osc.frequency.value=44;
    var og=actx.createGain();og.gain.value=0.04;
    osc.connect(og);og.connect(actx.destination);osc.start();ambNodes.push(osc);
  }catch(e){}
}
function cinBoom(){
  ia();if(!soundOn)return;
  try{
    var buf=actx.createBuffer(1,actx.sampleRate*1.8,actx.sampleRate);
    var d=buf.getChannelData(0);
    for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-(i/d.length),0.4)*0.45;
    var s=actx.createBufferSource();s.buffer=buf;
    var f=actx.createBiquadFilter();f.type='lowpass';f.frequency.value=110;
    var g=actx.createGain();g.gain.value=1;g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+2.2);
    s.connect(f);f.connect(g);g.connect(actx.destination);s.start();
    setTimeout(function(){
      try{var o=actx.createOscillator();o.type='sine';o.frequency.setValueAtTime(70,actx.currentTime);o.frequency.linearRampToValueAtTime(140,actx.currentTime+4);var sg=actx.createGain();sg.gain.setValueAtTime(0,actx.currentTime);sg.gain.linearRampToValueAtTime(0.07,actx.currentTime+1.5);sg.gain.linearRampToValueAtTime(0,actx.currentTime+4.5);o.connect(sg);sg.connect(actx.destination);o.start();o.stop(actx.currentTime+4.5);}catch(e){}
    },700);
  }catch(e){}
}
function ding(){
  ia();if(!soundOn)return;
  try{var o=actx.createOscillator();var g=actx.createGain();o.type='sine';o.frequency.setValueAtTime(680,actx.currentTime);o.frequency.exponentialRampToValueAtTime(320,actx.currentTime+0.13);g.gain.setValueAtTime(0.22,actx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+0.15);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+0.15);}catch(e){}
}
function chime(){
  ia();if(!soundOn)return;
  [200,300,420].forEach(function(f,i){setTimeout(function(){try{var o=actx.createOscillator();var g=actx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0.16,actx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+0.32);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+0.32);}catch(e){}},i*100);});
}
function badSound(){
  ia();if(!soundOn)return;
  try{var o=actx.createOscillator();var g=actx.createGain();o.type='sawtooth';o.frequency.setValueAtTime(160,actx.currentTime);o.frequency.exponentialRampToValueAtTime(50,actx.currentTime+0.6);g.gain.setValueAtTime(0.2,actx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+0.6);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+0.6);}catch(e){}
}
function winSound(){
  ia();if(!soundOn)return;
  [523,659,784,1047,1319].forEach(function(f,i){setTimeout(function(){try{var o=actx.createOscillator();var g=actx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0.22,actx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+0.5);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+0.5);}catch(e){}},i*170);});
}

// ── STARS ──
function initStars(id){
  var c=document.getElementById(id);if(!c)return;
  var ctx=c.getContext('2d');
  function resize(){c.width=window.innerWidth;c.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  var stars=[];for(var i=0;i<260;i++)stars.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.6+0.2,op:Math.random()});
  (function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    stars.forEach(function(s){s.op+=(Math.random()-0.5)*0.04;s.op=Math.max(0.08,Math.min(1,s.op));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,'+s.op+')';ctx.fill();});
    requestAnimationFrame(draw);
  })();
}

// ── ACHIEVEMENTS ──
var ACHIEVEMENTS=[
  {id:'first_win',icon:'🌍',name:'TERRA SURVIVOR',desc:'Complete all 8 years',secret:false},
  {id:'triple_crown',icon:'🌟',name:'TRIPLE CROWN',desc:'Win with all 3 meters above 60',secret:false},
  {id:'eco_hero',icon:'♻️',name:'ECO HERO',desc:'Finish with Planet above 80%',secret:false},
  {id:'people_champ',icon:'👥',name:'PEOPLE CHAMPION',desc:'Finish with People above 85%',secret:false},
  {id:'profit_king',icon:'💰',name:'PROFIT KING',desc:'Finish with over $700 profit',secret:false},
  {id:'policy_ace',icon:'⚡',name:'POLICY ACE',desc:'Score 80%+ in Policy Blitz',secret:false},
  {id:'no_coal',icon:'☀️',name:'CLEAN ENERGY',desc:'Never choose coal or ignore laws',secret:true},
  {id:'speed_run',icon:'🏃',name:'SPEED RUN',desc:'Complete a game in under 3 minutes',secret:true},
];

var saveData={plays:0,wins:0,unlocked:[],bestScore:null,settings:{sound:true,ambient:true,skipCinema:false,difficulty:'normal',speed:'normal'}};

function loadSave(){
  try{var s=localStorage.getItem('terra_save');if(s)saveData=JSON.parse(s);}catch(e){}
  // apply settings
  var sd=saveData.settings||{};
  soundOn=sd.sound!==false;
  document.getElementById('set-sound').checked=soundOn;
  document.getElementById('set-ambient').checked=sd.ambient!==false;
  document.getElementById('set-skipcinema').checked=!!sd.skipCinema;
  document.getElementById('set-difficulty').value=sd.difficulty||'normal';
  document.getElementById('set-speed').value=sd.speed||'normal';
  updateMenuStats();
}
function saveSave(){try{localStorage.setItem('terra_save',JSON.stringify(saveData));}catch(e){}}
function applySettings(){
  var sd=saveData.settings={};
  sd.sound=document.getElementById('set-sound').checked;
  sd.ambient=document.getElementById('set-ambient').checked;
  sd.skipCinema=document.getElementById('set-skipcinema').checked;
  sd.difficulty=document.getElementById('set-difficulty').value;
  sd.speed=document.getElementById('set-speed').value;
  soundOn=sd.sound;
  document.getElementById('sound-btn').textContent=soundOn?'🔊':'🔇';
  saveSave();
}
function resetProgress(){
  if(!confirm('Reset ALL progress, wins and achievements?'))return;
  saveData={plays:0,wins:0,unlocked:[],bestScore:null,settings:saveData.settings};
  saveSave();updateMenuStats();showToast('Progress reset.');
}
function updateMenuStats(){
  document.getElementById('ms-plays').textContent=saveData.plays||0;
  document.getElementById('ms-wins').textContent=saveData.wins||0;
  var ul=saveData.unlocked||[];
  document.getElementById('ms-ach').textContent=ul.length+'/'+ACHIEVEMENTS.length;
  document.getElementById('ms-best').textContent=saveData.bestScore?'$'+saveData.bestScore:'—';
}
function unlockAchievement(id){
  if(!saveData.unlocked)saveData.unlocked=[];
  if(saveData.unlocked.indexOf(id)>=0)return;
  saveData.unlocked.push(id);saveSave();
  var a=ACHIEVEMENTS.find(function(x){return x.id===id;});
  if(a)showToast('🏆 Achievement: '+a.name);
  updateMenuStats();
}
function renderAchievements(){
  var ul=saveData.unlocked||[];
  var html='';
  ACHIEVEMENTS.forEach(function(a){
    var got=ul.indexOf(a.id)>=0;
    html+='<div class="ach-card'+(got?' unlocked':'')+'"><div class="ach-icon">'+(got?a.icon:'🔒')+'</div>';
    html+='<div class="ach-name">'+(got?a.name:(a.secret?'???':a.name))+'</div>';
    html+='<div class="ach-desc">'+(got?a.desc:(a.secret?'Hidden achievement':a.desc))+'</div>';
    if(got)html+='';else html+='<div class="ach-locked">LOCKED</div>';
    html+='</div>';
  });
  document.getElementById('ach-grid').innerHTML=html;
}

function openOverlay(id){
  if(id==='ach-overlay')renderAchievements();
  document.getElementById(id).classList.add('open');
  ding();
}
function closeOverlay(id){document.getElementById(id).classList.remove('open');ding();}
// Close overlay on backdrop click
document.addEventListener('click',function(e){
  document.querySelectorAll('.menu-overlay.open').forEach(function(o){
    if(e.target===o)o.classList.remove('open');
  });
});

function showToast(msg){
  var t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  setTimeout(function(){t.classList.remove('show');},2800);
}

// ── MINI MENU EARTH (uses same WebGL renderer, smaller) ──
function initMenuEarth(){
  var canvas=document.getElementById('menu-earth-canvas');
  if(!canvas)return;
  var sz=180;canvas.width=sz;canvas.height=sz;
  var gl=canvas.getContext('webgl')||canvas.getContext('experimental-webgl');
  if(gl){initWebGLEarthOnCanvas(gl,canvas,sz);return;}
  init2DEarthOnCanvas(canvas,sz);
}

// ── GAME START TRACKING ──
var gameStartTime=0;
var coalChosen=false;

// ── OVERRIDE startGame to track stats ──
var _origStartGame=null; // will be set after main JS loads

// ── EARTH — WebGL realistic sphere ──
function initEarth(){
  var canvas=document.getElementById('earth-canvas');
  var sz=260;canvas.width=sz;canvas.height=sz;
  var gl=canvas.getContext('webgl')||canvas.getContext('experimental-webgl');
  if(gl){initWebGLEarth(gl,canvas,sz);}else{init2DEarth(canvas,sz);}
}

function initWebGLEarthOnCanvas(gl,canvas,sz){ initWebGLEarth(gl,canvas,sz); }
function init2DEarthOnCanvas(canvas,sz){ init2DEarth(canvas,sz); }
function initWebGLEarth(gl,canvas,sz){
  var vsrc=`
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main(){
      v_uv=a_pos*0.5+0.5;
      gl_Position=vec4(a_pos,0,1);
    }`;
  var fsrc=`
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_tex;
    uniform float u_time;
    uniform bool u_hasTex;
    #define PI 3.14159265

    // Sphere raycast
    bool hitSphere(vec2 uv,out vec3 pos,out vec3 norm){
      vec2 p=uv*2.0-1.0;
      float r2=dot(p,p);
      if(r2>1.0)return false;
      float z=sqrt(1.0-r2);
      pos=vec3(p,z);norm=pos;return true;
    }

    // Procedural ocean + land noise for fallback
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
    float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.1;a*=0.5;}return v;}

    void main(){
      vec2 uv=v_uv;
      vec3 pos,norm;
      if(!hitSphere(uv,pos,norm)){gl_FragColor=vec4(0);return;}

      // Convert pos to sphere UV with rotation
      float lon=atan(pos.x,pos.z)+u_time*0.4;
      float lat=asin(pos.y/length(pos));
      vec2 sphUV=vec2((lon/(2.0*PI))+0.5, (lat/PI)+0.5);

      vec3 color;
      if(u_hasTex){
        color=texture2D(u_tex,sphUV).rgb;
      } else {
        // Procedural realistic earth
        vec2 p=sphUV*vec2(6.0,4.0);
        float land=fbm(p+vec2(1.7,9.2));
        float ocean=fbm(p*0.8+vec2(4.1,2.3));
        // Ocean
        vec3 deepOcean=vec3(0.04,0.18,0.38);
        vec3 shallowOcean=vec3(0.08,0.32,0.58);
        vec3 oceanCol=mix(deepOcean,shallowOcean,ocean*0.6);
        // Land
        vec3 jungle=vec3(0.10,0.35,0.08);
        vec3 forest=vec3(0.16,0.42,0.12);
        vec3 desert=vec3(0.58,0.48,0.22);
        vec3 mountain=vec3(0.42,0.38,0.32);
        float d=fbm(p*1.4+vec2(8.3,3.1));
        vec3 landCol=mix(mix(jungle,forest,d),mix(desert,mountain,d*0.7),clamp((d-0.5)*2.0,0.0,1.0));
        // Blend land/ocean
        float isLand=smoothstep(0.44,0.58,land);
        // Continent shapes via fbm
        float continents=fbm(sphUV*vec2(4.0,3.0)+vec2(2.1,5.7));
        isLand*=smoothstep(0.38,0.55,continents);
        color=mix(oceanCol,landCol,isLand);
        // Ice caps
        float iceLat=abs(lat)/PI*2.0;
        float ice=smoothstep(0.72,0.88,iceLat+fbm(sphUV*8.0)*0.12);
        color=mix(color,vec3(0.88,0.92,1.0),ice);
        // Clouds
        float cloud=fbm(sphUV*vec2(5.0,3.5)+vec2(u_time*0.15,1.2));
        cloud=smoothstep(0.52,0.68,cloud)*0.75;
        color=mix(color,vec3(1.0),cloud);
      }

      // Lighting — sun from upper left
      vec3 light=normalize(vec3(-0.5,0.7,0.9));
      float diff=max(dot(norm,light),0.0);
      float ambient=0.12;
      // Specular on ocean
      vec3 viewDir=vec3(0,0,1);
      vec3 halfV=normalize(light+viewDir);
      float spec=pow(max(dot(norm,halfV),0.0),60.0)*0.35;
      color=color*(ambient+diff*0.88)+vec3(spec);

      // Atmosphere rim glow
      float rim=1.0-dot(norm,viewDir);
      rim=pow(rim,3.5)*1.2;
      color+=vec3(0.15,0.45,0.9)*rim;

      // Edge fade
      vec2 p2=uv*2.0-1.0;
      float edge=1.0-smoothstep(0.92,1.0,length(p2));
      gl_FragColor=vec4(color*edge,edge);
    }`;

  function makeShader(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  var prog=gl.createProgram();
  gl.attachShader(prog,makeShader(gl.VERTEX_SHADER,vsrc));
  gl.attachShader(prog,makeShader(gl.FRAGMENT_SHADER,fsrc));
  gl.linkProgram(prog);gl.useProgram(prog);

  var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  var aPos=gl.getAttribLocation(prog,'a_pos');
  gl.enableVertexAttribArray(aPos);gl.vertexAttribPointer(aPos,2,gl.FLOAT,false,0,0);

  var uTime=gl.getUniformLocation(prog,'u_time');
  var uTex=gl.getUniformLocation(prog,'u_tex');
  var uHasTex=gl.getUniformLocation(prog,'u_hasTex');

  gl.uniform1i(uHasTex,0);
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

  // Try loading NASA texture
  var tex=gl.createTexture();
  var texLoaded=false;
  var img=new Image();img.crossOrigin='anonymous';
  img.onload=function(){
    gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.uniform1i(uHasTex,1);texLoaded=true;
  };
  img.src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Land_ocean_ice_cloud_hires.jpg/1024px-Land_ocean_ice_cloud_hires.jpg';

  var t=0;
  (function loop(){
    gl.viewport(0,0,sz,sz);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime,t);
    if(texLoaded){gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(uTex,0);}
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    t+=0.008;requestAnimationFrame(loop);
  })();
}

function init2DEarth(canvas,sz){
  var ctx=canvas.getContext('2d');var off=0;
  var img=new Image();img.crossOrigin='anonymous';
  img.onload=function(){
    (function draw(){
      ctx.clearRect(0,0,sz,sz);ctx.save();ctx.beginPath();ctx.arc(sz/2,sz/2,sz/2,0,Math.PI*2);ctx.clip();
      var iw=img.width,ih=img.height,dw=sz*2.2,dh=sz,sx=off%iw;
      ctx.drawImage(img,sx,0,iw-sx,ih,0,0,((iw-sx)/iw)*dw,dh);
      ctx.drawImage(img,0,0,sx,ih,((iw-sx)/iw)*dw,0,(sx/iw)*dw,dh);
      var atmo=ctx.createRadialGradient(sz/2,sz/2,sz/2-12,sz/2,sz/2,sz/2+20);
      atmo.addColorStop(0,'transparent');atmo.addColorStop(0.84,'rgba(60,140,255,0.07)');atmo.addColorStop(1,'rgba(110,210,255,0.46)');
      ctx.fillStyle=atmo;ctx.beginPath();ctx.arc(sz/2,sz/2,sz/2,0,Math.PI*2);ctx.fill();
      var sh=ctx.createRadialGradient(sz*0.8,sz*0.28,0,sz*0.72,sz*0.36,sz*0.78);
      sh.addColorStop(0,'transparent');sh.addColorStop(0.5,'transparent');sh.addColorStop(1,'rgba(0,3,18,0.75)');
      ctx.fillStyle=sh;ctx.beginPath();ctx.arc(sz/2,sz/2,sz/2,0,Math.PI*2);ctx.fill();
      ctx.restore();off+=0.38;requestAnimationFrame(draw);
    })();
  };
  img.onerror=function(){drawProcedural(ctx,sz);};
  img.src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Land_ocean_ice_cloud_hires.jpg/1024px-Land_ocean_ice_cloud_hires.jpg';
}

function drawProcedural(ctx,sz){
  // Simple but clean 2D fallback
  var off=0;
  (function draw(){
    ctx.clearRect(0,0,sz,sz);ctx.save();ctx.beginPath();ctx.arc(sz/2,sz/2,sz/2,0,Math.PI*2);ctx.clip();
    var ocean=ctx.createRadialGradient(sz*0.38,sz*0.35,0,sz/2,sz/2,sz/2);
    ocean.addColorStop(0,'#1e7db5');ocean.addColorStop(0.5,'#0e5080');ocean.addColorStop(1,'#06203a');
    ctx.fillStyle=ocean;ctx.fillRect(0,0,sz,sz);
    ctx.restore();
    off+=0.4;requestAnimationFrame(draw);
  })();
}

// ── CINEMATIC ──
var cinStage=0,storyIdx=0,cinDone=false;
var spIds=['sp-a','sp-b','sp-c','sp-d','sp-e'];

function runCinematic(){
  initStars('star-canvas');initEarth();
  document.getElementById('cinematic').addEventListener('click',handleCinClick);
  setTimeout(function(){if(cinStage===0)goStory();},3500);
  cinBoom();setTimeout(playAmbient,1200);
}
function goStory(){
  cinStage=1;
  document.getElementById('scene-earth').classList.remove('active');
  document.getElementById('scene-story').classList.add('active');
  storyIdx=0;updateStory();
}
function updateStory(){
  spIds.forEach(function(id,i){document.getElementById(id).classList.toggle('sp-on',i===storyIdx);});
  for(var i=0;i<5;i++){var d=document.getElementById('sdot-'+i);d.className='sdot'+(i<storyIdx?' done':i===storyIdx?' curr':'');}
}
function goTitle(){
  cinStage=2;
  document.getElementById('scene-story').classList.remove('active');
  document.getElementById('scene-title').classList.add('active');
}
function endCinematic(){
  if(cinDone)return;cinDone=true;ding();
  var cin=document.getElementById('cinematic');
  cin.style.transition='opacity 1s';cin.style.opacity='0';
  setTimeout(function(){
    cin.classList.add('gone');
    var is=document.getElementById('intro-screen');
    is.classList.add('active');
    initStars('intro-stars');
    initMenuEarth();
  },1000);
}
function handleCinClick(){
  ding();
  if(cinStage===0){goStory();return;}
  if(cinStage===1){storyIdx++;if(storyIdx>=spIds.length){goTitle();return;}updateStory();return;}
  if(cinStage===2){endCinematic();return;}
}

// ── YEAR BACKGROUNDS ──
var yearBgs=[
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1950&q=80'
];

// ── GAME DATA ──
var years=[
  {event:"⚡ ENERGY CRISIS",desc:"The city grid is failing. Factories need power NOW. The board is watching — every option has a hidden cost.",choices:[
    {icon:"🏭",text:"Buy Coal Power",headline:"Record profits. Toxic skies.",outcome:"Coal plants fire up overnight. Numbers sing — but air quality drops dangerously. River fish are dying.",dm:200,dp:-30,dd:0,advice:"Short-term wins, but fossil fuels create compounding liability. Carbon taxes and stranded assets will haunt this balance sheet for decades.",tip:"💡 Renewables cost more upfront but have zero fuel cost and no carbon exposure."},
    {icon:"☀️",text:"Install Solar Panels",headline:"A clean bet on the future.",outcome:"Costs sting now — but energy bills drop to near zero. Your ESG rating quietly climbs.",dm:-100,dp:20,dd:0,advice:"Excellent. Solar has 25-year lifespans with virtually no operating cost. You've also de-risked against future carbon regulation.",tip:"💡 Keep planet health high — it unlocks better outcomes in later years."},
    {icon:"✂️",text:"Cut Worker Shifts",headline:"The lights stay on. Morale doesn't.",outcome:"3,000 workers go home with half their wage. Union meetings are scheduled. Quiet rage builds.",dm:50,dp:0,dd:-20,advice:"Extracting value from workers is a short-term fix with long-term consequences. Low morale spreads — expect higher turnover and industrial action.",tip:"💡 People below 30 triggers a revolt. Watch this carefully."}
  ]},
  {event:"🧪 SUPPLY CHAIN SCANDAL",desc:"A journalist exposes your supplier dumping toxic waste into the Mako River. Cameras everywhere. What does your corporation stand for?",choices:[
    {icon:"🙈",text:"Ignore It",headline:"Profit holds. The river doesn't.",outcome:"A non-apology is issued. Satellite images circulate. Two governments begin formal inquiries.",dm:150,dp:-40,dd:0,advice:"Ignoring environmental damage is never truly free. You've accumulated invisible debt — fines and cleanup costs will dwarf today's savings.",tip:"💡 Planet below 20 ends the game. You're pushing the limit."},
    {icon:"🧹",text:"Pay for Cleanup",headline:"Accountability costs money. It builds trust too.",outcome:"A full remediation fund is announced. Fish return. Communities write letters of support.",dm:-150,dp:10,dd:10,advice:"Companies that act with accountability in crises consistently outperform those that don't over a 10-year window.",tip:"💡 Both Planet and People improved. Balanced decisions compound beautifully."},
    {icon:"🔄",text:"Switch Supplier",headline:"A clean break from a dirty chain.",outcome:"A certified ethical supplier is found. Your audit trail is clean. The story quietly dies.",dm:-50,dp:8,dd:0,advice:"Switching suppliers is a systemic fix rather than a band-aid. Publishing supplier standards signals leadership.",tip:"💡 Small planet gains now prevent catastrophic losses later."}
  ]},
  {event:"⚖️ DIVERSITY AUDIT",desc:"An internal audit reveals a shocking gender pay gap. Whistleblowers are ready. What does leadership actually mean?",choices:[
    {icon:"✅",text:"Fix the Pay Gap",headline:"Equity costs money. Inequality costs more.",outcome:"Payroll restructured. Productivity climbs within two quarters as employees feel genuinely valued.",dm:-100,dp:0,dd:30,advice:"Equitable workplaces have 21% higher profitability. You've removed legal liability and built loyalty that money can't buy.",tip:"💡 High People score protects you in Year 6's automation crisis."},
    {icon:"📢",text:"Run a Marketing Campaign",headline:"A colourful distraction.",outcome:"Hashtag trends for two days. Employees notice the gap between messaging and payslips. Trust erodes.",dm:-20,dp:0,dd:5,advice:"Performative action without structural change compounds the eventual reckoning.",tip:"💡 Small PR gains won't protect against large systemic collapses."},
    {icon:"🚫",text:"Do Nothing",headline:"Silence speaks loudly.",outcome:"Three whistleblowers go to press. A class action is filed. Top executives begin updating CVs.",dm:50,dp:0,dd:-20,advice:"Inaction on equity creates compounding reputational, legal, and talent losses.",tip:"💡 People is draining. You need a strong boost in the next 2 years."}
  ]},
  {event:"🌊 WATER RIGHTS DISPUTE",desc:"Drought hits. Farmers demand reduced factory water usage. Your production lines run full capacity. Someone will go thirsty.",choices:[
    {icon:"💧",text:"Install Water Recycling",headline:"Engineering as empathy.",outcome:"Usage drops 42%. Local farmers survive. Regional media calls you the corporation that listened.",dm:-120,dp:18,dd:12,advice:"Water scarcity is the defining resource crisis of this century. Companies investing in efficiency now are building infrastructure for tomorrow.",tip:"💡 Community goodwill has real economic value."},
    {icon:"💰",text:"Buy Water Rights",headline:"Legal doesn't mean right.",outcome:"Your lawyers outbid local farmers. The regional governor publicly condemns your company.",dm:80,dp:-15,dd:-15,advice:"Legality and ethics are not the same thing. Community hostility creates operational risk and regulatory attention.",tip:"💡 Double damage to both Planet and People. This compounds fast."},
    {icon:"🤝",text:"Negotiate Shared Use",headline:"Less water. More goodwill.",outcome:"A sharing agreement is signed. Production slows 18%. Local leaders name you a regional partner.",dm:-30,dp:10,dd:10,advice:"Collaborative resource management protects your social licence to operate — increasingly treated as a financial asset.",tip:"💡 Balanced choices in the middle game keep all three meters healthy."}
  ]},
  {event:"🔥 CLIMATE REGULATION",desc:"The government introduces strict carbon limits. Your lobby team is ready. Your engineers are ready. Which future do you choose?",choices:[
    {icon:"🏗️",text:"Upgrade to Clean Tech",headline:"The retrofit that changes everything.",outcome:"Emissions drop 60%. A minister visits personally. Your carbon credits begin generating income.",dm:-200,dp:28,dd:0,advice:"Clean technology investments typically return 3-5x over 10 years. You've future-proofed against every carbon regulation scenario.",tip:"💡 Planet is healthy now. This protection carries through to the final year."},
    {icon:"🤝",text:"Lobby Against Regulation",headline:"Delay is not a strategy.",outcome:"Donations slow the bill two years. Protesters gather. Three investors divest. The regulation passes, stricter.",dm:-50,dp:-12,dd:-8,advice:"Lobbying against climate policy is increasingly a reputational liability. You delayed the inevitable at high cost.",tip:"💡 Negative on both Planet and People — a costly non-solution."},
    {icon:"😈",text:"Ignore the Law",headline:"Production continues. For now.",outcome:"Inspectors are stonewalled for one quarter. Then a raid. Fines issued. Factory shuttered.",dm:100,dp:-28,dd:0,advice:"Regulatory defiance almost always costs more than compliance through fines, shutdowns, and reputational collapse.",tip:"💡 Planet took a heavy hit. One more bad choice could end the game."}
  ]},
  {event:"🤖 AUTOMATION DILEMMA",desc:"An AI system can replace 40% of your workforce overnight. Shareholders are salivating. Workers are terrified.",choices:[
    {icon:"🤖",text:"Full Automation",headline:"Efficiency at a human cost.",outcome:"4,200 workers receive redundancy notices on a Tuesday. Profits surge. Parliament debates your company by name.",dm:250,dp:0,dd:-35,advice:"Mass displacement creates systemic risk. Regulatory backlash, consumer boycotts, and talent flight are real consequences.",tip:"💡 People is in the danger zone. One more negative hit could end the game."},
    {icon:"🎓",text:"Retrain Workers",headline:"Invest in humans. They compound too.",outcome:"Retraining launches across 14 sites. Output improves more slowly — but turnover drops to near zero.",dm:-80,dp:0,dd:25,advice:"Human capital investment consistently outperforms short-term automation in the 5-10 year window.",tip:"💡 Strong People boost. This protects against the final year's investor pressure."},
    {icon:"⚖️",text:"Hybrid Approach",headline:"A middle path no one loves.",outcome:"Half automated, half retrained. Shareholders underwhelmed. Workers anxious. Company keeps running.",dm:80,dp:0,dd:-8,advice:"Pragmatic but carries the costs of both approaches without fully reaping either benefit.",tip:"💡 Slight People dip — manageable if your score is healthy."}
  ]},
  {event:"🌿 GREENWASHING SCANDAL",desc:"An NGO publishes evidence your eco-friendly line is mostly spin. The hashtag TerraFakeVerdict trends globally. How do you respond?",choices:[
    {icon:"🌱",text:"Commit to Real Change",headline:"Authenticity is the only exit.",outcome:"A radical overhaul is announced. Independent auditors verify claims. Credibility returns with a loyal new customer segment.",dm:-150,dp:22,dd:18,advice:"Consumers and investors are expert at detecting the difference between genuine change and spin. You made the right call.",tip:"💡 Both Planet and People boosted. Setting up a strong finish."},
    {icon:"💬",text:"Crisis PR Campaign",headline:"Words without change are noise.",outcome:"Corporate speak masterclass issued. Most don't buy it. The NGO publishes a follow-up. It's worse.",dm:-40,dp:-5,dd:-10,advice:"PR without substance is a distrust multiplier. Once a greenwashing label sticks, it takes years of real action to remove.",tip:"💡 Negative on both metrics. You needed a recovery, not a setback."},
    {icon:"🏛️",text:"Sue the NGO",headline:"Silencing truth costs everything.",outcome:"Legal threats issued. Their crowdfunding raises 4M in 48 hours. Global media runs a David vs Goliath story.",dm:60,dp:-8,dd:-18,advice:"Strategic lawsuits against public participation have a catastrophic track record. You've handed your critics a narrative gift.",tip:"💡 The worst possible response to a credibility crisis."}
  ]},
  {event:"📉 THE FINAL RECKONING",desc:"Year 8. The decade closes. Investors demand maximum returns. In this final boardroom — who are you, and what legacy do you leave?",choices:[
    {icon:"💼",text:"Mass Layoffs",headline:"The oldest trick in the book.",outcome:"Stock spikes 22%. 6,000 families face uncertainty before Christmas. Business schools will debate this for years.",dm:300,dp:0,dd:-40,advice:"A classic short-termist exit. Investors profit today; communities pay for years. History's verdict is consistently harsh.",tip:"💡 Terra Verdict: Power without conscience."},
    {icon:"🔬",text:"Invest in Innovation",headline:"The slow-burn bet on tomorrow.",outcome:"R&D receives the windfall. Three patents filed. In five years those patents will be worth more than the company.",dm:-80,dp:12,dd:12,advice:"Innovation investment creates asymmetric upside. This is how category-defining companies are built.",tip:"💡 Terra Verdict: Vision over extraction."},
    {icon:"🌱",text:"Sustainable Legacy Plan",headline:"A CEO who counted more than money.",outcome:"You sacrifice the quarterly spike for a 10-year plan. Three cities issue commendations. A generation studies your tenure.",dm:-60,dp:18,dd:18,advice:"Sustainability is the only strategy viable across a full century. You understood what most CEOs never do.",tip:"💡 Terra Verdict: The world survived because you chose to lead it."}
  ]}
];

var G={money:0,planet:0,people:0},yr=0;

function startGame(){
  ding();
  // difficulty multiplier
  var diff=document.getElementById('set-difficulty').value;
  window.diffMult=diff==='hard'?1.4:diff==='easy'?0.6:1.0;
  G={money:600,planet:72,people:72};yr=0;
  gameStartTime=Date.now();coalChosen=false;
  saveData.plays=(saveData.plays||0)+1;saveSave();updateMenuStats();
  document.getElementById('intro-screen').classList.remove('active');
  document.getElementById('intro-screen').style.display='none';
  var gs=document.getElementById('game-screen');
  gs.classList.add('active');
  renderYear();
}

function renderYear(){
  document.getElementById('game-bg').style.backgroundImage="url('"+yearBgs[yr]+"')";
  document.getElementById('year-num').textContent='YEAR '+(yr+1);
  document.getElementById('event-tag').textContent=years[yr].event;
  document.getElementById('event-box').textContent=years[yr].desc;
  document.getElementById('result-panel').classList.remove('show');
  renderDots();renderChoices(years[yr].choices);
  var gs=document.getElementById('game-screen');gs.scrollTop=0;
}

function renderDots(){
  var html='';
  for(var i=0;i<years.length;i++){
    var c='ydot';if(i<yr)c+=' done';else if(i===yr)c+=' curr';
    html+='<div class="'+c+'" title="Year '+(i+1)+'"></div>';
  }
  document.getElementById('year-dots').innerHTML=html;
}

function renderChoices(choices){
  var html='';
  for(var i=0;i<choices.length;i++){
    html+='<button class="cbtn" onclick="pick('+i+')">'
      +'<span class="cbtn-icon">'+choices[i].icon+'</span>'
      +'<span>'+choices[i].text+'</span>'
      +'</button>';
  }
  document.getElementById('choices').innerHTML=html;
}

function pick(idx){
  ding();
  var c=years[yr].choices[idx];
  // track coal choice for achievement
  if(c.icon==='🏭'||c.icon==='😈')coalChosen=true;
  // apply difficulty multiplier to negative deltas
  var mult=window.diffMult||1.0;
  var dm=c.dm<0?Math.round(c.dm*mult):c.dm;
  var dp=c.dp<0?Math.round(c.dp*mult):c.dp;
  var dd=c.dd<0?Math.round(c.dd*mult):c.dd;
  c=Object.assign({},c,{dm:dm,dp:dp,dd:dd});
  G.money=Math.max(0,G.money+c.dm);
  G.planet=Math.min(100,G.planet+c.dp);
  G.people=Math.min(100,G.people+c.dd);
  function chg(v,lbl){if(v===0)return'<span class="chg neu">'+lbl+' ±0</span>';return'<span class="chg '+(v>0?'pos':'neg')+'">'+lbl+' '+(v>0?'+':'')+v+'</span>';}
  document.getElementById('change-row').innerHTML=chg(c.dm,'💰')+chg(c.dp,'🌍')+chg(c.dd,'👥');
  document.getElementById('outcome-headline').textContent=c.headline;
  document.getElementById('outcome-text').textContent=c.outcome;
  document.getElementById('sv-money').textContent='$'+G.money;
  document.getElementById('sv-planet').textContent=Math.max(0,G.planet)+'%';
  document.getElementById('sv-people').textContent=Math.max(0,G.people)+'%';
  document.getElementById('sb-money').style.width=Math.min(100,Math.max(0,G.money/10))+'%';
  document.getElementById('sb-planet').style.width=Math.max(0,G.planet)+'%';
  document.getElementById('sb-people').style.width=Math.max(0,G.people)+'%';
  document.getElementById('advisor-text').textContent=c.advice;
  document.getElementById('advisor-tip').textContent=c.tip;
  document.getElementById('btn-next').textContent=yr>=years.length-1?'SEE FINAL VERDICT →':'NEXT YEAR →';
  document.getElementById('choices').innerHTML='';
  document.getElementById('result-panel').classList.add('show');
  chime();
  setTimeout(function(){document.getElementById('game-screen').scrollTop=300;},120);
  if(G.planet<=0){setTimeout(function(){badSound();gameOver('🌍 Planetary collapse. Ecological systems failed. You are fired.');},600);return;}
  if(G.people<=0){setTimeout(function(){badSound();gameOver('👥 Mass revolt. Workers have had enough. Your corporation is dissolved.');},600);return;}
}

function nextYear(){
  ding();yr++;
  if(yr>=years.length){setTimeout(showWin,300);}
  else if(yr===4){
    // Launch Policy Blitz before Year 5!
    setTimeout(launchMiniGame,300);
  }
  else{renderYear();}
}

function gameOver(msg){
  document.getElementById('gameover-msg').textContent=msg;
  document.getElementById('gameover-overlay').classList.add('active');
}

function showWin(){
  winSound();
  // track win
  saveData.wins=(saveData.wins||0)+1;
  var score=G.money;
  if(!saveData.bestScore||score>saveData.bestScore)saveData.bestScore=score;
  saveSave();updateMenuStats();
  // achievements
  unlockAchievement('first_win');
  if(G.planet>60&&G.people>60&&G.money>500)unlockAchievement('triple_crown');
  if(G.planet>80)unlockAchievement('eco_hero');
  if(G.people>85)unlockAchievement('people_champ');
  if(G.money>700)unlockAchievement('profit_king');
  if(!coalChosen)unlockAchievement('no_coal');
  var elapsed=(Date.now()-gameStartTime)/1000;
  if(elapsed<180)unlockAchievement('speed_run');
  var p=function(v){return Math.max(0,Math.min(100,v));};
  document.getElementById('final-scores').innerHTML=
    '<div class="fscore"><div class="fval" style="color:var(--gold)">$'+G.money+'</div><div class="flab">Profit</div></div>'+
    '<div class="fscore"><div class="fval" style="color:var(--green)">'+p(G.planet)+'%</div><div class="flab">Planet</div></div>'+
    '<div class="fscore"><div class="fval" style="color:var(--blue)">'+p(G.people)+'%</div><div class="flab">People</div></div>';
  var msg='';
  if(G.planet>60&&G.people>60&&G.money>500)msg='A rare triple win. You proved profit, people and planet can coexist. Textbooks will be written about your tenure. 🌟';
  else if(G.planet<25)msg='The corporation survived — but the planet did not fare so well. Future generations will ask questions. 🌫️';
  else if(G.people<25)msg='Eight years in the boardroom. Workers remember every cut. History is not kind to all survivors. 😔';
  else if(G.money<200)msg='You saved the world but nearly bankrupted the company. Audacious. Uncomfortable. Arguably heroic. 📉';
  else msg='Eight brutal fiscal years. Compromises made, battles won and lost. Terra Verdict: Survivor. 🎯';
  document.getElementById('win-msg').textContent=msg;
  document.getElementById('win-overlay').classList.add('active');
}

function restartGame(){
  document.getElementById('gameover-overlay').classList.remove('active');
  document.getElementById('win-overlay').classList.remove('active');
  var gs=document.getElementById('game-screen');
  gs.classList.remove('active');gs.style.display='';
  var is=document.getElementById('intro-screen');
  is.style.display='';is.classList.add('active');
  yr=0;
}

// ── POLICY BLITZ MINI-GAME ──
var mgCards=[
  {icon:'☀️',text:'Subsidise solar & wind farms',hint:'Renewable energy policy',good:true},
  {icon:'🏭',text:'Open 20 new coal plants',hint:'Energy expansion policy',good:false},
  {icon:'🌳',text:'Plant 1 billion trees nationwide',hint:'Reforestation initiative',good:true},
  {icon:'🐟',text:'Dump industrial waste in rivers',hint:'Waste disposal method',good:false},
  {icon:'🚲',text:'Build citywide cycling networks',hint:'Urban transport policy',good:true},
  {icon:'✈️',text:'Remove all aviation emissions tax',hint:'Transport deregulation',good:false},
  {icon:'♻️',text:'Mandate 80% recycled packaging',hint:'Circular economy law',good:true},
  {icon:'🔥',text:'Clear rainforests for farmland',hint:'Land use policy',good:false},
  {icon:'💧',text:'Invest in water purification systems',hint:'Clean water initiative',good:true},
  {icon:'🧪',text:'Legalise ocean plastic dumping',hint:'Waste regulation rollback',good:false},
  {icon:'⚡',text:'Build nuclear power plants',hint:'Clean energy alternative',good:true},
  {icon:'🐄',text:'Double industrial livestock farming',hint:'Food production expansion',good:false},
  {icon:'🏙️',text:'Create green building standards',hint:'Construction regulation',good:true},
  {icon:'💨',text:'Remove all emission standards',hint:'Industrial deregulation',good:false},
  {icon:'🌊',text:'Protect 30% of ocean territory',hint:'Marine conservation',good:true},
  {icon:'🛢️',text:'Drill for oil in nature reserves',hint:'Resource extraction',good:false},
  {icon:'🎓',text:'Fund climate science education',hint:'Education initiative',good:true},
  {icon:'🏗️',text:'Build highways through wetlands',hint:'Infrastructure expansion',good:false},
  {icon:'🌞',text:'100% renewable energy by 2040',hint:'National energy target',good:true},
  {icon:'💣',text:'Burn crop waste openly in fields',hint:'Agricultural practice',good:false},
];

var mgState={score:0,streak:0,correct:0,total:0,timerInterval:null,timeLeft:20,deck:[],cardIdx:0,done:false,bonus:0};

function shuffleArr(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}

function launchMiniGame(){
  document.getElementById('game-screen').classList.remove('active');
  document.getElementById('game-screen').style.display='none';
  var mg=document.getElementById('minigame-screen');
  mg.classList.add('active');
  mgState={score:0,streak:0,correct:0,total:0,timerInterval:null,timeLeft:20,deck:[],cardIdx:0,done:false,bonus:0};
  mgState.deck=shuffleArr(mgCards.slice()).slice(0,12);
  document.getElementById('mg-result').style.display='none';
  document.getElementById('mg-card-area').style.display='flex';
  document.getElementById('mg-buckets').style.display='flex';
  document.getElementById('mg-feedback').textContent='';
  mgUpdateScore();
  mgShowCard();
  mgStartTimer();
  setupMgDrag();
  setupMgTouch();
}

function mgStartTimer(){
  mgState.timeLeft=20;
  mgUpdateTimer();
  mgState.timerInterval=setInterval(function(){
    mgState.timeLeft-=0.1;
    mgUpdateTimer();
    if(mgState.timeLeft<=0){clearInterval(mgState.timerInterval);mgFinish();}
  },100);
}

function mgUpdateTimer(){
  var pct=Math.max(0,(mgState.timeLeft/20)*100);
  document.getElementById('mg-timer-fill').style.width=pct+'%';
  document.getElementById('mg-timer-text').textContent=Math.ceil(Math.max(0,mgState.timeLeft))+'s';
}

function mgShowCard(){
  if(mgState.cardIdx>=mgState.deck.length){mgFinish();return;}
  var c=mgState.deck[mgState.cardIdx];
  var card=document.getElementById('mg-card');
  card.className='card-pop';
  document.getElementById('mg-card-icon').textContent=c.icon;
  document.getElementById('mg-card-text').textContent=c.text;
  document.getElementById('mg-card-hint').textContent=c.hint;
  card.setAttribute('data-good',c.good?'1':'0');
  setTimeout(function(){card.classList.remove('card-pop');},300);
}

function mgUpdateScore(){
  document.getElementById('mg-score').textContent='Score: '+mgState.score;
  document.getElementById('mg-streak').textContent=mgState.streak>=3?'🔥 x'+mgState.streak:'';
}

function mgAnswer(isGood){
  if(mgState.done)return;
  var card=document.getElementById('mg-card');
  var correct=mgState.deck[mgState.cardIdx].good===isGood;
  mgState.total++;
  var fb=document.getElementById('mg-feedback');
  if(correct){
    mgState.streak++;mgState.correct++;
    var pts=10+(mgState.streak>=3?5:0);
    mgState.score+=pts;
    fb.style.color='#22c55e';
    fb.textContent=mgState.streak>=3?'🔥 COMBO +'+pts:'✓ CORRECT +'+pts;
    ding();
    // flash good bucket
    document.getElementById('mg-good').classList.add('highlight');
    setTimeout(function(){document.getElementById('mg-good').classList.remove('highlight');},400);
  } else {
    mgState.streak=0;
    fb.style.color='#ef4444';
    fb.textContent='✗ WRONG — '+(mgState.deck[mgState.cardIdx].good?'That was beneficial!':'That was harmful!');
    badSound();
    document.getElementById('mg-bad').classList.add('highlight');
    setTimeout(function(){document.getElementById('mg-bad').classList.remove('highlight');},400);
  }
  mgUpdateScore();
  mgState.cardIdx++;
  setTimeout(function(){
    fb.textContent='';
    if(mgState.cardIdx>=mgState.deck.length){mgFinish();}
    else{mgShowCard();}
  },700);
}

function mgDrop(bucket){
  mgAnswer(bucket==='good');
}

function mgFinish(){
  if(mgState.done)return;
  mgState.done=true;
  clearInterval(mgState.timerInterval);
  document.getElementById('mg-card-area').style.display='none';
  document.getElementById('mg-buckets').style.display='none';
  document.getElementById('mg-feedback').textContent='';
  var pct=mgState.total>0?Math.round((mgState.correct/mgState.total)*100):0;
  // calculate bonus for main game
  mgState.bonus=pct>=80?15:pct>=60?8:pct>=40?3:0;
  var bonusType=pct>=80?'planet':pct>=60?'people':pct>=40?'money':'none';
  var result=document.getElementById('mg-result');
  result.style.display='block';
  var icon=pct>=80?'🌟':pct>=60?'✅':pct>=40?'😐':'💀';
  var title=pct>=80?'POLICY GENIUS':pct>=60?'SOLID LEADER':pct>=40?'NEEDS WORK':'POLICY DISASTER';
  var titleColor=pct>=80?'var(--gold)':pct>=60?'var(--green)':pct>=40?'var(--blue)':'var(--red)';
  document.getElementById('mg-result-icon').textContent=icon;
  document.getElementById('mg-result-title').textContent=title;
  document.getElementById('mg-result-title').style.color=titleColor;
  document.getElementById('mg-result-msg').textContent=
    mgState.correct+' of '+mgState.total+' policies sorted correctly ('+pct+'%). '+(mgState.score>0?'Final score: '+mgState.score+' pts.':'');
  if(mgState.bonus>0){
    var bonusLabel={planet:'🌍 Planet +'+mgState.bonus,people:'👥 People +'+mgState.bonus,money:'💰 Profit +$'+(mgState.bonus*10)};
    document.getElementById('mg-result-bonus').textContent='BONUS REWARD: '+bonusLabel[bonusType];
    document.getElementById('mg-result-bonus').style.color=pct>=80?'var(--gold)':'var(--green)';
    mgState.bonusType=bonusType;
  } else {
    document.getElementById('mg-result-bonus').textContent='No bonus earned this round.';
    document.getElementById('mg-result-bonus').style.color='rgba(255,255,255,0.4)';
  }
  winSound();
  if(pct>=80)unlockAchievement('policy_ace');
}

function endMiniGame(){
  // Apply bonus to game state
  if(mgState.bonus>0){
    if(mgState.bonusType==='planet') G.planet=Math.min(100,G.planet+mgState.bonus);
    else if(mgState.bonusType==='people') G.people=Math.min(100,G.people+mgState.bonus);
    else if(mgState.bonusType==='money') G.money+=mgState.bonus*10;
  }
  document.getElementById('minigame-screen').classList.remove('active');
  var gs=document.getElementById('game-screen');
  gs.style.display='block';gs.classList.add('active');
  renderYear();
}

// Drag support
function setupMgDrag(){
  var card=document.getElementById('mg-card');
  card.setAttribute('draggable','true');
  card.addEventListener('dragstart',function(e){card.classList.add('dragging');e.dataTransfer.effectAllowed='move';});
  card.addEventListener('dragend',function(){card.classList.remove('dragging');});
}

// Touch/swipe support
function setupMgTouch(){
  var card=document.getElementById('mg-card');
  var startX=0;
  card.addEventListener('touchstart',function(e){startX=e.touches[0].clientX;},{ passive:true });
  card.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-startX;
    if(Math.abs(dx)>60){mgAnswer(dx>0);}
  });
  // Click buckets directly
  document.getElementById('mg-good').addEventListener('click',function(){mgAnswer(true);});
  document.getElementById('mg-bad').addEventListener('click',function(){mgAnswer(false);});
  // Keyboard arrows
  document.addEventListener('keydown',function(e){
    if(!mgState.done&&document.getElementById('minigame-screen').classList.contains('active')){
      if(e.key==='ArrowRight')mgAnswer(true);
      if(e.key==='ArrowLeft')mgAnswer(false);
    }
  });
  // Mouse drag on card
  var mx0=0,draggingMouse=false;
  card.addEventListener('mousedown',function(e){mx0=e.clientX;draggingMouse=true;});
  document.addEventListener('mouseup',function(e){
    if(draggingMouse&&document.getElementById('minigame-screen').classList.contains('active')){
      var dx=e.clientX-mx0;
      if(Math.abs(dx)>60){mgAnswer(dx>0);}
      draggingMouse=false;
      card.classList.remove('tilt-left','tilt-right');
    }
  });
  document.addEventListener('mousemove',function(e){
    if(draggingMouse){
      var dx=e.clientX-mx0;
      if(dx<-20){card.classList.add('tilt-left');card.classList.remove('tilt-right');}
      else if(dx>20){card.classList.add('tilt-right');card.classList.remove('tilt-left');}
      else{card.classList.remove('tilt-left','tilt-right');}
    }
  });
}

window.addEventListener('load',function(){
  loadSave();
  runCinematic();
});