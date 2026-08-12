# 集合 Set

集合是数学中最基本的概念之一，也是算法与数据结构的重要基础。本页介绍集合的基本概念、运算及在编程中的表示。

## 基本概念

**集合**（Set）是由若干互不相同的元素组成的整体。集合中的元素是**无序**的、**互异**的（不重复）。

- 用大写字母 $A, B, C$ 表示集合
- 用小写字母 $a, b, c$ 表示元素
- $a \in A$ 表示 $a$ 是集合 $A$ 的元素
- $a \notin A$ 表示 $a$ 不是集合 $A$ 的元素

## 集合的表示

### 1. 列举法

把集合的所有元素一一列出，用花括号括起来。

$$A = \{1, 2, 3, 4, 5\}$$

### 2. 描述法

用元素的共同特征描述集合。

$$B = \{x \mid x \text{ 是正偶数}\}$$

$$C = \{x \in \mathbb{R} \mid x^2 < 4\}$$

!!! tip "特殊集合"
    - **空集** $\emptyset$：不含任何元素的集合
    - **全集** $U$：所讨论问题的所有元素组成的集合

## 集合间的关系

| 关系 | 符号 | 含义 | 示例 |
|------|------|------|------|
| 子集 | $A \subseteq B$ | $A$ 的所有元素都在 $B$ 中 | $\{1,2\} \subseteq \{1,2,3\}$ |
| 真子集 | $A \subset B$ | $A$ 是子集且 $A \neq B$ | $\{1,2\} \subset \{1,2,3\}$ |
| 相等 | $A = B$ | 两集合元素完全相同 | $\{1,2\} = \{2,1\}$ |
| 不相交 | $A \cap B = \emptyset$ | 两集合没有公共元素 | $\{1,2\}$ 与 $\{3,4\}$ |

!!! example "子集数量"
    若集合 $A$ 有 $n$ 个元素，则 $A$ 的子集总数为 $2^n$，真子集数为 $2^n - 1$。

## 集合的运算

### 并集

$$A \cup B = \{x \mid x \in A \text{ 或 } x \in B\}$$

### 交集

$$A \cap B = \{x \mid x \in A \text{ 且 } x \in B\}$$

### 差集

$$A \setminus B = \{x \mid x \in A \text{ 且 } x \notin B\}$$

### 对称差

$$A \triangle B = (A \setminus B) \cup (B \setminus A) = (A \cup B) \setminus (A \cap B)$$

### 补集

$$\overline{A} = \{x \mid x \in U \text{ 且 } x \notin A\}$$

!!! example "运算示例"
    设 $A = \{1, 2, 3\}$，$B = \{2, 3, 4\}$：
    
    - $A \cup B = \{1, 2, 3, 4\}$
    - $A \cap B = \{2, 3\}$
    - $A \setminus B = \{1\}$
    - $B \setminus A = \{4\}$
    - $A \triangle B = \{1, 4\}$

## 运算定律

| 定律 | 公式 |
|------|------|
| 交换律 | $A \cup B = B \cup A$，$A \cap B = B \cap A$ |
| 结合律 | $(A \cup B) \cup C = A \cup (B \cup C)$ |
| 分配律 | $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$ |
| 德摩根定律 | $\overline{A \cup B} = \overline{A} \cap \overline{B}$ |
| 德摩根定律 | $\overline{A \cap B} = \overline{A} \cup \overline{B}$ |

## 常用数集

| 符号 | 名称 | 描述 |
|------|------|------|
| $\mathbb{N}$ | 自然数集 | $\{0, 1, 2, 3, \ldots\}$ |
| $\mathbb{Z}$ | 整数集 | $\{\ldots, -2, -1, 0, 1, 2, \ldots\}$ |
| $\mathbb{Q}$ | 有理数集 | $\{p/q \mid p, q \in \mathbb{Z}, q \neq 0\}$ |
| $\mathbb{R}$ | 实数集 | 所有实数 |
| $\mathbb{C}$ | 复数集 | 所有复数 |

包含关系：

$$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}$$

## 集合的基数

集合 $A$ 中元素的个数称为**基数**（cardinality），记作 $|A|$。

- 有限集：$|A| = n$（$n$ 为非负整数）
- 无限集：$|\mathbb{N}| = \aleph_0$（可数无穷）

!!! info "容斥原理"
    $$|A \cup B| = |A| + |B| - |A \cap B|$$
    
    三个集合：
    $$|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|$$

## 在编程中表示集合

### 1. STL `std::set`

```cpp
#include <set>
set<int> A = {1, 2, 3, 4, 5};
set<int> B = {2, 3, 4, 5, 6};

// 并集
set<int> cup;
set_union(A.begin(), A.end(), B.begin(), B.end(),
          inserter(cup, cup.begin()));

// 交集
set<int> cap;
set_intersection(A.begin(), A.end(), B.begin(), B.end(),
                 inserter(cap, cap.begin()));

// 差集
set<int> diff;
set_difference(A.begin(), A.end(), B.begin(), B.end(),
               inserter(diff, diff.begin()));

// 对称差
set<int> sym;
set_symmetric_difference(A.begin(), A.end(), B.begin(), B.end(),
                         inserter(sym, sym.begin()));
```

### 2. `bitset`（元素为小整数时）

```cpp
bitset<100> A, B;
// 设 A = {1, 3, 5}
A[1] = A[3] = A[5] = 1;

// 并集
bitset<100> cup = A | B;
// 交集
bitset<100> cap = A & B;
// 差集
bitset<100> diff = A & ~B;
// 对称差
bitset<100> sym = A ^ B;
```

### 3. 布尔数组

```cpp
bool inA[100] = {false};
inA[3] = true;  // 3 在集合 A 中
```

!!! tip "选择建议"
    - 元素为小范围整数 → `bitset`（最快，支持位运算）
    - 元素任意，需要有序/去重 → `std::set`
    - 仅需判断存在性 → `bool` 数组或 `unordered_set`

## 集合在算法中的应用

### 枚举子集

枚举集合 $A$（用二进制表示）的所有子集：

```cpp
for (int sub = A; ; sub = (sub - 1) & A) {
    // sub 是 A 的一个子集
    if (sub == 0) break;
}
```

!!! example "复杂度"
    枚举大小为 $n$ 的集合的所有子集，时间复杂度为 $O(2^n)$。
