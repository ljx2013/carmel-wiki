// PDF 导出按钮 —— 真正生成 .pdf 文件并下载到本地
// - 普通页面：将当前页正文转为 PDF 下载
// - 首页（index）：抓取所有导航页面，拼接后生成一份完整 PDF 下载
// 使用 html2pdf.js（封装了 html2canvas + jsPDF）
(function () {
  'use strict';

  var EXPORT_BTN_ID = 'export-pdf-btn';
  var EXPORT_BTN_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v5h-2V7zm0 7h2v2h-2v-2z"/></svg>';
  var HTML2PDF_CDN = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.2/dist/html2pdf.bundle.min.js';

  // 动态加载 html2pdf.js
  function loadHtml2Pdf() {
    return new Promise(function (resolve, reject) {
      if (typeof window.html2pdf !== 'undefined') {
        resolve();
        return;
      }
      var script = document.createElement('script');
      script.src = HTML2PDF_CDN;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error('无法加载 html2pdf.js，请检查网络连接。'));
      };
      document.head.appendChild(script);
    });
  }

  // 判断当前是否为首页
  function isIndexPage() {
    var path = window.location.pathname.replace(/\/+$/, '');
    return path === '' || path === '/' ||
      path.endsWith('/index') || path.endsWith('/index.html') ||
      /\/index\.html?$/.test(window.location.pathname);
  }

  // 从导航栏提取所有页面 URL（排除首页）
  function getAllPageUrls() {
    var links = document.querySelectorAll('.md-nav--primary a.md-nav__link, .md-nav__list a.md-nav__link');
    var urls = [];
    var seen = {};
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
      if (href === 'index.html' || href === '../index.html' || href === './index.html' ||
          /index\.html?$/.test(href) || href === '..') return;

      var fullUrl = new URL(href, window.location.origin +
        window.location.pathname.replace(/[^/]*$/, '')).href;
      if (seen[fullUrl]) return;
      seen[fullUrl] = true;
      urls.push(fullUrl);
    });
    return urls;
  }

  // 从抓取到的 HTML 中提取正文
  function extractContent(htmlText) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlText, 'text/html');
    var article = doc.querySelector('.md-content__inner') || doc.querySelector('article');
    if (!article) return '';
    article.querySelectorAll('.md-content__button, .md-tags, .md-nav, .md-footer, .headerlink').forEach(function (el) {
      el.remove();
    });
    return article.innerHTML;
  }

  // 获取页面标题
  function extractTitle(htmlText) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlText, 'text/html');
    var h1 = doc.querySelector('.md-content__inner h1, article h1, h1');
    return h1 ? h1.textContent.trim().replace(/¶$/, '').trim() : '';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // 设置按钮状态
  function setBtnState(loading, btn, originalHtml) {
    if (loading) {
      btn.disabled = true;
      btn.innerHTML = '<span class="export-pdf-loading">生成中…</span>';
    } else {
      btn.disabled = false;
      if (originalHtml) btn.innerHTML = originalHtml;
    }
  }

  // html2pdf 通用配置
  function getOpt(filename) {
    return {
      margin: [15, 15, 15, 15],
      filename: filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['css', 'legacy'] }
    };
  }

  // 单页导出
  function exportCurrentPage(btn, originalHtml) {
    setBtnState(true, btn);
    loadHtml2Pdf().then(function () {
      var content = document.querySelector('.md-content__inner');
      if (!content) {
        alert('未找到页面内容。');
        setBtnState(false, btn, originalHtml);
        return;
      }

      // 克隆内容，移除不需要的元素
      var clone = content.cloneNode(true);
      clone.querySelectorAll('.md-content__button, .headerlink, .md-nav').forEach(function (el) {
        el.remove();
      });

      // 获取页面标题作为文件名
      var h1 = content.querySelector('h1');
      var title = h1 ? h1.textContent.trim().replace(/¶$/, '').trim() : '页面';
      var filename = 'Carmel Wiki - ' + title + '.pdf';

      return html2pdf().set(getOpt(filename)).from(clone).save();
    }).then(function () {
      setBtnState(false, btn, originalHtml);
    }).catch(function (err) {
      console.error(err);
      alert('导出失败: ' + err.message);
      setBtnState(false, btn, originalHtml);
    });
  }

  // 首页全站导出
  function exportAllPages(btn, originalHtml) {
    var urls = getAllPageUrls();
    if (urls.length === 0) {
      alert('未找到可导出的页面。');
      return;
    }

    setBtnState(true, btn);
    btn.innerHTML = '<span class="export-pdf-loading">抓取页面中…</span>';

    loadHtml2Pdf().then(function () {
      // 逐个抓取页面
      var promises = urls.map(function (url, idx) {
        return fetch(url)
          .then(function (resp) { return resp.text(); })
          .then(function (html) {
            btn.innerHTML = '<span class="export-pdf-loading">抓取中 ' + (idx + 1) + '/' + urls.length + '…</span>';
            return {
              title: extractTitle(html),
              content: extractContent(html),
              url: url
            };
          })
          .catch(function (err) {
            console.warn('Failed: ' + url, err);
            return { title: '(加载失败)', content: '<p>无法加载: ' + escapeHtml(url) + '</p>', url: url };
          });
      });

      return Promise.all(promises);
    }).then(function (results) {
      btn.innerHTML = '<span class="export-pdf-loading">生成 PDF 中…</span>';

      // 构建拼接容器
      var container = document.createElement('div');
      container.style.cssText = 'position:absolute;left:-9999px;top:0;width:680px;padding:20px;background:#fff;color:#333;font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

      // 封面
      var cover = document.createElement('div');
      cover.style.cssText = 'text-align:center;padding:60px 0 40px 0;page-break-after:always;';
      cover.innerHTML =
        '<h1 style="font-size:2rem;margin-bottom:0.5rem;">Carmel Wiki</h1>' +
        '<p style="color:#888;font-size:1rem;">全站内容合集</p>' +
        '<p style="color:#aaa;font-size:0.85rem;">共 ' + results.length + ' 篇文档</p>';
      container.appendChild(cover);

      // 各页面内容
      results.forEach(function (item, idx) {
        var section = document.createElement('div');
        section.style.cssText = 'page-break-after:always;margin-bottom:1.5rem;';

        if (item.title) {
          var h1 = document.createElement('h1');
          h1.textContent = item.title;
          h1.style.cssText = 'font-size:1.4rem;border-bottom:2px solid #FFC02D;padding-bottom:0.3em;margin-bottom:1rem;';
          section.appendChild(h1);
        }

        var contentDiv = document.createElement('div');
        contentDiv.innerHTML = item.content;
        section.appendChild(contentDiv);

        container.appendChild(section);
      });

      document.body.appendChild(container);

      // 等 MathJax 渲染完成后再生成
      var waitMs = (typeof window.MathJax !== 'undefined' && window.MathJax.startup) ? 1500 : 300;

      return new Promise(function (resolve) {
        setTimeout(function () { resolve(container); }, waitMs);
      });
    }).then(function (container) {
      var opt = getOpt('Carmel Wiki - 全站导出.pdf');
      opt.jsPDF.orientation = 'portrait';

      return html2pdf().set(opt).from(container).save().then(function () {
        document.body.removeChild(container);
      });
    }).then(function () {
      setBtnState(false, btn, originalHtml);
    }).catch(function (err) {
      console.error(err);
      alert('导出失败: ' + err.message);
      setBtnState(false, btn, originalHtml);
    });
  }

  // 注入导出按钮
  function injectButton() {
    if (document.getElementById(EXPORT_BTN_ID)) return;

    var header = document.querySelector('.md-header__inner');
    if (!header) return;

    var btn = document.createElement('a');
    btn.id = EXPORT_BTN_ID;
    btn.href = '#';
    btn.className = 'md-header__button md-header__export-btn';
    btn.title = isIndexPage() ? '导出全站为 PDF' : '导出本页为 PDF';
    btn.setAttribute('aria-label', btn.title);
    btn.innerHTML = EXPORT_BTN_ICON + '<span class="export-pdf-label">导出 PDF</span>';

    var originalHtml = btn.innerHTML;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      if (isIndexPage()) {
        exportAllPages(btn, originalHtml);
      } else {
        exportCurrentPage(btn, originalHtml);
      }
    });

    var headerButtons = header.querySelector('.md-header__buttons');
    if (headerButtons) {
      headerButtons.appendChild(btn);
    } else {
      header.appendChild(btn);
    }
  }

  // 兼容 MkDocs Material SPA
  if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(function () { injectButton(); });
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectButton);
    } else {
      injectButton();
    }
  }
})();
