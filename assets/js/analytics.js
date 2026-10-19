/* Medição com consentimento (LGPD) — Google Tag Manager + Consent Mode v2
 * Para ativar: preencha GTM_ID com o ID do contêiner (ex.: 'GTM-ABC1234').
 * Enquanto estiver vazio, nada é carregado, nenhum cookie é criado e o aviso não aparece.
 * Eventos já enviados ao dataLayer (para configurar no GTM/GA4):
 *   whatsapp_click  { link_location }   — cliques em qualquer link do WhatsApp
 *   contact_form_submit { modalidade } — envio do formulário de contato (gera lead)
 */
(function () {
  var GTM_ID = ''; // ← preencher quando o GTM for criado

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: 500
  });

  window.SiteConsent = { enabled: !!GTM_ID };
  if (!GTM_ID) return;

  var KEY = 'al_consent_v1';
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function apply(v) {
    var g = v === 'granted' ? 'granted' : 'denied';
    gtag('consent', 'update', { analytics_storage: g, ad_storage: g, ad_user_data: g, ad_personalization: g });
  }
  var choice = read();
  if (choice) apply(choice);

  // carrega o GTM (com consentimento negado por padrão até a escolha)
  (function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s); j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i; f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', GTM_ID);

  function banner() {
    if (document.querySelector('.cc')) return;
    var el = document.createElement('div');
    el.className = 'cc'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Preferências de cookies');
    el.innerHTML = '<p>Usamos cookies de medição para entender como o site é usado e melhorar a comunicação. Eles só são ativados com a sua permissão. <a href="privacidade.html">Saiba mais</a>.</p>' +
      '<div class="cc-actions"><button type="button" class="btn btn-ghost" data-cc="denied">Recusar</button><button type="button" class="btn btn-primary" data-cc="granted">Aceitar</button></div>';
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cc]'); if (!b) return;
      save(b.dataset.cc); apply(b.dataset.cc); el.remove();
    });
    document.body.appendChild(el);
  }
  window.SiteConsent.open = banner;
  document.addEventListener('DOMContentLoaded', function () {
    if (!choice) banner();
    var btn = document.querySelector('.cc-open');
    if (btn) { btn.hidden = false; btn.addEventListener('click', banner); }
  });
})();
