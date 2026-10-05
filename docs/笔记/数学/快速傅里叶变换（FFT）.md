---
difficulty: 提高+/省选−
---

# 快速傅里叶变换（FFT）

## 思想

用单位根把多项式点值表示在 `O(n log n)` 内互转，从而实现多项式乘法。核心：$A(x) = A_even(x^2) + x\cdot A_odd(x^2)$，分治 + 蝴蝶变换。

## 实现（迭代版）

```c++
#include <bits/stdc++.h>
using namespace std;
const double PI = acos(-1.0);
struct Cplx { double x, y; Cplx(double x=0,double y=0):x(x),y(y){} };
Cplx operator+(Cplx a,Cplx b){ return {a.x+b.x,a.y+b.y}; }
Cplx operator-(Cplx a,Cplx b){ return {a.x-b.x,a.y-b.y}; }
Cplx operator*(Cplx a,Cplx b){ return {a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x}; }

void fft(vector<Cplx>& a, int inv) {
    int n = a.size();
    for (int i=1,j=0;i<n;++i){ int bit=n>>1; for(;j&bit;bit>>=1) j^=bit; j^=bit; if(i<j) swap(a[i],a[j]); }
    for (int len=2;len<=n;len<<=1) {
        double ang = 2*PI/len*inv; Cplx wn(cos(ang),sin(ang));
        for (int i=0;i<n;i+=len) { Cplx w(1,0);
            for (int k=0;k<len/2;++k) {
                Cplx u=a[i+k], v=a[i+k+len/2]*w; a[i+k]=u+v; a[i+k+len/2]=u-v; w=w*wn;
            }
        }
    }
    if (inv==-1) for (auto& c:a) c.x/=n, c.y/=n;
}

vector<int> mul(const vector<int>& A, const vector<int>& B) {
    int n=1; while(n<A.size()+B.size()) n<<=1;
    vector<Cplx> a(n), b(n);
    for (int i=0;i<A.size();++i) a[i]={A[i],0};
    for (int i=0;i<B.size();++i) b[i]={B[i],0};
    fft(a,1); fft(b,1); for (int i=0;i<n;++i) a[i]=a[i]*b[i]; fft(a,-1);
    vector<int> c(n); for (int i=0;i<n;++i) c[i]=(int)round(a[i].x);
    return c;
}

int main() { vector<int> A={1,2,3}, B={4,5}; auto C=mul(A,B); for(int x:C) cout<<x<<' '; cout<<'\n'; return 0; }
```

## 小结

| 要点 | 内容 |
| --- | --- |
| 思想 | 用单位根把多项式点值表示在 O(n log n) 内互转，从而实现多项式乘法 |
| 核心内容 | 见正文详细说明 |
| 实现 | 参考 C++ 示例代码 |
