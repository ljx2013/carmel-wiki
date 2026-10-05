---
difficulty: 提高
---

# 博弈论基础（Nim 游戏）

## 规则

有若干堆石子，两人轮流从一堆取至少 1 个，取光者胜。

## 结论（Nim 和）

**先手必胜当且仅当各堆石子数的异或和不为 0**：

$$
win ⟺ a1 \oplus  a2 \oplus  … \oplus  ak \ne  0
$$

若异或和非 0，先手可把某堆改为 `ai xor X`（其中 `X` 为总异或和），使局面变为 0。

## 实现

```c++
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a[] = {3, 4, 5};
    int x = 0; for (int v : a) x ^= v;
    cout << (x ? "first win" : "second win") << '\n';   // 3^4^5=2 -> first win
    return 0;
}
```

## 小结

| 要点 | 内容 |
| --- | --- |
| 规则 | 有若干堆石子，两人轮流从一堆取至少 1 个，取光者胜 |
| 结论（Nim 和） | **先手必胜当且仅当各堆石子数的异或和不为 0**： |
| 实现 | 参考 C++ 示例代码 |
