---
difficulty: 提高+/省选−
---

# 概率 DP

## 思想

状态表示概率，转移用期望/概率递推。常见 `dp[i]` = 处于状态 i 的概率，逐层累加。

## 示例：随机游走到达概率

```c++
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n = 5; vector<double> dp(n+1, 0); dp[1] = 1;
    for (int step=0; step<10; ++step) {
        vector<double> ndp(n+1, 0);
        for (int i=1;i<=n;++i) if (dp[i]>0) {
            if (i==n) ndp[i]+=dp[i];                // 到终点停留
            else { ndp[i+1]+=dp[i]/2; ndp[max(1,i-1)]+=dp[i]/2; }
        }
        dp = ndp;
    }
    cout << dp[n] << '\n';
    return 0;
}
```

## 小结

| 要点 | 状态=概率 |
| --- | --- |
