---
difficulty: 提高+/省选−
---

# 期望 DP

## 思想

`dp[i]` 表示从状态 i 出发到终点的期望步数。常倒推：`dp[i] = 1 + Σ p_j · dp[next_j]`。

## 示例：掷骰子到 n 的期望步数（每步前进 1..6）

```c++
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n = 10; vector<double> dp(n+1, 0);
    for (int i=n-1;i>=0;--i) {
        dp[i] = 1;
        for (int k=1;k<=6 && i+k<=n;++k) dp[i] += dp[i+k]/6.0;
        if (i+6 > n) dp[i] = (double)(n-i);   // 简化边界示意
    }
    cout << dp[0] << '\n';
    return 0;
}
```

## 小结

| 方程 | `dp[i]=1+Σp·dp[next]` |
| --- | --- |
