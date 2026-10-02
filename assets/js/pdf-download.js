// 在 mkdocs-material 顶栏右上角（主题切换按钮旁）注入「下载本页 PDF」按钮
// 点击后调用浏览器打印，用户在打印窗口中选择「另存为 PDF」即可获得当前页面 PDF
(function () {
  function addPdfButton() {
    // 避免重复注入
    if (document.getElementById("pdf-download-btn")) return;

    // Material 9.x：主题切换等按钮直接挂在 .md-header__inner 下（无 .md-header__options 容器）
    var host =
      document.querySelector(".md-header__inner") ||
      document.querySelector(".md-header__options");
    if (!host) return;

    var opt = document.createElement("div");
    opt.className = "md-header__option";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "pdf-download-btn";
    btn.className = "md-icon md-header__button";
    btn.setAttribute("aria-label", "下载本页 PDF");
    btn.title = "下载本页 PDF（在打印窗口中选择“另存为 PDF”）";
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" style="width:1.2rem;height:1.2rem">' +
      '<path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>';

    btn.addEventListener("click", function () {
      window.print();
    });

    opt.appendChild(btn);
    host.appendChild(opt);
  }

  function ready() {
    addPdfButton();
    if (document.getElementById("pdf-download-btn") && window.__pdfObs) {
      window.__pdfObs.disconnect();
    }
  }

  // 脚本位于 </body> 前，此时 DOMContentLoaded 可能已触发，需兼容两种时机
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  // 兜底：SPA 或顶栏晚于脚本渲染时再尝试一次
  window.__pdfObs = new MutationObserver(ready);
  window.__pdfObs.observe(document.body, { childList: true, subtree: true });
})();
