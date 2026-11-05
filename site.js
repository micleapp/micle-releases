// Micle 公式サイト 共通（ダウンロードのリンク・バージョン・容量・応援の方法・英語⇔日本語の切り替え）
const MICLE = {
  version: '3.37.0',
  sizeMB: 83,          // Micle.exe の大きさ（MB）
  download: 'https://github.com/micleapp/micle-releases/releases/latest/download/Micle.exe',
  buy: '',             // Lemon Squeezy の購入ページ（できたら入れる。空の間は「準備中」）
  contact: 'https://docs.google.com/forms/d/e/1FAIpQLSfHNVmtSDxUMFfSJxF3mRXcln_wpAh4bhPPAPuHX0YEeMHXQA/viewform',
  mail: 'micleapp@gmail.com',
  // クリエイターを応援する方法（できたら足す。例：{name: 'Ko-fi', url: 'https://ko-fi.com/…'}）。空の間は「準備中」
  donate: [],
};

(function () {
  const $$ = s => document.querySelectorAll(s);
  $$('[data-dl]').forEach(a => a.href = MICLE.download);
  $$('[data-contact]').forEach(a => a.href = MICLE.contact);
  $$('[data-mail]').forEach(a => { a.href = 'mailto:' + MICLE.mail; a.textContent = MICLE.mail; });
  $$('[data-ver]').forEach(x => x.textContent = MICLE.version);
  $$('[data-size]').forEach(x => x.textContent = MICLE.sizeMB);
  $$('[data-buy]').forEach(a => {
    if (MICLE.buy) a.href = MICLE.buy;
    else { a.classList.add('off'); a.removeAttribute('href'); a.querySelectorAll('[data-soon]').forEach(s => s.hidden = false); }
  });
  const box = document.querySelector('[data-donate] .ways');
  if (box && MICLE.donate.length) {
    box.innerHTML = MICLE.donate.map(d => `<a class="btn sec" href="${d.url}" target="_blank" rel="noopener">${d.name}</a>`).join('');
    const e = document.querySelector('[data-donate-empty]'); if (e) e.hidden = true;
  }
  // 規約などの日本語・英語ページ
  if (document.body.hasAttribute('data-bilingual')) {
    let lang = new URLSearchParams(location.search).get('lang');
    try { if (!lang) lang = localStorage.getItem('micle-lang'); } catch (e) {}
    if (!lang) lang = (navigator.language || 'ja').toLowerCase().startsWith('ja') ? 'ja' : 'en';
    const apply = l => { document.body.classList.toggle('en', l === 'en'); document.documentElement.lang = l; };
    apply(lang);
    const b = document.getElementById('langBtn');
    if (b) b.onclick = () => { lang = lang === 'en' ? 'ja' : 'en'; apply(lang); try { localStorage.setItem('micle-lang', lang); } catch (e) {} };
  }
  // 日本語のページを、日本語以外のブラウザで開いた時：その言語のページがあることを小さく知らせる（勝手には移らない）
  const here = document.body.dataset.lang;
  const nav = (navigator.language || '').toLowerCase();
  if (here && !document.body.hasAttribute('data-bilingual')) {
    let want = nav.startsWith('ja') ? 'ja' : nav.startsWith('zh') ? (/tw|hk|hant/.test(nav) ? 'zh-Hant' : 'zh-Hans') : nav.split('-')[0];
    const alt = document.querySelector(`link[rel=alternate][hreflang="${want}"]`);
    const cur = document.documentElement.lang;
    let seen = false; try { seen = sessionStorage.getItem('micle-langbar') === '1'; } catch (e) {}
    if (alt && want !== cur && !seen) {
      const names = {ja: '日本語で見る', en: 'View in English', 'zh-Hans': '查看简体中文版', 'zh-Hant': '查看繁體中文版', ko: '한국어로 보기', es: 'Ver en español', fr: 'Voir en français', de: 'Auf Deutsch ansehen', pt: 'Ver em português', ru: 'Открыть на русском'};
      const bar = document.createElement('div'); bar.className = 'langbar';
      bar.innerHTML = `<a href="${alt.href}">${names[want] || alt.hreflang}</a><button type="button" aria-label="close">×</button>`;
      bar.querySelector('button').onclick = () => { bar.remove(); try { sessionStorage.setItem('micle-langbar', '1'); } catch (e) {} };
      document.body.appendChild(bar);
    }
  }
  // 言語のメニュー：外を押したら閉じる
  document.addEventListener('click', e => { $$('details.langs[open]').forEach(d => { if (!d.contains(e.target)) d.removeAttribute('open'); }); });
})();
