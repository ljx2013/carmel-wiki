// 在 mkdocs-material 顶栏右上角（主题切换按钮旁）注入「下载本页 PDF」按钮
// 点击后调用浏览器打印，用户在打印窗口中选择「另存为 PDF」即可获得当前页面 PDF
(function () {
  function addPdfButton() {
    // 避免重复注入
    if (document.getElementById("pdf-download-btn")) return;
    // mkdocs-material 把主题切换等按钮放在 .md-header__options 容器中
    var options = document.querySelector(".md-header__options");
    if (!options) return;

    var opt = document.createElement("div");
    opt.className = "md-header__option";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "pdf-download-btn";
    btn.className = "md-icon md-header__button";
    btn.setAttribute("aria-label", "下载本页 PDF");
    btn.title = "下载本页 PDF（在打印窗口中选择“另存为 PDF”）";
    btn.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>';

    btn.addEventListener("click", function () {
      window.print();
    });

    opt.appendChild(btn);
    options.appendChild(opt);
  }

  function init() {
    addPdfButton();
    if (document.getElementById("pdf-download-btn") && window.__pdfObs) {
      window.__pdfObs.disconnect();
    }
  }

  // mkdocs-material 为 SPA（即时加载），初次渲染时顶栏可能尚未就绪
  document.addEventListener("DOMContentLoaded", init);
  window.__pdfObs = new MutationObserver(init);
  window.__pdfObs.observe(document.documentElement, {
    childList: true,
    subtree: false,
  });
})();
