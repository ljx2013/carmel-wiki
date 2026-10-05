---
difficulty: NOI/NOI+/CTS
---

# 大整数分解（Pollard–Rho）

## 思想

用伪随机函数 $f(x) = (x^2 + c) \bmod  n$ 生成序列，Floyd 判圈找 $x_i \ne  x_{2i}$ 使 $\\\\gcd  (\mid x_i-x_{2i}\mid , n) > 1$，得到一个非平凡因子，递归分解。配合 Miller–Rabin 判素。

## 小结

| 要点 | 内容 |
| --- | --- |
| 思想 | 用伪随机函数 $f(x) = (x^2 + c) \bmod n$ 生成序列，Floyd 判圈找 $x_i \ne x_{2i}$ 使 $\\\\gcd … |
| 核心内容 | 见正文详细说明 |
| 实现 | 参考 C++ 示例代码 |
