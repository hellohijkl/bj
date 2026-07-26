---
title: 流量分析
date: 2026-07-26
published: 2026-07-26
description: 学习
image: "./cover.png"
draft: false
tags: ["misc"]
---
## 0.学习信息
【【CTF合辑】MISC-流量分析题大集合(第一辑)】 https://www.bilibili.com/video/BV1r5411h7aw/?share_source=copy_web&vd_source=f30b943bbd8c8a86c24e6fbcc470198c
[3.流量日志分析分类/1.基础入门/key.pcapng · 风二西/CTF流量题大集合 - 码云 - 开源中国](https://gitee.com/fengerxi/large-set-of-ctf-flow-problems/blob/master/3.%E6%B5%81%E9%87%8F%E6%97%A5%E5%BF%97%E5%88%86%E6%9E%90%E5%88%86%E7%B1%BB/1.%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8/key.pcapng)
【金山文档 | WPS云文档】 CTF流量分析基础入门
https://www.kdocs.cn/l/csbK8Ahqtp4f

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
不可打印字符.的ascll码是退格
## 5.蓝牙协议
统计->协议分级->OBEX Protocol（蓝牙里面传输文件的协议）->作为过滤器应用->选中
/直接过滤obex
## 6.usb键盘流量
### 参考
https://blog.csdn.net/xcellencw/article/details/145270632?fromshare=blogdetail&sharetype=blogdetail&sharerId=145270632&sharerefer=PC&sharesource=hellohijkl&sharefrom=from_link
### tshark指令前置
1. 找到 Wireshark 安装文件夹（含 tshark.exe 的目录）
2. 此电脑 → 右键属性 → 高级系统设置 → 环境变量
3. 系统变量里找到 `Path` → 编辑 → 新建，粘贴路径：
    
    `C:\Program Files\Wireshark`
4. 全部窗口确定，**关闭当前 CMD 重新打开**，再执行你原来的命令：

cmd

```
tshark -r a.pcapng -T fields -e usbhid.data > usbdata.txt
```
a.pcapng可替换流量包
## 7.
