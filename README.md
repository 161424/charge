~~用时间轮，每日自动执行任务。bug有点多~~
采用[gocron](https://github.com/go-co-op/gocron)执行定时任务

部分任务需要`access_key`.(access_key为移动设备专有的风控验证策略，需要抓包获取)

实现功能
- 每日投币、视频点赞
- up动态/充电更新检测
- 支持[server3](https://sc3.ft07.com/)信息推送
- redis数据持久化（支持ipv6访问，DNS刷新）
- 大会员每日积分（每日85-90积分，每月能换10天大会员）
- 支持OCR登录，提供Ck刷新服务(可选，ck刷新要求较高，需要ac_time_value，可以在网页的本地存储中获取到该数据也可通过OCR登录获取)
- B币提醒及兑换（自动充电或兑换成电池）
- 会员购签到（每日75+金币，由于金币过期策略，半年可换取Q版手办）
- 魔力赏签到（主要是魔晶奖励，魔晶3天过期）
- 接入青龙（轻微实现，可以通过脚本自动化获取ck及需要ac_time_value，具体见[油猴脚本](https://greasyfork.org/zh-CN/scripts/526111-%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96ck%E5%B9%B6%E4%B8%8A%E4%BC%A0ql)）
- 支持自动发送动态（仅支持文本以及附加图片）
- 魔力赏战令每日签到(主要还是获得魔晶，部分用户没有该活动)
- 自动参与充电抽奖（需要先参与充电）

还未实现功能
- 漫画签到 （有需求再完善） 
- ~~qqbot信息推送（需要使用者自己配置服务器且官方手册上手难度高）~~
- 大会员同城观影推送（目前无数据）


参考项目
- [BiliOutils](https://github.com/catlair/BiliOutils)：Bilibili 每日工具箱
- [BiliBiliToolPro](https://github.com/RayWangQvQ/BiliBiliToolPro)BiliBiliTool 是一个自动执行任务的工具
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)：b站api
- [botgo](https://github.com/tencent-connect/botgo?tab=readme-ov-file)：腾讯官方机器人
- [go-qrcode](https://github.com/skip2/go-qrcode?tab=readme-ov-file)：ocr生成包


