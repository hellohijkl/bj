---
title: 欧拉函数
published: 2026-10-19
description: 学习
image: ./cover.jpg
tags: [密码]
category: 密码
draft: false
---

## 1. 定义

$\varphi(n)$：$1 \sim n$ 中与 $n$ 互质的数的个数，$\varphi(1)=1$。

- $\varphi(10)=4$：1、3、7、9
- $n$ 是质数时，$\varphi(n)=n-1$

## 2. 通式

分解 $n=p_1^{a_1}p_2^{a_2}\cdots p_k^{a_k}$，则

$$\varphi(n)=n\left(1-\frac{1}{p_1}\right)\left(1-\frac{1}{p_2}\right)\cdots\left(1-\frac{1}{p_k}\right)$$

只看有哪些不同的质因子，指数不影响结果。

- $\varphi(60)=60\times\frac12\times\frac23\times\frac45=16$
- $\varphi(360)=360\times\frac12\times\frac23\times\frac45=96$
- $\varphi(11413)=\varphi(101\times113)=11413\times\frac{100}{101}\times\frac{112}{113}=11200$

特例：$\varphi(p^a)=p^a-p^{a-1}$。

## 3. 欧拉定理

若 $\gcd(a,n)=1$：

$$a^{\varphi(n)}\equiv 1 \pmod n$$

$p$ 为质数时（费马小定理）：$a^{p-1}\equiv 1 \pmod p$。

$\equiv$ 就是余数相同：$15\equiv 1 \pmod 7$，因为 `15 % 7 == 1`。

扩展欧拉定理（降幂）：$b\ge\varphi(n)$ 时，$a^b\equiv a^{b\bmod\varphi(n)+\varphi(n)}\pmod n$。

## 4. RSA 里的用法

$$n=pq,\qquad \varphi(n)=(p-1)(q-1),\qquad ed\equiv 1\pmod{\varphi(n)}$$

```python
n = p * q
phi = (p - 1) * (q - 1)
d = pow(e, -1, phi)
m = pow(c, d, n)
```

已知 $n$ 和 $\varphi(n)$ 可反推 $p,q$：

$$p+q=n-\varphi(n)+1,\qquad pq=n$$

例：$n=11413,\ \varphi(n)=11200$，则 $p+q=214$，解得 $p,q=113,101$。

**$\varphi(n)$ 泄露 = $p,q$ 泄露 = 私钥泄露。**

## 5. 易错点

- $\varphi(n)\ne n-1$，除非 $n$ 是质数
- 指数不影响 φ：$\varphi(2^{10})=512$，不是 1023
- 积性只在互质时成立：$\varphi(24)\ne\varphi(4)\varphi(6)$
- 连乘时每个括号都要乘
- 求模逆要求 $\gcd(e,\varphi(n))=1$
