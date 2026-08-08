---
title: 流量分析
published: 2026-07-26
description: 学习
image: ./cover.jpg
tags: [MISC]
category: MISC
draft: false
---
## 0.学习信息
1. 【【CTF合辑】MISC-流量分析题大集合(第一辑)】 https://www.bilibili.com/video/BV1r5411h7aw/?share_source=copy_web&vd_source=f30b943bbd8c8a86c24e6fbcc470198c
2. [3.流量日志分析分类/1.基础入门/key.pcapng · 风二西/CTF流量题大集合 - 码云 - 开源中国](https://gitee.com/fengerxi/large-set-of-ctf-flow-problems/blob/master/3.%E6%B5%81%E9%87%8F%E6%97%A5%E5%BF%97%E5%88%86%E6%9E%90%E5%88%86%E7%B1%BB/1.%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8/key.pcapng)
3. 【金山文档 | WPS云文档】 CTF流量分析基础入门
https://www.kdocs.cn/l/csbK8Ahqtp4f

### 资料
https://github.com/hellohijkl/-/tree/main/%E6%B5%81%E9%87%8F

## 1.flag明文
Ctrl+f 弹出搜索框，分组字节流，字符串，直接搜索flag/flag{
追踪流不同，结果不同
## 2.flag编码
lag经过16进制编码，或者其他编码
16进制：666C6167
32：MZWGCZY=
64：ZmxhZw==
ASCll转unicode：&#102;&#108;&#97;&#103;
[在线 Unicode 编码转换 | 菜鸟工具](https://www.jyshare.com/front-end/3602/)
## 3.压缩包流量
flag存放在zip rar tar.gz 7z里
统计->http->请求
过滤http
右键->追踪流->tcp流
解密发送包的内容（红色），先URL解码，再转base64或其他，得到压缩包格式
返回包中也有（蓝色），避免标志位去分组情况中导出
右键分组详情->显示分组字节->x@y或->|等(菜刀的标志位，去掉，从3开始)
如果是tar.gz则解码压缩,显示ascll码
不是就导出，手动打开（显示原始数据->save as->找到flag）/导出分组字节流
压缩包可能会遇到伪加密情况
[CTF中伪加密ZIP文件解析与解密方法-CSDN博客](https://blog.csdn.net/xiaozhaidada/article/details/124538768)
## 4.ASCLL表
https://blog.csdn.net/jiayoudangdang/article/details/79828853
![ASCLL.png](https://tu.helloblog.de5.net/file/1786212210634_ASCLL.png)
不可打印字符.的ascll码是退格
## 5.蓝牙协议
统计->协议分级->OBEX Protocol（蓝牙里面传输文件的协议）->作为过滤器应用->选中
/直接过滤obex
## 6.usb键盘和鼠标流量
### 参考
https://blog.csdn.net/xcellencw/article/details/145270632?fromshare=blogdetail&sharetype=blogdetail&sharerId=145270632&sharerefer=PC&sharesource=hellohijkl&sharefrom=from_link
https://blog.csdn.net/ON_Zero/article/details/130528679?fromshare=blogdetail&sharetype=blogdetail&sharerId=130528679&sharerefer=PC&sharesource=hellohijkl&sharefrom=from_link
### tshark指令前置
1. 找到 Wireshark 安装文件夹（含 tshark.exe 的目录）
2. 此电脑 → 右键属性 → 高级系统设置 → 环境变量
3. 系统变量里找到 `Path` → 编辑 → 新建，粘贴路径：
    
    `C:\Program Files\Wireshark`
4. 全部窗口确定，**关闭当前 CMD 重新打开**，再执行你原来的命令：
#### 键盘

cmd
```
tshark -r a.pcap -T fields -e usbhid.data > usbdata.txt
```
a.pcapng可替换流量包
#### 鼠标

```
tshark -r b.pcap -T fields -e usbhid.data | sed '/^\s*$/d' > usbdata.txt
```
##### gnuplot画图工具
gnuplot->plot ""

## 7.ssl流量
编辑->首选项->Protocols->TLS/SSL->选中加载密钥(出现了http,过滤查找)
## 8.ARCHPR工具(爆破)
https://pan.baidu.com/s/1g1S1EbtZhY-F3MhbPzO4qQ 提取码: zrec
## 9.CTF工具-破空_flag查找工具3.3
https://gitcode.com/open-source-toolkit/0a8a3?utm_source=tools_gitcode&index=bottom&type=card&&uuid_tt_dd=10_18661813840-1760433311904-100400&isLogin=1&from_id=142973285&from_link=400cd208904cba75f1fab52ca8616ed4
## 10.带密码的压缩包
### TCP的标志位
TCP流中的27fc表示分段传输，所以在TCP流中压缩需要手动去掉标志位，但在HTTP流中会自动去掉标志位，所以在HTTP流中可以直接提取压缩包，再用010去掉菜刀位（Rar前面的）保存
### 针对５.０以上的rar文件的爆破
在rar的安装目录找到rar.exe，运行脚本
```
＃　—＊—　coding: utf-8 —＊—
import subprocess
rar_name=""
#载入字典
with open('字典名','r') as f:
    for p in f.readlines():
        cmd = "rar.exe e {0} -y -p{1}".format(rar_name,p.strip())
        r = subprocess.getstausoutput(cmd)
        print(r)
        # print(r[0])
        if r[0] == 0:
            print("pass = {}".format(p.strip()))
            break
```
## 11.数据包中的线索
统计->HTTP->请求->/fenxi.php(过滤http,找到返回包，显示分组字节流，解码为base64,显示为图像)
## 12.在流量包中找压缩包密码
1.直接搜索password
2.跟踪TCP流，找
3.找到过滤当前TCP流和HTTP流
## 13.getshell
过滤TCP并追踪，反弹的默认装置4444

