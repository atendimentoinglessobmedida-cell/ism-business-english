(()=>{'use strict';
 const prices={core:{30:5899,180:32999,365:58999},premium:{30:7999,180:44999,365:79999}};
 const names={core:'Business English Core',premium:'Core + Job Interviews'},periods={30:'Mensal',180:'Semestral',365:'Anual'},months={30:1,180:6,365:12};
 const money=cents=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100);
 function update(){const pack=document.querySelector('[name=package]:checked').value,days=document.querySelector('[name=period]:checked').value;
 for(const d of ['30','180','365']){document.querySelector('[data-price="'+d+'"]').textContent=money(prices[pack][d]);document.querySelector('[data-month="'+d+'"]').textContent=d==='30'?money(prices[pack][d])+' por período':'Equivalente a '+money(prices[pack][d]/months[d])+'/mês';}
 document.getElementById('summary-title').textContent=names[pack];document.getElementById('summary-period').textContent=periods[days]+' · '+days+' dias';document.getElementById('summary-price').textContent=money(prices[pack][days]);
 const message='Olá, Professor Márcio! Tenho interesse no plano '+names[pack]+' — '+periods[days]+' ('+days+' dias), pelo valor total proposto de '+money(prices[pack][days])+'. Gostaria de confirmar a disponibilidade, as condições de contratação e o início do acesso.';
 document.getElementById('consult').href='https://wa.me/5511976901015?text='+encodeURIComponent(message);
 document.getElementById('selection-status').textContent=names[pack]+', '+days+' dias, valor total proposto '+money(prices[pack][days])+'.';
 }
 document.querySelectorAll('input[type=radio]').forEach(input=>input.addEventListener('change',update));update();
})();
