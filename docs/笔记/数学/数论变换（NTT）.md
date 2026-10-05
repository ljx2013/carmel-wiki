---
difficulty: 省选/NOI−
---

# 数论变换（NTT）

## 思想

用模意义下的原根代替 FFT 的单位根，避免浮点误差，在模 `998244353`（原根 3）下做多项式乘法。

## 实现

```c++
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const ll MOD = 998244353, G = 3;
ll qpow(ll a, ll b){ ll r=1%MOD; a%=MOD; while(b){ if(b&1)r=r*a%MOD; a=a*a%MOD; b>>=1; } return r; }

void ntt(vector<ll>& a, int inv) {
    int n=a.size();
    for (int i=1,j=0;i<n;++i){ int bit=n>>1; for(;j&bit;bit>>=1) j^=bit; j^=bit; if(i<j) swap(a[i],a[j]); }
    for (int len=2;len<=n;len<<=1) {
        ll wn = qpow(G, (MOD-1)/len); if (inv==-1) wn = qpow(wn, MOD-2);
        for (int i=0;i<n;i+=len) { ll w=1;
            for (int k=0;k<len/2;++k) {
                ll u=a[i+k], v=a[i+k+len/2]*w%MOD;
                a[i+k]=(u+v)%MOD; a[i+k+len/2]=(u-v+MOD)%MOD; w=w*wn%MOD;
            }
        }
    }
    if (inv==-1){ ll iv=qpow(n,MOD-2); for (auto& x:a) x=x*iv%MOD; }
}

vector<ll> mul(const vector<ll>& A, const vector<ll>& B) {
    int n=1; while(n<A.size()+B.size()) n<<=1;
    vector<ll> a(n,0), b(n,0);
    for (int i=0;i<A.size();++i) a[i]=A[i];
    for (int i=0;i<B.size();++i) b[i]=B[i];
    ntt(a,1); ntt(b,1); for (int i=0;i<n;++i) a[i]=a[i]*b[i]%MOD; ntt(a,-1);
    return a;
}

int main() { vector<ll> A={1,2,3}, B={4,5}; auto C=mul(A,B); for(int i=0;i<5;++i) cout<<C[i]<<' '; cout<<'\n'; return 0; }
```

## 小结

| 要点 | 内容 |
| --- | --- |
| 思想 | 用模意义下的原根代替 FFT 的单位根，避免浮点误差，在模 998244353（原根 3）下做多项式乘法 |
| 核心内容 | 见正文详细说明 |
| 实现 | 参考 C++ 示例代码 |
