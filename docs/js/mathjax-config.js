window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
  },
  // 使用 SVG 输出以便 html2canvas 正确捕获数学公式
  svg: { fontCache: 'global' },
  startup: {
    typeset: true
  }
};
