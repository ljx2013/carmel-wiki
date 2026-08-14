// PDF 导出按钮 —— 真正生成 .pdf 文件下载到本地
(function () {
  'use strict';

  var EXPORT_BTN_ID = 'export-pdf-btn';
  // 纯 CSS 下载图标：向下箭头 + 底线
  var EXPORT_BTN_ICON = '<span class="export-pdf-icon" aria-hidden="true"></span>';
  var HTML2PDF_CDN = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.2/dist/html2pdf.bundle.min.js';

  function loadHtml2Pdf() {
    return new Promise(function (resolve, reject) {
      if (typeof window.html2pdf !== 'undefined') { resolve(); return; }
      var s = document.createElement('script');
      s.src = HTML2PDF_CDN;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('无法加载 html2pdf.js')); };
      document.head.appendChild(s);
    });
  }

  function isIndexPage() {
    var p = window.location.pathname.replace(/\/+$/, '');
    return p === '' || p === '/' || p.endsWith('/index') || p.endsWith('/index.html');
  }

  function getAllPageUrls() {
    var links = document.querySelectorAll('.md-nav--primary a.md-nav__link, .md-nav__list a.md-nav__link');
    var urls = [], seen = {};
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
      if (href === 'index.html' || href === '../index.html' || href === './index.html' ||
          /index\.html?$/.test(href) || href === '..') return;
      var full = new URL(href, window.location.origin + window.location.pathname.replace(/[^/]*$/, '')).href;
      if (seen[full]) return;
      seen[full] = true; urls.push(full);
    });
    return urls;
  }

  function extractContent(htmlText) {
    var doc = new DOMParser().parseFromString(htmlText, 'text/html');
    var a = doc.querySelector('.md-content__inner') || doc.querySelector('article');
    if (!a) return '';
    a.querySelectorAll('.md-content__button, .md-tags, .md-nav, .md-footer, .headerlink').forEach(function (e) { e.remove(); });
    return a.innerHTML;
  }

  function extractTitle(htmlText) {
    var doc = new DOMParser().parseFromString(htmlText, 'text/html');
    var h = doc.querySelector('.md-content__inner h1, article h1, h1');
    return h ? h.textContent.trim().replace(/¶$/, '').trim() : '';
  }

  function escapeHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function setBtn(loading, btn, orig) {
    if (loading) { btn.disabled = true; btn.innerHTML = '<span class="export-pdf-loading">…</span>'; }
    else { btn.disabled = false; if (orig) btn.innerHTML = orig; }
  }

  function getOpt(fn) {
    return {
      margin: [15, 15, 15, 15], filename: fn,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };
  }

  function exportCurrentPage(btn, orig) {
    setBtn(true, btn);
    loadHtml2Pdf().then(function () {
      var c = document.querySelector('.md-content__inner');
      if (!c) { alert('未找到内容'); setBtn(false, btn, orig); return; }
      var clone = c.cloneNode(true);
      clone.querySelectorAll('.md-content__button, .headerlink, .md-nav').forEach(function (e) { e.remove(); });
      var h1 = c.querySelector('h1');
      var t = h1 ? h1.textContent.trim().replace(/¶$/, '').trim() : '页面';
      return html2pdf().set(getOpt('Carmel Wiki - ' + t + '.pdf')).from(clone).save();
    }).then(function () { setBtn(false, btn, orig); })
      .catch(function (e) { console.error(e); alert('导出失败: ' + e.message); setBtn(false, btn, orig); });
  }

  function exportAllPages(btn, orig) {
    var urls = getAllPageUrls();
    if (!urls.length) { alert('未找到页面'); return; }
    setBtn(true, btn);
    loadHtml2Pdf().then(function () {
      return Promise.all(urls.map(function (u, i) {
        return fetch(u).then(function (r) { return r.text(); }).then(function (h) {
          btn.innerHTML = '<span class="export-pdf-loading">' + (i+1) + '/' + urls.length + '</span>';
          return { title: extractTitle(h), content: extractContent(h) };
        }).catch(function () { return { title: '(失败)', content: '<p>加载失败</p>' }; });
      }));
    }).then(function (results) {
      btn.innerHTML = '<span class="export-pdf-loading">PDF…</span>';
      var container = document.createElement('div');
      container.style.cssText = 'position:absolute;left:-9999px;top:0;width:680px;padding:20px;background:#fff;color:#333;font-family:sans-serif;';
      var cover = document.createElement('div');
      cover.style.cssText = 'text-align:center;padding:60px 0 40px;page-break-after:always;';
      cover.innerHTML = '<h1 style="font-size:2rem;">Carmel Wiki</h1><p style="color:#888;">全站内容合集（' + results.length + ' 篇）</p>';
      container.appendChild(cover);
      results.forEach(function (item) {
        var sec = document.createElement('div');
        sec.style.cssText = 'page-break-after:always;';
        if (item.title) {
          var h = document.createElement('h1');
          h.textContent = item.title;
          h.style.cssText = 'font-size:1.4rem;border-bottom:2px solid #FFC02D;padding-bottom:.3em;margin-bottom:1rem;';
          sec.appendChild(h);
        }
        var cd = document.createElement('div');
        cd.innerHTML = item.content;
        sec.appendChild(cd);
        container.appendChild(sec);
      });
      document.body.appendChild(container);
      var wait = (typeof window.MathJax !== 'undefined' && window.MathJax.startup) ? 1500 : 300;
      return new Promise(function (r) { setTimeout(function () { r(container); }, wait); });
    }).then(function (container) {
      return html2pdf().set(getOpt('Carmel Wiki - 全站导出.pdf')).from(container).save()
        .then(function () { document.body.removeChild(container); });
    }).then(function () { setBtn(false, btn, orig); })
      .catch(function (e) { console.error(e); alert('导出失败: ' + e.message); setBtn(false, btn, orig); });
  }

  function injectButton() {
    // 如果已存在先移除（SPA 切换后可能残留旧的）
    var old = document.getElementById(EXPORT_BTN_ID);
    if (old) old.remove();

    var nav = document.querySelector('.md-header__inner');
    if (!nav) return;

    var btn = document.createElement('button');
    btn.id = EXPORT_BTN_ID;
    btn.type = 'button';
    btn.className = 'md-header__button md-header__export-btn';
    btn.title = isIndexPage() ? '导出全站 PDF' : '导出本页 PDF';
    btn.setAttribute('aria-label', btn.title);
    btn.innerHTML = EXPORT_BTN_ICON;

    var orig = btn.innerHTML;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (btn.disabled) return;
      if (isIndexPage()) exportAllPages(btn, orig);
      else exportCurrentPage(btn, orig);
    });

    // 插入到 nav 的最后一个子元素之前（搜索框/主题切换之后）
    nav.appendChild(btn);
  }

  // MkDocs Material SPA 兼容
  if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(function () { injectButton(); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();
