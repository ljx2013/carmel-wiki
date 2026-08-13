# 裴蜀定理 Bézout's Identity

裴蜀定理（贝祖定理）是数论中的一个基础定理，揭示了两个整数的最大公约数与其线性组合之间的关系。它是扩展欧几里得算法、求解线性丢番图方程、模逆元等问题的核心理论基础。

## 定理内容

对于任意整数 $a, b$，存在整数 $x, y$，使得：

$$a x + b y = \gcd(a, b)$$

其中 $\gcd(a, b)$ 表示 $a$ 和 $b$ 的最大公约数。

!!! tip "等价表述"
    设 $d = \gcd(a, b)$，则：

    - **充分性**：形如 $a x + b y$ 的数一定是 $d$ 的倍数
    - **必要性**：$d$ 本身可以表示为 $a x + b y$ 的形式

    换言之，$a$ 与 $b$ 的所有整系数线性组合构成的集合，恰好是 $d$ 的所有整数倍。

## 推论

### 推论 1：互素的充要条件

整数 $a, b$ 互素（即 $\gcd(a, b) = 1$）当且仅当存在整数 $x, y$ 使得：

$$a x + b y = 1$$

这是判断两数互素的重要依据。

### 推论 2：线性丢番图方程的可解性

方程 $a x + b y = c$ 有整数解当且仅当：

$$\gcd(a, b) \mid c$$

即 $c$ 是 $\gcd(a, b)$ 的倍数。

### 推论 3：扩展到多个数

对于 $n$ 个整数 $a_1, a_2, \ldots, a_n$，存在整数 $x_1, x_2, \ldots, x_n$ 使得：

$$a_1 x_1 + a_2 x_2 + \cdots + a_n x_n = \gcd(a_1, a_2, \ldots, a_n)$$

## 证明思路

**构造性证明**（使用欧几里得算法的步骤回溯）：

欧几里得算法的递推过程：

$$
\begin{aligned}
a &= q_1 b + r_1, \quad 0 < r_1 < b \\
b &= q_2 r_1 + r_2, \quad 0 < r_2 < r_1 \\
r_1 &= q_3 r_2 + r_3, \quad 0 < r_3 < r_2 \\
&\ \vdots \\
r_{k-2} &= q_k r_{k-1} + r_k, \quad 0 < r_k < r_{k-1} \\
r_{k-1} &= q_{k+1} r_k + 0
\end{aligned}
$$

由最后一个非零余数 $r_k = \gcd(a, b)$，逐层回代即可将 $r_k$ 表示为 $a$ 和 $b$ 的线性组合。

这一过程就是**扩展欧几里得算法**的思想。

## 扩展欧几里得算法

扩展欧几里得算法不仅计算 $\gcd(a, b)$，还同时求出满足 $a x + b y = \gcd(a, b)$ 的一组整数解 $(x, y)$。

### 递归实现

```cpp
int exgcd(int a, int b, int &x, int &y) {
    if (b == 0) {
        x = 1, y = 0;
        return a;
    }
    int d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}
```

### 非递归实现

```cpp
int exgcd(int a, int b, int &x, int &y) {
    x = 1, y = 0;
    int x1 = 0, y1 = 1, a1 = a, b1 = b;
    while (b1) {
        int q = a1 / b1;
        // 更新当前行
        tie(x, x1) = make_tuple(x1, x - q * x1);
        tie(y, y1) = make_tuple(y1, y - q * y1);
        tie(a1, b1) = make_tuple(b1, a1 - q * b1);
    }
    return a1;
}
```

!!! note "参数范围"
    当 $a, b$ 较大时，$x, y$ 也可能很大，建议使用 `long long`。

## 通解结构

已知方程 $a x + b y = d$（其中 $d = \gcd(a, b)$）的一组特解 $(x_0, y_0)$，则其全部整数解为：

$$
\begin{cases}
x = x_0 + \dfrac{b}{d} \cdot k \\[6pt]
y = y_0 - \dfrac{a}{d} \cdot k
\end{cases}, \quad k \in \mathbb{Z}
$$

对于更一般的方程 $a x + b y = c$（$d \mid c$），先令 $c' = c / d$，求出 $a x + b y = d$ 的特解 $(x_0, y_0)$，再乘以 $c'$ 得到原方程的一组特解：

$$(x_0', y_0') = (c' x_0, c' y_0)$$

然后通解同上。

## 典型应用

### 1. 求解线性丢番图方程

**问题**：求方程 $3 x + 5 y = 7$ 的所有整数解。

**解**：

$\gcd(3, 5) = 1$，且 $1 \mid 7$，方程有解。

先用扩展欧几里得求 $3 x + 5 y = 1$：

$$2 \cdot 3 + (-1) \cdot 5 = 1$$

两边乘 $7$ 得特解：$x_0 = 14,\ y_0 = -7$。

通解：

$$
\begin{cases}
x = 14 + 5k \\
y = -7 - 3k
\end{cases}, \quad k \in \mathbb{Z}
$$

### 2. 求模逆元

若 $\gcd(a, m) = 1$，则 $a$ 在模 $m$ 下存在逆元 $a^{-1}$，满足：

$$a \cdot a^{-1} \equiv 1 \pmod{m}$$

等价于求解 $a x + m y = 1$，用扩展欧几里得算法即可。

```cpp
// 求 a 在模 m 下的逆元，若不存在返回 -1
long long mod_inv(long long a, long long m) {
    long long x, y;
    long long d = exgcd(a, m, x, y);
    if (d != 1) return -1;
    return (x % m + m) % m;  // 保证为正
}
```

### 3. 中国剩余定理（CRT）中的合并

求解同余方程组：

$$
\begin{cases}
x \equiv a_1 \pmod{m_1} \\
x \equiv a_2 \pmod{m_2}
\end{cases}
$$

设 $x = a_1 + m_1 k$，代入第二个方程：

$$m_1 k \equiv a_2 - a_1 \pmod{m_2}$$

这是一个关于 $k$ 的线性同余方程，可用裴蜀定理判断是否有解，并用扩展欧几里得求解。

### 4. 判断能否用给定面额凑出钱数

**问题**：有面额为 $3$ 元和 $5$ 元的硬币无限枚，能否凑出 $n$ 元？

**解**：$\gcd(3, 5) = 1$，由裴蜀定理，**任何足够大的**整数 $n$ 都可表示。具体来说，最大的不能表示的数是 $3 \cdot 5 - 3 - 5 = 7$（弗罗贝尼乌斯数），即 $n \ge 8$ 时总能凑出。

## 例题

!!! example "例题 1：NOIP 2012 同余方程"
    求关于 $x$ 的同余方程 $a x \equiv 1 \pmod{b}$ 的最小正整数解。保证有解。

    **分析**：方程等价于 $a x + b y = 1$，用扩展欧几里得求 $x$，再调整到正范围。

    ```cpp
    #include <iostream>
    using namespace std;

    long long exgcd(long long a, long long b, long long &x, long long &y) {
        if (b == 0) { x = 1; y = 0; return a; }
        long long d = exgcd(b, a % b, y, x);
        y -= a / b * x;
        return d;
    }

    int main() {
        long long a, b, x, y;
        cin >> a >> b;
        exgcd(a, b, x, y);
        cout << (x % b + b) % b << endl;
        return 0;
    }
    ```

!!! example "例题 2：判断解的存在性"
    方程 $6 x + 9 y = 20$ 是否有整数解？

    **解**：$\gcd(6, 9) = 3$，但 $3 \nmid 20$，故无整数解。
