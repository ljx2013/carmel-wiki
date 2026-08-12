# 数学符号 Math symbols

本页汇总 Carmel Wiki 中常用的数学符号及其 LaTeX 写法，方便编写文档时查阅。

## 公式输入方式

本站使用 MathJax 渲染数学公式，支持以下语法：

| 类型 | 语法 | 示例源码 | 渲染效果 |
|------|------|----------|----------|
| 行内公式 | `$...$` | `$a + b = c$` | $a + b = c$ |
| 行间公式 | `$$...$$` | `$$\sum_{i=1}^{n} i$$` | $$\sum_{i=1}^{n} i$$ |

!!! tip "提示"
    - 公式中的特殊字符需转义：`\{`、`\}`、`\%`、`\#`。
    - 行间公式前后建议留空行，避免渲染异常。

## 希腊字母

### 小写字母

| 字母 | 语法 | 字母 | 语法 | 字母 | 语法 |
|------|------|------|------|------|------|
| $\alpha$ | `\alpha` | $\beta$ | `\beta` | $\gamma$ | `\gamma` |
| $\delta$ | `\delta` | $\epsilon$ | `\epsilon` | $\varepsilon$ | `\varepsilon` |
| $\zeta$ | `\zeta` | $\eta$ | `\eta` | $\theta$ | `\theta` |
| $\iota$ | `\iota` | $\kappa$ | `\kappa` | $\lambda$ | `\lambda` |
| $\mu$ | `\mu` | $\nu$ | `\nu` | $\xi$ | `\xi` |
| $\pi$ | `\pi` | $\rho$ | `\rho` | $\sigma$ | `\sigma` |
| $\tau$ | `\tau` | $\upsilon$ | `\upsilon` | $\phi$ | `\phi` |
| $\chi$ | `\chi` | $\psi$ | `\psi` | $\omega$ | `\omega` |

### 大写字母

| 字母 | 语法 | 字母 | 语法 | 字母 | 语法 |
|------|------|------|------|------|------|
| $A$ | `A` | $B$ | `B` | $\Gamma$ | `\Gamma` |
| $\Delta$ | `\Delta` | $E$ | `E` | $Z$ | `Z` |
| $H$ | `H` | $\Theta$ | `\Theta` | $I$ | `I` |
| $K$ | `K` | $\Lambda$ | `\Lambda` | $M$ | `M` |
| $N$ | `N` | $\Xi$ | `\Xi` | $O$ | `O` |
| $\Pi$ | `\Pi` | $P$ | `P` | $\Sigma$ | `\Sigma` |
| $T$ | `T` | $\Upsilon$ | `\Upsilon` | $\Phi$ | `\Phi` |
| $X$ | `X` | $\Psi$ | `\Psi` | $\Omega$ | `\Omega` |

## 关系运算符

| 符号 | 语法 | 含义 |
|------|------|------|
| $=$ | `=` | 等于 |
| $\neq$ | `\neq` | 不等于 |
| $<$ | `<` | 小于 |
| $>$ | `>` | 大于 |
| $\leq$ | `\leq` | 小于等于 |
| $\geq$ | `\geq` | 大于等于 |
| $\approx$ | `\approx` | 约等于 |
| $\equiv$ | `\equiv` | 恒等于 / 同余 |
| $\sim$ | `\sim` | 相似 / 等价 |
| $\propto$ | `\propto` | 正比于 |

!!! example "同余示例"
    $$a \equiv b \pmod{m}$$

    表示 $m \mid (a - b)$，即 $a$ 与 $b$ 模 $m$ 同余。

## 算术运算

| 符号 | 语法 | 含义 |
|------|------|------|
| $\pm$ | `\pm` | 正负 |
| $\mp$ | `\mp` | 负正 |
| $\times$ | `\times` | 乘 |
| $\div$ | `\div` | 除 |
| $\cdot$ | `\cdot` | 点乘 |
| $\cdots$ | `\cdots` | 水平省略号 |
| $\vdots$ | `\vdots` | 竖直省略号 |
| $\ddots$ | `\ddots` | 对角省略号 |
| $\mid$ | `\mid` | 整除 / 条件概率 |
| $\nmid$ | `\nmid` | 不整除 |

## 集合

| 符号 | 语法 | 含义 |
|------|------|------|
| $\in$ | `\in` | 属于 |
| $\notin$ | `\notin` | 不属于 |
| $\subset$ | `\subset` | 真子集 |
| $\subseteq$ | `\subseteq` | 子集 |
| $\supset$ | `\supset` | 真包含 |
| $\supseteq$ | `\supseteq` | 包含 |
| $\cup$ | `\cup` | 并集 |
| $\cap$ | `\cap` | 交集 |
| $\setminus$ | `\setminus` | 差集 |
| $\emptyset$ | `\emptyset` | 空集 |
| $\mathbb{N}$ | `\mathbb{N}` | 自然数集 |
| $\mathbb{Z}$ | `\mathbb{Z}` | 整数集 |
| $\mathbb{Q}$ | `\mathbb{Q}` | 有理数集 |
| $\mathbb{R}$ | `\mathbb{R}` | 实数集 |
| $\{x \mid x > 0\}$ | `\{x \mid x > 0\}` | 集合表示 |

