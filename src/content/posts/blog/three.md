---
title: MoeCTF 2026wp
published: 2026-08-30
description: wp
image: ./cover.jpg
tags: 
category: 
draft: false
---
# 1.取证与安全杂项
## 1.Misc入门指北
1. 下载附件，得到一份pdf
2. pdf最后提示下面有一串二进制数据，复制粘贴得到“01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001 01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001 00110101 01100011 01111101”，二进制转ASCII得到flag
![image.png](https://tu.helloblog.de5.net/file/1788074759566_image.png)
3. moectf{W31c0me_7o_m15c}

## 2.ez_BASE
1. 下载附件，得到一个压缩包解压得到一串颠倒的base64“=0HN2U0cAJ2XudHMut2XzYHQo9Vdwk1emR3Yl9Wb”
2. 颠倒成确的base64得到“bW9lY3Rme1kwdV9oQHYzX2tuMHduX2JAc0U2NH0=”
![image.png](https://tu.helloblog.de5.net/file/1788075864900_image.png)
3. 解码得到moectf{Y0u_h@v3_kn0wn_b@sE64}
![image.png](https://tu.helloblog.de5.net/file/1788075882883_image.png)

## 3.ez_LSB
1. 下载附件，得到一张图片
2. 题目提示LSB，用stegsolve->Data Extract，得到一串base64“bW91Y3Rme2M0N19rTjBXNV9MU0J”
![image.png](https://tu.helloblog.de5.net/file/1788076471634_image.png)
3. 解码得到moectf{c47_kN0W5_LSB}
![image.png](https://tu.helloblog.de5.net/file/1788076650159_image.png)

## 4.星走路的旅程-level1
1. 下载附件，得到一张图片
3. 由图片中的美丽空港搜索知道是贵阳龙洞堡国际机场，搜索IATA代码为“KWE”
![image.png](https://tu.helloblog.de5.net/file/1788077863375_image.png)
2. 用CyberChef打开图片，提取EXIF信息，得到是小米手机拍摄，时间为2026:05:31 10:03:21（北京时间），又北京时间 = UTC+8，所以UTC = 10 − 8 = 2 小时 03 分 → `0203`
![image.png](https://tu.helloblog.de5.net/file/1788077361011_image.png)
3. 综合得到moectf{KWE_XIAOMI_0203}

## 5.空白文档
1. 下载附件，得到一个word文档，考察XOR
![image.png](https://tu.helloblog.de5.net/file/1788078451224_image.png)
2. 把word文档后缀改成zip
3. 找到document.xml，发现一串base64，“AgkDChcDFBEOWhEAMFcVNg4cMABXXQQY”
![image.png](https://tu.helloblog.de5.net/file/1788080747999_image.png)
4. 先base64解密，再XOR得到moectf{wh3re_1s_my_f14g}
![image.png](https://tu.helloblog.de5.net/file/1788080738057_image.png)

# 2.二进制漏洞审计
## 1.Pwn入门指北
1. 

# 3.Python沙箱逃逸

# 4.现代密码学

# 5.软件逆向工程

# 6.Web安全与渗透测试

# 7.开发与运维基础