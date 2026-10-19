(function(){
  var doc=document.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // page-load sequence
  requestAnimationFrame(function(){setTimeout(function(){document.body.classList.add('loaded')},60)});

  // header + back-to-top
  var head=document.querySelector('.site-head'),top=document.querySelector('.to-top');
  function onScroll(){
    var y=window.scrollY;
    head.classList.toggle('scrolled',y>10);
    if(top) top.classList.toggle('show',y>900);
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  if(top) top.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

  // mobile menu
  var btn=document.querySelector('.menu-btn'),nav=document.getElementById('nav');
  function closeNav(){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','Abrir menu')}
  btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Fechar menu':'Abrir menu')});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))closeNav()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeNav()});

  // reveal on scroll
  var els=document.querySelectorAll('.reveal,.reveal-img,.stagger,.steps,svg.draw');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}});
    },{threshold:.15,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});

  // active nav link
  var links=[].slice.call(document.querySelectorAll('.nav a[href*="#"]'));
  var secs=links.map(function(a){var id=a.getAttribute('href').split('#')[1];return document.getElementById(id)}).filter(Boolean);
  if(secs.length && 'IntersectionObserver' in window){
    var so=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href').split('#')[1]===en.target.id)})}
      });
    },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(s){so.observe(s)});
  }

  // gentle parallax on marked images
  var px=document.querySelectorAll('[data-parallax]');
  if(px.length && !reduce){
    var ticking=false;
    function par(){
      px.forEach(function(el){
        var r=el.parentElement.getBoundingClientRect(),vh=window.innerHeight;
        if(r.bottom<0||r.top>vh)return;
        var p=(r.top+r.height/2-vh/2)/vh;
        el.style.transform='translate3d(0,'+(p*-8-6).toFixed(2)+'%,0)';
      });ticking=false;
    }
    window.addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(par);ticking=true}},{passive:true});par();
  }

  // video: respect reduced motion
  document.querySelectorAll('video[autoplay]').forEach(function(v){if(reduce){v.removeAttribute('autoplay');v.pause()}else{var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})}});

  // FAQ: one open at a time
  var dets=document.querySelectorAll('.faq details');
  dets.forEach(function(d){d.addEventListener('toggle',function(){if(d.open)dets.forEach(function(o){if(o!==d)o.open=false})})});

  // contact form -> WhatsApp
  var form=document.getElementById('contact-form');
  if(form){
    var phone=form.querySelector('#f-tel');
    phone.addEventListener('input',function(){
      var v=phone.value.replace(/\D/g,'').slice(0,11),o='';
      if(v.length>0)o='('+v.slice(0,2);
      if(v.length>=3)o+=') '+v.slice(2,v.length>10?7:6);
      if(v.length>=7)o+='-'+v.slice(v.length>10?7:6);
      phone.value=o;
    });
    function setErr(id,bad){var f=form.querySelector(id).closest('.field');f.classList.toggle('err',bad);return bad}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var nome=form.nome.value.trim(),tel=phone.value.replace(/\D/g,''),mail=form.email.value.trim();
      var bad=false;
      bad=setErr('#f-nome',nome.length<2)||bad;
      bad=setErr('#f-tel',tel.length<10)||bad;
      bad=document.querySelector('#f-email')&&setErr('#f-email',mail!==''&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))||bad;
      var ok=form.consent.checked;form.querySelector('.consent').style.color=ok?'':'#B03A2E';bad=!ok||bad;
      if(bad){var first=form.querySelector('.field.err input,.field.err textarea')||form.consent;first.focus();return}
      var modal=(form.querySelector('input[name=modalidade]:checked')||{}).value||'Ainda não sei';
      var per=[].slice.call(form.querySelectorAll('input[name=periodo]:checked')).map(function(i){return i.value}).join(', ')||'Sem preferência';
      var msg=form.mensagem.value.trim();
      var txt='Olá, Clara! Vim pelo site e gostaria de informações sobre o atendimento.\n\n'+
        'Nome: '+nome+'\nTelefone: '+phone.value+(mail?'\nE-mail: '+mail:'')+
        '\nModalidade: '+modal+'\nMelhor período: '+per+(msg?'\n\nMensagem: '+msg:'');
      var url=form.getAttribute('data-wa')+'?text='+encodeURIComponent(txt);
      document.getElementById('wa-again').href=url;
      document.querySelector('.form-card').classList.add('sent');
      document.querySelector('.form-card').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
      window.open(url,'_blank','noopener');
    });
    form.addEventListener('input',function(e){var f=e.target.closest('.field');if(f)f.classList.remove('err')});
  }
})();

/* Eventos de medição (dataLayer) — inofensivos enquanto o GTM não estiver ativo */
(function () {
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    window.dataLayer.push({ event: 'whatsapp_click', link_location: a.getAttribute('data-loc') || (a.closest('section,header,footer') || {}).id || 'site' });
  });
  var form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', function () {
    if (document.querySelector('.form-card.sent')) {
      var m = form.querySelector('input[name=modalidade]:checked');
      window.dataLayer.push({ event: 'contact_form_submit', modalidade: m ? m.value : '' });
    }
  });
})();
