---
title: MISC
published: 2026-08-02
description: wp
image: ./cover.jpg
tags: [MISC]
category: MISC
draft: false
---
## 0.题目https://ctf2.dasctf.com/dashboard/practice/b9bbb32f-f186-458f-b90b-12440c0f6aea?tab=challenges
## 1.snake
1. 下载附件，解压得到一张snake的图片。
2. 拿到图片观察，没有直接看到flag，猜测是压缩包，binwalk -e snake.jpg
3. 得到一个压缩包，解压成功，得到两个文件：cipher、key。
4. 打开key后，发现V2hhdCBpcyBOaWNraSBNaW5haidzIGZhdm9yaXRlIHNvbmcgdGhhdCByZWZlcnMgdG8gc25ha2VzPwo= 经过base64解密得“What is Nicki Minaj’s favorite song that refers to snakes?”译为“尼基-米娜最喜欢哪首提到蛇的歌曲？”
5. 百度一下，《Anaconda》是美国说唱女歌手妮琪·米娜演唱的一首说唱歌曲，“anaconda”就是我们要找的key。 
8. 使用在线工具“http://serpent.online-domain-tools.com/”进行解密
### 步骤
1. 打开网站，修改第一项
Input type：File（必须选 File！不要选 Text，因为密文是二进制cipher文件）
点击右侧 Browse，选中你解压出来的 cipher 文件上传。
2. 配置加密参数（严格照抄）
Function：SERPENT
Mode：ECB (electronic codebook)
ECB 模式不需要 IV（初始向量），网站 IV 框直接忽略不用填
Key：输入 anaconda（全部小写！不要大写）
Key 下方单选框：选中 Plaintext
3. 执行解密
点击绿色按钮 Decrypt!
等待提示 File was uploaded.
4. 读取结果
页面下方 Decrypted text 区域右侧能看到字符串：
CTF{who_knew_serpent_cipher_existed}
把CTF改成flag
最终得到flag：flag{who_knew_serpent_cipher_existed}
5. flag{who_knew_serpent_cipher_existed}
## 2.二维码
1. 下载附件，得到一个二维码
2. 扫描得到swpuctf{flag_is_not_here}
3. binwalk -e QR_code，得到一个压缩包，提示密码是4位数字，用ARCHPR爆破得到7639,打开得到CTF{vjpw_wnoei}
4. flag{vjpw_wnoei}
## 3.easycap
1. 下载附件，得到一个流量包
2. 打开发现全是TCP流，追踪一下TCP流得到FLAG:385b87afc8671dee07550290d16a8071
3. flag{385b87afc8671dee07550290d16a8071}
## 4.镜子里面的世界
1. 下载附件，得到一张图片。
2. 图片提示“Look very closely ;)”(应该是图片隐写)
3. 用STEGSOLVE工具
###
1. Analyse → Data Extract
2. 弹出 Data Extract 窗口，严格按照下面参数勾选：
配置参数（重点！）
Bit Planes：
Red：只勾选 0
Green：只勾选 0
Blue：只勾选 0
Alpha 全部取消
Order settings：
Extract By：Row
Bit Order：MSB First
Bit Plane Order：RGB
3. 预览提取数据
点击下方 Preview
往上滚动预览窗口文本，可以看到一行：
the secret key is: st3g0_saurus_wr3cks
4. 得到 Flag
flag{st3g0_saurus_wr3cks}
### stegsolve的简单使用
https://blog.csdn.net/m0_75030189/article/details/136940462?ops_request_misc=elastic_search_misc&request_id=b0ae3e9436349818ffb241ff86913dc7&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-2-136940462-null-null.142^v102^pc_search_result_base4&utm_term=StegSolve%E4%BD%BF%E7%94%A8&spm=1018.2226.3001.4187
## 5.N种方法解决
1. 下载附件，得到一个KEY.exe
2. 这个exe不能运行，可能是其他类型，更改后缀为txt
3. 得到一串base64，data:image/jpg告诉我们这是一个图片，我们用工具(https://www.toolhelper.cn/Image/Base64?tab=image)得到一个二维码，用工具扫描二维码(https://www.toolhelper.cn/QRCode/Recognize?tab=image)得到KEY{dca57f966e4e4e31fd5b15417da63269}
4. flag{dca57f966e4e4e31fd5b15417da63269}
### KEY.txt
data:image/jpg;base64,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
## 6.被嗅探的流量
1. 下载附件，得到一个流量包
2. 搜索flag，过滤出TCP流，追踪一下发现flag
3. flag{da73d88936010da1eeeb36e945ec4b97}
## 7.荷兰宽带数据泄露
1. 下载附件，得到一个bin文件
#### bin
1. Bin 文件是最纯粹的二进制机器代码, 或者说是"顺序格式"。按照assembly code顺序翻译成binary machine code，内部没有地址标记。Bin是直接的内存映象表示，二进制文件大小即为文件所包含的数据的实际大小。 BIN文件就是直接的二进制文件，一般用编程器烧写时从00开始，而如果下载运行，则下载到编译时的地址即可。可以直接在裸机上运行。
2. https://blog.csdn.net/hfut_zhanghu/article/details/123064359?ops_request_misc=&request_id=&biz_id=102&utm_term=bin&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-6-123064359.142^v102^pc_search_result_base4&spm=1018.2226.3001.4187
2. 用RouterPassView打开，搜索Username，得到053700357621
3. flag{053700357621}
### RouterPassView
https://link.gitcode.com/i/e7c71f64812bbf639f40eec7e0c77d86?uuid_tt_dd=10_18661813840-1760433311904-100400&isLogin=1&from_id=148276146
### 类似
https://blog.csdn.net/weixin_58038441/article/details/142511625?ops_request_misc=&request_id=&biz_id=102&utm_term=RouterPassView&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-3-142511625.142^v102^pc_search_result_base4&spm=1018.2226.3001.4187
## 8.你竟然赶我走
1. 下载附件，得到一个图片
2. 尝试binwalk -e biubiu.jpg，没有压缩包，丢010看
3. 搜索flag，得到flag
3. flag{stego_is_s0_bor1ing}
## 9.zip伪加密
1. 下载附件，得到一个zip
2. 题目提示是zip伪加密，用010打开zip，将“50 4B 03 04 14 00 09 00”改为“50 4B 03 04 14 00 00 00”另存并打开得到flag
3. flag{Adm1N-B2G-kU-SZIP}
## 10.wireshark
1. 下载附件，得到一个流量包
2. 题目提示黑客通过wireshark抓到管理员登陆网站的一段流量包（管理员的密码即是答案) ,我们直接搜索password，得到flag
3. flag{ffb7567a1d4f4abdffdb54e022f8facd}
