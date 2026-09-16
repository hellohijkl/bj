---
title: MoeCTF 2026wp
published: 2026-08-30
description: wp
image: ./cover.jpg
tags: [wp]
category: wp
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

# 3.Python沙箱逃逸

# 4.现代密码学
## 训练
### Day1
#### BabyGo
1. 题目描述
![image.png](https://tu.helloblog.de5.net/file/1789563292477_image.png)
2. 附件main.go
```
package main

import ("fmt")

func XORCipher(data []byte, key string) []byte {
	keyBytes := []byte(key)
	keyLen := len(keyBytes)
	result := make([]byte, len(data))

	for i := range data {
		keyByte := keyBytes[i%keyLen]
		intermediate := data[i] ^ keyByte
		shifted := (intermediate << 3) | (intermediate >> 5)
		result[i] = shifted
	}

	return result
}

func main() {
	flag := "flag{*************}"
	key := "s3cr3tK3y"
	dataToEncrypt := []byte(flag)
	encryptedData := XORCipher(dataToEncrypt, key)

	fmt.Printf("Ciphertext: ")
	for _, b := range encryptedData {
		fmt.Printf("%02x", b)
	}
	// Output: a8fa10a842b1fb8b0061a29a12185998185992901278
}

```
3. decrypt.go
```
package main

import ("fmt")

// 解密函数，逆运算
func Decrypt(cipher []byte, key string) []byte {
	keyBytes := []byte(key)
	keyLen := len(keyBytes)
	result := make([]byte, len(cipher))
	for i := range cipher {
		// 逆：循环右移3位，还原intermediate
		intermediate := (cipher[i] >> 3) | (cipher[i] << 5)
		keyByte := keyBytes[i%keyLen]
		result[i] = intermediate ^ keyByte
	}
	return result
}

func main() {
	// 题目给出的密文hex
	hexStr := "a8fa10a842b1fb8b0061a29a12185998185992901278"
	key := "s3cr3tK3y"

	// 把hex转byte数组
	var cipher []byte
	for i := 0; i < len(hexStr); i += 2 {
		var b byte
		fmt.Sscanf(hexStr[i:i+2], "%02x", &b)
		cipher = append(cipher, b)
	}

	plain := Decrypt(cipher, key)
	fmt.Println("Decrypted flag:", string(plain))
}

```
4. 得到flag
![image.png](https://tu.helloblog.de5.net/file/1789563915540_image.png)
#### Base套娃
1. 题目提示Base套娃，并给了一串base64“MjlEcXlyTktTYkdUcnVSOW1EbkhRcmk2VUtlemdOWFg1SmRydEZHMmtCelRDUGF6UmFWMVlTWDZMZ2lGdGJiYktMaVROdGJRS3pSRlc2TTdYQ2FaYXBxOWZ4TUU0MlFLdzdp”
2. base64解码
![image.png](https://tu.helloblog.de5.net/file/1789565674845_image.png)
3. base58解码
![image.png](https://tu.helloblog.de5.net/file/1789565687237_image.png)
4. base32解码
![image.png](https://tu.helloblog.de5.net/file/1789565711406_image.png)
5. flag{af7bfd4a-7399-48ff-808d-0aa888ac708f}
#### 抽奖盒
1. 题目描述
![image.png](https://tu.helloblog.de5.net/file/1789571494904_image.png)
2. 通过不断的抽，，base4解码得到flag{2140dd0e-5f40-4f47-ab99-4c20b988b980}
![image.png](https://tu.helloblog.de5.net/file/1789571545194_image.png)
#### 抽奖盒Plus
1. 题目描述
![image.png](https://tu.helloblog.de5.net/file/1789572577823_image.png)
2. 根据题目写脚本
```
import requests
import random
import re

url = "http://127.0.0.1:49598"
for _ in range(1000):
    ip = f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}"
    headers = {
        "X-Forwarded-For": ip
    }
    res = requests.get(url, headers=headers)
    html = res.text
    # 修改正则：<br>后面抓取所有字符，直到换行
    match = re.search(r"<br>(.+)", html)
    if match:
        content = match.group(1).strip()
        print(f"IP:{ip:15} | 内容: {content}")
        if "flag{" in content:
            print("\n✅✅✅找到FLAG！！", content)
            break

```
![image.png](https://tu.helloblog.de5.net/file/1789573309258_image.png)
3. flag{1c66cb80-3f5e-40a1-92d3-7448be81539e}
 

# 5.软件逆向工程

# 6.Web安全与渗透测试

# 7.开发与运维基础