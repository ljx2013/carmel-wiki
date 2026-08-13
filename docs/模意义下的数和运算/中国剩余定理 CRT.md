# 中国剩余定理 Chinese Remainder Theorem

中国剩余定理（CRT）是数论中一个重要定理，用于求解模数两两互素的同余方程组。最早记载于《孙子算经》中"物不知数"问题，故又称**孙子定理**。

## 定理内容

设 $m_1, m_2, \ldots, m_n$ 是**两两互素**的正整数，则同余方程组：

$$
\begin{cases}
x \equiv a_1 \pmod{m_1} \\
x \equiv a_2 \pmod{m_2} \\
\cdots \\
x \equiv a_n \pmod{m_n}
\end{cases}
$$

有解，且在模 $M = m_1 m_2 \cdots m_n$ 下解是唯一的：

$$x \equiv x_0 \pmod{M}$$

其中 $x_0$ 为方程组的一个特解。

## 求解过程

### 核心思想

设 $M = m_1 m_2 \cdots m_n$，$M_i = M / m_i$。由于 $m_1, m_2, \ldots, m_n$ 两两互素，所以 $\gcd(M_i, m_i) = 1$，即 $M_i$ 在模 $m_i$ 下存在逆元。

### 求解步骤

1. 计算 $M = m_1 m_2 \cdots m_n$
2. 对每个 $i$，计算 $M_i = M / m_i$
3. 求 $M_i$ 在模 $m_i$ 下的逆元 $y_i$（$M_i \cdot y_i \equiv 1 \pmod{m_i}$）
4. 特解为：

$$x_0 = \sum_{i=1}^{n} a_i M_i y_i \pmod{M}$$

### 示例

**问题**：解方程组

$$
\begin{cases}
x \equiv 2 \pmod{3} \\
x \equiv 3 \pmod{5} \\
x \equiv 2 \pmod{7}
\end{cases}
$$

**解**：

$M = 3 \times 5 \times 7 = 105$

| $i$ | $m_i$ | $a_i$ | $M_i = M / m_i$ | $y_i = M_i^{-1} \pmod{m_i}$ | $a_i M_i y_i$ |
|-----|-------|-------|-----------------|-----------------------------|---------------|
| 1 | 3 | 2 | 35 | $35 \equiv 2 \pmod{3}$，$2^{-1} \equiv 2 \pmod{3}$ | $2 \times 35 \times 2 = 140$ |
| 2 | 5 | 3 | 21 | $21 \equiv 1 \pmod{5}$，$1^{-1} \equiv 1 \pmod{5}$ | $3 \times 21 \times 1 = 63$ |
| 3 | 7 | 2 | 15 | $15 \equiv 1 \pmod{7}$，$1^{-1} \equiv 1 \pmod{7}$ | $2 \times 15 \times 1 = 30$ |

$$x_0 = 140 + 63 + 30 = 233 \equiv 23 \pmod{105}$$

验证：$23 \equiv 2 \pmod{3}$ ✓，$23 \equiv 3 \pmod{5}$ ✓，$23 \equiv 2 \pmod{7}$ ✓

## 代码实现

### 扩展欧几里得求逆元法

```cpp
long long exgcd(long long a, long long b, long long &x, long long &y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}

// 求 a 在模 m 下的逆元
long long mod_inv(long long a, long long m) {
    long long x, y;
    exgcd(a, m, x, y);
    return (x % m + m) % m;
}

// 中国剩余定理：x ≡ a_i (mod m_i)，m_i 两两互素
long long crt(vector<long long> &a, vector<long long> &m) {
    int n = a.size();
    long long M = 1;
    for (int i = 0; i < n; i++) M *= m[i];

    long long x0 = 0;
    for (int i = 0; i < n; i++) {
        long long Mi = M / m[i];
        long long yi = mod_inv(Mi, m[i]);
        x0 = (x0 + a[i] * Mi % M * yi) % M;
    }
    return (x0 % M + M) % M;
}
```

### 递推合并法

将 $n$ 个同余方程两两合并，每次用扩展欧几里得求解合并后的方程：

