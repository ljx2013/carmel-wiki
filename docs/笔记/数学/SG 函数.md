---
difficulty: 提高+/省选−
---

# SG 函数（Sprague–Grundy）

## 定义

对公平组合游戏的单点局面 `x`，$SG(x) = mex{ SG(y) \mid  y 是 x 的后继 }$，`mex` 为未出现的最小非负整数。

## 复合局面

多个独立子游戏合成的局面，其 SG 值为各子游戏 SG 的**异或和**（Nim 和）。$SG=0$ 必败，否则必胜。

## 实现（取石子，每次取 1..3）

```c++
#include <bits/stdc++.h>
using namespace std;
int sg(int x){ if(x==0) return 0; int vis[4]={0}; for(int t=1;t<=3&&t<=x;++t) vis[sg(x-t)]=1; for(int i=0;;++i) if(!vis[i]) return i; }
int main() {
    int a[] = {2, 3};
    cout << (sg(a[0]) ^ sg(a[1]) ? "win" : "lose") << '\n';
    return 0;
}
```

## 小结

| 要点 | 内容 |
| --- | --- |
| 定义 | 对公平组合游戏的单点局面 x，$SG(x) = mex{ SG(y) \mid y 是 x 的后继 }$，mex 为未出现的最小非负整数 |
| 复合局面 | 多个独立子游戏合成的局面，其 SG 值为各子游戏 SG 的**异或和**（Nim 和） |
| 实现 | 参考 C++ 示例代码 |
