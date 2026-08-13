# 取模 Modulo

取模运算（Modulo Operation）是数论的基础概念，用于研究整数的周期性与同余关系。在算法竞赛和密码学中，取模是处理大数、防止溢出、构造循环结构的核心工具。

## 带余除法与模的定义

对于任意整数 $a$ 和正整数 $m$，存在**唯一**的一对整数 $q$（商）和 $r$（余数），满足：

$$
a = q \cdot m + r, \quad 0 \le r < m
$$

此时称 $r$ 为 $a$ 除以 $m$ 的**余数**，记作：

$$r = a \bmod m$$

读作「$a$ 模 $m$」。$m$ 称为**模数**（modulus）。

!!! example "示例"
    - $17 \bmod 5 = 2$（因为 $17 = 3 \times 5 + 2$）
    - $7 \bmod 7 = 0$
    - $3 \bmod 10 = 3$

### 负数的取模

当 $a$ 为负数时，余数仍要求是非负的。例如：

$$
-1 \bmod 5 = 4
$$

因为 $-1 = (-1) \times 5 + 4$，满足 $0 \le 4 < 5$。

!!! warning "编程语言中的差异"
    部分语言（如 C/C++）的 `%` 运算符对负数会返回负余数，需要手动调整到正范围：
    ```cpp
    int mod(int a, int m) {
        return (a % m + m) % m;
    }
    ```

## 同余关系

如果两个整数 $a, b$ 模 $m$ 的余数相等，即 $a \bmod m = b \bmod m$，则称 $a$ 与 $b$ **模 $m$ 同余**，记作：

$$a \equiv b \pmod{m}$$

等价于：$m \mid (a - b)$（即 $m$ 整除 $a - b$）。

!!! tip "同余的直观理解"
    把整数按模 $m$ 分到 $m$ 个「剩余类」中，编号 $0, 1, \ldots, m-1$。同余的数属于同一类。
    例如模 $5$：$\{\ldots, -5, 0, 5, 10, \ldots\}$ 属于 $0$ 类，$\{\ldots, -4, 1, 6, 11, \ldots\}$ 属于 $1$ 类。

## 模运算的基本性质

模运算对加、减、乘具有**相容性**：先运算再取模 = 先取模再运算。

### 1. 加法

$$
(a + b) \bmod m = \big((a \bmod m) + (b \bmod m)\big) \bmod m
$$

### 2. 减法

$$
(a - b) \bmod m = \big((a \bmod m) - (b \bmod m) + m\big) \bmod m
$$

!!! note "减法注意"
    减去后可能为负，加一个 $m$ 再取模保证结果非负。

### 3. 乘法

$$
(a \cdot b) \bmod m = \big((a \bmod m) \cdot (b \bmod m)\big) \bmod m
$$

这三条性质意味着：**在只含加减乘的表达式中，可以随时对中间结果取模**，不影响最终结果。

!!! example "示例：大数运算"
    求 $(1234 \times 5678) \bmod 7$：

    $$
    \begin{aligned}
    1234 &\equiv 2 \pmod{7} \\
    5678 &\equiv 1 \pmod{7} \\
    1234 \times 5678 &\equiv 2 \times 1 = 2 \pmod{7}
    \end{aligned}
    $$

    所以结果为 $2$。

### 4. 幂运算

由乘法性质归纳可得：

$$
a^k \bmod m = (a \bmod m)^k \bmod m
$$

## 每步取模防止溢出

在编程中，当数值可能超过整型范围时，**每进行一步运算就取一次模**：

```cpp
const int MOD = 1e9 + 7;

// 安全的加法取模
long long add(long long a, long long b) {
    return (a + b) % MOD;
}

// 安全的乘法取模（先强转 long long 防溢出）
long long mul(long long a, long long b) {
    return a * b % MOD;
}
```

!!! tip "常用模数"
    - $10^9 + 7$：大素数，常见于算法题
    - $998244353$：NTT 常用素数
    - $10^9 + 9$：另一个常用大素数

## 快速幂（模幂运算）

计算 $a^k \bmod m$，当 $k$ 很大时（如 $10^{18}$），需要用**快速幂**（二进制拆分），时间复杂度 $O(\log k)$。

### 原理

把指数 $k$ 写成二进制：

$$
k = 2^{i_1} + 2^{i_2} + \cdots + 2^{i_t}
$$

则：

$$
a^k = a^{2^{i_1}} \cdot a^{2^{i_2}} \cdots a^{2^{i_t}}
$$

通过反复平方预处理 $a^{2^0}, a^{2^1}, a^{2^2}, \ldots$，再根据二进制位决定是否乘入。

### 实现

```cpp
// 计算 (base^exponent) % mod
long long qpow(long long base, long long exponent, long long mod) {
    long long result = 1;
    base %= mod;
    while (exponent > 0) {
        if (exponent & 1) {          // 当前位为 1
            result = result * base % mod;
        }
        base = base * base % mod;    // 平方
        exponent >>= 1;
    }
    return result;
}
```

!!! example "快速幂示例"
    计算 $3^{13} \bmod 7$：

    $13_{10} = 1101_2$，$3^{13} = 3^8 \cdot 3^4 \cdot 3^1$

    | 指数位 | base 平方 | result |
    |--------|-----------|--------|
    | 1（最低位） | $3^1 \equiv 3$ | $1 \times 3 = 3$ |
    | 0 | $3^2 = 9 \equiv 2$ | 不变 |
    | 1 | $3^4 \equiv 2^2 = 4$ | $3 \times 4 = 12 \equiv 5$ |
    | 1（最高位） | $3^8 \equiv 4^2 = 16 \equiv 2$ | $5 \times 2 = 10 \equiv 3$ |

    结果：$3^{13} \equiv 3 \pmod{7}$ ✓

