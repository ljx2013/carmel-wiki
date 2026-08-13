// 首页「本站已经收录了 X 条页面」计数动画
// 读取首页 .page-counter 上的 data-total 属性作为总数，
// 从 0 以 easeOutCubic 缓动递增到目标值，结束后停止。
(function () {
  'use strict';

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function startCounter() {
    var counter = document.querySelector('.page-counter');
    if (!counter) return;

    var total = parseInt(counter.getAttribute('data-total'), 10);
    if (!isFinite(total) || total <= 0) return;

    var numEl = document.getElementById('pageCounterNum');
    if (!numEl) return;

    // 基础时长 1200ms，页面越多时间越久，封顶 3000ms
    var duration = Math.min(1200 + total * 80, 3000);
    var startTime = null;
    var hasFinished = false;

    function tick(ts) {
      if (startTime === null) startTime = ts;
      var elapsed = ts - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var value = Math.round(total * easeOutCubic(progress));
      numEl.textContent = String(value);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else if (!hasFinished) {
        hasFinished = true;
        // 最终精确对齐，避免四舍五入误差
        numEl.textContent = String(total);
        counter.classList.add('page-counter--finished');
      }
    }

    requestAnimationFrame(tick);
  }

  // 兼容 MkDocs Material 的 SPA 切换（若启用）
  if (typeof document$.subscribe === 'function') {
    document$.subscribe(function () { startCounter(); });
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startCounter);
    } else {
      startCounter();
    }
  }
})();
