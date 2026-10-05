---
difficulty: 入门
---



# `freopen()`的使用

## 简介

`freopen()`是一种文件读写函数，主要用于CSP-J/S比赛，本文将介绍`freopen()`函数的使用方法，帮助新手OIer避免因为文件I/O格式错误而爆零。

## 使用方法

`freopen()`主要的使用格式是：`freopen(文件名(包含后缀名),模式(r/w),其他)`。

例如一位选手需要读入`apple.in`中的数据，输出到`apple.out`。

那么Ta就可以这么写：

```c++
freopen("apple.in","r",stdin);
freopen("apple.out","w",stdout);
```

其中：

`apple.in`与`apple.out`分别表示需要读入与输出的文件名。

$\textbf{注意：如果文件夹中没有需要读入的文件，则会报错。}$

`r`表示读入模式，是`read`的缩写；`w`表示读出模式，是`write`的缩写；

`stdin`与`stdout`分别是读入与输出需要的配置，这里不需要管，写上就可以了。

**注意，`freopen()`需要写在关闭输入输出流的前面，也就是主函数的第一行，还是以apple举例，就像这样：**

```c++
#include<bits/stdc++.h>
using namespace std;
int main(){
    freopen("apple.in","r",stdin);
    freopen("apple.out","w",stdout);
    ios::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);
    //你的代码
    return 0;
}
```

本文较短，若有问题请到Issue提交，感谢各位指教！
