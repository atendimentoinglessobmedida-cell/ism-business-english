/* Shared speech playback for Core and Premium; learning state is never touched. */
(()=>{
 'use strict';
 const synth=window.speechSynthesis;
 const supported=!!synth&&typeof window.SpeechSynthesisUtterance==='function';
 let voices=[],selected='',current=null,run=0,timer=null,last=null;
 try{selected=JSON.parse(localStorage.getItem('ismbe:audio:v1')||'{}').voice||'';}catch{}
 const panel=document.createElement('details');panel.className='audio-settings';
 panel.innerHTML='<summary>Áudio · voz e teste</summary><div class="audio-controls"><label for="ismVoice">Voz em inglês</label><select id="ismVoice" aria-describedby="ismAudioHelp"></select><div class="audio-buttons"><button type="button" id="ismTest" class="btn soft">TESTAR ÁUDIO</button><button type="button" id="ismRepeat" class="btn soft" disabled>REPETIR</button><button type="button" id="ismStop" class="btn soft" disabled>PARAR</button></div><p id="ismAudioHelp">No Android, use uma voz em inglês do aparelho. O áudio começa ao tocar em Ouvir. Se necessário, ative ou instale inglês nas configurações de texto para fala do Android.</p></div>';
 const status=document.createElement('p');status.id='ismAudioStatus';status.className='audio-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const main=document.querySelector('main');main.prepend(status);main.prepend(panel);
 const select=panel.querySelector('select'),stopButton=panel.querySelector('#ismStop'),repeat=panel.querySelector('#ismRepeat');
 function tell(message){status.textContent=message;}
 function refresh(){
   if(!supported){select.disabled=true;panel.querySelector('#ismTest').disabled=true;tell('Este navegador não oferece leitura de texto. Abra o app no Chrome para Android e verifique as vozes do aparelho.');return;}
   try{voices=synth.getVoices().filter(v=>/^en(?:[-_]|$)/i.test(v.lang));}catch{voices=[];}
   select.replaceChildren(new Option('Automática · inglês',''));
   voices.forEach(v=>select.add(new Option(v.name+' · '+v.lang,v.voiceURI)));
   select.value=voices.some(v=>v.voiceURI===selected)?selected:'';
 }
 select.addEventListener('change',()=>{selected=select.value;stop();try{localStorage.setItem('ismbe:audio:v1',JSON.stringify({voice:selected}));}catch{}tell('Voz selecionada. Toque em TESTAR ÁUDIO.');});
 function stop(message='Áudio parado.'){
   run++;clearTimeout(timer);current=null;if(supported)synth.cancel();stopButton.disabled=true;
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
 function speak(text,rate=.95){
   if(!supported){refresh();return;}
   const clean=String(text??'').trim();if(!clean)return;
   stop(null);refresh();
   const available=synth.getVoices();
   if(available.length&&!voices.length){panel.open=true;tell('Nenhuma voz em inglês disponível. Instale ou ative inglês nas configurações de texto para fala do Android e teste novamente.');return;}
   const voice=voices.find(v=>v.voiceURI===selected)||voices.find(v=>/^en-US$/i.test(v.lang)&&v.localService)||voices.find(v=>/^en-US$/i.test(v.lang))||voices[0]||null;
   const speed=Number.isFinite(Number(rate))?Math.max(.5,Math.min(1.3,Number(rate))):.95;
   last={text:clean,rate:speed};repeat.disabled=false;const token=run,parts=chunks(clean);let index=0;
   stopButton.disabled=false;
   function next(){
     if(token!==run)return;
     if(index>=parts.length){current=null;stopButton.disabled=true;tell('Áudio concluído.');return;}
     const u=new SpeechSynthesisUtterance(parts[index++]);current=u;u.lang=voice?.lang||'en-US';if(voice)u.voice=voice;u.rate=speed;u.pitch=1;u.volume=1;
     tell('Preparando áudio em inglês…');
     timer=setTimeout(()=>{if(token===run){stop(null);panel.open=true;tell('A voz não iniciou. Verifique o volume de mídia, a voz em inglês e a conexão; depois toque em TESTAR ÁUDIO.');}},12000);
     u.onstart=()=>{if(token!==run)return;clearTimeout(timer);tell('Reproduzindo em inglês'+(speed<.85?' · lento':'')+' · trecho '+index+'/'+parts.length);};
     u.onend=()=>{if(token!==run)return;clearTimeout(timer);next();};
     u.onerror=e=>{if(token!==run)return;stop(null);panel.open=true;const messages={'not-allowed':'Toque novamente em Ouvir para permitir a reprodução.','language-unavailable':'A voz em inglês não está instalada. Verifique as configurações de texto para fala do Android.','voice-unavailable':'Esta voz não está disponível. Selecione outra voz e teste novamente.','network':'A voz precisa de conexão. Verifique a internet ou escolha uma voz instalada no aparelho.','audio-busy':'O áudio está ocupado por outro aplicativo. Tente novamente.','audio-hardware':'Não foi possível acessar a saída de áudio. Verifique o aparelho e tente novamente.'};tell(messages[e.error]||'Não foi possível reproduzir. Verifique o volume de mídia e teste outra voz em inglês.');};
     try{synth.speak(u);}catch{stop(null);panel.open=true;tell('Não foi possível iniciar a voz. Toque em TESTAR ÁUDIO para tentar novamente.');}
   }
   next();
 }
 panel.querySelector('#ismTest').onclick=()=>speak('Welcome to Business English. Let’s practice clear and confident communication.');
 repeat.onclick=()=>{if(last)speak(last.text,last.rate);};stopButton.onclick=()=>stop();
 if(supported)synth.addEventListener('voiceschanged',refresh);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&current)stop();});
 window.addEventListener('pagehide',()=>stop(null));
 // Prevent speech continuing after leaving an activity, including dynamic Premium views.
 const view=document.getElementById('view');if(view)new MutationObserver(()=>{if(current)stop();}).observe(view,{childList:true});
 document.querySelectorAll('.panel').forEach(p=>new MutationObserver(()=>{if(current)stop();}).observe(p,{attributes:true,attributeFilter:['class']}));
 window.ISMAudio={speak,stop};refresh();
})();
