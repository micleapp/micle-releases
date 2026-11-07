// Micle 公式サイト 共通（ダウンロードのリンク・バージョン・容量・応援の方法・英語⇔日本語の切り替え）
const MICLE = {
  version: '3.37.0',
  sizeMB: 83,          // Micle.exe の大きさ（MB）
  download: 'https://github.com/micleapp/micle-releases/releases/latest/download/Micle.exe',
  buy: '',
  supabase: {url: '', anon: ''},
  releaseStart: '',   // 正式リリースの日（例 '2026-11-28'）。入れるとその日から1か月リリース記念セール（Sales.cs と同じ）   // アカウント（Supabase のプロジェクトの URL と anon キー。公開してよい鍵）             // Lemon Squeezy の購入ページ（できたら入れる。空の間は「準備中」）
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
  // セール（アプリの Sales.cs と同じ決まり。日本時間。永久ライセンスだけ安くなる）
  const sb = document.querySelector('[data-sale]');
  if (sb) {
    const now = Date.now(), jy = new Date(now + 9 * 3600e3).getUTCFullYear();
    const J = (y, m, d) => Date.UTC(y, m - 1, d) - 9 * 3600e3;
    const bf = y => { let d = 1; while (new Date(Date.UTC(y, 10, d)).getUTCDay() !== 4) d++; return d + 22; };
    const list = y => [[0, J(y, 3, 20), J(y, 4, 8), 30, '4/7'], [1, J(y, 7, 21), J(y, 7, 29), 30, '7/28'], [2, J(y, 11, bf(y)), J(y, 11, bf(y) + 4), 50, (d => (d.getUTCMonth() + 1) + '/' + d.getUTCDate())(new Date(Date.UTC(y, 10, bf(y) + 3)))],
      [3, J(y, 12, 20), J(y, 12, 28), 40, '12/27'], [4, J(y, 12, 28), J(y + 1, 1, 8), 30, '1/7']];
    let rel = null;   // リリース記念（正式リリースの日から1か月・Sales.cs と同じ）
    if (MICLE.releaseStart) {
      const [ry, rm, rd] = MICLE.releaseStart.split('-').map(Number), end = new Date(Date.UTC(ry, rm, rd - 1));
      rel = [5, J(ry, rm, rd), J(ry, rm + 1, rd), 55, (end.getUTCMonth() + 1) + '/' + end.getUTCDate()];
    }
    const s = [...list(jy - 1), ...list(jy), ...(rel ? [rel] : [])].filter(x => now >= x[1] && now < x[2]).sort((a, b) => b[3] - a[3])[0];
    if (s) {
      const names = JSON.parse(sb.dataset.names || '[]');
      sb.textContent = sb.dataset.fmt.replace('{name}', names[s[0]] || '').replace('{pct}', s[3]).replace('{end}', s[4]);
      sb.hidden = false;
      const life = document.querySelector('[data-life]');
      if (life) { const p = Math.round(9800 * (100 - s[3]) / 1000) * 10; life.innerHTML = '<s>¥9,800</s>¥' + p.toLocaleString('en-US') + ' ' + life.querySelector('small').outerHTML; }
    }
  }
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
