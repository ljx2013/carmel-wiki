// PDF 导出按钮
// - 普通页面：点击后调用 window.print() 导出当前页为 PDF
// - 首页（index）：抓取所有导航页面内容，拼接成一份完整文档后打印
(function () {
  'use strict';

  var EXPORT_BTN_ID = 'export-pdf-btn';
  var EXPORT_BTN_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v5h-2V7zm0 7h2v2h-2v-2z"/></svg>';

  // 判断当前是否为首页
  function isIndexPage() {
    var path = window.location.pathname.replace(/\/+$/, '');
    return path === '' || path.endsWith('/index') || path.endsWith('/index.html') || path === '/' || /\/index\.html$/.test(window.location.pathname);
  }

  // 从导航栏提取所有页面 URL（排除首页）
  function getAllPageUrls() {
    var links = document.querySelectorAll('.md-nav--primary a.md-nav__link, .md-nav__list a.md-nav__link');
    var urls = [];
    var seen = {};
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      // 跳过外链、锚点、首页
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
      if (href === 'index.html' || href === '../index.html' || href === './index.html' || /index\.html?$/.test(href) || href === '..') return;

      // 解析为绝对 URL
      var fullUrl = new URL(href, window.location.origin + window.location.pathname.replace(/[^/]*$/, '')).href;
      // 去重
      if (seen[fullUrl]) return;
      seen[fullUrl] = true;
      urls.push(fullUrl);
    });
    return urls;
  }

  // 从抓取到的 HTML 中提取正文内容
  function extractContent(htmlText) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlText, 'text/html');
    var article = doc.querySelector('.md-content__inner');
    if (!article) {
      article = doc.querySelector('article');
    }
    if (!article) return '';
    // 移除编辑按钮、分享按钮等非内容元素
    article.querySelectorAll('.md-content__button, .md-tags, .md-nav, .md-footer').forEach(function (el) {
      el.remove();
    });
    return article.innerHTML;
  }

  // 获取页面标题
  function extractTitle(htmlText) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlText, 'text/html');
    var h1 = doc.querySelector('.md-content__inner h1, article h1, h1');
    return h1 ? h1.textContent.trim() : '';
  }

  // 首页导出：抓取所有页面并拼接
  function exportAllPages() {
    var urls = getAllPageUrls();
    if (urls.length === 0) {
      alert('未找到可导出的页面。');
      return;
    }

    // 显示进度提示
    var btn = document.getElementById(EXPORT_BTN_ID);
    var originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="export-pdf-loading">导出中…</span>';

    // 逐个抓取页面内容
    var promises = urls.map(function (url) {
      return fetch(url)
        .then(function (resp) { return resp.text(); })
        .then(function (html) {
          var title = extractTitle(html);
          var content = extractContent(html);
          return { title: title, content: content, url: url };
        })
        .catch(function (err) {
          console.warn('Failed to fetch: ' + url, err);
          return { title: '', content: '<p style="color:#c00;">加载失败: ' + url + '</p>', url: url };
        });
    });

    Promise.all(promises).then(function (results) {
      // 构建拼接页面
      var combinedHtml = '';
      results.forEach(function (item, idx) {
        combinedHtml += '<section class="pdf-export-section">';
        if (item.title) {
          combinedHtml += '<h1 class="pdf-export-title">' + escapeHtml(item.title) + '</h1>';
        }
        combinedHtml += item.content;
        combinedHtml += '</section>';
        // 页面间分隔
        if (idx < results.length - 1) {
          combinedHtml += '<div class="pdf-page-break"></div>';
        }
      });

      // 构建完整的打印页面
      var printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('无法打开新窗口，请检查浏览器弹窗设置。');
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        return;
      }

      // 收集当前页面的 CSS（包括 MkDocs 主题样式）
      var cssLinks = [];
      document.querySelectorAll('link[rel="stylesheet"]').forEach(function (link) {
        cssLinks.push(link.outerHTML);
      });

      printWindow.document.write('<!DOCTYPE html><html><head><meta charset="utf-8">');
      printWindow.document.write('<title>Carmel Wiki - 全站导出</title>');
      // 引入原页面的 CSS
      cssLinks.forEach(function (css) {
        printWindow.document.write(css);
      });
      // 额外的打印样式
      printWindow.document.write('<style>');
      printWindow.document.write('body { max-width: 800px; margin: 0 auto; padding: 40px 20px; }');
      printWindow.document.write('.pdf-export-section { page-break-after: always; margin-bottom: 2rem; }');
      printWindow.document.write('.pdf-export-title { border-bottom: 2px solid #FFC02D; padding-bottom: 0.3em; margin-bottom: 1rem; }');
      printWindow.document.write('.pdf-page-break { page-break-after: always; }');
      printWindow.document.write('@media print { body { max-width: none; padding: 0; } .pdf-export-section { page-break-after: always; } }');
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1 style="text-align:center;font-size:1.8rem;margin-bottom:0.5rem;">Carmel Wiki</h1>');
      printWindow.document.write('<p style="text-align:center;color:#666;margin-bottom:2rem;">全站内容合集（共 ' + results.length + ' 页）</p>');
      printWindow.document.write(combinedHtml);
      printWindow.document.write('</body></html>');
      printWindow.document.close();

      // 等待 CSS 加载后打印
      printWindow.onload = function () {
        setTimeout(function () {
          printWindow.print();
          btn.disabled = false;
          btn.innerHTML = originalHtml;
        }, 800);
      };

      // 兜底：3 秒后也可打印
      setTimeout(function () {
        if (!printWindow.closed) {
          btn.disabled = false;
          btn.innerHTML = originalHtml;
        }
      }, 3000);
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // 单页导出
  function exportCurrentPage() {
    window.print();
  }

  // 注入导出按钮
  function injectButton() {
    if (document.getElementById(EXPORT_BTN_ID)) return;

    // 查找 header 右侧按钮区域
    var header = document.querySelector('.md-header__inner');
    if (!header) return;

    var btn = document.createElement('a');
    btn.id = EXPORT_BTN_ID;
    btn.href = '#';
    btn.className = 'md-header__button md-header__export-btn';
    btn.title = isIndexPage() ? '导出全站为 PDF' : '导出本页为 PDF';
    btn.setAttribute('aria-label', btn.title);
    btn.innerHTML = EXPORT_BTN_ICON + '<span class="export-pdf-label">导出 PDF</span>';

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (isIndexPage()) {
        exportAllPages();
      } else {
        exportCurrentPage();
      }
    });

    // 插入到 header 按钮区域
    var headerButtons = header.querySelector('.md-header__buttons');
    if (headerButtons) {
      headerButtons.appendChild(btn);
    } else {
      header.appendChild(btn);
    }
  }

  // 兼容 MkDocs Material SPA
  if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(function () {
      injectButton();
    });
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectButton);
    } else {
      injectButton();
    }
  }
})();
