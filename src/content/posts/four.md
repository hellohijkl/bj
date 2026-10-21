---
title: 密码
published: 2026-09-22
description: 学习
image: ./cover.jpg
tags: [密码]
category: 密码
draft: false
---

## 训练

### Day1

#### BabyGo

1. 题目描述

![image.png](/images/blog/1789563292477_image.webp)

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

![image.png](/images/blog/1789563915540_image.webp)

#### Base套娃

1. 题目提示Base套娃，并给了一串base64“MjlEcXlyTktTYkdUcnVSOW1EbkhRcmk2VUtlemdOWFg1SmRydEZHMmtCelRDUGF6UmFWMVlTWDZMZ2lGdGJiYktMaVROdGJRS3pSRlc2TTdYQ2FaYXBxOWZ4TUU0MlFLdzdp”

2. base64解码

![image.png](/images/blog/1789565674845_image.webp)

3. base58解码

![image.png](/images/blog/1789565687237_image.webp)

4. base32解码

![image.png](/images/blog/1789565711406_image.webp)

5. flag{af7bfd4a-7399-48ff-808d-0aa888ac708f}

#### 抽奖盒

1. 题目描述

![image.png](/images/blog/1789571494904_image.webp)

2. 通过不断的抽，base4解码得到flag{2140dd0e-5f40-4f47-ab99-4c20b988b980}

![image.png](/images/blog/1789571545194_image.webp)

#### 抽奖盒Plus

1. 题目描述

![image.png](/images/blog/1789572577823_image.webp)

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

![image.png](/images/blog/1789573309258_image.webp)

3. flag{1c66cb80-3f5e-40a1-92d3-7448be81539e}
