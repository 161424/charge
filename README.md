~~用时间轮，每日自动执行任务。bug有点多~~
采用[gocron](https://github.com/go-co-op/gocron)执行定时任务

部分任务需要`access_key`.(access_key为移动设备专有的验证策略，可以使用Fiddler+随机安卓模拟器进行获取)

实现功能
- 每日投币、视频点赞
- up动态/充电更新检测
- server3信息推送
- redis数据持久化（支持ipv6访问、DNS刷新）
- 大会员每日积分（每日85-90积分，每月能换10天大会员）
- OCR登录、支持Ck刷新(可选，ck刷新要求较高，需要ac_time_value，可以在网页的本地存储中获取到该数据)
- B币提醒及兑换（自动充电或兑换成电池）
- 会员购签到（每日75+金币，由于过期策略，半年可换取Q版手办）
- 魔力赏签到（主要是魔晶奖励，3天过期）
- 接入青龙（轻微实现，可以通过青龙更改ck及需要ac_time_value，具体见油猴脚本）

还未实现功能
- 监听up抽奖动态（饼（主打copy））
- 漫画签到 （有需求再完善） 
- ~~qqbot信息推送（需要使用者自己配置服务器且官方手册上手难度高）~~
- 大会员同城观影推送（目前无数据）
- 魔力赏战令每日签到

参考项目
- [BiliOutils](https://github.com/catlair/BiliOutils)：Bilibili 每日工具箱
- [BiliBiliToolPro](https://github.com/RayWangQvQ/BiliBiliToolPro)BiliBiliTool 是一个自动执行任务的工具
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)：b站api
- [botgo](https://github.com/tencent-connect/botgo?tab=readme-ov-file)：腾讯官方机器人
- [go-qrcode](https://github.com/skip2/go-qrcode?tab=readme-ov-file)：ocr生成包