```cpp
// 合并两个方程：x ≡ a1 (mod m1)，x ≡ a2 (mod m2)
// 要求 gcd(m1, m2) = 1
long long merge(long long a1, long long m1, long long a2, long long m2,
                long long &newM) {
    long long k1, k2;
    // 解 m1 * k1 + a1 ≡ a2 (mod m2)
    // 即 m1 * k1 ≡ (a2 - a1) (mod m2)
    long long g = exgcd(m1, m2, k1, k2);
    long long diff = (a2 - a1) % m2;
    if (diff < 0) diff += m2;
    // k1 ≡ diff * inv(m1/g) (mod m2/g)
    long long m2g = m2 / g;
    long long inv = mod_inv(m1 / g, m2g);
    k1 = (diff / g * inv) % m2g;
    if (k1 < 0) k1 += m2g;

    newM = m1 / g * m2;  // lcm(m1, m2)
    return (a1 + k1 * m1) % newM;
}

long long crt_merge(vector<long long> &a, vector<long long> &m) {
    int n = a.size();
    long long curA = a[0], curM = m[0];
    for (int i = 1; i < n; i++) {
        long long newM;
        curA = merge(curA, curM, a[i], m[i], newM);
        curM = newM;
    }
    return (curA % curM + curM) % curM;
}
```

## 非互素情形的扩展

当模数**不一定两两互素**时，方程组不一定有解。需要逐对合并，并检查每一步是否有解。

对两个方程 $x \equiv a_1 \pmod{m_1}$ 和 $x \equiv a_2 \pmod{m_2}$：

- 令 $g = \gcd(m_1, m_2)$
- 若 $a_1 \not\equiv a_2 \pmod{g}$，则**无解**
- 若有解，合并后的模数为 $\text{lcm}(m_1, m_2) = m_1 m_2 / g$

!!! example "例题：非互素情形"
    解方程组：

    $$
    \begin{cases}
    x \equiv 1 \pmod{4} \\
    x \equiv 3 \pmod{6}
    \end{cases}
    $$

    $g = \gcd(4, 6) = 2$，$1 \equiv 3 \pmod{2}$ ✓，有解。

    合并得 $x \equiv 9 \pmod{12}$（验证：$9 \equiv 1 \pmod{4}$ ✓，$9 \equiv 3 \pmod{6}$ ✓）

## 应用

### 1. 求解大数同余

当模数为大整数时，CRT 可以将问题分解为多个模数互素的小问题。

### 2. 密码学

- **RSA** 的快速解密使用 CRT 加速
- **整数分解** 的筛法

### 3. 计算组合

$x^{100} \pmod{1000003}$ 可分解为 $x^{100} \pmod{1000003}$，当 $1000003$ 可分解为互素因子乘积时，可用 CRT 分步求解。

## 例题

!!! example "例题 1：物不知数（《孙子算经》）"
    今有物不知其数，三三数之剩二，五五数之剩三，七七数之剩二。问物几何？

    即解 $x \equiv 2 \pmod{3}$，$x \equiv 3 \pmod{5}$，$x \equiv 2 \pmod{7}$。

    最小正整数解为 $x = 23$。

!!! example "例题 2：求最小正整数解"
    求最小的正整数 $x$，使得：

    $$
    \begin{cases}
    x \equiv 1 \pmod{2} \\
    x \equiv 2 \pmod{3} \\
    x \equiv 3 \pmod{5} \\
    x \equiv 5 \pmod{7}
    \end{cases}
    $$

    $M = 2 \times 3 \times 5 \times 7 = 210$，计算得 $x_0 = 53$，验证：
    $53 \equiv 1 \pmod{2}$ ✓，$53 \equiv 2 \pmod{3}$ ✓，$53 \equiv 3 \pmod{5}$ ✓，$53 \equiv 5 \pmod{7}$ ✓。

!!! example "例题 3：模逆元的批量计算"
    利用 CRT 可以将模 $p \times q$ 的逆元问题（$p, q$ 为大素数）分解为模 $p$ 和模 $q$ 下的逆元计算，再用 CRT 合并。这是 RSA 运算加速的核心思想之一。
