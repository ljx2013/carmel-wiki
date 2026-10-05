---
difficulty: 提高+/省选−
---

# 大素数测试（Miller–Rabin）

## 思想

对奇数 `n`，写 $n-1 = d\cdot 2^r$。若对所有测试基 `a`，$a^d \equiv  1$ 或某步 $a^{d\cdot 2^i} \equiv  -1$，则 `n` 很可能是素数。选少量基即可在高范围内确定性判定。

```c++
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
ll qpow(ll a, ll b, ll m){ ll r=1%m; a%=m; while(b){ if(b&1)r=r*a%m; a=a*a%m; b>>=1; } return r; }
bool miller(ll n) {
    if (n<2) return false;
    for (ll p : {2,3,5,7,11,13,17,19,23,29,31,37}) if (n%p==0) return n==p;
    ll d=n-1; int r=0; while(!(d&1)) d>>=1, ++r;
    for (ll a : {2,325,9375,28178,450775,9780504,1795265022}) {
        if (a%n==0) continue;
        ll x = qpow(a, d, n); if (x==1||x==n-1) continue;
        bool ok=false;
        for (int i=0;i<r-1;++i){ x=qpow(x,2,n); if(x==n-1){ ok=true; break; } }
        if (!ok) return false;
    }
    return true;
}
int main() { cout << miller(998244353) << '\n'; return 0; }  // 1
```

## 小结

| 要点 | 内容 |
| --- | --- |
| 思想 | 对奇数 n，写 $n-1 = d\cdot 2^r$ |
| 核心内容 | 见正文详细说明 |
| 实现 | 参考 C++ 示例代码 |