## 模逆元与除法取模

模运算中**没有直接的除法**。要除以 $a$，等价于乘以 $a$ 的**模逆元** $a^{-1}$，满足：

$$
a \cdot a^{-1} \equiv 1 \pmod{m}
$$

此时：

$$
\frac{b}{a} \bmod m \;=\; b \cdot a^{-1} \bmod m
$$

### 逆元存在条件

当且仅当 $\gcd(a, m) = 1$（即 $a$ 与 $m$ 互素）时，$a$ 在模 $m$ 下存在逆元，且逆元在模 $m$ 下唯一。

### 求逆元的方法

#### 方法 1：扩展欧几里得算法

求解 $a x + m y = 1$，得到的 $x$ 即逆元。详细推导见 [裴蜀定理](裴蜀定理%20Bezout%20identity.md#2_1)。

```cpp
long long exgcd(long long a, long long b, long long &x, long long &y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}

long long mod_inv(long long a, long long m) {
    long long x, y;
    long long d = exgcd(a, m, x, y);
    if (d != 1) return -1;  // 逆元不存在
    return (x % m + m) % m;
}
```

#### 方法 2：费马小定理（模数为素数时）

若 $p$ 为素数，且 $p \nmid a$，则：

$$
a^{p-1} \equiv 1 \pmod{p}
$$

两边同乘 $a^{-1}$ 得：

$$
a^{-1} \equiv a^{p-2} \pmod{p}
$$

直接用快速幂即可：

```cpp
// 模数 p 为素数时的逆元
long long fermat_inv(long long a, long long p) {
    return qpow(a, p - 2, p);
}
```

## 线性递推逆元（批量求逆元）

求 $1 \sim n$ 中每个数模素数 $p$ 的逆元，可用线性递推公式：

$$
i^{-1} \equiv \left(p - \left\lfloor \frac{p}{i} \right\rfloor \cdot (p \bmod i)^{-1}\right) \pmod{p}
$$

边界：$1^{-1} \equiv 1 \pmod{p}$。

```cpp
vector<long long> inv_range(int n, long long p) {
    vector<long long> inv(n + 1);
    inv[1] = 1;
    for (int i = 2; i <= n; i++) {
        inv[i] = (p - p / i) * inv[p % i] % p;
    }
    return inv;
}
```

## 常见应用

### 1. 组合数取模

利用逆元计算阶乘的逆元，再求组合数 $\binom{n}{m} \bmod p$（$p$ 为素数）：

```cpp
long long C(long long n, long long m, long long p,
            vector<long long> &fac, vector<long long> &inv_fac) {
    if (m < 0 || m > n) return 0;
    return fac[n] * inv_fac[m] % p * inv_fac[n - m] % p;
}
```

其中 `fac[i] = i! % p`，`inv_fac[i] = (i!)^{-1} % p`，可用 $O(n)$ 预处理。

### 2. 求解同余方程

线性同余方程 $a x \equiv b \pmod{m}$ 的解可通过逆元或扩展欧几里得求得，详见 [裴蜀定理](裴蜀定理%20Bezout%20identity.md) 与 [中国剩余定理](中国剩余定理%20CRT.md)。

### 3. 哈希与滚动哈希

将字符串映射到模 $p$ 下的整数，通过乘进制加字符来快速计算子串哈希：

```cpp
const int MOD = 1e9 + 7, BASE = 911382629;

long long string_hash(const string &s) {
    long long h = 0;
    for (char c : s) {
        h = (h * BASE + c) % MOD;
    }
    return h;
}
```

### 4. 动态规划计数

当方案数很大时，所有 DP 转移步骤都取模，常见于「数路径」「数划分」等计数问题。

## 例题

!!! example "例题 1：快速幂模板"
    求 $a^b \bmod m$，其中 $1 \le a, b, m \le 10^9$。

    直接使用 `qpow` 模板，复杂度 $O(\log b)$。

!!! example "例题 2：求单个逆元"
    求 $7$ 在模 $11$ 下的逆元。

    **方法 1（扩展欧几里得）**：
    $7x \equiv 1 \pmod{11}$，尝试得 $7 \times 8 = 56 \equiv 1 \pmod{11}$，故 $7^{-1} \equiv 8 \pmod{11}$。

    **方法 2（费马小定理，$11$ 是素数）**：
    $7^{11-2} = 7^9 \bmod 11$。计算：
    $7^2 = 49 \equiv 5$，$7^4 \equiv 25 \equiv 3$，$7^8 \equiv 9$，
    $7^9 = 7^8 \cdot 7 \equiv 9 \times 7 = 63 \equiv 8 \pmod{11}$ ✓

!!! example "例题 3：组合数取模"
    求 $\binom{10}{3} \bmod (10^9 + 7)$。

    $\binom{10}{3} = 120$，直接验证结果应为 $120$。

    使用预计算：
    - `fac[10] = 10! = 3628800`
    - `inv_fac[3] = 6^{-1}`，`inv_fac[7] = 5040^{-1}`
    - 相乘取模得 $120$ ✓

!!! example "例题 4：负数取模"
    计算 $(-123) \bmod 7$。

    $123 = 17 \times 7 + 4$，故 $-123 = (-18) \times 7 + 3$，结果为 $3$。
    验证：$-123 + 7 \times 18 = -123 + 126 = 3$ ✓