## 逻辑

| 符号 | 语法 | 含义 |
|------|------|------|
| $\land$ | `\land` | 与 |
| $\lor$ | `\lor` | 或 |
| $\lnot$ | `\lnot` | 非 |
| $\Rightarrow$ | `\Rightarrow` | 蕴含 |
| $\Leftrightarrow$ | `\Leftrightarrow` | 等价 |
| $\forall$ | `\forall` | 任意 |
| $\exists$ | `\exists` | 存在 |
| $\nexists$ | `\nexists` | 不存在 |

## 求和与求积

| 符号 | 语法 |
|------|------|
| $\sum_{i=1}^{n} i$ | `\sum_{i=1}^{n} i` |
| $\prod_{i=1}^{n} i$ | `\prod_{i=1}^{n} i` |
| $\bigcup_{i=1}^{n} A_i$ | `\bigcup_{i=1}^{n} A_i` |
| $\bigcap_{i=1}^{n} A_i$ | `\bigcap_{i=1}^{n} A_i` |

!!! example "求和公式"
    $$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

## 微积分

| 符号 | 语法 | 含义 |
|------|------|------|
| $\lim_{x \to \infty}$ | `\lim_{x \to \infty}` | 极限 |
| $\int_{a}^{b}$ | `\int_{a}^{b}` | 定积分 |
| $\iint$ | `\iint` | 二重积分 |
| $\oint$ | `\oint` | 曲线积分 |
| $\partial$ | `\partial` | 偏导 |
| $\nabla$ | `\nabla` | 梯度 |
| $\infty$ | `\infty` | 无穷 |

## 函数与常用记号

| 符号 | 语法 | 含义 |
|------|------|------|
| $\sqrt{x}$ | `\sqrt{x}` | 平方根 |
| $\sqrt[n]{x}$ | `\sqrt[n]{x}` | n 次方根 |
| $x^{n}$ | `x^{n}` | 幂 |
| $x_{i}$ | `x_{i}` | 下标 |
| $\frac{a}{b}$ | `\frac{a}{b}` | 分式 |
| $\binom{n}{m}$ | `\binom{n}{m}` | 组合数 |
| $\lfloor x \rfloor$ | `\lfloor x \rfloor` | 向下取整 |
| $\lceil x \rceil$ | `\lceil x \rceil` | 向上取整 |
| $\|x\|$ | `\|x\|` | 范数 |
| $\log_{a}{b}$ | `\log_{a}{b}` | 对数 |
| $\ln{x}$ | `\ln{x}` | 自然对数 |
| $\lg{x}$ | `\lg{x}` | 常用对数 |
| $\max(a, b)$ | `\max(a, b)` | 最大值 |
| $\min(a, b)$ | `\min(a, b)` | 最小值 |
| $\gcd(a, b)$ | `\gcd(a, b)` | 最大公约数 |
| $\bmod m$ | `\bmod m` | 取模 |
| $\lcm(a, b)$ | `\lcm(a, b)` | 最小公倍数 |

!!! warning "注意"
    `\lcm` 在原生 MathJax 中可能未定义，可用 `\operatorname{lcm}` 替代：
    $$\operatorname{lcm}(a, b) = \frac{a \cdot b}{\gcd(a, b)}$$

## 矩阵

```latex
$$
\begin{bmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{bmatrix}
$$
```

渲染效果：

$$
\begin{bmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{bmatrix}
$$

!!! info "矩阵环境"
    - `bmatrix`：方括号 `[ ]`
    - `pmatrix`：圆括号 `( )`
    - `vmatrix`：竖线 `| |`（行列式）
    - `Bmatrix`：花括号 `{ }`

## 箭头

| 符号 | 语法 | 含义 |
|------|------|------|
| $\to$ | `\to` | 右箭头 |
| $\rightarrow$ | `\rightarrow` | 右箭头 |
| $\leftarrow$ | `\leftarrow` | 左箭头 |
| $\leftrightarrow$ | `\leftrightarrow` | 双向箭头 |
| $\mapsto$ | `\mapsto` | 映射到 |
| $\Rightarrow$ | `\Rightarrow` | 双线右箭头 |
| $\Leftrightarrow$ | `\Leftrightarrow` | 双线双向箭头 |
| $\uparrow$ | `\uparrow` | 上箭头 |
| $\downarrow$ | `\downarrow` | 下箭头 |

## 分段函数

```latex
$$
f(n) =
\begin{cases}
1, & n = 1 \\
n \times f(n-1), & n > 1
\end{cases}
$$
```

渲染效果：

$$
f(n) =
\begin{cases}
1, & n = 1 \\
n \times f(n-1), & n > 1
\end{cases}
$$

## 多行对齐

使用 `aligned` 环境对齐多行公式：

```latex
$$
\begin{aligned}
(a + b)^2 &= (a + b)(a + b) \\
          &= a^2 + 2ab + b^2
\end{aligned}
$$
```

渲染效果：

$$
\begin{aligned}
(a + b)^2 &= (a + b)(a + b) \\
          &= a^2 + 2ab + b^2
\end{aligned}
$$
