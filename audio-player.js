/* Shared speech playback for Core and Premium; learning state is never touched. */
(()=>{
 'use strict';
// Dialogue playback shared by the three ISM apps. Only English voices; no recording.
function parseDialogue(input) {
  if (Array.isArray(input)) return input.map(line => typeof line === 'string' ? parseDialogue(line) : [line]).flat();
  const text = String(input || '').trim();
  const pattern = /(?:^|\s)([A-Z][A-Za-z'’ -]{0,34}):\s+/g;
  const matches = [...text.matchAll(pattern)];
  if (!matches.length || matches[0].index !== 0) return text ? [{speaker:'Narrador',text,voiceSlot:0}] : [];
  return matches.map((match,index) => ({speaker:match[1].trim(),text:text.slice(match.index + match[0].length,matches[index+1]?.index ?? text.length).trim()}));
}

function createDialoguePlayer(options) {
  let generation=0,media=null,timer=null,utterance=null,last=[],lastSettings={};
  const publish=(state,index=-1,note='')=>options.publish?.({state,index,note,segments:last});
  function stop(silent=false) {
    generation++;clearTimeout(timer);timer=null;
    const speaking=!!utterance;
    if(media){media.onended=null;media.onerror=null;media.pause();media.removeAttribute('src');media.load();media=null;}
    if(utterance){utterance.onend=null;utterance.onerror=null;utterance.onstart=null;utterance=null;}
    if(speaking)options.synthesis?.cancel();if(!silent&&last.length)publish('stopped');
  }
  async function play(input,settings={}) {
    stop(true);options.cancelOther?.();
    const token=generation;
    const identities=[];
    last=parseDialogue(input).filter(line=>line.text?.trim()).map(line=>{
      const speaker=String(line.speaker||'Narrador');
      if(!identities.includes(speaker))identities.push(speaker);
      return {...line,speaker,voiceSlot:line.voiceSlot===0||line.voiceSlot===1?line.voiceSlot:identities.indexOf(speaker)%2};
    });
    lastSettings=settings;if(!last.length)return;
    publish('loading');
    const available=(await options.prepare()).filter(voice=>/^en(?:[-_]|$)/i.test(voice.lang));
    if(token!==generation)return;
    const a=available.find(voice=>voice.voiceURI===options.voiceA?.())||available.find(voice=>/^en-US$/i.test(voice.lang))||available[0];
    const b=available.find(voice=>voice.voiceURI===options.voiceB?.()&&voice!==a)||available.find(voice=>voice!==a)||a;
    const requested=Number(settings.rate??options.rate?.()??.85);
    const rate=Number.isFinite(requested)?Math.min(1.15,Math.max(.6,requested)):.85;
    const note=a===b?'Este aparelho oferece uma única voz em inglês; os personagens usam variações leves de ritmo e tom.':'Duas vozes em inglês, fixas por personagem.';
    let index=Number.isInteger(settings.from)?settings.from:0;
    const end=settings.single?index+1:last.length;
    const next=()=>{
      if(token!==generation)return;
      if(index>=end){publish('ended',-1,note);return;}
      const line=last[index];
      const complete=()=>{if(token!==generation)return;clearTimeout(timer);index++;timer=setTimeout(next,320);};
      let usedFallback=false;
      const fallback=()=>{
        if(token!==generation||usedFallback)return;
        usedFallback=true;
        clearTimeout(timer);
        if(media){media.onended=null;media.onerror=null;media.pause();media.removeAttribute('src');media.load();media=null;}
        const voice=line.voiceSlot===1?b:a;
        if(!voice||!options.synthesis||!options.makeUtterance){publish('error',index,'Nenhuma voz em inglês disponível. Use a transcrição ou ative inglês no aparelho.');return;}
        const u=options.makeUtterance(line.text);utterance=u;
        u.voice=voice;u.lang=voice.lang;u.rate=rate*(line.voiceSlot===1?.98:1);
        u.pitch=(line.voiceSlot===1?1.06:.97)+(line.text.endsWith('?')?.025:0);u.volume=1;
        timer=setTimeout(()=>{if(token===generation){stop(true);publish('error',index,'A voz não iniciou. Confira o aparelho e tente novamente.');}},12000);
        u.onstart=()=>{if(token!==generation)return;clearTimeout(timer);publish('playing',index,note);};
        u.onend=complete;
        u.onerror=()=>{if(token===generation){stop(true);publish('error',index,'Não foi possível reproduzir. Tente outra voz ou leia a transcrição.');}};
        try{options.synthesis.speak(u);}catch{u.onerror();}
      };
      // Files must already be served by this app, including protected routes for Premium.
      // Never copy protected URLs into a public manifest or persist signed URLs.
      let url;
      try{url=line.audioUrl?new URL(line.audioUrl,options.origin):null;}catch{url=null;}
      if(url&&url.origin===options.origin&&/^https?:$/.test(url.protocol)&&options.makeAudio){
        const audio=options.makeAudio(url.href);media=audio;audio.playbackRate=rate;
        audio.onended=complete;audio.onerror=fallback;
        timer=setTimeout(fallback,12000);
        Promise.resolve(audio.play()).then(()=>{if(token===generation&&media===audio){clearTimeout(timer);publish('playing',index,'Áudio gravado.');}}).catch(fallback);
      }else fallback();
    };
    next();
  }
  return {play,stop,repeat:()=>play(last,{...lastSettings,from:0,single:false}),line:index=>last[index]?play(last,{...lastSettings,from:index,single:true}):undefined};
}




 const synth=window.speechSynthesis;
 const supported=!!synth&&typeof window.SpeechSynthesisUtterance==='function';
 let dialogue=null;let voices=[],selected='',current=null,run=0,timer=null,last=null;const playback={text:'',rate:.95,started:0};
 try{selected=JSON.parse(localStorage.getItem('ismbe:audio:v1')||'{}').voice||'';}catch{}
 const panel=document.createElement('details');panel.className='audio-settings learner-support-setting';
 panel.innerHTML='<summary>Áudio · vozes, diálogo e teste</summary><div class="audio-controls"><label for="ismVoice">Voz em inglês</label><select id="ismVoice" aria-describedby="ismAudioHelp"></select><label for="ismVoiceB">Segunda voz do diálogo</label><select id="ismVoiceB"></select><label for="ismDialogueRate">Velocidade dos diálogos</label><select id="ismDialogueRate"><option value=".7">Lento</option><option value=".95" selected>Normal</option><option value="1">Original</option></select><div class="audio-buttons"><button type="button" id="ismTest" class="btn soft">TESTAR ÁUDIO</button><button type="button" id="ismRepeat" class="btn soft" disabled>REPETIR</button><button type="button" id="ismStop" class="btn soft" disabled>PARAR</button></div><p id="ismAudioHelp">No Android, use uma voz em inglês do aparelho. O áudio começa ao tocar em Ouvir. Se necessário, ative ou instale inglês nas configurações de texto para fala do Android.</p></div>';
 const status=document.createElement('p');status.id='ismAudioStatus';status.className='audio-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const main=document.querySelector('main');main.prepend(status,panel);
 const select=panel.querySelector('select'),stopButton=panel.querySelector('#ismStop'),repeat=panel.querySelector('#ismRepeat');
 function tell(message){status.textContent=message;}
 function refresh(){
   if(!supported){select.disabled=true;panel.querySelector('#ismTest').disabled=true;tell('Este navegador não oferece leitura de texto. Abra o app no Chrome para Android e verifique as vozes do aparelho.');return;}
   try{voices=synth.getVoices().filter(v=>/^en(?:[-_]|$)/i.test(v.lang));}catch{voices=[];}
   const second=panel.querySelector('#ismVoiceB'),savedSecond=second.value;second.replaceChildren(new Option('Automática · outra voz',''));voices.forEach(v=>second.add(new Option(v.name+' · '+v.lang,v.voiceURI)));second.value=savedSecond;
   select.replaceChildren(new Option('Automática · inglês',''));
   voices.forEach(v=>select.add(new Option(v.name+' · '+v.lang,v.voiceURI)));
   select.value=voices.some(v=>v.voiceURI===selected)?selected:'';
 }
 select.addEventListener('change',()=>{selected=select.value;stop();try{localStorage.setItem('ismbe:audio:v1',JSON.stringify({voice:selected}));}catch{}tell('Voz selecionada. Toque em TESTAR ÁUDIO.');});
 function stop(message='Áudio parado.'){
   dialogue?.stop();run++;clearTimeout(timer);current=null;if(supported)synth.cancel();stopButton.disabled=true;
   if(message)tell(message);
 }
 function chunks(text){
   const result=[];let part='';
   for(const word of text.trim().split(/\s+/)){
     if(part&&(part.length+word.length>220)){result.push(part);part='';}
     part+=(part?' ':'')+word;
     if(/[.!?]$/.test(word)&&part.length>=90){result.push(part);part='';}
   }
   if(part)result.push(part);return result;
 }
 function speak(text,rate=.95,regional=null){
   if(!supported){refresh();return;}
   const clean=String(text??'').trim();if(!clean)return;
   const lines=parseDialogue(clean);if(!regional&&new Set(lines.map(line=>line.speaker)).size>1){last={dialogue:lines,rate:rate===.95?Number(panel.querySelector('#ismDialogueRate').value):rate};repeat.disabled=false;stopButton.disabled=false;void dialogue.play(lines,{rate:last.rate});return;}
   stop(null);refresh();
   const available=synth.getVoices();
   if(!regional&&available.length&&!voices.length){panel.open=true;tell('Nenhuma voz em inglês disponível. Instale ou ative inglês nas configurações de texto para fala do Android e teste novamente.');return;}
   const matches=regional?voices.filter(v=>v.lang.replace(/_/g,'-').toLowerCase()===regional.lang.toLowerCase()):voices;
   if(regional&&!matches.length){last=null;repeat.disabled=true;panel.open=true;tell('Áudio regional indisponível: '+regional.label+'. Nenhuma voz compatível foi encontrada neste navegador. Use a transcrição ou o botão de voz geral, que não representa o sotaque solicitado.');return;}
   const voice=matches.find(v=>v.voiceURI===selected)||(regional?matches.find(v=>v.localService)||matches[0]:voices.find(v=>/^en-US$/i.test(v.lang)&&v.localService)||voices.find(v=>/^en-US$/i.test(v.lang))||voices[0])||null;
   const speed=Number.isFinite(Number(rate))?Math.max(.5,Math.min(1.3,Number(rate))):.95;
   last={text:clean,rate:speed,regional};playback.text=clean;playback.rate=speed;playback.started=Date.now();repeat.disabled=false;const token=run,parts=chunks(clean);let index=0;
   stopButton.disabled=false;
   function next(){
     if(token!==run)return;
     if(index>=parts.length){current=null;stopButton.disabled=true;tell('Áudio concluído.');return;}
     const u=new SpeechSynthesisUtterance(parts[index++]);current=u;u.lang=voice?.lang||'en-US';if(voice)u.voice=voice;u.rate=speed;u.pitch=1;u.volume=1;
     tell('Preparando áudio em inglês…');
     timer=setTimeout(()=>{if(token===run){stop(null);panel.open=true;tell('A voz não iniciou. Verifique o volume de mídia, a voz em inglês e a conexão; depois toque em TESTAR ÁUDIO.');}},12000);
     u.onstart=()=>{if(token!==run)return;clearTimeout(timer);tell('Reproduzindo '+(regional?regional.label+' · '+voice.name:'em inglês')+(speed<.85?' · lento':'')+' · trecho '+index+'/'+parts.length);};
     u.onend=()=>{if(token!==run)return;clearTimeout(timer);next();};
     u.onerror=e=>{if(token!==run)return;stop(null);panel.open=true;const messages={'not-allowed':'Toque novamente em Ouvir para permitir a reprodução.','language-unavailable':'A voz em inglês não está instalada. Verifique as configurações de texto para fala do Android.','voice-unavailable':'Esta voz não está disponível. Selecione outra voz e teste novamente.','network':'A voz precisa de conexão. Verifique a internet ou escolha uma voz instalada no aparelho.','audio-busy':'O áudio está ocupado por outro aplicativo. Tente novamente.','audio-hardware':'Não foi possível acessar a saída de áudio. Verifique o aparelho e tente novamente.'};tell(messages[e.error]||'Não foi possível reproduzir. Verifique o volume de mídia e teste outra voz em inglês.');};
     try{synth.speak(u);}catch{stop(null);panel.open=true;tell('Não foi possível iniciar a voz. Toque em TESTAR ÁUDIO para tentar novamente.');}
   }
   next();
 }
 panel.querySelector('#ismTest').onclick=()=>speak('Welcome to Business English. Let’s practice clear and confident communication.');
 repeat.onclick=()=>{if(last?.dialogue)void dialogue.play(last.dialogue,{rate:last.rate});else if(last)speak(last.text,last.rate,last.regional);};stopButton.onclick=()=>stop();

 function updateDialogue(event){
  let box=panel.querySelector('[data-dialogue]');
  if(!box){box=document.createElement('section');box.dataset.dialogue='';box.setAttribute('aria-label','Transcrição e falas do diálogo');panel.append(box);}
  if(event.state==='loading'){
   box.replaceChildren();const heading=document.createElement('p');heading.textContent='Diálogo · transcrição e reprodução por fala';box.append(heading);
   event.segments.forEach((line,index)=>{const row=document.createElement('p');row.lang='en';row.dataset.line=String(index);const label=document.createElement('span');label.textContent=line.speaker+': '+line.text;const button=document.createElement('button');button.type='button';button.textContent='Ouvir fala '+(index+1);button.onclick=()=>dialogue.line(index);row.append(label,button);box.append(row);});
  }
  box.querySelectorAll('[data-line]').forEach(row=>{const active=event.state==='playing'&&Number(row.dataset.line)===event.index;row.style.outline=active?'2px solid currentColor':'';if(active)row.setAttribute('aria-current','true');else row.removeAttribute('aria-current');});
  const labels={loading:'Preparando diálogo…',playing:'Reproduzindo '+(event.segments[event.index]?.speaker||'')+' · fala '+(event.index+1),ended:'Diálogo concluído.',stopped:'Áudio parado.',error:'Áudio indisponível.'};
  tell(labels[event.state]+' '+event.note);
 }

 dialogue=createDialoguePlayer({synthesis:synth,origin:window.location?.origin||'http://localhost',prepare:async()=>{if(supported&&!synth.getVoices().length)await new Promise(resolve=>{const done=()=>{clearTimeout(wait);synth.removeEventListener('voiceschanged',done);resolve()};const wait=setTimeout(done,900);synth.addEventListener('voiceschanged',done)});return supported?synth.getVoices():[];},makeUtterance:text=>new SpeechSynthesisUtterance(text),makeAudio:url=>new Audio(url),voiceA:()=>selected,voiceB:()=>panel.querySelector('#ismVoiceB').value,rate:()=>Number(panel.querySelector('#ismDialogueRate').value),cancelOther:()=>stop(null),publish:event=>{updateDialogue(event);stopButton.disabled=!['loading','playing'].includes(event.state);}});
 panel.querySelector('#ismVoiceB').onchange=()=>stop();panel.querySelector('#ismDialogueRate').onchange=()=>stop();
 window.addEventListener('hashchange',()=>stop(null));
 if(supported)synth.addEventListener('voiceschanged',refresh);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.addEventListener('pagehide',()=>stop(null));
 // Prevent speech continuing after leaving an activity, including dynamic Premium views.
 const view=document.getElementById('view');if(view)new MutationObserver(()=>{stop();}).observe(view,{childList:true});
 document.querySelectorAll('.panel').forEach(p=>new MutationObserver(()=>{stop();}).observe(p,{attributes:true,attributeFilter:['class']}));
 function capability(){return {supported,englishVoices:voices.length,selected:selected||'auto',lastText:playback.text,lastRate:playback.rate};}
 window.ISMAudio={speak,stop,capability,speakDialogue:(lines,settings={})=>{last={dialogue:parseDialogue(lines),rate:settings.rate??Number(panel.querySelector('#ismDialogueRate').value)};repeat.disabled=false;return dialogue.play(last.dialogue,{rate:last.rate});}};refresh();
})();
