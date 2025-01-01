// ==UserScript==
// @name         战斗吧歌姬！
// @homepage     https://greasyfork.org/zh-CN/scripts/434237
// @version      8.8.30
// @description  哔哩哔哩勋章升级、天选时刻抽奖、实物宝箱金宝箱抽奖、圆盘抽奖、动态抽奖、红包抽奖、批量取关及其他常用功能等
// @author       风绫丨钰袖
// @iconURL      https://www.bilibili.com/favicon.ico
// @icon64URL    https://www.bilibili.com/favicon.ico
// @match        https://live.bilibili.com/*
// @match        https://www.bilibili.com/blackboard/live/*
// @connect      bilibili.com
// @connect      gitcode.net
// @connect      gitee.com
// @connect      127.0.0.1
// @connect      flyx.fun
// @connect      iw233.cn
// @connect      ftqq.com
// @connect      pushplus.plus
// @connect      qingyunke.com
// @connect      *
// @require      https://lib.baomitu.com/jquery/3.4.1/jquery.min.js
// @require      https://greasyfork.org/scripts/441505-crypto-js4-1-1/code/crypto-js411.js?version=1028182
// @require      https://greasyfork.org/scripts/445313-pako-1-0-10/code/pako@1010.js?version=1052595
// @require      https://update.greasyfork.org/scripts/447321/1416383/BiliveHeart.js
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @run-at       document-idle
// @grant        GM_info
// @license      MIT License
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/434237/%E6%88%98%E6%96%97%E5%90%A7%E6%AD%8C%E5%A7%AC%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/434237/%E6%88%98%E6%96%97%E5%90%A7%E6%AD%8C%E5%A7%AC%EF%BC%81.meta.js
// ==/UserScript==

/*
引用或借鉴荒年、spiritlhl、Aw、sealong、lzghzr、Newell Gabe L.等代码，特此感谢！
脚本不能加载时可尝试替换库源网址：
替换第21-24行：
// @require      http://flyx.fun:1369/static/jQuery3.4.1.js
// @require      http://flyx.fun:1369/static/crypto-js.js
// @require      http://flyx.fun:1369/static/pako.min.js
// @require      http://flyx.fun:1369/static/BiliveHeart1071099.js
*/

window.onload =(function ZDBGJ_BLRHH_Plus(){
    var medal_list_now = []
    var dmlist = [
        "official_331",
        "official_332",
        "official_348",
        "official_343",
        "official_335",
        "official_345",
        "official_339",
        "official_337",
        "official_342",
        "official_346",
        "official_147",
        "official_109",
        "official_113",
        "official_150",
        "official_103",
        "official_128",
        "official_133",
        "official_149",
        "official_124",
        "official_146",
        "official_148",
        "official_102",
        "official_137",
        "official_118",
        "official_108",
        "official_104",
        "official_105",
        "official_106",
        "official_110",
        "official_111",
        "official_115",
        "official_116",
        "official_117",
        "official_119",
        "official_122",
        "official_125",
        "official_126",
        "official_134"
    ]
    var fwqip = '127.0.0.1'
    var bot_keyword = ["色图","涩图","图来"]
    var bot_keyword3 = ["真涩图","不涩","真色图","不色","来点色","来点涩","不够涩","不够色"]
    var bot_keyword4 = ["菜单","帮助","命令","指令"]
    var xiaoai_keyword = ["小爱"]
    var qqbotlist = ['10086']
    var access_token = ''
    var server_area_id = 88
    var server_area_data = [{"id": 2,"name": "网游","percent": 13},{"id": 3,"name": "手游","percent": 13},{"id": 6,"name": "单机游戏","percent": 13},{"id": 1,"name": "娱乐","percent": 13},{"id": 5,"name": "电台","percent": 13},
        {"id": 9,"name": "虚拟主播","percent": 13},{"id": 10,"name": "生活","percent": 4},{"id": 11,"name": "学习","percent": 4},{"id": 13,"name": "赛事","percent": 4},{"id": 88,"name": "全区热门","percent": 10}]
    var Lottery_room_list = []
    var journal_pb_console = false
    var journal_medal_console = false
    var journal_popularity_red_pocket_console = false
    var goldjournal_console = false
    var freejournal_console = false
    var freejournal2_console = false
    var freejournal3_console = false
    var freejournal4_console = false
    var freejournal4_record_id_list = []
    var freejournal5_console = false
    var freejournal6_console = false
    var freejournal7_console = false
    var freejournal8_console = false
    var get_sessions_console = false
    var lottery_result_console = false
    var getOnlineGoldRank_mark = false
    var time_switch_mark = true
    var dianchi = 0
    var dianchi_gift_num = 0
    var ms_diff = 0
    var s_diff = 0
    var Storm_BLACK = false
    var bag_gift_check_mark = false
    var bag_gift_name_list = []
    var bag_gift_id_list = []
    var bag_gift_num_list = []
    var pocket_time_hours = []
    var pocket_time_mins = []
    var reload_mark = false
    var need_pass = false
    var popularity_red_pocket_do_mark = false
    var popularity_red_pocket_join_num_max = false
    var ALLFollowingList_2000_mark = true
    var widthmax,
        heightmax;
    var sessions_msg = []//私信提取临时存储
    var dynamic_msg = []//批量动态中奖检查临时存储
    var qun_server = []
    var dynamic_lottery_tags_tagid = 0//动态抽奖分组ID
    var tags_mid_list = []//默认分组uid列表
    var txskdatu = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS0AAAFhCAMAAAASpwzLAAAC7lBMVEX///9XPbVWObdZNr1UNL1ZNrtuXLhYPJ4jI4RQO5BuVqpHJZ9AJaFMOqFrVZ41JIU6OYx1Wq1DOrY2NXVtXL86JIxYT55ZPKZXSpNoT7cmJH1KQJRAJpt+YaNTNLlKPJwzH3yTdK+niK59aqJ1W5tsWJM1OoafgbM0L3LUtqS3o7BzaZTTtKEhJ3OAbqkkJ4soKZMrLJosLaA8N6c/JJQuMJ5XVbU3NKxQNLQ9OZtxasHHxOunodiZktlxbMiCfstNOYM9NqKTe63SsppKOqdva7fU0Ov7+v/19P/a1vRLNK7y7v+uqtzi3/c7OJTn5PhVNMKCfcJYU6u2r+fv6/7SsZSNb7S+uOnQsK+GfdOUkMnr5v/Jq7DXt7BbTsh+b8tOSaGOfsWBerh/cMEsMpSalMhoVrbIqaPTsJKSc6luZ6uoldLSr4+BdLXo4v4sMosaKmk0OXteS7OScaPTzPTl3/7LxPR+albRrXtYQ67b1Pvi2v/e1v+Ldax8bL/a0f+onuXXzf8rNYSBcMKRfrWgg8CbksLa0d3w5+n+8+7/9+/98+v98O306+Xu5uPq39ze1NOtlrZRRHvIssfNwcfYxsjl2tjt49/37OXTyf7n3uXBtvX+9ez+8eX/797+7tv769v46Nf15tXw4tbq0cjGtc+/qMu5ocuzm8q0qMiulsSck7SMgdbOw//338xzW8luXL9rWbfKvv+1qvX96tVoUct5YMbHuv9aOs3t18Wpn+1uXH3cvZny4czCtP5JNdL78eujmeidk+S9rvuvovO1r/j/583q0rXnzKy9rv/XyNXbuI7Ys4XixaHVrn7LvtO0qfeRhdtwZp+cm7lbNMhZNsRlOshmOc3YsZdqPtFvQ9JxRtPRr4X+5cnPrHKTlLbNqWjLpV7KpFknNHvKolHHnkkaGD4eM3KEdtHHnD/GoD0ZMmtuXGlxXl9xaFhwZ1FmYVXEmze8lT98blC5lDxsZk5mWWGwjkBqZJx1YH/ZclbPAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAQfJJREFUeNrtnX9gFNW1+LdCzARMdrCwhFleNn2QlVed7G5CSDZhSVYTnkQczcYfJW2/SWBFSsFNeP4sxerywwKKWATxCaI88QfEHxWLkForSKpirUC11j5fn7DgClGR19L33n/fc+6PmTszmx9QE3zsnsDOzJl779z7mXPOPXN3N3E4iHzjvCEgQ4eYJSsrC1/x/9DUMuT8bIlJzrDhF1yQm+fkx5IzL/sCFFE3kJKTN5xcbpgs6Mydco4YMrSnkWTpAxaFIhl64TcdXC4canDKMsPKYrqeaGWNHMY7Niov94ILhtu6ip3NGQxYTpf95tAblq3fUfn8HmlliSO2wgBA32CwzhNsylSaH2T1eImhWVkjnBL+YM+A1gWj83HXafDD3rr0e0vPOPsyNqdpzyn1xzjZ1YZn5xvtO+kdzOHH+X3QSj1+yutC6oQprInsDsnSeWNrvFXzNut82ckkn9zHPHpgvtuj6MBZwf7RMor1ixZcfrh+MV6eOCdoeBfzxmT1dNe5H/Fh2y3tPPTGC3uAlWUYZ9ZQ+jI0xfb8bN4VFiNGGSz0SMJdUQcpiMLljPzPoJXnGm42ZBCXeAOdzlEjsnqjRcc7NKsHXFloXUZ4IjtZWcYu2+lVxgzT+0JcITvH6gjZ2S6Z+aCFlGKXM8DENm5Xdu7YscPFIEmDg8ut38/zkRa5yUMt2yzOK2sIB5dl7FJG5zkc/2Cc5DX0bT9gFWSN0O2c3MncPKdBJicvNzc7O8epO6FoWUpKOTNWuCe7s7M9YEhGEzngnGMFR8weo/d7qGWbZRu0AITD+abjG7ZT1p0+5Pwc/dah4w3Pk52CceVlu0cJrAReOp9C8tM/XopkKSG25szJz87LMVqB2zd27FjDEZ3DxvRjPKkA6LTOMxuWId/qp/zjON0Vx+dlZ2ePLxLsJydfdtJ4baHFSRUWMlqFhSIu9sIO7QZoZcr0wMtplPKOz8/Jzx9v3M1/vKhfI0qJEBFNcPDwZCv+T/2Vb+uzYtG48UVF48cJtLhPGrQkgVahSZRCk4314KlWCzTTLHQKLeSPKyoqunicl9+r8f0ckM1YeEAjtIhcIgij1U/juki/efL4vHx3Po+zirhxGubFaTFIKgodvdkjU0uhoheSmAFS73Q6qaXq8J35+Tk5OUVF5AbhhYv7ZVqMlo0HpZXFafHieLagAGgVkC3+2LdZ+jZrjBEYSKDwZDtNzsNojWLAuGUZqFRV8vkDIE5mYwYWPNQDG7E+P4jkc5oIIihfSYnPbKuB0tKJEydmyxIzbfl87D75b56oCuh0VUBPAy3cmnlQYbSgINMVFMBeAQrQ6p8Is2IO0Jo4NjvHbA4EVo4rR7csCytVKps0sry8vKJEKhQCmcIsxQhvIP7ykUPKS8pLfKK55eQ4C/0XFpRBg4VqoQItYlFosWSiO99Jr09mRAKG9LmAjTuLWUCWPhw2bkKB2REvTmnRs9xZGdV+e+K3/rFIN67xRTk5+UXjnbpDEFr+3GD++PHjvUZE5qxcPklRlUBlVdXkSaWhcr8QysDB6I7P79eVUumUqqpQQfXQEmNWKKyB8CSXTAmVSgAe7JTeAifgLw8X1ZDbhXPQpf2L8WzcjAKlxcAhLYr0ssvQCrHAZZedJq2LinXjyh+fn59fVGSO3v7yUHWtKz8v3whZzFV9k+vKfJKvZOo///PlVdXTppT4FZVzQY9DpoUl9YCB2mKhrxyKXjG9KlRucHVCeHKXTaq6srJMUnyqP8BolZaHLiyHa3Lj7h8sPm5KAaPRZZcxH0JaBTotsEK6Ry3ykn56YgFNuXwYeYK14XA4qPl9gvjLp1w19epyiGfk6Rbjjz+A4cfv80+bGmqY5I/8M8jlV10egthDRlqoAuIp9cAOAJWGKnCHiL/88suh6OWTBVo57omB0srGy/956pQwEA6U0cKFJeXXTB5ZX0auJOEzYkXPQ7jwQn33kn8qMCjAvk6rAGjxQkRHCl4r0hpz3XVj+tyOwXTZf+GFQ4cWTCqYNHISlXomFVOmXn5549DyMMGFJgUkqitLS0oD/msuv+Kq6f7I1OuvuRykMlAaYEMFe5w2udwvgeFVXjW53i8pjFZVCFq7prJEh5XvDpSUVFZh/WmVcBciEZ8qK1A8UHr55VWTqyEilkI7OZeOqaio6GEcF1ZceCHXcFrXMloFOq0Cg9a11+q0rjXCXMFF3/nORX1us0bISGvKDJTQdJSqqsbp00PV1dWgmT516tSq0BDEJaNpOctnTL1qamhSQySAY6zyRaoiTVOvump6uKwpTI3LF2767uXXVCP06mmXXzO9Muyn+tLG8srJ00OlPhrJIR8t0gKBkknXY0tTI35/YPr0gATNKKo/DKprrqwuLwFYznHfuxRppR4HnLmQa9gkd61Oi/HoD63vff/73+t7O8aFtP7fFCLNzfAC0eUaGCQVoh5SXjrRk18DHhSomHbFFVd8t6qqoeVy2GmVIlc21c1saIj4Z11VHZDIJFl5JZyZdv3111ddiWMOhanR+UqvrJ5UWg9TIvPMQDCoRQMBfx3SusHnCzZ896qmYNXk2VGJ0Lqiqj4A86ckf/s7N1YUVPTQ//MqLvwG1/SL1pw5P/jBDy6D/z+YM+c0bauiAo3LV1pSUlIWoBGpBGFd01QCUQslEEYpmzjRXVRTWFgyBU+CNMzGHZdz7hVXVTUFtWDd1CvAmSDp9JfVVcGZqqamphsQ25URv0RzjfAVVzY2gbHArIsOGyifhVLZ0AT4r5pcN/OHcCOuvGEaVJ3UUgs1oQ8Szq9FN954KdLqybYu/IbFtggPAoTxMNGaR2QOeRVo9SduQS/QuCCgsyheKJVchTRaAyT1UTASu3MmosCDXGFJddXkqXB6WksDvs6cfwNsbmqY2dA4bdq0xroAEA4EqpF2NBYLTEdsEObb2pBWEI6uLPX76tAGC9sD5dUNKNOuvOaaqQ0zZzZMhh2kdc1NVXUt2IfKAPbAmVdcvKC+oKe4VSHGrUsMHhTHPDutf0G5lrz+C9SmtXALlyggs0mKLdmgLGAZKsmRYFCBm78LUk2DDXTXGZw4cdTEUaNGTYRMMlBZGa6bfnNVqzT9u9+9cubcuTdg4aa6upkzZ86aVUdnsUqsD9HJ1wQ71/t4HhvEohF/5OaGgFTYXkMeAaLRlptAO3WYJHvkpptuaZKr4LDK48GydX68fs5oMt/0NCuSMRQUiOP+FwGIQatCrHFJhSGXGAcFFTYpsGzRuBAWo+UntGYZtEo9ExEWSE6OVgpAauuGxWLTvnvTDZCdzsfBusgjH3ouJmX+OtA1+NrafA1wrtHHnqF9tVh0Uu30m24FG+Rpnr8ar3bzTCXSoHqnT3aqSKtJ0W7itJzZQKuC0aroCZdt3AyIXkinJZxMVatPocbFaBU6/TffBFLn47T85SVuRmvUKBljGyTxytxbbmqU1TZ1/i1Q2AW+1qb6gjSA++pA1yC1tUkNcK6qjksTFg1NhteqWWUsx5eCt9500y3T62R1cpVLceWrahUUmqtoWJbQysmuJaaVApeu7JkW51VxG6NlPnkGtMC4EBelVSMDrVtuuSXCaSmBSeXBHDej5QRYUTilTL/lemQk0FIiTX4Ftm2SmdZMLoTWDY3wenM1oyX5QDmtCSDJ0265fmYO4Ke0ZCh1yyS4EJgWp1VBxprSqHqhxSDd7uAO+/fSumPYRBLlEZdT9k8DWLe0SAwWpEnNJRrDBfOB318XVBStajI1qGIs7MKi7sZpdT6M6NJsUDUAOKUBdholtkgoRbBoJNJ4y62VQR9ddJAiN99y80wvQGqFcz9qgBarYGeuKmNZoAWmlVtbz3GJvpWKV0+04PVfHAz3D4hc8gNDLrnxtGjV14chf/CTZx5nzPejhSBRFmx84dCPbx1ZonmoMzpj/khVU8xZ98O5brcM0oqFYd8dmbzwlqqGoKSAkd2ycGErobXwloWNZEpUQN0C6oURH0T5KK7v4CJQcPrCm+djAe+teHIm0Lp+4UJCCw6BljM7l9My4Ii4TMRuNEGgG1Yx28HKXmKTGy86PVrlU0JNRGZhfPkxdPTHLNZUVoZuXriwcUppGUxfkE4Gg5Om//jmhkjDTDg5GeSH06vg/OT58ydjtVtnxSSgBXtNlBacQ+9EWqprIaHla4j66PpEpK7pRwunD4u4XMMI9CovpbUQaC0ktApzPMNzaw1X5LiE/6JcdKOdBStfa9Cy2taiMadJiz7yTJ9eDeli9Y9Bbq6adSdJHhsa4egnodISvxYNk+MfwdnJ8/NBFsKpmflNsFnoyp87HfRNEWJboGmCgK80QAFKyw2O7cLyEUmK+snSodNXdyu0VdWIWf/NcOpHTRj1roe9uaqXls3JHivS6kvGLLLalk6rwsHYUs3phSoLrYpJk+64o7a2Jahp0QjSavxJS1SLRjUtOOmuH98duiPqczqjYXgSuhPH9ePJboxUuJfXNh83cVX1NP6oVUavUrCFRrTMybiDjijdMFdRXD+mtMDdEVaNM3gran5U1fjDH+FOVatAi5R1ZntOi5ZJLjHYAKjzHFydklbW4tYf9lNuaGptXeLyOckqs6/uJyANt9ZJNV6yHDjp1lApsQaf3+3W/JPxtEudMGFCIdlrm48bDNSRyTKZExUXKKbjLNgIO42YmNbd3Ogi6p9EnDUxX01NTU5Ne6Fv8k/uvn5y61xXw91wpur6xglIC3bz2rykbOxbixYtWbJ02Q033NDXGFoXZ1kAXIbh7sYbGWed1mWpaC2efs9Pl6/oU5YvX7ny3vvuW3X/6gdy6KKo1IAdbWmcLtUU1eBIo9V3sOTIWVNU5COnvRN+9rMJMu65DVqKm8CCAIW4JXjCC1Fa7llVP7l7+txhlECR7MsvKoKHTtVXeX3rXHdcdSGhqqZb725ob2trFGjJax58cO3qdQ+tWnXfypW9j+On90xfbKFFXi7jhzqty+y0Wu/pmxSltXz5eqD10Lq1P6C0fJPvvvvuW2NNN0ecZEiF/nDUyRekaoqkO+H03XGg1ZaPe962+XQDNoVuSGiB4k6M8k2wA7QijbB9uGkuFmyJFeUDrfx2vDHB2TEIb/J0vOJMuO6tTd42LAu0sOxp0EK5pzWlJ57XJ63F/9o/WCuWr2S07l+9BheZVcX3CPQzJNXdPV2WERdkkDqsQrVdqsRxKEgLR/+wSjZ3y+S9sh5oeecCgia3i9EqknNqqBlLuFAohx4GTvNnPozN5f0dtFb862IbLcqmwEbrMqFgFresDRsf7V02PbZp0+ObN//buieeWPvtGvIo8jBIBDeznDkElyEkBMFpQktthb3Gtra5WMEtR+YOc1Nciuvuhx8mtEgJtX1CoeuR6bLiwoJIy8taw1VSVW7CQnNd1+PZxva2RtgALdIL+XvfeXDt2ifW/dvmf3v00Y09ig7yHjF29eqJIq1WxmrTE1ue7FueevqZZ7ZufeCBbePAiHxIo1GWfI0PPxKJQTi24JIiOA4FgryK42pltFpDjY88MnmuQqI/YrlTmdCuNBBaoFIaXCqj5TRaxEcFrePZh28NubyT8eT1rjZCy8VpXbpt27YHHnjmmSefXLNmi03WUNmydvOjDFfrmdDaQmE991Tr8/2RkSNfeOHnY2bPHpFfKPnvevbZZ2dJqjTr2WfvijidNTk1Flpw/lmgosovPvvsi/ltbXWoeBFfnt3uUtprahQX7N6pwE4D7ACtQiisqET9bItTaE6RWkIvPtvYIBdiyWcfmQuW2Qg7LtWLx5GYKzL6jtljfj5y5Mje+r946ZqXNpAhbzkTWj+lsJb9YsfSp/uWrSDLtm276KKLtuX7Jr0Mgw7C2IKPPPvi5EhsVI7ojCItHGBInUBovfjii/j/xZDi/VmNs0WnBepGZQJUUybUMFqSqrcmxRaEXnwkNCyuzn0EcD8yX6W0GvM5reJFiy5dctHSZcuWbe1ZloFNbKW4fnomtEjqsGnrzqVrX9r06Cb2L7U89thjmzdvfm7XLghcax/MC94FY64k6+sdsHdXnSbDBCaEeSmCVDA4b4fT7rYJbS5UvPjy5NaOzhcfAUY1cSwyC2nNgp3t4LWK0v6zXxaSgi2S/l6iL1jZ2dhRp0HeCm29+EgrTqxtd93VEClUvVgW4tYrr0Dc2vXcrza/9NJjPQ3hpefWLN755CYyaZ0JLWJaT+xcvGtj33PiypVkTnxo3bp1q7cFK199+eWQhtFXaoEhvLy9ulYWYz3QehnGIanx1pcfCUGS+rMJ3rtA80iDS5Yj2zuVnByvXA0VOySvV5oFZ151Q5LrrfllTWELQuW04NEgMiXUMTsox5UWuEUvP/JIa10E8q25rsK2tgnyyy++/HJEfvDBB1evu/+h++6DObGX7PHRtc//YhfZO1NaG7f++vt9wkJar1Fa969bvbVl0vaXX94doQNyzgJyL78aqmzR8vNr9EhTDcqXZbnurlCdBrBgbnS13vVqyDsBUv/ds6R8WYp0QontkZaWFlK2QwNYNTXtSgseMVrOmD8aOT8SlHNkZ8se0HfWhV5/fXsDruADrEIZyyKttYzWhl4ziEfX/Pp7G3ujdd55vdN6qXXnc/3JtwxaW1siu199dU+Efd5F0kKvomwPVdYGYVCEVWzBXtRVR+oi5JlwAk6OXleHq73mZ954teYFWp7K7a++GkJak6Do69XewvZ2/ORDC9B/ldByAix/NBp15+fnyJP2vIrFlWFwuos8ErjATkGn01oFtFb0nm89t7P1pV5tqw9av3n++d/QllbuWr/yjTdB3li/HrdvPE50lNZyTmv1shbo9+uhiCeHB2GER3lNiWj4ubhYS2Xnq6/u3v3666E6D9Ai64Eocns7GI/sAfeLS155yut7wIFrvLHQW69Xy4rijNRVzm6JYFuMltM5alRO/vg8WSMtNnvg+QhPe1X34j137emYhQdIax8mp/fdt35577R+84sdv/lqaG18e/PG377y5pvv/G7z5t8Crd/u2rwLdBTW8pX3Aq37Hnp3Zu2kPW/tnVHr2nYpxxWLdFJcr4d+HohqMW1KaD+aQaR6+1vbQ9V1syMesiLo9XrhVdPAmlokyZkja6FJJFWTag+AHyrOyrv2d20PHSC0nJxW/viDLi1Svf/1zmq0UxXN6VWPHHodt12EloZhq3+02GjPNG7ptHa9+bt3gNCuXZt/u3nz24+98fgru954W6CFtnXP1rrIlM694HNzn9n34DaGyxkDgCD7qyPBoObRgiE46GyRFLmuE9X7O0Ohjo5qKjM6Og6EQhGn5KxxOiP00dLpDGpKobRg/1u6IC3ycbGiPJcnPPJAZ6h5kiZhjuHF09WzjKJvRdxoWiRsvbZ8+aDSeucdQmvzb3cJtMgaxPp1z8yMjJyxZ0ZlJLJky+rVq9du4x+wjEU69r/V1Rz0uPJAtMjet7oq8f1j5+zdxqC6+L+33poRI0HcGY3RpMMpwbEEyPd3scK1zkLOKlg6qbm5MqI5aeDHYm/t7Xxrb+jAblo64lq7mjlir1Ni77TqT4sW9cRd77yZktbK5aueaYjcMbK5eVJk7pJnVmMiAbjyOa7wlD2hoDZ+3LhxBw+6opX7d2sk3DsjMzoFi2Gy38P8zO+j1ek0urfrQOWsA6T4/iCyykdWgUBppNajjXI69TDZtXdWx1uVLS7wT8C/R5u7Gk2LOuJp0Ko321b9mdjWG5TW278y0frpltZIOHzHpEmR+cveXXc/CPJa+wD/QOooLQIJff7BYuSVr3VUxvJzCAItUtkR2t3ZuXc/CprY/v17Yhyy/olDhLe7syUW8yCB/TNio+R8F7ACaWlx5blHcah4B2adL0f2y+5xLu3A/t3VEe0BFrX6DFv6aOvttmXQqjes7TKDqoXWO4TWK6/8itrWZhOte5bNr6urmz9z2TP7HoKZEYQAW/3MePKGmJO9j5gzflxx8bjxWm3QPe5gUY4TeTm1lsiC2XWVlZWzZjWDzJoym5kUf6+WHvkqQwBE0vbsPVAZlPPHj89zgeQNgwbzcnghNC4vZBRyteb+9gNyZEbE49q2j5vWyr4WbERa9QyLhRb7SNq111bAKy6sVjCN2RN/9bt3Nr+x67e/+9Ub6ze/vet3Zlrr7gHZt+8eDKWriBBi61avKc4ZJQhM9zg6LZqHRlaUXwPjk8iHt9GUuIioDGDalBhGq9mY50L1vLy5xSCLivPYe+D8c8KXbtv2QJ4WjBc/eDAWdENYILD644iGJyIDCsga5XVa9YxWfUpab74NEf6dd97e/Pgbj+165+0333xczyDorEiTCCKrOLH71z14ab5p3Dl5YF4e7eC4g8Br3PiinBrmQjwncNpZURaxoIZINWRVzGTRonHZ+MEdvdCovG1r4UHnmYNut+uZbXkHLwXDAlh4F9G0+k2rnppXRT3hdO1lxNQKrLSu7YnW4799Y/2b77zyq7c373p75a63d73yzuMk8nNa0BXIItbrwBi0h+5f/UDeRHHYE3GwecUYwVAOAjD9qxxmVBOZsMNYNCrn5Od73AcNVsV5HlOhnOJnYAIEWfP73/9+zYNr1jxIYaFl3bu8z5VT3ROJZREnu9ZgY7etHmm9+c76FW+8vWvl2++88g7Mhys2v/Lm42+8+dvHGK0VcN9WLn/t3nvXI7H1OrZVq+6//8liNw5nIn+ZmJ0HDlRMgeHr+KL8nByLUU3UYVEYE3Pc7nzivwdTsCItj5rouuhBOh1zgYP7qRsSP+zrDRmBFo9HAq36/tPaBaa0axfOjW9uxu2KzbuA1hsrOS3oCwJb+RrIvfhDsSGvh9ZelD3RLMiLAitm2MbnFeH3TCaKRsXE486GRI2iLTbZ1VhzwRGQurD5mAkcEMNCP+wzavVJq77ftPoUxIXv/RCfRG4r7wVu619DA1u3dcTEnngZMq744HhMX12ubC54OGwEgbPIjGoEt6ux+OUP0uKSB+83JmQqeEAC/PrXsGunRavCTqv+K6O1YgMaFzExQov+gLGBlcED5BIwr7EWXiNswJDKItPBEiKL5hfPF7TFedkexonJRM+Ip9et4hPMQw/xf6uoF977Wj/80Eyrvn5Aaa3YsGG5Lhs2rGCGRmfL9RC9PProuIuBgdmAzQfhkKhcN58LQ0VdcKwoedv2gee/tt40J6+6jzrh+tdWruyPafVNq/6ro8U8csVyYZcShGi2fv2+bSOGm0YItjbWQy1skQlWSgFsl15aXDyMmpWJ1fDs6558aONrK0nUNE/LgOre12iM6EffB59WD1YHY1n17kXDzLyIALBhzAUX2Rhdp1vYpRCrAJWZE2VV/PS6jSs3sEgAro/I1hNTwxmHhIcV/YH1NaHFkK186Mkl+EsQxo69wAIMiIGNFS/61pKUAqaHpIbbWF9wwfDcEVv3rV+5gV6Buj8NnTR+ErPa0M8ufo1o4Wg2rnvyutH4TXX8xQ0WZsNhChw2YgRAm79oETU19FDQDBuWnZuC1PALxgKrZfvuW2miscEUQFf0l9TXjhbl9RTYFxOkNpaCI9uxqMwlucPo0TSHyNXLUr7kh/wCFpDsEVvfXQU++FV172tGi9nXkmE6BKsAwOH9lNHzt6JdfWWsvoa0CK+HtmydP7q/UFJL7rAlT61e/5WyOh1ac+YMEi0S7+9b/dSSEdlnjmr+1i33b/xqUZ0erXmDRovw2nj/u08vGXEGFgaolj25+qt1wT5oUUsSac0jtOYMDi0d2FMXFQ87HRMbPeK6rRTVV88qJS0CZF4PtOYNGi0G7KF9T25dUjwsO7dPUNnDRly39Kl3160fIFS90Zr3NaBFgG1Yuf6hfVueXrYEEtDUzHKzRyOorU++u+6+jQOHKjWteV8nWhQY2Nh99+9798mnty6FZ2iakA7DTHUEPPpctGzrU1v2rbtv/cCS+jtp1Q4SLU4MkG1cf99D61bve/fdd/EjjrDZRz7tQTkNMKl+0iqg615nlZbAjIKjoh8PUgd6p1VRUZDleO/9q4dkVVR8DWiddeGjra2tJ190MWgBqCHvv/+HDxwfoLz3/pw5+HlwOMmK1aY5LcZhHlrUnDkAigil9cEHf/zjH8DK5mQVVNyRoVVPeBFQaFF//CODJNAirx/84f33h6BnprMn0hg15P33AJTBhtD68IOdO3catIj84Q+ALH1pDRny/h+Y6xm0gNGHHzo+pPLHP+40aBFJX1oCBACyc+cf//jhhx8QSgYt8pqhZaFlsPmQ2NYHZIdo/oQvGVo4em5EjNYHjJYe5enJP/37h+T/hx+mLy0cPWL4k05Lj/I7d4pRngDFYn9KY1r//qc/IQJ0Mz3KE0w7HTvfew+3116Lr0bcOlu2tdwkZ4fWn4S4BVDeAzbvASYA5XiPyrXX4uscPPke4TfocWt5z4JnB5EWPtxwLAYbFE5rzhz9JJNBo7W8vzJYtAQIlNacrwutfqMaBF490Zpj0HqfbufNM2i9jzIYtOw47oV/996L/+lmUIkZtCgBAgR2gA0cocrxPpV581Axh2lRBprW8lSs7rXIoJoYH63BAIFQNlQcV1999fvwQzXzYI/K+1cPLK1UrHqQQcOl0zIEgCAtBuVqpDUU/lONrgYZWFpfR+GjvfrqIe+/f/UQHQiwGUopOcifHLl66Lx5uJ0n/BmStKbF/ogPBTJPx+Jg2wwtY7RD+Z/0SUErC08WgKagYOg8/PXpQ+mvPEtjWsYfZOG0CnBbMBR/32kW+WWo5FeiCr9PL0MLwFAqOhb222ErDFrs91mmNS3dZAxapu8nzpsHLwXzevw2ZzoIHy0xGUQARkTZ8N8taKJVkaFFaekQ5hlsRFoffURP8u991qcxLcFkCBBkQ7+vyD8H8dFH5HXwPzXyNRKRVn3FHfj6kcFG/NRIhpble9X1d+hAzLRqqaa2tv6j2tLyzDv75eQbZLUoH+lsykvry8sdtVQ++oieBFrltGD60iql5lJbikAom1IqQCtXp5X7US7QKiWwStOYFvhXqZkWw+XIrcUf0MAGaYHUkpPpSysMxlWOmHIFWrXh0jDQIoK0cpFWmMNKZ1rh0vJywECA5FJaYfyzTmFGK5fRAljgseG0p4UeRp2NsQnnGrTCAi2wrAwtQitXoEVgcVphgxaXdKeVa6aVm5JWeYZWGHHVnhatcHrTqrXSCqeM8oxWOL1pAS4I5ozW7bfnsjCfilZ5hlY4LNgWoZVrokU0H3E3DKc9LWJaom3BsU6L8mMPROEMrZ5oeQxangwtnVY4bPXE3LCZVu7tGVoGLcR1uzVueQgvK63g8Awt4CPQGk5pEVxi3EJY4dwMLQhdtwtxKzwco3wqWuH0phUMMl636343HAyI0PIItMhqDZbzpC+tYBh/iDBa+IoETbRqb+ewwp50poViokVsC3QCrRZGi04HaU+LmI0et8JE6fCItD7ifpihBbgE2/IEGS0ihF9L7e0sgcjQAk+sZbQ8wGa4SCvXRAtxZeIWAXE7BipgEzTR8hBauRlaZlq5KWkxT2zhtDCWpTmtIAngjJbHTsvjobRwaSdDi0d5D9IKmml5MrTstEr7ooVvj5EZMUOLPfmQmG6nRWZGtnjvydAKkse/VLYVpLQgg6hlS6kZWvCoGExNS7CtXB1X2tMKoxH1SitXp8VXbP7jbI9h8OQ/TLTQtIBWbn9o5ebin319qXXn2r7/xt05IhvX0r/adg9n4+mPbdGF+tyZq6CBNTsXPzFYv/7qLMuGJxbvXAOmsWp+0MDVGy2SunJaucvWg3Ft3bn0ubTAteG5pTu3gmmtbw1aaAV7oaXbVm7LM8v1Ns59YXax/OncoMUTg6mzU0ZLl8i7zD43ne2hDLxsYjFny+ighVauSCvYU5QHmXsPxr7nnz/3Iz0f5T3DgqLYaQV7oFVcTCP9pjSI9NyDVtUFg3PnmuOWTitspuUx0XpgcXFtS3pEej3CN4WDcxc/YKEVFmiFU9NqyV26s3VYbiQtIj2P8M/Ulrpady7tgVawF1otS3c8vySSFpGex5p3I6W1S57f0RutYLgnWku3Pn9pS27dOR/pjQgfzi1+futSCy1TBtELredaF6dBpNcj/HxPsHhx63NIS9P6S8uj09r0xI7WYS3neKTXI/xSjyevdccTm5YuBVSnSSsXaD26ac3zS1wt53ak13N4jyf7W8+v2fQo0tIoLsASNOdbGo3yfzZoeXRaj7209flFLS16pD8HQxdfN9jSonkWPb/1pUcpLc1E688CraCVlken9egTOx9oAaeEZjd9+9dLz8F5cdPSX38bh7UEAD2w8wkYMtDSNB64iCf+2aAVTEkL/qEnppVtaTAhvqTTorj+nJrW7Vbb8qRd3NI8PG4xWprHRovErWD4dtSHDVoeD50T89JmTvzPoOa6js6JnFawB1pBEy0iNN9qaUmffEvT5pJ8y+yJQRMtDadLz58pLfI5N04Lc/mWc3/VxsjlteAizOV7p4WnkFaQ0NJtawcJWhjhd6XHcyJEehc+J2qazis1Le3P1EPJJ04ZrZ0YtDDCb17663MzwnMxIn0w77qdJlrBXmnxJVaP5wEMWizCt56bEZ6LHumXBXF9y2xbkF2lpIUojSXpcSzCP3oOR3gdlx7pg8Fxcy35VkpamjvIbQtpud0eHuF/ce5GeC5CpNcEWL3Q0iy03C4S4Vt3PnkOR3gu+opgi5lW0EwrqtMKCp7oBlouGuF3bn38bA9lMERfbfaYaeWaaUVT0QoCLRLhnzrXIzwXMafXaYX/7OmJlibQ0jzu+eRzEL/Yca5HeB2X/jmI06UFCg/7jM2aR8/2MAZL9M/YGI4YxrjF8y1Q9mRbGvu02y/S8PNbIq2wHuXdoO2RlpvSSsfPBuqwgFau7olud4+0AFc60wrqtFpaOC1Ny9Dqm1ZuriluEVwff2zOIDK0eC7f0pKh1T9aHkbLQz2R0IpSWiZPDKY1LY0//7HnRA8NW5qVlseToWWh5cb1GZqxElrRDC0LLcILzcoNgrTcRGWm9XHQk/FEG62PP3aDEVloBUVa6R3ldVofM1ogWtBOKxPlRVpu5IRsYMOeqqMa/PuYgBJoBdOelsdMSzNoRTO0zLSCOi2N0tIMTzRoaRlaBi23ToupjLiVoWWlhU7olmVCS0aNO0MrJS26RGPQkpGWx0bLwJWhhU7IaWkiLSHKaxlahBaalvyxzGkRjSNmsa0MLYOWzGkRR4SMndDSMrTstDQwLYMWSdhlpKVlaFlo0Wc/BAUvMtCippWCVibKU9OSBVpMk6GVghZxMMQEtGSDlkxokWTMQsvjSXNaFJbG50SNmJbM3vOx0PKkPS0KS6SFmZcjKjNaWoYWj1vUtEiAknmUcmOGyj+RpNPiHztN499jgzw4LdyltGRNpEU8UdPoB93cGVoyAcXZ4HO1iZZGaKGkPS1ZpnHLoOWWZeGdfRLJtI81XdL6UyNWWhp1RNmhGe8nMjelHpvO6/IclkGLOKJMaMXYO2TR6MeAjhXM0CJpPHuGdjNaZMUGcwqy3hyLxmgxOY1pyYYwWhoJW4xWDLN73H4ci8V4wQwtpMU9kdGSrbQ4sAwtWY7SuQ9XUInHUVoxfHKE7aFYTOeVoQVouG2x8ORAHeCx0IrJsQytmE6LawxaUROtWIYWrmWRiGWipVFasQwtEy2ylMXXTkVagOsQgMrQMtlW1FixEWjJnFYsQ0ugRR8IZbNt4fQXy9DqLy2KK0MrFS05NS1ZpxXN0DIequVDNloxEy0dV4aWnIqW10toEX9kpOLxeDrT8vZIyxvzMtvK0BJp0SXBQyTfOkRZeb2OONqWzD0xznF5vWlMSzZoyRZacaTltdKKx9ObFlttJpwOUVoxQgtweeUMLRMtXP4zaH1MLctCK05pQdBKe1pstfmQV7ctTisuU1pxoBXP0BJWA70GLa9Oi9iWTGkRUvEMLUaLxS3CShY8USaemKEFtLgfElpenZbJtmRKK56hxVl5ZUbL642baB1GfYZWClroid64QQu3hyGexbwZWpyWl8b1Q7hz6FA8brItyE7jEMUOZ2hZaGFsP0ywoH0RWoDr0GFiYewo3Wl5eYJ1iFDhRsRoxZEWpF2HvXGGMc1pMdPyHhZpeTmt+GEAFcOTGU+ktLw2Wl4zLW+GluCJOq04i1sWWvEMLcETkZlAy2ujFScnM7QYLZk5G6Vl9sQ4o+XN0EpFy+KJ+IhIaHkztJgnerUe45ZuWxlaPN/Swj3GrSi+xjO0VqygyzMywCo9FNDjlplWSdREK43f82G0AFbpoVKN2pY3JtCKHT5UCrgOE4ZEUZbutBAW0CoNkOyUpKsapRUrOwT6kqhOK1ZWOli0lvdbBpUWgYW0SgOH0eVk5EdoxQKlSKs0fJg9JAKsQaPVD2qD1APj3VcOi9AqPUwmPzkYLnVQWJRWKYZ6b7sXYQ06rZTIBvXiwpzIYFFahw5zfg5qSIzWoXAUaMmoODu0zqro3+aUOSxG61CQ8XMkCCxOqzQcbfcGS9ObVmmQw+K0SoOUnwPdUKAFuCisDK1UtAKlZlql4bJ0p1XWsydGwxZaZbF090R88inrIcpTXDqtQCxOA1c609Jx0byKPj7LkEEkKC5OK4BvVXsDaU+LJQYYyDVCqx1UYUeC4mK0AiS1b48H0psWwIkTXJAkaF5KC0QGWgQXy07jCUKrPR5NZ1qMTRkmoJqX0GongrQQF6EVONKeILgAWiDtabVDJnpYkwmtdoEW4Dp8CGdDnVZ7Io3XtzgtcEYyGx4+YqEVP3wYYMV1WoArQ6vdW3YEJ8MjZlpA58jhUpgNj8TpEey2py8tL7ctLUxs68iRdoMWsSWgFWW0mC+mPS3MRw+HZTMtwgbjVjgq0iIrzS+17nzubI9h8OQ5+tePVhiwSg+XwkOPTitOacVKDpMH6iNkPkRVtATrbdz66++f838NkMvG7/9660ZKC5NRLRyGND4cDsqcljdKPBGnysN87TROYYWx3oYndi7elSa4Nu5avJP+zTW+0hwOI61wkNECFUb5WBmoD8NZsnaKthUrKwmTdctNW3e2rn1p06PnvGx6aW3rzq3kD0Wu5MvyjFb48BEW80uAVixQUlJy+HAJ6kv8cYIPND8lxvXcsl/sWPr0U+e8PL1sxy+W0b99uEpjb/jotA7H8OkmjLQILKSFryUl0TiFVbJlBcX1VOvzaSGtT7E/FLklrGlhJoxW0AuwyspKHHECy6BVEqWwSmZRd96w6YktT57tOz/w8uSWJzaxPxTZUFpWZqFVBlBQHNGSMjOtMoqvpPQeFv42bDzbQWUwZCP/o5r31JbJWpmFVsyrEVqxQBnwKgONxbZK6v71bE9TZ0P+ta5MJukDAis7XEbjVgLSB6QFcQupAS18LSnT41ZJScM9f//F/6/JPQ0Aq71dDhJcZZTKEbrygLQoLkYLYSUSfm5dk/f9dHDfAD2rsvyn+56pCyIs8s40RC9CC/IttlBTRvKtgE6LJBAJ3bpK6xr+k8sNXJb1rFlmVwm63+uil+KKZVaFrrGrlm3TRa+2bdt/brP2wNbU7219+k+zprWuNkBhUVzghGVlAZnRgiSCrEEALkqLqhlAwisap/yALB5CmUCMF4qWUSFr+Rw/U8V5IarDqtE4fzj1shla83KR8Y0TyI9lXUPKlJIyUKGdLmYSkdt18dLr0ZbJiKgGagZJU7RegJVKiMMD0Uei9zwQa2e0EBdG+bJYO6eFz4m0NqHlP6pXjvERxg1cRGPAMq6AT08mldAxqiPchVGSSUcT2JC+lQkKUJEyXqMWHXZMULST68HV2s1Xw6c7HVZ7O4Fj6hNqhJEgi6gOq93o0uEyOd6OTz6EFlsNTMSQlj9x1NReSZmffRbOsC7xfoAmYDIjjsvUMV0nDNKLE7IJDbF8zWtVmWDh2m/ABIvgMl0N0eCzncCK4oqaugTDM8OCilG9cfrVTbz+Yc2bglbiyBGsfdTUXpk/zpfpdesyX1TxW8kkrN0nDg8WETcNEnBZYIEpWWB547LWbhFZtmriAS+7cIIcxr0yWm27GXPUjAaH57d0EgsZsJh149ppHDzRtNIMnI5geyKthJ+N2jCueFQPY1xssACXRQW0AlHLGL3RqEiKfHKR0iLf1WJfNYpp8T5pebmNAC368VC5LOi1FIrZ+mSjlTBotXvpN8MEWgkrrbiNlp9fgqxLcFqm6yo2WvFYwNozcFj0Q3rFBI/OVrcLoG8aX/ij3hI14wKNBRe0Ta+HZkVhBW20vNhQ755IW6KN8y+GwRP0kSjs2GiBxi9ZPTEg4CLrXuDZZlyK39oNuIQlkiEsNmy8KLkumd3MuAJscsWeJ0hZ6IAFF9FYozyU8SaIXXFY2LQFlhUXbclk/1HeeJzdM5wJjuA8Z6UVD0DcAlxHLe2ZcZFUgM6SeANA68dC9igfiFth0WGzu8indBnH5NWjPp2TaIl2Uz0RlgkXLxPjXy3xyqQhAGiBZcbFWxJgERXer3Zm3DEcyRGcnmgGgS3R93wCSAtwGbR8rD3F8DCSHNCkgt1Kv60bpPuWdCvAe9vO7CYWoLQCMieBnkmMi6DAQtgnKn5WiA9RwMWvRoySfRIZDsjVdFxeowMWWAYuiFm6SoSFtAL+o0dpGbLSTAaEtAJGvsVhRfkvUA8anwCjfxkIf3k/WTDDpEgXzJqwjKEK6+IRVKW1tVA3N+gmf5kQqpWG2fqbvV7QphGvRrsVpn+fwp2LKW4uvZq7p4Z6agkOnRLDFaPUj+AtPHKU+WqZg919QitwRFEFWH5Nyx19RxrJaI/crvqjLGYRIAiN0qJP1dRVGC2/IlpW7tnu/uBL7oQ2sC50wwClRdjEWCbuYHGF0QogrjSGBbg+kQLRaBmLYowWmBvCKnOw8MZpQahnsALOs93xsyMTPgnoIZ/TAnMjM5MjINI6CjOH5GcqD629YPbP00JmL6Dj9XwS9cUstGBeJk/mDsbm6FFKC6ZZjosG+Nl3zkoTufPnZMCjP4FMI8bMi1A5chQXOZCgQ/GLtACWqjJc1LIWLz7/bN/1wZHz71w8mwz5EyFNpFSOsqeUgEPFpxedFsIiuODRjppW6+yzHUgGS2Y3VBq0GC6kEjt6lCe1DpXiAlrRaPRoIqlSXHBAqp7ferYHMXgy606dVlIFXFFCK6ZwWvEY0FKVGHA6Go3Ck4+aTKoITPEzWnemE61ZjFYSBXFFj+LC2NGjSYYLaakJHzwL+f2SehSPCDDF7x9EWgvMhyP7OD9QtJhtJamocb//aAzQAS2kB0JoAS6gJak6LWJwg0drZLPpcMyeT18wF3ihecyg0wIqEjw4q5wW8qK0VPBNgEVpMVEorYaB6tuCF7hU7ulsFqxnQUdXZ/OYF14QADV3hgYBl0CLMfAfTQq0kpyWepSAEmmpg0aruasrJND6dO+e5pELmncLgD7t6uQHL5zONc6UFvEwDEdHMYbZaEEkU2BzTICVGGBahozs6jJccWTz3t0zEOH2rg5dOaNrN8uKKnc3D1gQ47RUFo8kiFvxhEFrAo9bEsQtxUQr4RtoWmN4MF8g0urY27V7z54DHTNCXXt1O+ro2s3scEbXngGjtZjblkryAoDlh2ieMGyLzYkSzok+RaAF0+RA03phT/MLKWh1de7p2t5ROXLkgd3NnOcBYERlR2jHgHVIoEWSKEIL198ZrbjfQWGRDMKnHBNgDTytru2fjkEBT+ygBoM4Opo7KL0xU6ZwNKGuPXRnwYHmM7vY6dCisHyMFmShxyisWNRBYRFafh9CBCtMIqxBoNW1g7rXdu5eY/BoSmdX56cjm18YOfLTrj1jCKPdXZ2k4EgwsoEL8yItCovQ8lNakH1FHUkCi9LyH1Vo7CdFB4EWc68DncxiFqCpHeja23FgTEfohTGVnZ8Sigtm7J1Bae3u6hp4WgkdFqOFMyPAAlokmOm0fIoOi9FaPJC02N4Y0b1e6NzbEeoc+fPOAzsW7GARfQGZCBdgVNs7YP3RaUkJDovTiidIFIs6JL9IC2IXhzWItEQZs6fzU2AypRJyrAPNL4gTIEwKoBx4Wn4fh8Vp+eNIKxp1+M20ABcvelZojTmwp3nG9s4DB/aAR3btnQG0RjKp3HNgDCReg0BLstMiYSsFrYR0VmjRZGFk84zmjs4DHaHtnWOmdHTuxiCl02puBoJ7Bp6WpFo9UVKTE+JIy+qJiSSLZINM6wCJTCMrRzZ3NH+6Z/ueGZ8eWDBliqnCmJ8v2NMVGnhakMdbojzk8fjOOMyJ5iiPz0XMugaaFqRZxtLMlL04/RG/m9KxB1nt3WtJ2nccCEGi33GaVzkDWpgWmDKI44QWfu40mRQzCLoQRq1roGktgDTr02YqMyCjosnCyB2fdpDjvdZHnD3bO7vErH9AaSX17NQnHWe0EnGglcSgRrPT48ZCmG/Aad1xYHtX1/a9IJ17u7o6Z1CEI6e8sOPT0N7dB5qta4KdM5rBQ8cMEi1IDUAgNElJoDWBfSIpSXD5jh71+aQEpwXO6PMNOK0xzR0dB6h0zJjCnn1+PmXGgT0HPt1hpwI5V+WnI0/zGmdOi+A6CrCstJJxpAVP2zotJDjgtMhzIROd4AtTmpvFhUChMJYfyN40mGkhrqMAC2hNYB9qdLDHa5glIWYJtJISqTprQGml4je41+uNVlKRCJDjxzHEC7SSx0iAF2klSdWBta2vl9hoJXVa9OOjnFbCTiuRfrTOt9BSfMcSzLboW2QOFtSPklRLoJWgnnh+Q/q8V83elv/EgOU7hivNQAtRJRktVfIdO+bziVE+waL8gsWzzk8TmXXnAhMtgOU7Fosl2imtJKMFsAgtnzmD4J+xSRuhpjX6EwMW0PLHEjotlp0yWr5jyWQ3h+XTqIEumJ0mwmZj9ycGLKTljx0/jrAmJOJ+ByXDaSWS3d0Mlk8524Hk7MgE8jkICssHVGKxY8epZcViDkqG0/IhLqaS3Ge742dD3J+okHkyWEjLFztGZsY4cHNIPhMtKMlggXG50+rz3yij3W1tYCeKZKYFVIjG4TPTglDPS/qUuOxJK16jPd4JbZJP0gkwTzzmi5NnbD+h5fcbtKSkYhRWYvidC00m37wQxaZIpbLX02Srin7PwyT4Nyls1Wxta/a2U1zN3pCtA4JKiykqWpYqCbTQkqQE2lDM50hYPJE8HvkEkRSYJxWfWaWaFeZLcJXabdFJOIcoZg2fgXVNwqZSjKjLJZ4wF0l5NdXWttptGZ6kCBOgoVLFuOUjcYs0ZJkTJZJBxM3t4TRpac/GL0HTNnPXus0DQFiIS7BdfcHDDMs0Sok94ZphWa6X4mqqrSEVRyd2gMDCisZoqEqYE+HlOP2sINBiU6CRbxkphA6r22QSVGXmh33ttnffpKOwBFySJKwPmWEZXaB33wyZ1RPbtl+N2BGMWx8LgdUtNsUHZ1YlhfEiFYnSwoaAFsFFaR2nF0imbM8YkHgBiai6xc5KRveJTiIqDovUJEWURJJ1jQ+cw2JdwB/7gHxGISXF1Uz4usnwqCRNHcBgrrfNVJJkHe8xskZ6nN9AB22P0AI97b+OK1V7iaRFIRk9UyWbCnU4yxiw6MAlFjKoMVNcEsNHu5Aw9d7Axc2PdpOMW7wavTWGhuESGuJd71XFnhPJGil/IEw4WHvHjn32+RdfHP8C5MQJfP38s3ZfH5fguISeqVSliJ1VbT0jNRXGysDFYQmjNFdDXCRoYg1ClXZBFerRG8bM39CZG8KmrCrSJ9z58gQKQfDZsc9gq9NKOljHjh07dhLkuCH/dVuP7ZlxiWQoLhOslJ3tVlg44rS6AVei21IqIfVrjCq3Uf1qquVqCdv1sQMWTVIhg/vLX3UEAOUY2bHQ6v7icwR6kkJF+zpx/L+UZDJle5a+mlWAy9ZZxVpIpKW3hXHZ2pa1A5KVH8BRuk20gHHCejU1FS2rho3ur8c5hC+++OwY3XJTdZjaO9ndrV/6+LEU9K39UCXbRRWbKrUjJMy4UoG31bMadwrbwlim9NlQipa6WQdOHucQoKVjiaTRuE6LtXeSXxH2IYPtob3eh6ikcERrb3uKu8ne69HA2W2rpoq07KEgRQd6bEmkBfPHMUnExWjx9k7qNygJkSzlJVTbFcxDtHWWB36hGJvTE9aWTG2pkrUen+Tt1Ywwn5Rs04y9od5a6j7JHUyfE3VcqsPU3km9Ms6Sfc2A/ZoTVZ5nGE3xBMjorZGMWOY2Xi9pDDFltQSjZVxNTd2QCEvEZWRDSEt/eABahqOrioO39znIFydPESEDIrSkCV9+SZv78st2PG7/29/4MblC+2eftRNcpJyqwPl20g1ejx5Dub9NSNJ6EyReD3uL5aBn9Fi4Hq/3N70eP24ng4RyCMtcD67Pjtv/xvutt9NOcPF+m/qZ5P0GPaP1xWcoJz/7DLBwWJidUvgnBSHtUVq3/fWvf8Hm/vLXv97Gjm9DOHD8F36M1oXH2N5trNxfaD31NqEe9lZsB20Cy+GohXL9qEevp0iWesL1WTvmetCQud+8n2K9kyfJw9ExIifJK7FcNFsHN96TJ8G4Tn5+4tSpkycTVIGv/33y5H9jNoRbfoy2ZDqG7pNyin5MtngFUznoraUe2SqSrZ5krpf6etZ2VOsxNGQupyRT1es29/tkAq0W0nWwKwIFQz3F5OBuTeCcJKH+pKEgzDFlvs1+b0UbIedt9zppute3YW/Nx6m3qmqrp/SnnnWrQEMWvfIXezmLjcK4Ewp3rZMMRILalEMy08JQL9LCOKBgXDHiCG7VCebjVNsJkJ73o96XtvrYM0s9xdr+hC8t7ejxStCrtn5LKfo9wdyOaficlkId0EYLJwWhOJ0nJKsodo29kJq0FlOMSUuv1m0rlLTX66saLlao9obUvjtAVhFFYbZlpsWG4lCMQtS2um20Eil6b2UDHmzvbLeloiLO8XzU3ZaKSrLbWk/tsxpdBuvralRlhWXpAMQtbMlES2VdcvBLUFqff45RHrOJz9kG5MSpE59b5NQpu+aUXWPR2TUpVCdSFTrRZzV8tD3Rd0Op2jY3fpI8LLPhU1oqT8kc/D4SWp9/eQppnRJpnSBX/cJ20VO9a5hK0H15yqbCI2z/hK3aqf5ojGqElRlXz9WsHTCrTh4jLbHhEzJ6BuvgZk9oqd1tbW1wVtUdlyfqgpUrpFSbYNJKso2IYNIKLSOYOWjgiFTkDx4qLSG4B6vWJlwQrkZ/jGrdRJHqESCpmBpCERqiYnRAVwlOrJ4ky+1JPRApOq1uzOVpe4QlIX/yZBv2jBYnPTM9r3A0Bi5d09Zt6azwUKHSjrYJzydqm06LFeLVhFGq+rBZNbxZ1kcffT2XawxYekNExdSqIsJi6w1MdewYWb43AhGhRS/pAJBtScmcy5P2aHHdeg2zP2Wz6FM21alTVp1dY1Kd6E8hUXNCVHFH1J3xBD+fuiGzClezTnzBG2KmZHq26W4TaCFrIa6cwnPqyf9Lwp9T/o4GjuuV8dmlG2l/iVH7BPJgXkBpobWqgvHiqVOW20FviUXxpb3QlwZ2/f5aC+Hi5IkvLKXsl7OrPj9h03xOWjNZ14m+Gzr15ZesJ3yd9Au9EUKLxgeVhlqdFg18YF0iLHJOQZVQto3V5sGSBiqVF+A1VSHSdNOIrYr1+LKk8BFXunikN6XXJgu6bW1GnKLrw8YhFlGS5oVmejVzSyqG1m7TyOm6vNEDfI+Jrn4zPWucXZ/WcrTxSyQtXcX2hEtgJ5M2WkmFszHCrN5X7u6qJaDSd7+UpElUFtHpTMBnPIKru40jYuvDBi7jzSOdF128NcNiM5Gh5e+HcFRsFlMMWmwyMhuR45t8BjfjYm/wiDekzbzS3MZmU9XgyyZn0lfhXtNpS7yPCTaTGZLQc23Djnhmr19P4XObeQY0rItPnCZcxkqzCRa5mrDYKelNMdNSFT4n85rfdHyzTe+GiMvoGbcSUWXqrOhA1vfMyDtfksBGT0ZMb+Mn9fTEAovjEtMTRZ+i9AyMG1absHir98lYabYmOinfq+boeeOqYZQOhwP2E9a8SeiZ7mVGRsJpJYX2TKlNitVoMSmiKp+kfw5CXDI2W2TK1JffMHGh2XBDPYUVLcucKBot2d93VyywjOElARa4Yq/tdbd1s4grqsxX4O0JVzAbOJWkCEscpfg4rFpg8V6J1SiupL0h4SGazhnWhohZmlqy1iOLAUmThg4v+U0HwWXtmLm9pK1rqn2IFlipHpg4LpMmYS9Enh5MCwVktjGvQXS3WWolkpZBU+uyNoRtK1aVdYEDYYkKOjwKy44rRXvWAVk7q1pgMVzWpR7VujyDuFIUsqyq2JeDFFuthH15JmVDtpZs60op1sVUnRXKP8hxA1c/2lNTaGxX6DYeaPHTHlRpW0ZUbItnkm3xjC9d9qpJ2GulaMh+NUXto3FFFVExYOMWLSoGGXfxxePGjTtI5H+oXHzx/1ilXxpBddDUYE8Vi6jwo/xfMiHa8SnF0NNC5B8vfxDGcfHFFxdBExeTYY2D0V188S/N8tkvrfLZZ//7v//7zW/aIf1/a5zP1iGb5XYAAAAASUVORK5CYII='
    var xxxx = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABsCAMAAAC4uKf/AAACIlBMVEUAAAAAAAACAgIAAAAAAAAAAAACAgILCAgAAAAAAAACAgIAAAAAAAAAAAAMCQYAAAAAAAAAAADlu5QAAAAAAADYr46nhXIkHRdzZk3JnnnGnXniuJLfs4jYrYjdso3WqoXQpX/guJXQqIfCmXrZsJLLooXSqo28ln/Pp5HGoIu1kX2be2i7mITFoYyXd2etineWd2PIoYzBnYWJbVq9m4C9moIpIhiwj3MAAABoUD99aFPNpYG+lnm9lHe8lnm/mHzVrZG0jXS8ln3HoYfQqZCwi3SvinTDnofBmoSphXKuiXaigG3KpI+cfGu3lIDIo42TdGK9m4eigG22lH2BaFSNcFtzW0yNcl+ggW1kTz5oU0FTQDHEoYlpUkBANCmOd1m8nngzJnTuuYHwxJbTp3o+LnXIm347LHTSpnnZrH/UqHvtwZPyxZfvw5Xsv5HbroHitonYq37csILWqXzCln5AMXXluYvgs4besYTAlX7Wqn3nuo3vwpTqvpA3KnXpvI/ovI7muozkt4nhtYhCMnZUQXjfsoXqvZBZRXhRPndKOXbqvpLNonvCnIrhtIakhIbSp4Kxi3yEZ3h8YXg3KXSOcoLVqX6OcHuHaXrlu5PftI2Vd4SHbIPns4GEaYC7kX2AZHtxWHteSXtsVHqYd3nFmX6KbHxHNnXKo4+ykYunh4ibfYariYO7lYGnhYB2XoCbenzDmnuZeHu0jnmffXhlT3dZuLhGAAAAYXRSTlMAAgUIChYSDgwkHQ8iJy4fGCv9Gxr+nSgN/f3+/v79/f35+Pbx8e/c17m0oJeUk4eBeG5sVk80LhkYEvvz8vDv7eTi4N/e3draw8G7raWSi4qEg3pnYl9TS0pHREE4LCsiE4hpjAAABoNJREFUaN7s1M9LImEYwPHddU2hmyAEpmCYaCRhJFKnoKAOUUSXDkE9Dm2HaQYPObCM85MRTRHZBdlMtzZjoV/Qv7iP7xbDOu28M1N7Wr90CB3fT8/zku9GjRo1atSo/633L/T2iil9+KN/4z1De9mNVCIe4phQPJHayO49g29LoXSwlQodM8wxc2wWSm0d/PbekprIrj4hDAHN35nV7ASFc0ctZeKMTfHMkoXzPFUm9Hxs5Lb7WKsbsmzUa4/d28jTy1wo8/rpyF3lEhzDMfhz06vAUJXeDb45eD+RI3f3OmsizZE690+SxbvvcKQ0Ge41K8wvc2WOK3faJfhrpXZn8Ay3nPe8ygHlWwiV2TLL3hlgm3HHsvhgaME34Dxa840yFu4DtX4YsXJjnmierG12UNMABxlN8vC2F43MxbM8y7ZkcJTcIhqZzb210ECs0QPH9RqINci9uVyiLx/heb5xDS66ruJHInmfq0WSb6gkj12Aqy54LLnk6trQ+piWeElqgctaPC/x6Y+oubmwHFJSU3aLyU3E+JyLa0MskEQrbIDrjHBVqiYDiDlf4my1qlT74KG+pEjSrLlIKuZbjCHWAk+1FEWJLfoQczqYqijnhjfMOFdVxRyNPlhYUdU2eKytKGrYHI022I6qquclr1gJR1N3HI2GgwVWRFHswnBHZ1+PwJL84+xw6KUufnwlQEajD7YvYqcw3GWh8OnQ8hd8LhR+Dr12KmL7ZDQqFtwUNbEJlr4XrBpa2PD/flMTtc2gE8w3vqZp2oUV+1IgmtW6tHxF4gFr4/Q94hbHYoImVKzY0YmpmdZLu61oghYbwz3St7grCEIUgKqZlqUoHrFL3SNigTl88gHsNJoFD3jEXAAx6pXNCILeBluNYsE3QddnyKXRrmxd1/UroGi2FlzhEet4aXRsWteLNaBothbU9GJx2gnmnyoWi3WgaCd2FtTxiCk/HQv6o/hkCSiarQUlPCLqD1KxgH8Sn5TBTqNZIOMRk/6AE+xXu/by0jgQxwEcbGbyblJaLO1FWVmEFVxBEGFfrKCgIoj4QEVhIbptLqWNodkevASLlVKqLepFUHT1pPj8//aXKArRzS/Nnhb6PYji/ObDzG9KprS2bW/6PrGOHOvowucqAlMEw7psu2b6rewXujLTrtW6AmHvajV7B7EQbadm2+8CYe+LxeIWYq3/9tW2YIr3gbBeGHmCWGs/fc/+CUzRGwDjyIdisXzub4Hhq50Xy+UPAY4+Qz4CdoVZ/toVYB8Jg2N0wbLKdcRCtLpVLi/QIJjQZVlWxddCtApM0CUAhj9iEr0w9tjPwrRjmKA3IUYCPDzVTqtgXQa7g2y8eQe5LFiFTpXtwDGOrBQgFfR29aJtenbRqV8hnIPhTRuBwQcB740br++NB1A+8tQytGnDM4Vcof5q3rU3b8TN43PTM66eK+Rmhh9bhu9j8lMulzv8ETKHUPwpCbuIY+4+dsL4uhnOMutQ3Am76GL4Gwt1tRsKrsNh17lstntVfXljgS8tC9kOY23nsp6FYUdETfYAtm6G2MR1KOxJqp7j4b+0uSxkd7NVq7nr1M15FoZ0jUgTTtVtq9itUzUhEU/HkKXFk9/y+Xy20ZrVyELNt2TcszD0taYsdYO2/9CK9bAPJd1Liuc1hmERkUiDeilf2m+0sC7H2h+UiBjxYOhGJvgBwPL5s2bAs3GWz0PBAJ/wbCKKuW3j+0sQY9cMYpm7zthSP+82DLBWtAhHBH5Acya42cat7RujZBjaAC8QLvLKwtvGgjZYNZycmciyzgxDN/TqIFisT8MQbfGroYNW3Vv7O7W2V9V1sL4uhrMAc7U4Hx03dCfVg523qZ0DoJyMR/m4awEWRuNoQpJnP+uPuWtUvFKlcadr7j8/z8pSgnI+FqoxlCh8tC+lPSV9v3e6dWE2m+bF1unefVp7SqovyiuEMoiFfPDDiCQuyUNTac0n6akhWYoTkQEKsdCthHMiD01/1zIZLaNp8OM57t/fp4dkOBnIFgbTOhiWqookx5b7RlMZT1KjfcsxWVJUyjIdmIVrbudEqgoSL8ei8/2TY196UtVMuufL2GT/fDQm85KgUtHpFmIF51hKhgWFl+VYLBZ1A7/IMq8Iw4SyCNU6x4mUqAlBUSSJh0iSoggJlVCRQ6gwnOOxIqXkOZSKLAMSQoXiwAOQAdINx7gQSJD/94sMPl/RaKeddtpp55/yBzfcbwejnezIAAAAAElFTkSuQmCC'
    //导入导出过滤参数：
    var unlist = ["qqawardlist","journal_popularity_red_pocket","red_pocket_done_id_list","popularity_red_pocket_done_id_list","materialobject_ts","medal_ts","Following_ts","Anchor_ts","medal_sign_time_hour","medal_sign_time_min",
        "do_lottery_ts","push_msg_oneday_time_s","qq_zdy","qq_dt","detail_by_lid_ts","push_tag","switch_sever","JSMARK","AUTO_dynamic_create_ts","get_medal_room","journal_medal","journal_pb","activity_lottery_gone",
        "haveMsg_uid_list","dtjk_name","dtjk_keyword","dtjk_flash","dtjk_uid","refresh_Select1_time","refresh_Select2_time","qq_zdy","qq_dt","COUNT_GOLDBOX","get_sessions_end_ts","medal_level_list","storm_done_id_list",
        "poison_chicken_soup","last_lottery_id","dynamic_id_str_done_list","medal_id_list","medal_roomid_list","medal_uid_list","updata","setu_bot_start","done_room_time_list","done_room_list","aid_number_list","done_id_list",
        "room_AnchorRecord_time","room_ruid","business_id","space_history_offset_t","msgfeed_at_id_list","articles_id_done_list","ALLFollowingList","COUNT","LCOUNT","LOVE_COUNT","CLEAR_TS","TTCOUNT","TTLOVE_COUNT","BPJY","BPDJ",
        "DJLVMK","FollowingList","guardroom","guard_level","guardroom_activite","goldjournal","freejournal","freejournal2","freejournal3","freejournal4","freejournal5","freejournal6","freejournal7","freejournal8","local_cards_dynamic_id_str_list",
        "strlast_lottery_id","lottery_id_done_list","lidcongratulations_rpid_ct","msgfeed_reply_id_list","showlive_discusss","key_rpid","key_ctime","key_rpid2","key_ctime2","key_rpid3","key_ctime3"]
    var MaterialObject = []
    var poison_chicken_soup = []
    var Xname
    var tags_name = []
    var tags_tagid = []
    var lowfans_uid = []
    var room_AnchorRecord_time_uid = []//取关uid临时存储
    var space_history_uid = []//取关uid临时存储
    var AnchorRecord_list = []//网络天选数据
    var awardlist_list = []//网络实物数据
    var at_list,reply_list
    var anchor_name,anchor_uid,anchor_room,award_name,end_time,anchor_uid1,anchor_room1,anchor_name1,award_name1,end_time1,anchor_uid2,anchor_room2,anchor_name2,award_name2,end_time2
    var guardsListdata = []//大航海数据
    var readConfig = [];
    var Anchor_room_list = [];
    var Anchor_award_id_list = [];
    var Anchor_award_nowdate = [];
    var ALLFollowingList = [];//全部关注
    var medal_sign = true//true则可执行
    var SmallHeart_runmark = true//true则可执行
    var getmsg_mark = true //true则可执行
    var groupmove_mark = true //true则可执行
    var activity_lottery_run_mark = true//true则可执行
    var dynamic_lottery_run_mark = true//true则可执行
    var push_msg_oneday_run_mark = true//true则可执行
    var qq_run_mark = false
    var CZ_delay = true
    var scrollTop_mark = false
    var read_list = []
    var port = 1369
    var niuwa_num = 0
    var NAME;
    var BAPI;
    var ZBJ;
    var CJ;
    var sendLiveDanmu_dm_type_send_list = []
    var medal_today_feed_list = []
    var Live_info = {
        coin: undefined,
        room_id: undefined,
        uid: undefined,
        csrf_token: undefined,
        rnd: undefined,
        ruid: undefined,
        uname: undefined,
        user_level: undefined,
        Blever: undefined,
        room_area_id: 371,
        area_parent_id: 9,
        vipType: undefined,
        vipStatus: undefined,
        face_url: undefined,
        vipTypetext: undefined,
        cost: undefined,
        regtime: undefined,
        identification: undefined,
        img_key:undefined,
        sub_key:undefined,
        jointime:undefined,
        coupon_balance:0,
        bcoin_balance:0,
    };
    let bili_get_info = async function(uid,url='flyx.fun:1369'){
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://${url}/sync/getinfo/${uid}`,
                dataType: "html",
                onload: function(response){
                    //console.log('bili_get_info',response)
                    let list = response.responseText
                    let num = list.indexOf('<body style="font-size: 36px;color:#FF34B3;">')
                    let num1 = list.indexOf('</body>')
                    list = list.substr(num,num1-num)
                    resolve(list);
                }
            });
        })
    }
    let bili_get_dynamic_check = async function(uid,url='flyx.fun:1369'){
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://${url}/sync/dynamic_check/${uid}`,
                onload: function(response){
                    const res = JSON.parse(response.responseText)
                    console.log('bili_get_dynamic_check',res)
                    resolve(res);
                }
            });
        })
    }
    let getMyJson = function(url){
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response){
                    const res = strToJson((response || {}).responseText)
                    resolve(res);
                }
            });
        })
    }
    let strToJson = function(params){
        const isJSON = (str => {
            if(typeof str === 'string'){
                try {
                    const obj = JSON.parse(str);
                    return typeof obj === 'object' ? obj : false
                } catch (_){
                    console.log(str);
                    return false;
                }
            }else{
                console.log(`${str}\nIt is not a string!`);
                return false;
            }
        })(params);
        return isJSON ? isJSON : {}
    }
    const tz_offset = () => new Date().getTimezoneOffset() + 480;
    const ts_ms = () => Date.now();
    const ts_s = () => Math.round(ts_ms() / 1000);
    const year = () => new Date(ts_ms()).getFullYear()
    const month = () => new Date(ts_ms()).getMonth() + 1;
    const day = () => new Date(ts_ms()).getDate();
    const hour = () => new Date(ts_ms()).getHours();
    const minute = () => new Date(ts_ms()).getMinutes();
    const second = () => new Date(ts_ms()).getSeconds();
    const ts_ten_m = () => new Date(ts_ms()).getHours() * 6 + Math.round(new Date(ts_ms()).getMinutes() / 10) //十分钟误差标记
    const delayCall = (callback, delay = 10e3) => {
        const p = $.Deferred();
        setTimeout(() => {
            const t = callback();
            if(t && t.then)
                t.then((arg1, arg2, arg3, arg4, arg5, arg6) => p.resolve(arg1, arg2, arg3, arg4, arg5, arg6));
            else
                p.resolve();
        }, delay);
        return p;
    };
    function shuffle(arr) {
        var length = arr.length,
            randomIndex,
            temp;
        while (length) {
            randomIndex = Math.floor(Math.random() * (length--));
            temp = arr[randomIndex];
            arr[randomIndex] = arr[length];
            arr[length] = temp
        }
        return arr;
    }
    function sleep(ms){
        return new Promise(resolve => setTimeout(() => resolve('sleep'), ms));
    }
    function timestampToTime(timestamp){
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate() )+ ' ';
        let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds());
        return M + D + h + m + s;
    }
    function timestampToTime1(timestamp){
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate() )+ ' ';
        let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    }
    function timestampToTime2(timestamp){
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate() )+ ' ';
        let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds());
        return h + m + s;
    }

    function sloarToLunar(sy, sm, sd){
        let lunarYearArr = [
                0x0b557, //1949
                0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
                0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
                0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
                0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
                0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
                0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
                0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
                0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
                0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
                0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
                0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
                0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
                0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
                0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
                0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
                0x0d520 //2100
            ],
            lunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
            lunarDay = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'],
            tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
            diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        function sloarToLunar(sy, sm, sd){
            sm -= 1;
            let daySpan = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;
            let ly,
                lm,
                ld;
            for(let j = 0; j < lunarYearArr.length; j++){
                daySpan -= lunarYearDays(lunarYearArr[j]);
                if(daySpan <= 0){
                    ly = 1949 + j;
                    daySpan += lunarYearDays(lunarYearArr[j]);
                    break
                }
            }
            for(let k = 0; k < lunarYearMonths(lunarYearArr[ly - 1949]).length; k++){
                daySpan -= lunarYearMonths(lunarYearArr[ly - 1949])[k];
                if(daySpan <= 0){
                    if(hasLeapMonth(lunarYearArr[ly - 1949]) && hasLeapMonth(lunarYearArr[ly - 1949]) <= k){
                        if(hasLeapMonth(lunarYearArr[ly - 1949]) < k){
                            lm = k;
                        }else if(hasLeapMonth(lunarYearArr[ly - 1949]) === k){
                            lm = '闰' + k;
                        }else{
                            lm = k + 1;
                        }
                    }else{
                        lm = k + 1;
                    }
                    daySpan += lunarYearMonths(lunarYearArr[ly - 1949])[k];
                    break
                }
            }
            ld = daySpan;
            if(hasLeapMonth(lunarYearArr[ly - 1949]) && (typeof(lm) === 'string' && lm.indexOf('闰') > -1)){
                lm = `闰${lunarMonth[/\d/.exec(lm) - 1]}`
            }else{
                lm = lunarMonth[lm - 1];
            }
            ly = getTianGan(ly) + getDiZhi(ly);
            if(ld < 11){
                ld = `${lunarDay[10]}${lunarDay[ld-1]}`
            }else if(ld > 10 && ld < 20){
                ld = `${lunarDay[9]}${lunarDay[ld-11]}`
            }else if(ld === 20){
                ld = `${lunarDay[1]}${lunarDay[9]}`
            }else if(ld > 20 && ld < 30){
                ld = `${lunarDay[11]}${lunarDay[ld-21]}`
            }else if(ld === 30){
                ld = `${lunarDay[2]}${lunarDay[9]}`
            }
            return {
                lunarYear: ly,
                lunarMonth: lm,
                lunarDay: ld,
            }
        }
        function hasLeapMonth(ly){
            if(ly & 0xf){
                return ly & 0xf
            }else{
                return false
            }
        }
        function leapMonthDays(ly){
            if(hasLeapMonth(ly)){
                return (ly & 0xf0000) ? 30 : 29
            }else{
                return 0
            }
        }
        function lunarYearDays(ly){
            let totalDays = 0;
            for(let i = 0x8000; i > 0x8; i >>= 1){
                let monthDays = (ly & i) ? 30 : 29;
                totalDays += monthDays;
            }
            if(hasLeapMonth(ly)){
                totalDays += leapMonthDays(ly);
            }

            return totalDays
        }
        function lunarYearMonths(ly){
            let monthArr = [];
            for(let i = 0x8000; i > 0x8; i >>= 1){
                monthArr.push((ly & i) ? 30 : 29);
            }
            if(hasLeapMonth(ly)){
                monthArr.splice(hasLeapMonth(ly), 0, leapMonthDays(ly));
            }
            return monthArr
        }
        function getTianGan(ly){
            let tianGanKey = (ly - 3) % 10;
            if(tianGanKey === 0)tianGanKey = 10;
            return tianGan[tianGanKey - 1]
        }
        function getDiZhi(ly){
            let diZhiKey = (ly - 3) % 12;
            if(diZhiKey === 0) diZhiKey = 12;
            return diZhi[diZhiKey - 1]
        }
        return sloarToLunar(sy, sm, sd)
    }
    let tzArr = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    let sdArr = ['夜半', '鸡鸣', '平旦', '日出', '食时', '隅中', '日平', '日昳', '晡时', '日入', '黄昏', '人定']
    let skArr = ['一', '二', '三', '四', '五', '六', '七', '八']
    const getShiChen = (h = new Date().getHours(), m = new Date().getMinutes(), s = new Date().getSeconds()) => {
        let shichenStr = tzArr[parseInt(h / 2)] + '时（' + sdArr[parseInt(h / 2)] + '）'
        if(h % 2 === 0){
            shichenStr += skArr[parseInt(m / 15)]
        }else if(h % 2 === 1){
            shichenStr += skArr[parseInt(m / 15) + 4]
        }
        return shichenStr + '刻'
    }
    /**
     * 替换字符串中所有的匹配项
     * @param oldSubStr 搜索的字符串
     * @param newSubStr 替换内容
     */
    String.prototype.replaceAll = function(oldSubStr, newSubStr){
        return this.replace(new RegExp(oldSubStr, 'gm'), newSubStr)
    }
    const newWindow = {
        init: () => {
            return newWindow.Toast.init();
        },
        Toast: {
            init: () => {
                try {
                    const list = [];
                    window.toast = (msg, type = 'info', timeout = 5e3, side = 'left') => {
                        switch (type){
                            case 'success':
                            case 'info':
                            case 'error':
                                break;
                            default:
                                type = 'info';
                        }
                        const a = $(`<div class="link-toast ${type} fixed" style="z-index:2001;text-align: left;"><span class="toast-text">${msg}</span></div>`)[0];
                        document.body.appendChild(a);
                        a.style.top = (document.body.scrollTop + list.length * 40 + 10) + 'px';
                        if(side == 'left')a.style.left = 10 + 'px';
                        if(side != 'left')a.style.left = (document.body.offsetWidth + document.body.scrollLeft - a.offsetWidth - 5) + 'px';
                        list.push(a);
                        setTimeout(() => {
                            a.className += ' out';
                            setTimeout(() => {
                                list.shift();
                                list.forEach((v) => {
                                    v.style.top = (parseInt(v.style.top, 10) - 40) + 'px';
                                });
                                $(a).remove();
                            }, 200);
                        }, timeout);
                    };
                    window.singleToast = (msg, type = 'info', timeout = 5e3, top, left) => {
                        switch (type) {
                            case 'success':
                            case 'info':
                            case 'caution':
                            case 'error':
                                break;
                            default:
                                type = 'info';
                        }
                        const a = $(`<div class="link-toast ${type} fixed" style="z-index:2001"><span class="toast-text">${msg}</span></div>`)[0];
                        document.body.appendChild(a);
                        a.style.top = top;
                        a.style.left = left;
                        setTimeout(() => {
                            a.className += ' out';
                            setTimeout(() => {
                                $(a).remove();
                            }, 200);
                        }, timeout);
                    };
                    return $.Deferred().resolve();
                } catch (err){
                    return $.Deferred().reject();
                }
            }
        }
    }
    newWindow.init();
    if(GM_getValue('popularity_red_pocket_send_record_count_num') == undefined)GM_setValue('popularity_red_pocket_send_record_count_num', [0,0,''])
    let hbr = $(`<img width="40" height="40" style="position: absolute; top: 580px; right: -50px;z-index:999;" src='https://s1.hdslb.com/bfs/live/2b3de8fa9eddebfab4d62b3a953a90da2a4ab81c.png@80w_80h_1e_1c.webp' title="日抛小号快速投喂日志" />`)
    $('.chat-history-panel').append(hbr);
    let clickFn_timer = null
    let hbcm = true
    hbr.click(function () {
        clearTimeout(clickFn_timer)
        clickFn_timer = setTimeout(function () {
            let record_count_num = GM_getValue('popularity_red_pocket_send_record_count_num')
            let con = '日抛小号快速投喂日志：<br>' + record_count_num[2] + '<br>送出礼物数：' + record_count_num[1] + '<br>送出电池总数：' + record_count_num[0]
            if(hbcm){
                window.toast(con,'info',10000,1)
                hbcm = false
                setTimeout(() => {
                    hbcm = true
                },5000)
            }
        },500)
    });
    hbr.dblclick(function () {
        clearTimeout(clickFn_timer)
        let r = confirm(`点击确认清空日抛日志！`);
        if (r == true){
            GM_setValue('popularity_red_pocket_send_record_count_num', [0,0,''])
            window.toast('成功清空日抛日志！','info',10000,1)
        }
    });

    $(function () { //DOM完毕，等待弹幕加载完成
        let loadInfo = (delay) => {
            if((typeof BilibiliLive) == "undefined"){
                BilibiliLive = undefined;
            }
            setTimeout(async function () {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://api.bilibili.com/x/web-interface/nav",
                    onload: async function(response){
                        let json = JSON.parse(response.response);
                        //console.log(json);
                        if(!json.data.isLogin){
                            loadInfo(5000);
                            window.toast('无账号登陆信息,请先登录或检查网络！','error',8000);
                        }else{
                            if(BilibiliLive == undefined) return loadInfo(5000);
                            if(BilibiliLive.ROOMID == undefined) return loadInfo(5000);
                            Live_info.room_id = BilibiliLive.ROOMID;
                            Live_info.uid = json.data.mid
                            Live_info.coin = json.data.money
                            Live_info.ruid = BilibiliLive.ANCHOR_UID
                            Live_info.Blever = json.data.level_info.current_level
                            Live_info.vipType = json.data.vipType
                            Live_info.vipStatus = json.data.vipStatus
                            Live_info.uname = json.data.uname
                            Live_info.face_url = json.data.face
                            Live_info.vipTypetext = json.data.vip_label.text
                            if(Live_info.vipTypetext=='')Live_info.vipTypetext = '普通会员'
                            let img_url = json.data.wbi_img.img_url
                            let sub_url = json.data.wbi_img.sub_url
                            let img_key = img_url.slice(img_url.lastIndexOf('/') + 1,img_url.lastIndexOf('.'))
                            let sub_key = sub_url.slice(sub_url.lastIndexOf('/') + 1,sub_url.lastIndexOf('.'))
                            Live_info.img_key = img_key
                            Live_info.sub_key = sub_key
                            Live_info.coupon_balance = json.data.wallet.coupon_balance//B币券
                            Live_info.bcoin_balance = json.data.wallet.bcoin_balance//B币
                            NAME = Live_info.uid;
                            //console.log('登陆信息获取成功！',Live_info,new Date().toLocaleString());
                            window.toast('登陆信息获取成功！','success');
                            console.clear()
                            init();
                        }
                    },
                    onerror : function(err){
                        loadInfo(5000);
                        window.toast('无账号登陆信息,请先登录或检查网络！','error',8000);
                        console.log('无登陆信息',new Date().toLocaleString());
                    }
                });
            }, delay);
        };
        loadInfo(5000);
    });
    function init(){ //API初始化
        const right_ctnr = $('.right-ctnr');
        const share = right_ctnr.find('.v-middle.icon-font.icon-share').parent();
        const like_button = $(
            `<div data-v-6d89404b="" data-v-42ea937d="" title="" class="icon-ctnr live-skin-normal-a-text pointer" id = "blth_like_button" style="line-height: 16px;margin-left: 15px;"><i data-v-6d89404b="" class="v-middle icon-font icon-delete" style="font-size: 16px;"></i><span data-v-6d89404b="" class="action-text v-middle" style="font-size: 12px;margin-left: 5px;">去掉直播水印</span></div>`
        );
        like_button.click(() => {
            $('.web-player-icon-roomStatus').remove()
        });
        const blanc_button = $(
            `<div data-v-6d89404b="" data-v-42ea937d="" title="" class="icon-ctnr live-skin-normal-a-text pointer" id = "blth_like_button" style="line-height: 16px;margin-left: 15px;"><i data-v-6d89404b="" class="v-middle icon-font icon-top" style="font-size: 16px;"></i><span data-v-6d89404b="" class="action-text v-middle" style="font-size: 12px;margin-left: 5px;">回到默认界面</span></div>`
        );
        blanc_button.click(() => {
            window.top.location.href = 'https://live.bilibili.com/blanc/'+ Live_info.room_id
        })
        if ($('.right-ctnr').length !== 0){
            right_ctnr[0].insertBefore(like_button[0], share[0]);
            right_ctnr[0].insertBefore(blanc_button[0], like_button[0], share[0]);
        }
        try {
            BAPI = BilibiliAPI;
        } catch (err){
            console.error(`[${NAME}]`, err);
            return;
        }
        Live_info.csrf_token = BAPI.getCookie('bili_jct');
        const MY_API = {
            CONFIG_DEFAULT: {
                sign_danmu_content:["打卡","签到","路过","打卡o(￣ヘ￣o＃)","ᕕ( ´Д` )ᕗ打卡","( TロT)σ打卡","|•'▿'•)✧打卡","(●'◡'●)ﾉ♥","(●'◡'●)ﾉ♥打卡"],
                AUTO_dynamic_create:false,//自动发动态
                AUTO_dynamic_create2:false,//自动转发视频动态
                AUTO_dynamic_create_ts:0,//自动发动态时间戳
                AUTO_dynamic_create_flash:30,//分，自动发动态间隔
                official_dynamic_data:[],//官方动态抽奖数据
                official_business_data:[],//官方预约抽奖数据
                detail_by_lid_flash:180,//直播预约抽奖、动态抽奖间隔
                gitee_url:"http://flyx.fun:1369/static/keyword.json",//云屏蔽词数据地址
                gitee_url2:"http://flyx.fun:1369/static/un_keyword.json",//云正则关键词数据地址
                getmsg_num:2900,//无私信主播取关门槛
                getmsg:false,//无私信主播取关开关
                unignore_to_get_medal_switch:true,//无勋章时，正则关键词，会自动获得勋章，且升级
                tags2_min: 0, //低粉下限
                tags5_min: 30, //动态鸽子下限
                Anchor_danmu_go_r: 0, //手动弹幕抽奖房间号
                Anchor_danmu_go_c: '抽奖', //手动弹幕抽奖内容
                Anchor_danmu_go_check:false,//随机鸡汤
                Anchor_danmu_go_f: 8, //间隔
                Anchor_danmu_go_t: 1, //次数
                fans_switch: false,//天选粉丝下限开关
                fans_min: 1500,//天选粉丝下限
                money_switch: true,//天选现金开关
                money_min: 2,//天选现金下限
                medal_sign_time_hour: 16,//勋章打卡时间
                medal_sign_time_min: 16,//勋章打卡时间
                AUTO_activity_lottery: true,//自动定时抽奖
                AUTO_activity_lottery2: true,//自动定时获取次数
                AUTO_activity_lottery_time_hour: 0,//活动抽奖定时时间
                AUTO_activity_lottery_time_min: 1,//活动抽奖定时时间
                GIFT_AUTO: true,//自动送过期礼物开关
                GIFT_ROOM: 25746928,//自动送过期礼物房间
                TALK: false, //不显示抽奖反馈
                TIMEAREADISABLE: true,//抽奖休眠开关
                TIMEAREASTART: 2,//抽奖休眠起始时间
                TIMEAREAEND: 6,//抽奖休眠结束时间
                sleep_TIMEAREADISABLE: true,//定时推送开关
                sleep_TIMEAREASTART: 22,//定时推送休眠起始时间
                sleep_TIMEAREAEND: 10,//定时推送休眠结束时间
                gift_price: 0,//天选参与金瓜子上限
                Anchor_ignore_keyword: ["大蒜", "点播", "表情", "小游戏", "cos", "看号", "加速器", "优惠", "舰", "抵扣", "返券", "冬日热饮", "一起玩", "星际战甲", "上车", "搭配", "上船", "保温", "写真", "自画像", "自拍", "照", "总督", "提督", "一毛", "禁言", "代金", "通行证", "第五人格", "抵用"],//屏蔽关键词
                Anchor_unignore_keyword:["旗舰手机"],//正则关键词
                Anchor_ignore_room: [],//屏蔽的直播间号
                Anchor_ignore_uid: [],//屏蔽的UID号
                ignore_room:[],//输入界面存储
                AnchorserverFLASH: 20, //获取服务器抽奖数据间隔
                AnchorcheckFLASH: 60, //检索抽奖数据休眠时间
                Anchor_room_send: 0, //手动推送服务器数据房间
                JSMARK: 0, //多开标记
                AUTO_BOX: true, //每日换硬币
                AUTO_COIN: false, //每日视频投币5个
                AUTO_COIN2: false, //每日专栏投币5个
                auto_light:true,
                auto_medal_task: false, //弹幕点赞分享观看
                medal_level_pass: true,//跳过勋章直播间打卡签到
                medal_pass_level: 20,//跳过勋章等级
                AUTO_DailyReward: true, //主站登陆、观看、转发经验获取
                materialobject_ts: 0,//金箱子时间戳
                medal_ts: 0,//自动更新勋章数据时间戳
                Following_ts: 0,//自动更新关注数据时间戳
                Anchor_ts: 0,//检索抽奖数据时间戳
                do_lottery_ts: 0,//获取抽奖数据时间戳
                detail_by_lid_ts: 0,//动态抽奖时间戳
                last_aid: 850,//金箱子序号
                AUTO_GOLDBOX: false, //金箱子抽奖
                AUTO_GOLDBOX_sever2: false, //金箱子群主的云模式
                AUTO_Anchor: false, //天选时刻抽奖
                detail_by_lid_live: false, //直播预约抽奖
                detail_by_lid_live_fans: false, //仅关注直播预约抽奖
                detail_by_lid_live_ignore: true, //直播预约抽奖应用屏蔽关键词
                detail_by_lid_dynamic: false, //全部动态抽奖
                COUNT_GOLDBOX: 0, //天选时刻、金箱子抽奖参与次数
                Anchor_cur_gift_num: true, //天选时刻金瓜子参与次数
                switch_sever: false, //检索开关
                sever_modle: false, //获取专栏数据开关
                get_data_from_server:true,//获取服务器中转数据开关
                medal_change: false,//自动更换勋章开关
                get_Anchor_ignore_keyword_switch1: false,//屏蔽词/房自动更新到本地
                get_Anchor_ignore_keyword_switch2: false,//屏蔽词/房自动同步到本地
                get_Anchor_ignore_keyword_switch3: true,//本地模式
                get_Anchor_unignore_keyword_switch1: false,//正则关键词自动更新到本地
                get_Anchor_unignore_keyword_switch2: false,//正则关键词自动同步到本地
                get_Anchor_unignore_keyword_switch3: true,//本地模式
                ServerChan_SCKEY: 0, //Server酱微信推送SCKEY
                switch_ServerChan_SCKEY: false, //Server酱微信推送开关
                go_cqhttp: '0.0.0.0',//你的架设了qbot的服务器ip地址
                switch_go_cqhttp: false, //开关
                push_KEY: 0, //http://push.ijingniu.cn/微信推送SCKEY
                switch_push_KEY: false, //http://push.ijingniu.cn微信推送开关
                pushplus_KEY: 0,
                switch_pushplus_KEY: false,
                anchor_danmu: false, //天选中奖发弹幕开关
                anchor_danmu_content: ['嘿嘿嘿嘿嘿', 'hahahahaha'], //中奖弹幕
                anchor_msg: false, //天选中奖发私信开关
                anchor_msg_content: ['嘿嘿嘿嘿嘿中奖了~~', '天选中奖了~~', '天选居然中奖了~~'], //中奖私信
                Anchor_Followings_switch: false,//仅参与关注的主播的抽奖开关
                popularity_red_pocket_Followings_switch: false,//仅参与关注的主播的电池道具抽奖开关
                COUNT: 0,//修仙指数
                LCOUNT: 0, //小心心数量
                LOVE_COUNT: 0,//经验
                CLEAR_TS: 0,//
                TTCOUNT: 0,//经验
                TTLOVE_COUNT: 0,//经验
                BPJY: 0,//经验
                BPDJ: 1,//经验
                DJLVMK: 100,//经验
                room_ruid:[],//room-uid数据库
                room_AnchorRecord_time:[],//记录天选房间号+开启的时间
                done_id_list:[],//
                popularity_red_pocket_done_id_list:[],//
                storm_done_id_list:[],//
                aid_number_list:[],//
                done_room_list:[],//
                done_room_time_list:[],//
                updata:[],//
                medal_uid_list:[],//
                medal_level_list:[],//
                medal_roomid_list:[],//
                medal_id_list:[],//
                FollowingList:[],//
                ALLFollowingList:[],//
                guardroom:[],//
                guard_level:[],//
                guardroom_activite:[],//
                goldjournal:[],//消费日志
                freejournal:[],//免费日志
                freejournal2:[],
                freejournal3:[],
                freejournal4:[],
                freejournal5:[],
                freejournal6:[],
                freejournal7:[],
                freejournal8:[],
                journal_pb:[],//屏蔽日志
                journal_medal:[],//勋章投喂日志
                journal_popularity_red_pocket:[],
                dynamic_id_str_done_list:[],//已参与的动态did//
                last_lottery_id:70000,//
                lottery_id_done_list:[],//参与的动态lid
                poison_chicken_soup:[],
                zdydj_bendi:false,//本地自定义短句
                bendi_zdydj:[],//本地自定义短句
                key_rpid:[],
                key_ctime:[],
                key_rpid2:[],
                key_ctime2:[],
                key_rpid3:[],
                key_ctime3:[],
                activity_lottery_gone:[],//过期转盘sid
                ignore_room:[],//屏蔽拉黑房
                tags2_checkbox:false,//低粉
                tags5_checkbox:false,//动态鸽子
                tags6_checkbox:false,//中奖
                articles_id_done_list:[],//已检查的专栏id
                not_office_dynamic_go:false,
                msgfeed_at_id_list:[],//@id
                msgfeed_reply_id_list:[],//回复id
                AUTO_dynamic_del:30,
                space_history_offset_t:0,//已转动态时间戳秒
                business_id:[],//预约抽奖已参加ID
                get_sessions:true,//@信息推送开关
                msgfeed_reply:true,//回复信息推送开关
                get_sessions_keyword:["中奖","二维码","恭喜","开奖"],//私信关键词
                push_msg_oneday_check:false,
                push_msg_oneday_hour:21,
                push_msg_oneday_time:60,
                push_msg_oneday_time_s:0,
                push_msg_oneday_hour_check:true,
                push_msg_oneday_time_check:false,
                push_msg_oneday_days:1,
                no_money_checkbox:false,
                get_sessions_end_ts:0,//私信提取时间戳ms
                auto_get_sessions:false,//自动已读提取私信
                auto_get_sessions_day:7,//私信提取回溯
                auto_get_sessions_hour:20,//私信提取回溯
                unusual_check:false,//天选关注异常检查
                unusual_stop_delay_time:10,//天选关注异常暂停
                join_code_check:false,//天选验证码异常检查
                join_code_stop_delay_time:10,//天选验证码异常暂停
                unusual_uid:17561219,//私信功能测接收UID，默认直播小喇叭
                qqbot:false,
                qq2:0,//私有化接收QQ号
                qq:0,//群专属接收QQ号
                haveMsg_uid_list:[],//有私信uid
                qq_zdy:false,//QQ群通知监控
                qq_dt:false,//QQ通知监控
                dtjk_uid:[],
                dtjk_flash:5,
                lottery_result_uid_list:[],//API.CONFIG.lottery_result_uid_list  检查的uidlist
                refresh:false,
                refresh_Select1:false,
                refresh_Select2:true,
                refresh_Select1_time:180,
                refresh_Select2_time:23,
                BKL_check:true,//使用免费灯牌
                fans_gold_check:false,//使用粉丝团灯牌
                push_tag:'天选一组',//推送标签
                get_medal_room:[],//批量勋章房间列表
                BKL_check_get_medal:false,
                fans_gold_check_get_medal:false,
                zdydj:false,//自定义短句
                zdydj_url:"http://flyx.fun:1369/static/zdydj.json",//自定义短句云地址
                gsc:false,//古诗词
                yyw:false,//一言文
                chp:true,//彩虹屁
                Anchor_vedio:false,//随机评论开关
                Anchor_vedio_text:"就是来抽奖的！",//视频评论
                Anchor_vedio_bv:"BV11e4y157jp",//视频BV
                auto_config:false,//自动同步云配置
                auto_config_url:"",//自动同步云配置
                get_b:false,//自动B币券
                b_to_gold:false,//自动领取B币券冲金瓜子
                popularity_red_pocket_join_switch:false,//直播间电池道具红包
                total_price:3,//元
                popularity_red_pocket_flash:60,//道具红包抽奖间隔
                popularity_red_pocket_open_left:260,//剩余秒数
                popularity_red_pocket_only_official_switch: false,//仅参与官方的电池道具抽奖开关
                popularity_red_pocket_no_official_switch: false,//略过官方的电池道具抽奖开关
                AUTO_EditPlugs:true,//自动关闭空间勋章显示
                dynamic_lottery_up_move:true,//转发抽奖后自动移动到动态分组
                not_office_dynamic_only_modify: false,//专栏动态仅关注
                space_article_uid: [226257459,99439379],//uid，获取最近24小时专栏投稿
                popularity_red_pocket_time_switch:false,//定时开启
                popularity_red_pocket_time_switch2:false,
                popularity_red_pocket_time:'18点0分到18点30分,20点0分到20点20分',//开启时段
                popularity_red_pocket_time2:60,
                score_auto_dm:false,//自动发弹幕加贡献值
                ALLFollowingList_2000:false,//满关注推送
                setu_bot_start:false,//QQ机器人
                qqawardlist:[],
                qqawardlist_switch:true,
                AUTO_storm:false,
                YIYUAN_AUTO:false,
                YIYUAN:[],//API.CONFIG.YIYUAN = [{roomid:0,count:0}]  API.CONFIG.YIYUAN_send_num
                YIYUAN_roomid_list:[25746928],
                YIYUAN_send_num:10,
                coins_send_num:0,
                popularity_red_pocket_onlineNum_switch:true,//红包在线人数开关
                popularity_red_pocket_onlineNum_switch2:false,//在线人数>红包数不参加开关
                popularity_red_pocket_onlineNum:20,//红包在线人数上限
                popularity_red_pocket_Num:0,//在线人数超过红包数
                send_bag_gift_now:false,//包裹礼物即送开关
                send_bag_gift_now_room:25976373,//包裹礼物即送房间号
                send_bag_gift_now_price:9999,//起送下限
                anchor_join_delay:false,//天选间隔模式开关
                anchor_join_delay_time:300,//天选间隔模式间隔
                remove_some_ele:false,//精简
                background_show:true,//海报
                isnotLogin_push:true,//未登录推送开关
                space_article_title:['互动抽奖','抽奖'],//专栏标题关键词
                bagsendonekey_room:25976373,
                tips_show:true,
                nice:false,//充电打赏
                Anchor_onlineNum_switch:false,//天选在线人数开关
                Anchor_onlineNum:20,//天选在线人数上限
                Anchor_score_auto_dm:false,//自动发弹幕加贡献值
                use_old_repost_api:false,//使用旧动态转发接口
                gift_anchor_only:false,//仅礼物天选
                gift_anchor_min_switch:false,//礼物天选价值过滤
                gift_anchor_min:52,//礼物天选价值过滤
                require_none:false,//无要求天选抽奖
                medal_pass_uid:[],//不执行观看任务
                medal_first_uid:[],//优先执行观看任务
                sort:true,//从小到大，否则从大到小
            },

            CONFIG: {},
            init: async function () {
                try {
                    BAPI.setCommonArgs(BAPI.getCookie('bili_jct')); // 设置token
                } catch (err){
                    console.error(`[${NAME}]`, err);
                    return;
                }

                let p = $.Deferred();
                try {
                    MY_API.loadConfig().then(async function () {
                        let remove_some_ele = $('<button id="ddremove" style="position: absolute; top: 416px; right: -72px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                            '精简页面</button>');
                        remove_some_ele.click(function () {
                            window.toast('精简页面：灰色原页面，紫色去除部分页面内容，恢复到原页面需刷新！');
                            if(MY_API.CONFIG.remove_some_ele){
                                MY_API.CONFIG.remove_some_ele = false
                                $("#ddremove").css("background-color", "GhostWhite")
                            }else{
                                MY_API.CONFIG.remove_some_ele = true
                                $("#ddremove").css("background-color", "purple")
                                //播放器
                                $('.minimal-restore-btn.dp-none.p-absolute.pointer.ts-dot-2').remove()
                                $('#player-minimal-panel-vm').remove()
                                $('.live-player-mounter.h-100').remove()
                                $('.side-bar-cntr').remove()//实验室、关注
                                $("#my-dear-haruna-vm").remove()//2233
                                $('#link-footer-vm').remove()//
                                $("#sections-vm").remove()//动态
                                $('#room-ssr-vm').remove()//顶栏
                                $('.gift-presets.p-relative.t-right').remove()
                                $('.m-guard-ent.gift-section.guard-ent').remove()
                                //$('.gift-section.gift-list').remove()
                                $('.gift-panel.base-panel.live-skin-coloration-area').remove()
                                $('.left-part-ctnr.vertical-middle.dp-table.section.p-relative').remove()
                                //$('.header-info-ctnr.live-skin-coloration-area').remove()
                            }
                        });
                        $('.chat-history-panel').append(remove_some_ele);
                        if(!MY_API.CONFIG.remove_some_ele){
                            $("#ddremove").css("background-color","GhostWhite")
                        }else{
                            $("#ddremove").css("background-color","purple")
                        }
                        let background_show = $('<button id="background_show" style="position: absolute; top: 446px; right: -72px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                            '背景海报</button>');
                        background_show.click(function () {
                            $('.zdbgjtpp').toggle()
                            if($(".zdbgjtpp").is(":hidden")){
                                MY_API.CONFIG.background_show = false
                                $("#background_show").css("background-color", "GhostWhite")
                            }else{
                                MY_API.CONFIG.background_show = true
                                $("#background_show").css("background-color", "purple")
                            };
                        });
                        $('.chat-history-panel').append(background_show);
                        if(!MY_API.CONFIG.background_show){
                            $("#background_show").css("background-color","GhostWhite")
                        }else{
                            $("#background_show").css("background-color","purple")
                        }

                        MY_API.CONFIG.poison_chicken_soup = []
                        if(MY_API.CONFIG.AnchorserverFLASH <= 16)MY_API.CONFIG.AnchorserverFLASH = 20
                        if(MY_API.CONFIG.gitee_url == "https://gitcode.net/m0_66551500/flyx/-/raw/master/key.json")MY_API.CONFIG.gitee_url = "http://flyx.fun:1369/static/keyword.json"
                        if(MY_API.CONFIG.gitee_url2 == "https://gitcode.net/m0_66551500/flyx/-/raw/master/unkey.json")MY_API.CONFIG.gitee_url2 = "http://flyx.fun:1369/static/un_keyword.json"
                        if(MY_API.CONFIG.zdydj_url == "https://gitcode.net/m0_66551500/flyx/-/raw/master/zdydj.json")MY_API.CONFIG.zdydj_url = "http://flyx.fun:1369/static/zdydj.json"

                        p.resolve();
                    });
                } catch (e){
                    console.log('API初始化出错', e);
                    MY_API.chatLog('脚本初始化出错', 'warning');
                    p.reject()
                }
                return p
            },
            loadConfig: async function () {
                let p = $.Deferred();
                try {
                    let config = JSON.parse(localStorage.getItem(`${NAME}_CONFIG`));
                    $.extend(true, MY_API.CONFIG, MY_API.CONFIG_DEFAULT);
                    for(let item in MY_API.CONFIG){
                        if(!MY_API.CONFIG.hasOwnProperty(item))
                            continue;
                        if(config[item] !== undefined && config[item] !== null)
                            MY_API.CONFIG[item] = config[item];
                    }
                    //console.log('载入配置', MY_API.CONFIG);
                    p.resolve()
                } catch (e){
                    console.log('API载入配置失败', e);
                    MY_API.setDefaults();
                    p.reject()
                }
                return p
            },

            saveConfig: function () {
                try {
                    localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
                    //console.log('配置已保存', MY_API.CONFIG);
                    return true
                } catch (e){
                    console.log('API保存出错', e);
                    return false
                }
            },
            setDefaults: async function () {
                let CONFIG_keys = [];
                $.each(localStorage, (key) => {
                    CONFIG_keys.push(key);
                });
                let CONFIG_keys_mark = true
                for (let i = 0; i < CONFIG_keys.length; i++) {
                    if(CONFIG_keys[i].indexOf("_CONFIG") > -1 && CONFIG_keys[i].match(/\d+/g) && CONFIG_keys[i].indexOf("_CONFIG_") == -1){
                        CONFIG_keys_mark = false
                        let getnumber = CONFIG_keys[i].match(/\d+/g)
                        let other_uid = getnumber[0]
                        let code = await prompt(`检测到账号${other_uid}配置信息！\n输入【1】载入默认配置并删除配置缓存\n输入【2】继承账号${other_uid}配置\n输入【3】仅载入默认配置`,"2");
                        if(code == "1"){
                            localStorage.removeItem(CONFIG_keys[i]);
                            MY_API.CONFIG = MY_API.CONFIG_DEFAULT;
                            MY_API.saveConfig();
                        }else if(code == "2"){
                            let value = localStorage.getItem(CONFIG_keys[i])
                            localStorage.setItem(Live_info.uid + "_CONFIG",value)
                            localStorage.removeItem(CONFIG_keys[i]);
                        }else{
                            MY_API.CONFIG = MY_API.CONFIG_DEFAULT;
                            MY_API.saveConfig();
                        }
                        break
                    }
                }
                if(CONFIG_keys_mark){
                    MY_API.CONFIG = MY_API.CONFIG_DEFAULT;
                    MY_API.saveConfig();
                }
                MY_API.chatLog(`天选众：${Live_info.uname}<br>我欲成仙丨快乐无边<br>欢迎来到哔哩哔哩的修仙世界！`);
                MY_API.chatLog(`将在3秒后刷新载入脚本配置！`, 'warning');
                setTimeout(() => {
                    window.location.reload()
                }, 3000);
            },
            cjcheck: function () {
                if(MY_API.CONFIG.BPDJ < 100){
                    CJ = '筑基';
                }else if(MY_API.CONFIG.BPDJ < 200){
                    CJ = '旋照'
                }else if(MY_API.CONFIG.BPDJ < 300){
                    CJ = '辟谷'
                }else if(MY_API.CONFIG.BPDJ < 400){
                    CJ = '结丹'
                }else if(MY_API.CONFIG.BPDJ < 500){
                    CJ = '元婴'
                }else if(MY_API.CONFIG.BPDJ < 600){
                    CJ = '出窍'
                }else if(MY_API.CONFIG.BPDJ < 700){
                    CJ = '分神';
                }else if(MY_API.CONFIG.BPDJ < 800){
                    CJ = '合体'
                }else if(MY_API.CONFIG.BPDJ < 900){
                    CJ = '渡劫'
                }else if(MY_API.CONFIG.BPDJ < 1000){
                    CJ = '大乘'
                }else if(MY_API.CONFIG.BPDJ < 2000){
                    CJ = '仙人'
                }else if(MY_API.CONFIG.BPDJ < 5000){
                    CJ = '地仙'
                }else if(MY_API.CONFIG.BPDJ < 10000){
                    CJ = '天仙'
                }else if(MY_API.CONFIG.BPDJ < 20000){
                    CJ = '玄仙'
                }else if(MY_API.CONFIG.BPDJ < 30000){
                    CJ = '神境'
                }else if(MY_API.CONFIG.BPDJ < 40000){
                    CJ = '神人'
                }else if(MY_API.CONFIG.BPDJ < 60000){
                    CJ = '准神'
                }else if(MY_API.CONFIG.BPDJ < 80000){
                    CJ = '主神'
                }else if(MY_API.CONFIG.BPDJ < 100000){
                    CJ = '神王'
                }else if(MY_API.CONFIG.BPDJ < 200000){
                    CJ = '初始天尊'
                }else if(MY_API.CONFIG.BPDJ < 300000){
                    CJ = '天尊一重天'
                }else if(MY_API.CONFIG.BPDJ < 400000){
                    CJ = '天尊二重天'
                }else if(MY_API.CONFIG.BPDJ < 500000){
                    CJ = '天尊三重天'
                }else if(MY_API.CONFIG.BPDJ < 600000){
                    CJ = '天尊四重天'
                }else if(MY_API.CONFIG.BPDJ < 700000){
                    CJ = '天尊五重天'
                }else if(MY_API.CONFIG.BPDJ < 800000){
                    CJ = '天尊六重天'
                }else if(MY_API.CONFIG.BPDJ < 900000){
                    CJ = '天尊七重天'
                }else if(MY_API.CONFIG.BPDJ < 1000000){
                    CJ = '天尊八重天'
                }else if(MY_API.CONFIG.BPDJ < 2000000){
                    CJ = '天尊九重天'
                }else if(MY_API.CONFIG.BPDJ >= 2000000){
                    CJ = '天尊大圆满'
                };
                let lunar = sloarToLunar(year(),month(),day())
                let info = document.getElementById('CJ');
                if(info){
                    info.innerHTML = `${lunar.lunarYear}年&nbsp;&nbsp;&nbsp;&nbsp;${lunar.lunarMonth}月${lunar.lunarDay}&nbsp;&nbsp;&nbsp;&nbsp;${getShiChen()}<br>
修为：${CJ}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;今日修仙指数：${MY_API.CONFIG.COUNT}<br>
攻击：${MY_API.CONFIG.TTCOUNT}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;防御：${MY_API.CONFIG.TTLOVE_COUNT}<br>
灵力：${MY_API.CONFIG.BPJY}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;等级：Lv${MY_API.CONFIG.BPDJ}`
                }
            },
            expaddGift: function(count){
                count = 20 + Math.ceil(Math.random() * 20)
                MY_API.CONFIG.COUNT += count;
                MY_API.CONFIG.TTCOUNT += count;
                MY_API.CONFIG.BPJY += count * 4;
                if(MY_API.CONFIG.BPJY >= MY_API.CONFIG.DJLVMK){
                    MY_API.CONFIG.BPDJ += 1;
                    MY_API.CONFIG.DJLVMK += 1000
                    //MY_API.chatLog('恭喜你升级了ヾ(o◕∀◕)ﾉヾ');
                }
                MY_API.cjcheck();
                MY_API.saveConfig();
            },
            expaddLove: function(count){
                count = 10 + Math.ceil(Math.random() * 20)
                MY_API.CONFIG.LOVE_COUNT += count;
                MY_API.CONFIG.TTLOVE_COUNT += count;
                MY_API.CONFIG.BPJY += count * 6;
                if(MY_API.CONFIG.BPJY >= MY_API.CONFIG.DJLVMK){
                    MY_API.CONFIG.BPDJ += 1;
                    MY_API.CONFIG.DJLVMK += 1000
                    //MY_API.chatLog('恭喜你升级了ヾ(o◕∀◕)ﾉヾ');
                }
                MY_API.cjcheck();
                MY_API.saveConfig();
            },

            creatSetBox: function () { //创建设置框
                let show_dianchi = $(`<button id='btn_dianchi' style="position: absolute;width: 105px;top:630px;left:315px;z-index: 999;background-color: #428bca;color:  #fff;border-radius:4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;text-align: left;">包裹电池：${dianchi}<br>包裹礼物：${dianchi_gift_num}</button>`);
                $('.chat-history-panel').append(show_dianchi);
                let record_count_num = GM_getValue('popularity_red_pocket_send_record_count_num')
                let show_send_dianchi = $(`<button id='btn_send_dianchi' style="position: absolute;width: 105px;top:670px;left:315px;z-index: 999;background-color: #428bca;color:  #fff;border-radius:4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;text-align: left;">已投电池：${record_count_num[0]}<br>已投礼物：${record_count_num[1]}</button>`);
                $('.chat-history-panel').append(show_send_dianchi);
                if(GM_getValue('btn1') == undefined)GM_setValue('btn1', true)
                if(GM_getValue('btn2') == undefined)GM_setValue('btn2', true)
                let btn1 = $('<button style="position: absolute; top: 223px; right: -120px;z-index: 1;background-color: pink;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '显隐插件参数界面</button>');
                btn1.click(function () {
                    $('.zdbgjdiv').toggle()
                    $('.zdbgjtj').toggle()
                    $('.zdbgjohb').toggle()
                    $('.zdbgjtuisong').toggle()
                    $('.zdbgjhongbao').toggle()
                    $('.zdbgjtianxuanshike').toggle()
                    $('.zdbgjmeiri').toggle()
                    $('.zdbgjshiwuhuodong').toggle()
                    $('.zdbgjdongtai').toggle()
                    $('.zdbgjwanju').toggle()
                    $('.zdbgjpeizhi').toggle()
                    $('.zdbgjsongli').toggle()
                    if($(".zdbgjdiv").is(":hidden")){
                        GM_setValue('btn1', true)
                        $('.zdbgjsessions').hide()
                        $('.zdbgjget_medal').hide()
                        $('.zdbgjtags').hide()
                        $('#chang_page_div1').hide()
                        $('#chang_page_div2').hide()
                        $('#chang_page_div3').hide()
                        $('#chang_page_div4').hide()
                        $('#chang_page_div5').hide()
                        $('#chang_page_div6').hide()
                        $('#chang_page_div7').hide()
                        $('#chang_page_div8').hide()
                        $('#chang_page_div9').hide()
                        $('#chang_page_div10').hide()
                        $('#chang_page_div11').hide()
                        $('#chang_page_div12').hide()
                    }else{
                        GM_setValue('btn1', false)
                        $('#chang_page_div1').show()
                        $('#chang_page_div2').show()
                        $('#chang_page_div3').show()
                        $('#chang_page_div4').show()
                        $('#chang_page_div5').show()
                        $('#chang_page_div6').show()
                        $('#chang_page_div7').show()
                        $('#chang_page_div8').show()
                        $('#chang_page_div9').show()
                        $('#chang_page_div10').show()
                        $('#chang_page_div11').show()
                        $('#chang_page_div12').show()
                    };
                });
                $('.chat-history-panel').append(btn1);
                let btn2 = $('<button style="position: absolute; top: 246px; right: -120px;z-index:1;background-color:yellow;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '显隐最新中奖信息</button>');
                btn2.click(function () {
                    $('.zdbgjaward').toggle()
                    if(qq_run_mark && !$(".zdbgjqqrunmark").is(":hidden"))$('.zdbgjqqrunmark').toggle()
                    if($(".zdbgjaward").is(":hidden")){
                        GM_setValue('btn2', true)
                    }else{
                        GM_setValue('btn2', false)
                    };
                });
                $('.chat-history-panel').append(btn2);
                let btn3 = $('<button style="position: absolute; top: 269px; right: -120px;z-index:1;background-color:purple;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '清空抽奖反馈信息</button>');
                btn3.click(function () {
                    $('.zdbgjMsg').hide();
                });
                $('.chat-history-panel').append(btn3);

                if(GM_getValue('read') == undefined)GM_setValue('read', false)
                let btn4 = $('<button id="read" style="position: absolute; top: 315px; right: -120px;z-index:1;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '中奖语音播报开关</button>');
                btn4.click(function () {
                    MY_API.chatLog('中奖语音播报：灰色关闭，紫色开启');
                    if(GM_getValue('read')){
                        READ('中奖语音播报已关闭！')
                        GM_setValue('read', false)
                        $("#read").css("background-color", "GhostWhite")
                    }else{
                        GM_setValue('read', true)
                        READ('中奖语音播报已开启！')
                        $("#read").css("background-color", "purple")
                    }
                });
                $('.chat-history-panel').append(btn4);
                if(!GM_getValue('read')){
                    $("#read").css("background-color", "GhostWhite")
                }else{
                    $("#read").css("background-color", "purple")
                }

                if(GM_getValue('go_down') == undefined)GM_setValue('go_down', true)
                let btn5 = $('<button id="go_down" style="position: absolute; top: 292px; right: -120px;z-index:1;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '反馈信息滚动开关</button>');
                btn5.click(function () {
                    if(GM_getValue('go_down')){
                        GM_setValue('go_down', false)
                        $("#go_down").css("background-color", "GhostWhite")
                    }else{
                        GM_setValue('go_down', true)
                        $("#go_down").css("background-color", "yellow")
                    }
                    MY_API.chatLog('反馈信息滚动：灰色关闭，黄色开启');

                });
                $('.chat-history-panel').append(btn5);
                if(!GM_getValue('go_down')){
                    $("#go_down").css("background-color", "GhostWhite")
                }else{
                    $("#go_down").css("background-color", "yellow")
                }
                let btn11 = $('<button id="btn11" style="position: absolute; top: 200px; right: -120px;z-index: 1;background-color: yellow;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '显隐专属参数界面</button>');
                btn11.click(function () {
                    $('.zdbgjqqrunmark').toggle()
                    if(!$(".zdbgjaward").is(":hidden"))$('.zdbgjaward').toggle()
                });
                $('.chat-history-panel').append(btn11);
                $('#btn11').hide()
                let qqrunmark = $("<div class='zdbgjqqrunmark'>");
                qqrunmark.css({
                    'width': '260px',
                    'height': '200px',
                    'position': 'absolute',
                    'top': '160px',
                    'left': '10px',
                    'background': 'rgba(255,255,255,1)',
                    'padding': '10px',
                    'z-index': '999',
                    'border-radius': '12px',
                    'transition': 'height .3s',
                    'overflow': 'auto',
                    'line-height': '15px',
                });
                qqrunmark.append(`
<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">内群专属功能</legend>
<div data-toggle="AUTO_storm" style="font-size: 100%;color:blue;">
<input style="vertical-align: text-top;" type="checkbox" >节奏风暴
</div>

<div data-toggle="qqbot" style="font-size: 100%;color:blue;">
<input style="vertical-align: text-top;" type="checkbox" >中奖推送到你的QQ：<br><input class="num" style="width:75px;vertical-align:inherit;" type="text"><button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button><button data-action="save1" style="font-size: 100%;color:  #FF34B3">测试</button>
</div>
<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">动态监控推送</legend>
<div data-toggle="qq_dt" style="font-size: 100%;color:blue;">
注：新机制需要关注被监控的UP<br>
<input style="vertical-align: text-top;" type="checkbox" >监控半佛抽奖娘动态通知你QQ</div>
<div data-toggle="qq_zdy" style="font-size: 100%;color:blue;">
<input style="vertical-align: text-top;" type="checkbox" >监控自定义UP通知你QQ<br>
监控UID列表：<input class="num" style="width:80px;vertical-align:inherit;" type="text"><br>
监控间隔：<input class="num3" style="width:25px;vertical-align:inherit;" type="text">秒<button data-action="save" style="font-size: 100%;color:#FF34B3;">保存并关注</button>

</div>
</fieldset>
`);
                qq_run_mark = GM_info != undefined && GM_info.script != undefined && GM_info.script.homepage != undefined && GM_info.script.name != undefined && GM_info.script.homepage.indexOf("430750") > -1
                $('.chat-history-panel').append(qqrunmark);
                $('.zdbgjqqrunmark').hide()
                if(qq_run_mark)$('#btn11').show()
                if(MY_API.CONFIG.AUTO_storm)qqrunmark.find('div[data-toggle="AUTO_storm"] input:checkbox').attr('checked', '');
                qqrunmark.find('div[data-toggle="AUTO_storm"] input:checkbox').change(function () {
                    MY_API.CONFIG.AUTO_storm = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`节奏风暴设置：${MY_API.CONFIG.AUTO_storm}`);
                });

                if(MY_API.CONFIG.qqbot)qqrunmark.find('div[data-toggle="qqbot"] input:checkbox').attr('checked', '');
                qqrunmark.find('div[data-toggle="qqbot"] input:checkbox').change(function () {
                    MY_API.CONFIG.qqbot = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`群主QQ机器人推送设置：${MY_API.CONFIG.qqbot}`);
                });
                if(MY_API.CONFIG.qq_zdy)qqrunmark.find('div[data-toggle="qq_zdy"] input:checkbox').attr('checked', '');
                qqrunmark.find('div[data-toggle="qq_zdy"] input:checkbox').change(function () {
                    MY_API.CONFIG.qq_zdy = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自定义动态监控设置：${MY_API.CONFIG.qq_zdy}`);
                });
                qqrunmark.find('div[data-toggle="qq_zdy"] .num').val((MY_API.CONFIG.dtjk_uid.toString()));
                qqrunmark.find('div[data-toggle="qq_zdy"] .num3').val(parseInt(MY_API.CONFIG.dtjk_flash.toString()));
                qqrunmark.find('div[data-toggle="qq_zdy"] [data-action="save"]').click(async function () {
                    MY_API.CONFIG.dtjk_flash = parseInt(qqrunmark.find('div[data-toggle="qq_zdy"] .num3').val());
                    let val = qqrunmark.find('div[data-toggle="qq_zdy"] .num').val();
                    let list = val.replaceAll(' ', '').replaceAll('，', ',').split(",");
                    let list2 = []
                    for(let i = 0; i < list.length; i++){
                        if(list[i]=='')continue
                        if(list[i] && Number(list[i]) && list2.indexOf(Number(list[i])) == -1){
                            list2.push(Number(list[i]))
                        }
                    }
                    MY_API.CONFIG.dtjk_uid = list2
                    MY_API.saveConfig()
                    MY_API.chatLog(`UID列表：${MY_API.CONFIG.dtjk_uid}<br>监控间隔：${MY_API.CONFIG.dtjk_flash}<br>注意！间隔过短可能容易出现动态风控情况！`);
                    if(MY_API.CONFIG.qq_dt)list2.push(294887687,37663924,651039864)
                    for(let i = 0; i < list2.length; i++){
                        if(MY_API.CONFIG.ALLFollowingList.indexOf(list2[i]) == -1){
                            await BAPI.modify(list2[i], 1).then(async(data) => {
                                if(data.code==0){
                                    MY_API.chatLog(`动态监控UID：${list2[i]}关注成功！`,'success')
                                    if(dynamic_lottery_tags_tagid)await BAPI.tags_addUsers(list2[i], dynamic_lottery_tags_tagid)//移动到动态分组防止默认分组取关
                                }else{
                                    MY_API.chatLog(`UID：${list2[i]}关注失败：${data.message}！`,'warning')
                                }
                            })
                            await sleep(5000)
                        }else{
                            await sleep(5000)
                            if(dynamic_lottery_tags_tagid)await BAPI.tags_addUsers(list2[i], dynamic_lottery_tags_tagid)//移动到动态分组防止默认分组取关
                        }
                    }
                });

                if(MY_API.CONFIG.qq_dt)qqrunmark.find('div[data-toggle="qq_dt"] input').attr('checked', '');
                qqrunmark.find('div[data-toggle="qq_dt"] input:checkbox').change(function () {
                    MY_API.CONFIG.qq_dt = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`半佛抽奖娘动态监控设置：${MY_API.CONFIG.qq_dt}`);
                });
                qqrunmark.find('div[data-toggle="qqbot"] .num').val(parseInt(MY_API.CONFIG.qq.toString()));
                qqrunmark.find('div[data-toggle="qqbot"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.qq = parseInt(qqrunmark.find('div[data-toggle="qqbot"] .num').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`你的QQ号：${MY_API.CONFIG.qq}`);
                });
                let qqbotmark = true
                qqrunmark.find('div[data-toggle="qqbot"] [data-action="save1"]').click(function () {
                    if(!qqbotmark)return MY_API.chatLog(`10秒CD中！`);
                    if(!MY_API.CONFIG.qqbot)return MY_API.chatLog(`推送没有勾选！`);
                    if(MY_API.CONFIG.qq && MY_API.CONFIG.qqbot && qqbotmark){
                        qq(MY_API.CONFIG.qq,`【天选众】【${MY_API.CONFIG.push_tag}】${Live_info.uname}：群主QQ机器人推送测试消息！${year()}年${month()}月${day()}日${hour()}点${minute()}分！`,qun_server[1],qun_server[3]).then(async function(data){
                            if(data.retcode==0){
                                MY_API.chatLog(`群主QQ机器人推送测试消息发送成功！`);
                            }else{
                                MY_API.chatLog(`群主QQ机器人推送测试消息：${data.retmsg}`);
                            }
                        })
                    }
                    qqbotmark = false
                    setTimeout(() => {
                        qqbotmark = true
                    }, 10e3);
                });

                let bagsendbox = $("<div class='bagsendbox'>");
                bagsendbox.css({
                    'width': '260px',
                    'height': '40px',
                    'position': 'absolute',
                    'top': '510px',
                    'left': '10px',
                    'background': 'rgba(255,255,255,1)',
                    'padding': '10px',
                    'z-index': '999',
                    'border-radius': '12px',
                    'transition': 'height .3s',
                    'overflow': 'auto',
                    'line-height': '15px',
                });
                bagsendbox.append(`
<fieldset>

<div data-toggle="bagsendonekey" style="font-size: 100%;color:blue;">
直播间号：<input class="num" style="width:75px;vertical-align:inherit;" type="text"><button data-action="save" style="font-size: 100%;color:  #FF34B3">一键赠送</button>
</div>
</fieldset>
`);
                $('.chat-history-panel').append(bagsendbox);
                $('.bagsendbox').hide()
                bagsendbox.find('div[data-toggle="bagsendonekey"] .num').val(parseInt(MY_API.CONFIG.bagsendonekey_room.toString()));
                bagsendbox.find('div[data-toggle="bagsendonekey"] [data-action="save"]').click(async function () {
                    MY_API.CONFIG.bagsendonekey_room = parseInt(bagsendbox.find('div[data-toggle="bagsendonekey"] .num').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`快捷送礼房间号：${MY_API.CONFIG.bagsendonekey_room}`);
                    await sleep(1000)
                    let gift_list = ["i了i了","情书","打call","牛哇","干杯","这个好诶","星愿水晶球","告白花束","花式夸夸","撒花","守护之翼","牛哇牛哇","小花花","人气票","星轨列车","次元之城","小电视飞船","粉丝团灯牌"]
                    let r = confirm(`投喂直播间号：${MY_API.CONFIG.bagsendonekey_room}\n投喂包裹礼物范围：${gift_list}\n点击确认开始投喂`);
                    if (r == true){
                        let rUid
                        if(MY_API.CONFIG.room_ruid.indexOf(MY_API.CONFIG.bagsendonekey_room) > -1 ){
                            let num = MY_API.CONFIG.room_ruid.indexOf(MY_API.CONFIG.bagsendonekey_room)
                            rUid = MY_API.CONFIG.room_ruid[num + 1]
                        }else{
                            await BAPI.live_user.get_anchor_in_room(MY_API.CONFIG.bagsendonekey_room).then(async(data) => {
                                if(data.data.info == undefined)return MY_API.chatLog('【快捷送礼】用户不存在！', 'warning');
                                rUid = data.data.info.uid;
                            });
                        }
                        if(rUid != undefined){
                            await BAPI.gift.bag_list().then(async function(bagResult){
                                //console.log('check_bag_gift',bagResult.data)
                                if(bagResult.data == undefined || bagResult.data.list == undefined) return
                                let list = bagResult.data.list
                                if(list == null){
                                    dianchi = 0
                                }else{
                                    for(let i=0;i<list.length;i++){
                                        if(gift_list.indexOf(list[i].gift_name) > -1 && list[i].expire_at != 0){
                                            await sleep(2000)
                                            await BAPI.gift.bag_send(Live_info.uid, list[i].gift_id, rUid, list[i].gift_num, list[i].bag_id, MY_API.CONFIG.bagsendonekey_room, (ts_ms()+ms_diff)).then(async function(data){
                                                if(data.code === 0 ){
                                                    MY_API.chatLog(`【快捷送礼】直播间：${MY_API.CONFIG.bagsendonekey_room}：投喂包裹礼物${list[i].gift_name}×${list[i].gift_num}成功！`, 'success');
                                                }else{
                                                    MY_API.chatLog(`【快捷送礼】${data.message}`, 'warning');
                                                }
                                            });
                                        }
                                    }
                                }
                            })
                        }
                    }
                })

                widthmax = $('.web-player-ending-panel').width() - 50;
                heightmax = 550
                var div_css = {
                    'width': '500px',
                    'height': '550px',
                    'max-height': `${heightmax}px`,
                    'position': 'absolute',
                    'top': '10px',
                    'right': '10px',
                    'background': 'rgba(255,255,255,1)',
                    'padding': '10px',
                    'z-index': '99',
                    'border-radius': '12px',
                    'transition': 'height .3s',
                    'overflow': 'auto',
                    'line-height': '15px'
                }
                let div = $("<div class='zdbgjdiv'>");

                div.css(div_css);

                let tianxuanshike = $("<div class='zdbgjtianxuanshike'>");//天选页
                tianxuanshike.css(div_css);

                tianxuanshike.append(`

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【天选时刻抽奖】</legend>
<div data-toggle="AUTO_Anchor">
<append style="font-size: 100%; color: #FF34B3" title="一个关注，即可自动白嫖天选时刻，参加其他请手动点击蓝字直播间链接前往直播间">
<input id = "AUTO_Anchor" style="vertical-align: text-top;" type="checkbox" >自动天选时刻抽奖
</div>

<div data-toggle="require_none">
<append style="font-size: 100%; color: #FF34B3" title="无要求天选抽奖">
<input id = "require_none" style="vertical-align: text-top;" type="checkbox" >仅参与无要求天选抽奖【除非开了仅关注】
</div>

<div data-toggle="anchor_danmu_content">
<append style="font-size: 100%; color:  #FF34B3" title="中奖自动发送随机弹幕，英文逗号隔开，不会发送弹幕！">
<input style="vertical-align: text-top;" type="checkbox" >中奖后自动发送随机弹幕<br/><input class="num" style="width:380px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<div data-toggle="anchor_msg_content">
<append style="font-size: 100%; color:  #FF34B3" title="中奖自动发送随机私信，英文逗号隔开">
<input style="vertical-align: text-top;" type="checkbox" >中奖后自动发送随机私信<br/><input class="num" style="width:380px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<div data-toggle="gift_anchor_only">
<append style="font-size: 100%; color: #FF34B3" title=开启后只参与礼物天选！">
<input style="vertical-align: text-top;" type="checkbox" >仅参与礼物天选抽奖
<br><append style="font-size: 100%;color:blue;">注：如果不抽粉丝团灯牌、小花花、人气票、这个好诶等天选抽奖可在奖品屏蔽词里设置屏蔽！
</div>

<div data-toggle="Anchor_Followings_switch">
<append style="font-size: 100%; color: #FF34B3" title=开启后只参与关注的主播的抽奖！">
<input style="vertical-align: text-top;" type="checkbox" >仅参与关注的主播的抽奖
</div>

<div data-toggle="Anchor_onlineNum_switch">
<append style="font-size: 100%; color: #FF34B3">
<input style="vertical-align: text-top;" type="checkbox" >在线人数超过<input class="num" style="width: 30px;vertical-align:inherit;" type="text">时不参加
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>

<div data-toggle="Anchor_score_auto_dm">
<append style="font-size: 100%; color: #FF34B3" title="自动发弹幕加贡献值！">
<input style="vertical-align: text-top;" type="checkbox" >自动点赞
</div>

<div data-toggle="join_delay">
<append style="font-size: 100%; color:  #FF34B3" title="天选抽奖频率控制">
<input style="vertical-align: text-top;" type="checkbox">天选抽奖间隔设置<input class="num" style="width:40px;vertical-align:inherit;" type="text">秒
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<div data-toggle="unusual_check" style="font-size: 100%;color: #FF34B3">
<input style="font-size: 100%;color: #FF34B3;vertical-align: text-top;" type="checkbox">天选关注异常时暂停抽奖
<input class="num" style="width: 40px;vertical-align:inherit;" type="text">分
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>

<div data-toggle="join_code_check" style="font-size: 100%;color: #FF34B3">
<input style="font-size: 100%;color: #FF34B3;vertical-align: text-top;" type="checkbox">天选验证码异常时暂停抽奖
<input class="num" style="width: 40px;vertical-align:inherit;" type="text">分
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>

<div data-toggle="fans_min">
<append style="font-size: 100%; color:  #FF34B3" title="抽奖主播粉丝数下限，低于下限不抽奖">
<input style="vertical-align: text-top;" type="checkbox">粉丝数量低于<input class="num" style="width:40px;vertical-align:inherit;" type="text">不参加
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<div data-toggle="money_min">
<append style="font-size: 100%; color:  #FF34B3" title="抽奖奖品金额下限（单位：元），低于下限不抽奖">
<input style="vertical-align: text-top;" type="checkbox">奖金低于<input class="num" style="width:30px;vertical-align:inherit;" type="text">元则不参加
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<div data-toggle="gift_anchor_min">
<append style="font-size: 100%; color:  #FF34B3" title="抽奖奖品电池下限，低于下限不抽奖">
<input style="vertical-align: text-top;" type="checkbox">电池总价值低于<input class="num" style="width:30px;vertical-align:inherit;" type="text">不参加
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<div data-toggle="no_money_checkbox">
<append style="font-size: 100%; color:  #FF34B3" title="仅现金及正则参与抽奖">
<input style="vertical-align: text-top;" type="checkbox">仅现金及正则项参与抽奖
</div>

<div data-toggle="gift_price">
<append style="font-size: 100%; color:  #FF34B3" title="理性消费，1电池=100金瓜子=1毛钱">
投喂金瓜子高于<input class="num" style="width: 32px;vertical-align:inherit;" type="text">不参加
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<div data-toggle="Anchor_cur_gift_num">
<append style="font-size: 100%; color: #FF34B3" title="只参加一次抽奖！">
<input style="vertical-align: text-top;" type="checkbox" >忽略已参加的金瓜子抽奖
</div>


<div data-toggle="BKL_check">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">批量获取勋章</button>
</div>


<div data-toggle="get_Anchor_ignore_keyword_switch3">
<append style="font-size: 100%; color:  #FF34B3">
<input name="get_Anchor_ignore_keyword_switch" style="vertical-align: text-top;" type="radio">本地模式
</div>

<div data-toggle="get_Anchor_ignore_keyword_switch1">
<append style="font-size: 100%; color:  #FF34B3">
<input name="get_Anchor_ignore_keyword_switch" style="vertical-align: text-top;" type="radio" title="勾选后，会从云屏蔽词屏蔽房自动新增到本地，在本地存储更新添加">从云屏蔽词屏蔽房自动新增到本地
</div>
<div data-toggle="get_Anchor_ignore_keyword_switch2">
<append style="font-size: 100%; color:  #FF34B3">
<input name="get_Anchor_ignore_keyword_switch" style="vertical-align: text-top;" type="radio" title="勾选后，会从云屏蔽词屏蔽房自动同步到本地，覆盖本地存储">从云屏蔽词屏蔽房自动同步到本地
<br>云地址：<input class="string" style="width:330px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<div data-toggle="get_Anchor_unignore_keyword_switch3">
<append style="font-size: 100%; color:  #FF34B3">
<input name="get_Anchor_unignore_keyword_switch" style="vertical-align: text-top;" type="radio">本地模式
</div>

<div data-toggle="get_Anchor_unignore_keyword_switch1">
<append style="font-size: 100%; color:  #FF34B3">
<input name="get_Anchor_unignore_keyword_switch" style="vertical-align: text-top;" type="radio" title="勾选后，会从云正则关键词自动新增到本地，在本地存储更新添加">从云正则关键词自动新增到本地
</div>
<div data-toggle="get_Anchor_unignore_keyword_switch2">
<append style="font-size: 100%; color:  #FF34B3">
<input name="get_Anchor_unignore_keyword_switch" style="vertical-align: text-top;" type="radio" title="勾选后，会从云正则关键词自动同步到本地，覆盖本地存储">从云正则关键词自动同步到本地
<br>云地址：<input class="string" style="width:330px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<div data-toggle="Anchor_ignore_keyword">
<append style="font-size: 100%;color: #FF34B3" title="没兴趣的奖品，可以按格式加进去,注意是英文逗号！">
奖品名称屏蔽词设置<input class="keyword" style="width: 260px;vertical-align:inherit;" type="text"><button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>

<div data-toggle="Anchor_unignore_keyword">
<append style="font-size: 100%;color: #FF34B3" title="正则关键词，与屏蔽关键词同时存在时，忽略屏蔽词，可以按格式加进去,注意是英文逗号！">
奖品名称正则关键词<input class="keyword" style="width: 260px;vertical-align:inherit;" type="text"><button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>

<div data-toggle="Anchor_ignore_room">
<append style="font-size: 100%;color: #FF34B3" title="主播黑名单，可以按格式加进去,注意是英文逗号！">
直播间真实房间号屏蔽列表<input class="keyword" style="width: 220px;vertical-align:inherit;" type="text"><button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button><br>
<append style="font-size: 100%;color: blue">注：自动参与抽奖只执行一次！
</div>
</fieldset>
`);
                tianxuanshike.find('div[data-toggle="anchor_danmu_content"] .num').val((MY_API.CONFIG.anchor_danmu_content).toString());
                tianxuanshike.find('div[data-toggle="anchor_danmu_content"] [data-action="save"]').click(function () {
                    let val = tianxuanshike.find('div[data-toggle="anchor_danmu_content"] .num').val();
                    if(val == ''){
                        val = '哈哈哈哈哈哈'
                    }
                    MY_API.CONFIG.anchor_danmu_content = val.split(",");
                    MY_API.saveConfig();
                    MY_API.chatLog(`中奖自动弹幕设置：<br>${MY_API.CONFIG.anchor_danmu_content}`);
                });

                if(MY_API.CONFIG.anchor_danmu) tianxuanshike.find('div[data-toggle="anchor_danmu_content"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="anchor_danmu_content"] input:checkbox').change(function () {
                    MY_API.CONFIG.anchor_danmu = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`中奖自动弹幕设置：${MY_API.CONFIG.anchor_danmu}`);
                });

                tianxuanshike.find('div[data-toggle="anchor_msg_content"] .num').val((MY_API.CONFIG.anchor_msg_content).toString());
                tianxuanshike.find('div[data-toggle="anchor_msg_content"] [data-action="save"]').click(function () {
                    let val = tianxuanshike.find('div[data-toggle="anchor_msg_content"] .num').val();
                    if(val == ''){
                        val = '天选中奖了~~'
                    }
                    MY_API.CONFIG.anchor_msg_content = val.split(",");
                    MY_API.saveConfig();
                    MY_API.chatLog(`中奖自动私信设置：<br>${MY_API.CONFIG.anchor_msg_content}`);
                });

                if(MY_API.CONFIG.anchor_msg) tianxuanshike.find('div[data-toggle="anchor_msg_content"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="anchor_msg_content"] input:checkbox').change(function () {
                    MY_API.CONFIG.anchor_msg = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`中奖自动私信设置：${MY_API.CONFIG.anchor_msg}`);
                });

                if(MY_API.CONFIG.AUTO_Anchor) tianxuanshike.find('div[data-toggle="AUTO_Anchor"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="AUTO_Anchor"] input:checkbox').change(function () {
                    MY_API.CONFIG.AUTO_Anchor = $(this).prop('checked');
                    if(MY_API.CONFIG.AUTO_Anchor && !MY_API.CONFIG.get_data_from_server){
                        MY_API.chatLog(`获取服务器直播间抽奖数据未开启，请在设置中开启`, 'warning');
                    }
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动天选设置：${MY_API.CONFIG.AUTO_Anchor}`);
                });

                if(MY_API.CONFIG.require_none) tianxuanshike.find('div[data-toggle="require_none"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="require_none"] input:checkbox').change(function () {
                    MY_API.CONFIG.require_none = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`无要求天选抽奖：${MY_API.CONFIG.require_none}`);
                });

                if(MY_API.CONFIG.Anchor_Followings_switch)tianxuanshike.find('div[data-toggle="Anchor_Followings_switch"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="Anchor_Followings_switch"] input:checkbox').change(async function () { //
                    MY_API.CONFIG.Anchor_Followings_switch = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`仅参与关注主播的抽奖设置：${MY_API.CONFIG.Anchor_Followings_switch}`);
                });

                if(MY_API.CONFIG.gift_anchor_only) tianxuanshike.find('div[data-toggle="gift_anchor_only"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="gift_anchor_only"] input:checkbox').change(async function () { //
                    MY_API.CONFIG.gift_anchor_only = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`仅参与礼物天选抽奖设置：${MY_API.CONFIG.gift_anchor_only}`);
                });

                if(MY_API.CONFIG.Anchor_onlineNum_switch) tianxuanshike.find('div[data-toggle="Anchor_onlineNum_switch"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="Anchor_onlineNum_switch"] input:checkbox').change(function () {
                    MY_API.CONFIG.Anchor_onlineNum_switch = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`在线人数设置：${MY_API.CONFIG.Anchor_onlineNum_switch}`);
                });
                tianxuanshike.find('div[data-toggle="Anchor_onlineNum_switch"] .num').val((MY_API.CONFIG.Anchor_onlineNum.toString()));
                tianxuanshike.find('div[data-toggle="Anchor_onlineNum_switch"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.Anchor_onlineNum = parseInt(tianxuanshike.find('div[data-toggle="Anchor_onlineNum_switch"] .num').val());
                    MY_API.saveConfig();
                    MY_API.chatLog(`在线人数设置：${MY_API.CONFIG.Anchor_onlineNum}`);
                });
                if(MY_API.CONFIG.Anchor_score_auto_dm) tianxuanshike.find('div[data-toggle="Anchor_score_auto_dm"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="Anchor_score_auto_dm"] input:checkbox').change(function () {
                    MY_API.CONFIG.Anchor_score_auto_dm = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动点赞：${MY_API.CONFIG.Anchor_score_auto_dm}！`);
                });
                tianxuanshike.find('div[data-toggle="join_delay"] .num').val((parseInt(MY_API.CONFIG.anchor_join_delay_time)).toString());
                if(MY_API.CONFIG.anchor_join_delay)
                    tianxuanshike.find('div[data-toggle="join_delay"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="join_delay"] [data-action="save"]').click(function () {
                    let val = parseInt(tianxuanshike.find('div[data-toggle="join_delay"] .num').val());
                    MY_API.CONFIG.anchor_join_delay_time = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`间隔设置：${MY_API.CONFIG.anchor_join_delay_time}`);
                });
                tianxuanshike.find('div[data-toggle="join_delay"] input:checkbox').change(function () {
                    MY_API.CONFIG.anchor_join_delay = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`间隔开关设置：${MY_API.CONFIG.anchor_join_delay}`);
                });

                if(MY_API.CONFIG.unusual_check) tianxuanshike.find('div[data-toggle="unusual_check"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="unusual_check"] input:checkbox').change(function () {
                    MY_API.CONFIG.unusual_check = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`天选关注异常设置：${MY_API.CONFIG.unusual_check}`);
                });
                tianxuanshike.find('div[data-toggle="unusual_check"] .num').val(parseInt(MY_API.CONFIG.unusual_stop_delay_time.toString()));
                tianxuanshike.find('div[data-toggle="unusual_check"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.unusual_stop_delay_time = parseInt(tianxuanshike.find('div[data-toggle="unusual_check"] .num').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`天选关注异常暂停设置：${MY_API.CONFIG.unusual_stop_delay_time}`);
                })

                if(MY_API.CONFIG.join_code_check) tianxuanshike.find('div[data-toggle="join_code_check"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="join_code_check"] input:checkbox').change(function () {
                    MY_API.CONFIG.join_code_check = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`天选验证码异常设置：${MY_API.CONFIG.join_code_check}`);
                });
                tianxuanshike.find('div[data-toggle="join_code_check"] .num').val(parseInt(MY_API.CONFIG.join_code_stop_delay_time.toString()));
                tianxuanshike.find('div[data-toggle="join_code_check"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.join_code_stop_delay_time = parseInt(tianxuanshike.find('div[data-toggle="join_code_check"] .num').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`天选验证码异常暂停设置：${MY_API.CONFIG.join_code_stop_delay_time}`);
                })

                tianxuanshike.find('div[data-toggle="gift_anchor_min"] .num').val((Number(MY_API.CONFIG.gift_anchor_min)).toString());
                tianxuanshike.find('div[data-toggle="gift_anchor_min"] [data-action="save"]').click(function () {
                    let val = Number(tianxuanshike.find('div[data-toggle="gift_anchor_min"] .num').val());
                    MY_API.CONFIG.gift_anchor_min = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`总电池下限设置：${MY_API.CONFIG.gift_anchor_min}<br>下限设置开关：${MY_API.CONFIG.gift_anchor_min_switch}`);
                });
                if(MY_API.CONFIG.gift_anchor_min_switch)tianxuanshike.find('div[data-toggle="gift_anchor_min"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="gift_anchor_min"] input:checkbox').change(function () {
                    MY_API.CONFIG.gift_anchor_min_switch = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`总电池下限设置：${MY_API.CONFIG.gift_anchor_min_switch}`);
                });

                //粉丝，金额

                tianxuanshike.find('div[data-toggle="money_min"] .num').val((Number(MY_API.CONFIG.money_min)).toString());
                tianxuanshike.find('div[data-toggle="money_min"] [data-action="save"]').click(function () {
                    let val = Number(tianxuanshike.find('div[data-toggle="money_min"] .num').val());
                    MY_API.CONFIG.money_min = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`奖金下限设置：${MY_API.CONFIG.money_min}<br>奖金下限设置：${MY_API.CONFIG.money_switch}`);
                });
                if(MY_API.CONFIG.money_switch)tianxuanshike.find('div[data-toggle="money_min"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="money_min"] input:checkbox').change(function () {
                    MY_API.CONFIG.money_switch = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`奖金下限设置：${MY_API.CONFIG.money_switch}`);
                });

                tianxuanshike.find('div[data-toggle="fans_min"] .num').val((parseInt(MY_API.CONFIG.fans_min)).toString());
                tianxuanshike.find('div[data-toggle="fans_min"] [data-action="save"]').click(function () {
                    let val = parseInt(tianxuanshike.find('div[data-toggle="fans_min"] .num').val());
                    MY_API.CONFIG.fans_min = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`粉丝下限设置：${MY_API.CONFIG.fans_min}`);
                });
                if(MY_API.CONFIG.fans_switch)tianxuanshike.find('div[data-toggle="fans_min"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="fans_min"] input:checkbox').change(function () {
                    MY_API.CONFIG.fans_switch = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`粉丝下限设置：${MY_API.CONFIG.fans_switch}`);
                });

                if(MY_API.CONFIG.no_money_checkbox)tianxuanshike.find('div[data-toggle="no_money_checkbox"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="no_money_checkbox"] input:checkbox').change(function () {
                    MY_API.CONFIG.no_money_checkbox = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`仅现金及正则参与抽奖设置：${MY_API.CONFIG.no_money_checkbox}`);
                });

                tianxuanshike.find('div[data-toggle="gift_price"] .num').val((parseInt(MY_API.CONFIG.gift_price)).toString());
                tianxuanshike.find('div[data-toggle="Anchor_ignore_keyword"] .keyword').val(MY_API.CONFIG.Anchor_ignore_keyword);
                tianxuanshike.find('div[data-toggle="Anchor_unignore_keyword"] .keyword').val(MY_API.CONFIG.Anchor_unignore_keyword);
                tianxuanshike.find('div[data-toggle="Anchor_ignore_room"] .keyword').val(MY_API.CONFIG.Anchor_ignore_room);
                tianxuanshike.find('div[data-toggle="gift_price"] [data-action="save"]').click(function () {
                    let val = parseInt(tianxuanshike.find('div[data-toggle="gift_price"] .num').val());
                    if(val == ''){
                        val = 0
                    }
                    if(MY_API.CONFIG.gift_price === val){
                        MY_API.chatLog('改都没改保存嘛呢');
                        return
                    }
                    MY_API.CONFIG.gift_price = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`【天选时刻】金瓜子投喂上限：${MY_API.CONFIG.gift_price}。<br>理性消费，1电池=100金瓜子=1毛钱`);
                });

                tianxuanshike.find('div[data-toggle="Anchor_ignore_keyword"] [data-action="save"]').click(function () {
                    let val = tianxuanshike.find('div[data-toggle="Anchor_ignore_keyword"] .keyword').val();
                    if(val == ''){
                        val = '不会吧不会吧居然真有人什么都不过滤'
                    }
                    MY_API.CONFIG.Anchor_ignore_keyword = val.split(",");
                    let word=[]
                    for(let i = 0; i < MY_API.CONFIG.Anchor_ignore_keyword.length; i++){//本地去重、去空格、去空、转小写
                        if(MY_API.CONFIG.Anchor_ignore_keyword[i] == '')continue
                        if(word.indexOf(MY_API.CONFIG.Anchor_ignore_keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && MY_API.CONFIG.Anchor_ignore_keyword[i]){
                            word.push(MY_API.CONFIG.Anchor_ignore_keyword[i].replaceAll(' ', '').toLowerCase())
                        }
                    }
                    MY_API.CONFIG.Anchor_ignore_keyword = word
                    MY_API.saveConfig();
                    MY_API.chatLog(`【天选时刻】屏蔽过滤关键词已设置：<br>${MY_API.CONFIG.Anchor_ignore_keyword}`);

                });

                tianxuanshike.find('div[data-toggle="Anchor_unignore_keyword"] [data-action="save"]').click(function () {
                    let val = tianxuanshike.find('div[data-toggle="Anchor_unignore_keyword"] .keyword').val();
                    if(val == ''){
                        val = '正则关键词'
                    }
                    MY_API.CONFIG.Anchor_unignore_keyword = val.split(",");
                    let word=[]
                    for(let i = 0; i < MY_API.CONFIG.Anchor_unignore_keyword.length; i++){//本地去重、去空格、去空
                        if(MY_API.CONFIG.Anchor_unignore_keyword[i] == '')continue
                        if(word.indexOf(MY_API.CONFIG.Anchor_unignore_keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && MY_API.CONFIG.Anchor_unignore_keyword[i]){
                            word.push(MY_API.CONFIG.Anchor_unignore_keyword[i].replaceAll(' ', '').toLowerCase())
                        }
                    }
                    MY_API.CONFIG.Anchor_unignore_keyword = word
                    MY_API.saveConfig();
                    MY_API.chatLog(`【天选时刻】正则关键词已设置：<br>${MY_API.CONFIG.Anchor_unignore_keyword}`);

                });

                tianxuanshike.find('div[data-toggle="Anchor_ignore_room"] [data-action="save"]').click(function () {
                    let val = tianxuanshike.find('div[data-toggle="Anchor_ignore_room"] .keyword').val();
                    if(val == ''){
                        MY_API.CONFIG.Anchor_ignore_room = [1234567890]
                        MY_API.saveConfig();
                        MY_API.chatLog(`【天选时刻】主播黑名单已设置：<br>${MY_API.CONFIG.Anchor_ignore_room}`);
                        return
                    }
                    let word = val.split(",");
                    let list = []
                    for(let i = 0; i < word.length; i++){
                        if(word[i] == '')continue
                        if(list.indexOf(Number(word[i].replaceAll(' ', ''))) == -1){
                            list.push(Number(word[i].replaceAll(' ', '')))
                        }
                    }
                    MY_API.CONFIG.Anchor_ignore_room = list
                    MY_API.saveConfig();
                    MY_API.chatLog(`【天选时刻】主播黑名单已设置：<br>${MY_API.CONFIG.Anchor_ignore_room}`);
                });
                if(MY_API.CONFIG.Anchor_cur_gift_num)tianxuanshike.find('div[data-toggle="Anchor_cur_gift_num"] input').attr('checked', '');
                tianxuanshike.find('div[data-toggle="Anchor_cur_gift_num"] input:checkbox').change(function () {
                    MY_API.CONFIG.Anchor_cur_gift_num = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`金瓜子抽奖设置：${MY_API.CONFIG.Anchor_cur_gift_num}`);
                    MY_API.chatLog('【天选时刻】已手动参与的金瓜子抽奖，脚本巡检到将不再次参与！', 'warning');
                });

                tianxuanshike.find('div[data-toggle="BKL_check"] [data-action="save"]').click(function () {
                    $('.zdbgjget_medal').toggle()
                });

                if(MY_API.CONFIG.get_Anchor_ignore_keyword_switch3)tianxuanshike.find('div[data-toggle="get_Anchor_ignore_keyword_switch3"] input:radio').attr('checked', '');
                tianxuanshike.find('div[data-toggle="get_Anchor_ignore_keyword_switch3"] input:radio').change(function () {
                    MY_API.CONFIG.get_Anchor_ignore_keyword_switch3 = $(this).prop('checked');
                    MY_API.CONFIG.get_Anchor_ignore_keyword_switch2 = !MY_API.CONFIG.get_Anchor_ignore_keyword_switch3
                    MY_API.CONFIG.get_Anchor_ignore_keyword_switch1 = !MY_API.CONFIG.get_Anchor_ignore_keyword_switch3
                    MY_API.saveConfig()
                    MY_API.chatLog(`屏蔽词获取设置（本地模式）：${MY_API.CONFIG.get_Anchor_ignore_keyword_switch3}`);
                });
                if(MY_API.CONFIG.get_Anchor_ignore_keyword_switch1)tianxuanshike.find('div[data-toggle="get_Anchor_ignore_keyword_switch1"] input:radio').attr('checked', '');
                tianxuanshike.find('div[data-toggle="get_Anchor_ignore_keyword_switch1"] input:radio').change(function () {
                    MY_API.CONFIG.get_Anchor_ignore_keyword_switch1 = $(this).prop('checked');
                    MY_API.CONFIG.get_Anchor_ignore_keyword_switch2 = !MY_API.CONFIG.get_Anchor_ignore_keyword_switch1
                    MY_API.CONFIG.get_Anchor_ignore_keyword_switch3 = !MY_API.CONFIG.get_Anchor_ignore_keyword_switch1
                    MY_API.saveConfig()
                    MY_API.chatLog(`屏蔽词获取设置（云更新模式）：${MY_API.CONFIG.get_Anchor_ignore_keyword_switch1}`);
                });
                if(MY_API.CONFIG.get_Anchor_ignore_keyword_switch2)tianxuanshike.find('div[data-toggle="get_Anchor_ignore_keyword_switch2"] input:radio').attr('checked', '');
                tianxuanshike.find('div[data-toggle="get_Anchor_ignore_keyword_switch2"] input:radio').change(async function () {
                    MY_API.CONFIG.get_Anchor_ignore_keyword_switch2 = $(this).prop('checked');
                    MY_API.CONFIG.get_Anchor_ignore_keyword_switch1 = !MY_API.CONFIG.get_Anchor_ignore_keyword_switch2
                    MY_API.CONFIG.get_Anchor_ignore_keyword_switch3 = !MY_API.CONFIG.get_Anchor_ignore_keyword_switch2
                    MY_API.saveConfig()
                    MY_API.chatLog(`屏蔽词获取设置（云同步模式）：${MY_API.CONFIG.get_Anchor_ignore_keyword_switch2}`);
                    await sleep(2000)
                    if(MY_API.CONFIG.get_Anchor_ignore_keyword_switch2){
                        let r = confirm("注意！点击确定后，云屏蔽词会同步到本地，覆盖本地数据!");
                        if(r == true){
                            let keyword = []
                            if(MY_API.CONFIG.gitee_url == '0' || !MY_API.CONFIG.gitee_url)return MY_API.chatLog(`【屏蔽词/房】无云数据地址！`,'warning');
                            let gitee_ignore_keyword = await getMyJson(MY_API.CONFIG.gitee_url);
                            if(gitee_ignore_keyword[0]== undefined){
                                return MY_API.chatLog(`无云数据或获取异常！`,'warning');
                            }else{
                                keyword = gitee_ignore_keyword
                            }
                            MY_API.CONFIG.Anchor_ignore_keyword = []
                            MY_API.CONFIG.Anchor_ignore_room = []
                            for(let i = 0; i < keyword.length; i++){ //去重、分类、去空格、去空、转小写
                                if(keyword[i]=='')continue
                                if(MY_API.CONFIG.Anchor_ignore_keyword.indexOf(keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && isNaN(Number(keyword[i])) && Number(keyword[i])!=0){ //非数字则为屏蔽词
                                    MY_API.CONFIG.Anchor_ignore_keyword.push(keyword[i].replaceAll(' ', '').toLowerCase())
                                }
                                if(!isNaN(Number(keyword[i])) && MY_API.CONFIG.Anchor_ignore_room.indexOf(Number(keyword[i])) == -1 && Number(keyword[i])!=0){ //数字则为屏蔽房
                                    MY_API.CONFIG.Anchor_ignore_room.push(Number(keyword[i]))
                                }
                            }
                            MY_API.saveConfig()
                            tianxuanshike.find('div[data-toggle="Anchor_ignore_keyword"] .keyword').val(MY_API.CONFIG.Anchor_ignore_keyword);
                            tianxuanshike.find('div[data-toggle="Anchor_ignore_room"] .keyword').val(MY_API.CONFIG.Anchor_ignore_room);
                            MY_API.chatLog(`已同步屏蔽词：${MY_API.CONFIG.Anchor_ignore_keyword}<br>已同步屏蔽房：${MY_API.CONFIG.Anchor_ignore_room}`);
                        }
                    }
                });

                tianxuanshike.find('div[data-toggle="get_Anchor_ignore_keyword_switch2"] .string').val((MY_API.CONFIG.gitee_url).toString());
                tianxuanshike.find('div[data-toggle="get_Anchor_ignore_keyword_switch2"] [data-action="save"]').click(function () {
                    let str = tianxuanshike.find('div[data-toggle="get_Anchor_ignore_keyword_switch2"] .string').val()
                    MY_API.CONFIG.gitee_url = str
                    MY_API.saveConfig()
                    MY_API.chatLog(`云数据地址：${MY_API.CONFIG.gitee_url}`);
                });

                if(MY_API.CONFIG.get_Anchor_unignore_keyword_switch3)tianxuanshike.find('div[data-toggle="get_Anchor_unignore_keyword_switch3"] input:radio').attr('checked', '');
                tianxuanshike.find('div[data-toggle="get_Anchor_unignore_keyword_switch3"] input:radio').change(function () {
                    MY_API.CONFIG.get_Anchor_unignore_keyword_switch3 = $(this).prop('checked');
                    MY_API.CONFIG.get_Anchor_unignore_keyword_switch1 = !MY_API.CONFIG.get_Anchor_unignore_keyword_switch3
                    MY_API.CONFIG.get_Anchor_unignore_keyword_switch2 = !MY_API.CONFIG.get_Anchor_unignore_keyword_switch3
                    MY_API.saveConfig()
                    MY_API.chatLog(`正则关键词获取设置（本地模式）：${MY_API.CONFIG.get_Anchor_unignore_keyword_switch3}`);
                });
                if(MY_API.CONFIG.get_Anchor_unignore_keyword_switch1)tianxuanshike.find('div[data-toggle="get_Anchor_unignore_keyword_switch1"] input:radio').attr('checked', '');
                tianxuanshike.find('div[data-toggle="get_Anchor_unignore_keyword_switch1"] input:radio').change(function () {
                    MY_API.CONFIG.get_Anchor_unignore_keyword_switch1 = $(this).prop('checked');
                    MY_API.CONFIG.get_Anchor_unignore_keyword_switch2 = !MY_API.CONFIG.get_Anchor_unignore_keyword_switch1
                    MY_API.CONFIG.get_Anchor_unignore_keyword_switch3 = !MY_API.CONFIG.get_Anchor_unignore_keyword_switch1
                    MY_API.saveConfig()
                    MY_API.chatLog(`正则关键词获取设置（云更新模式）：${MY_API.CONFIG.get_Anchor_unignore_keyword_switch1}`);
                });
                if(MY_API.CONFIG.get_Anchor_unignore_keyword_switch2)tianxuanshike.find('div[data-toggle="get_Anchor_unignore_keyword_switch2"] input:radio').attr('checked', '');
                tianxuanshike.find('div[data-toggle="get_Anchor_unignore_keyword_switch2"] input:radio').change(async function () {
                    MY_API.CONFIG.get_Anchor_unignore_keyword_switch2 = $(this).prop('checked');
                    MY_API.CONFIG.get_Anchor_unignore_keyword_switch1 = !MY_API.CONFIG.get_Anchor_unignore_keyword_switch2
                    MY_API.CONFIG.get_Anchor_unignore_keyword_switch3 = !MY_API.CONFIG.get_Anchor_unignore_keyword_switch2
                    MY_API.saveConfig()
                    MY_API.chatLog(`正则关键词获取设置（云同步模式）：${MY_API.CONFIG.get_Anchor_unignore_keyword_switch2}`);
                    await sleep(2000)
                    if(MY_API.CONFIG.get_Anchor_unignore_keyword_switch2){
                        let r = confirm("注意！点击确定后，正则关键词会同步到本地，覆盖本地数据!");
                        if(r == true){
                            let keyword = []
                            if(MY_API.CONFIG.gitee_url2 == '0' || !MY_API.CONFIG.gitee_url2)return MY_API.chatLog(`【正则关键词】无云数据地址！`,'warning');
                            let gitee_unignore_keyword = await getMyJson(MY_API.CONFIG.gitee_url2);
                            if(gitee_unignore_keyword[0]== undefined){
                                return MY_API.chatLog(`无云数据或获取异常！`,'warning');
                            }else{
                                keyword = gitee_unignore_keyword
                            }
                            MY_API.CONFIG.Anchor_unignore_keyword = []
                            for(let i = 0; i < keyword.length; i++){ //去重、分类、去空格、去空、转小写
                                if(keyword[i]=='')continue
                                if(MY_API.CONFIG.Anchor_unignore_keyword.indexOf(keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && isNaN(Number(keyword[i])) && Number(keyword[i])!=0){ //非数字则为屏蔽词
                                    MY_API.CONFIG.Anchor_unignore_keyword.push(keyword[i].replaceAll(' ', '').toLowerCase())
                                }
                            }
                            MY_API.saveConfig()
                            tianxuanshike.find('div[data-toggle="Anchor_unignore_keyword"] .keyword').val(MY_API.CONFIG.Anchor_unignore_keyword);
                            MY_API.chatLog(`已同步正则关键词：${MY_API.CONFIG.Anchor_unignore_keyword}`);
                        }
                    }
                });

                tianxuanshike.find('div[data-toggle="get_Anchor_unignore_keyword_switch2"] .string').val((MY_API.CONFIG.gitee_url2).toString());
                tianxuanshike.find('div[data-toggle="get_Anchor_unignore_keyword_switch2"] [data-action="save"]').click(function () {
                    let str = tianxuanshike.find('div[data-toggle="get_Anchor_unignore_keyword_switch2"] .string').val()
                    MY_API.CONFIG.gitee_url2 = str
                    MY_API.saveConfig()
                    MY_API.chatLog(`云数据地址：${MY_API.CONFIG.gitee_url2}`);
                });
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(tianxuanshike);


                let dongtai = $("<div class='zdbgjdongtai'>");//动态页
                dongtai.css(div_css);

                dongtai.append(`

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【官方动态及预约抽奖】</legend>
<div data-toggle="use_old_repost_api">
<append style="font-size: 100%; color: #FF34B3" title="动态抽奖使用旧动态转发接口">
<input style="vertical-align: text-top;" type="checkbox">动态抽奖使用旧动态转发接口
</div>

<div data-toggle="dynamic_lottery_up_move">
<append style="font-size: 100%; color: #FF34B3" title="转发抽奖后自动移动到动态分组">
<input style="vertical-align: text-top;" type="checkbox">转发抽奖后自动移动到动态分组
</div>

<div data-toggle="not_office_dynamic_only_modify">
<append style="font-size: 100%; color: #FF34B3" title="仅参与已关注的动态抽奖">
<input style="vertical-align: text-top;" type="checkbox" >仅参与已关注的动态抽奖<br>
<append style="font-size: 100%;color:blue;">注：该选项仅是对以下两项动态抽奖的附加限制，自动转发抽奖生效需勾选至少以下两种动态抽奖的其中一种。
</div>

<div data-toggle="detail_by_lid_dynamic">
<append style="font-size: 100%; color: #FF34B3" title="自动参与全部最新的官方抽奖工具的动态抽奖，会增加关注">
<input id="detail_by_lid_dynamic" style="vertical-align: text-top;" type="checkbox" >自动参与群主收集官方动态抽奖
</div>

<div data-toggle="not_office_dynamic_go">
<append style="font-size: 100%; color: #FF34B3" title="自动参与某个人近期专栏的全部动态抽奖，包括官方的非官方的，会增加关注！">
<input style="vertical-align: text-top;" type="checkbox" >参与某个人专栏的全部动态抽奖<br>
专栏作者的UID列表：<input class="num1" style="width: 260px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button><br>
专栏标题关键词列表：<input class="num2" style="width: 260px;vertical-align:inherit;" type="text">
<button data-action="save1" style="font-size: 100%;color:  #FF34B3">保存</button><br>

<append style="font-size: 100%;color:blue;">运行机制：筛选专栏作者的UID列表内所有作者的24小内标题含有【标题关键词】的专栏，提取专栏内的动态网址并转评赞，官方动态抽奖不评论。<br>由于专栏大都是主要是近期开奖动态，偶尔转发量少属于正常情况。
</div>

<div data-toggle="detail_by_lid_live">
<append style="font-size: 100%; color: #FF34B3" title="自动参与直播预约抽奖，不需要关注">
<input id="detail_by_lid_live" style="vertical-align: text-top;" type="checkbox" >自动参与群主收集全部直播预约抽奖
</div>

<div data-toggle="detail_by_lid_live_fans">
<append style="font-size: 100%; color: #FF34B3" title="自动参与直播预约抽奖，不需要关注">
<input id="detail_by_lid_live_fans" style="vertical-align: text-top;" type="checkbox" >自动参与群主收集已关注的直播预约抽奖
</div>


<div data-toggle="detail_by_lid_live_ignore">
<append style="font-size: 100%; color: #FF34B3" title="勾选使用天选时刻屏蔽词">
<input style="vertical-align: text-top;" type="checkbox" >预约直播抽奖应用天选抽奖屏蔽
</div>

<div data-toggle="detail_by_lid_flash">
<append style="font-size: 100%; color:  #FF34B3" title="直播预约抽奖、转发抽奖的最小间隔！">
转发参与间隔：<input class="num" style="width: 50px;vertical-align:inherit;" type="text">秒
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<div data-toggle="AUTO_dynamic_create2">
<append style="font-size: 100%; color:  #FF34B3" title="自动发动态及间隔">
<input style="vertical-align: text-top;" type="checkbox" >自动转发视频投稿动态
</div>

<div data-toggle="AUTO_dynamic_create">
<append style="font-size: 100%; color:  #FF34B3" title="自动发动态及间隔">
<input style="vertical-align: text-top;" type="checkbox" >自动发送文库文字动态<br>
文字动态或投稿转发间隔：<input class="num" style="width:30px;vertical-align:inherit;" type="text">分
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>


<div data-toggle="AUTO_dynamic_del">
<append style="font-size: 100%; color:  #FF34B3" title="删除旧动态">
【手动点击执行】删除<input class="num" style="width:30px;vertical-align:inherit;" type="text">天前的所有动态
<button data-action="save" style="font-size: 100%;color:  #FF34B3">立即执行</button>
</div>
</fieldset>

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【批量检查官方抽奖中奖情况】</legend>
<div data-toggle="lottery_result_uid_list">
<append style="font-size: 100%; color:  #FF34B3" title="动态抽奖、预约抽奖、动态红包">
UID列表：<input class="num1" style="width:340px;vertical-align:inherit;" type="text"><br>
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
<button id="jindu" data-action="save1" style="font-size: 100%;color:  #FF34B3">立即执行</button>
<button data-action="save2" style="font-size: 100%;color:  #FF34B3">显示结果</button>
</div>
</fieldset>

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【随机文库】</legend>
<div data-toggle="zdydj_bendi">
<append style="font-size: 100%; color: #FF34B3" title="本地自定义短句">
<input style="vertical-align: text-top;" type="checkbox" >本地自定义短句：<br>
<input class="url" style="width:320px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<div data-toggle="zdydj">
<append style="font-size: 100%; color: #FF34B3" title="自定义短句">
<input style="vertical-align: text-top;" type="checkbox" >自定义云短句<br>
云地址：<input class="url" style="width:330px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
<a target="_blank" href="https://www.bilibili.com/video/BV1t341167Fw"><button style="font-size: 100%;color:  #FF34B3">教程</button></a>
</div>

<div data-toggle="gsc">
<append style="font-size: 100%; color: #FF34B3" title="古诗词短句">
<input style="vertical-align: text-top;" type="checkbox" >古诗词短句近千条
</div>

<div data-toggle="yyw">
<append style="font-size: 100%; color: #FF34B3" title="古诗词短句">
<input style="vertical-align: text-top;" type="checkbox" >一言文短句近千条
</div>

<div data-toggle="chp">
<append style="font-size: 100%; color: #FF34B3" title="彩虹屁短句">
<input style="vertical-align: text-top;" type="checkbox" >彩虹屁短句近千条<br>
<button id="soup_length" data-action="save" style="font-size: 100%;color:  #FF34B3">立即重载随机文库</button><br>
<append style="font-size: 100%;color:blue;">注：适用于自动发动态、动态抽奖评论、视频评论抽奖、直播弹幕抽奖！
</div>
</fieldset>
`)

                if(MY_API.CONFIG.use_old_repost_api)dongtai.find('div[data-toggle="use_old_repost_api"] input').attr('checked', '');
                if(MY_API.CONFIG.dynamic_lottery_up_move)dongtai.find('div[data-toggle="dynamic_lottery_up_move"] input').attr('checked', '');
                if(MY_API.CONFIG.detail_by_lid_dynamic)dongtai.find('div[data-toggle="detail_by_lid_dynamic"] input').attr('checked', '');
                dongtai.find('div[data-toggle="use_old_repost_api"] input:checkbox').change(async function () {
                    MY_API.CONFIG.use_old_repost_api = $(this).prop('checked');
                    MY_API.saveConfig();
                    MY_API.chatLog(`动态抽奖转发使用旧接口：${MY_API.CONFIG.use_old_repost_api}`);
                })
                dongtai.find('div[data-toggle="detail_by_lid_dynamic"] input:checkbox').change(async function () {
                    MY_API.CONFIG.detail_by_lid_dynamic = $(this).prop('checked');
                    if(MY_API.CONFIG.detail_by_lid_dynamic){
                        if(!dynamic_lottery_tags_tagid){
                            await BAPI.tag_create('动态抽奖').then(async(data) => {//创建分组
                                //console.log(data)
                                if(data.code == 0){
                                    MY_API.chatLog(`【动态抽奖】动态抽奖分组创建成功！`);
                                }
                                if(data.code == 22106){
                                    MY_API.chatLog(`【动态抽奖】动态抽奖分组:${data.message}`);
                                }
                            });
                            dynamic_lottery_tags_tagid = 0
                            await BAPI.get_tags().then(async(data) => {//获取分组ID
                                let tags_data = data.data
                                for(let i = 0; i < tags_data.length; i++){
                                    if(tags_data[i].name == '动态抽奖')
                                        dynamic_lottery_tags_tagid = tags_data[i].tagid
                                }
                            })
                        }
                    }
                    MY_API.saveConfig();
                    MY_API.chatLog(`全动态抽奖：${MY_API.CONFIG.detail_by_lid_dynamic}`);
                })
                dongtai.find('div[data-toggle="dynamic_lottery_up_move"] input:checkbox').change(async function () {
                    MY_API.CONFIG.dynamic_lottery_up_move = $(this).prop('checked');
                    MY_API.saveConfig();
                    MY_API.chatLog(`自动移动分组设置：${MY_API.CONFIG.dynamic_lottery_up_move}`);
                })

                if(MY_API.CONFIG.detail_by_lid_live)dongtai.find('div[data-toggle="detail_by_lid_live"] input').attr('checked', '');
                dongtai.find('div[data-toggle="detail_by_lid_live"] input:checkbox').change(async function () {
                    MY_API.CONFIG.detail_by_lid_live = $(this).prop('checked');
                    if(MY_API.CONFIG.detail_by_lid_live_fans)document.getElementById("detail_by_lid_live_fans").click()
                    MY_API.saveConfig()
                    MY_API.chatLog(`预约抽奖设置：${MY_API.CONFIG.detail_by_lid_live}`);
                })
                if(MY_API.CONFIG.detail_by_lid_live_fans)dongtai.find('div[data-toggle="detail_by_lid_live_fans"] input').attr('checked', '');
                dongtai.find('div[data-toggle="detail_by_lid_live_fans"] input:checkbox').change(async function () {
                    MY_API.CONFIG.detail_by_lid_live_fans = $(this).prop('checked');
                    if(MY_API.CONFIG.detail_by_lid_live)document.getElementById("detail_by_lid_live").click()
                    MY_API.saveConfig()
                    MY_API.chatLog(`预约抽奖设置仅关注：${MY_API.CONFIG.detail_by_lid_live_fans}`);
                })

                if(MY_API.CONFIG.not_office_dynamic_only_modify)dongtai.find('div[data-toggle="not_office_dynamic_only_modify"] input').attr('checked', '');
                dongtai.find('div[data-toggle="not_office_dynamic_only_modify"] input:checkbox').change(async function () {
                    MY_API.CONFIG.not_office_dynamic_only_modify = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`专栏动态设置：${MY_API.CONFIG.not_office_dynamic_only_modify}`);
                })
                if(MY_API.CONFIG.not_office_dynamic_go)dongtai.find('div[data-toggle="not_office_dynamic_go"] input').attr('checked', '');
                dongtai.find('div[data-toggle="not_office_dynamic_go"] input:checkbox').change(async function () {
                    MY_API.CONFIG.not_office_dynamic_go = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`专栏动态设置：${MY_API.CONFIG.not_office_dynamic_go}<br>注：非官方动态抽奖往往附加很多要求，可能不能达到要求，目前仅做统一关注、点赞、转发、评论处理。抽奖信息来源：某专栏。`);
                })
                if(MY_API.CONFIG.space_article_uid[0] == undefined || MY_API.CONFIG.space_article_uid[0] < 10){
                    let dd = Number(MY_API.CONFIG.space_article_uid)
                    MY_API.CONFIG.space_article_uid = []
                    MY_API.CONFIG.space_article_uid.push(dd)
                    MY_API.saveConfig();
                }
                dongtai.find('div[data-toggle="not_office_dynamic_go"] .num1').val(MY_API.CONFIG.space_article_uid.toString());
                dongtai.find('div[data-toggle="not_office_dynamic_go"] [data-action="save"]').click(function () {
                    let val = dongtai.find('div[data-toggle="not_office_dynamic_go"] .num1').val()
                    val = val.replaceAll(' ', '').replaceAll('，', ',').split(",");
                    let keyword = []
                    for(let i = 0; i < val.length; i++){
                        if(val[i]=='')continue
                        if(keyword.indexOf(val[i]) == -1 && !isNaN(val[i]) && Number(val[i])!=0){
                            keyword.push(Number(val[i]))
                        }
                    }
                    MY_API.CONFIG.space_article_uid = keyword;
                    dongtai.find('div[data-toggle="not_office_dynamic_go"] .num1').val(MY_API.CONFIG.space_article_uid.toString());
                    MY_API.saveConfig();
                    MY_API.chatLog(`专栏作者UID列表：${MY_API.CONFIG.space_article_uid}`);
                });

                dongtai.find('div[data-toggle="not_office_dynamic_go"] .num2').val(MY_API.CONFIG.space_article_title.toString());
                dongtai.find('div[data-toggle="not_office_dynamic_go"] [data-action="save1"]').click(function () {
                    let val = dongtai.find('div[data-toggle="not_office_dynamic_go"] .num2').val()
                    val = val.replaceAll(' ', '').replaceAll('，', ',').split(",");
                    let keyword = []
                    for(let i = 0; i < val.length; i++){
                        if(val[i]=='')continue
                        if(keyword.indexOf(val[i]) == -1){
                            keyword.push(val[i])
                        }
                    }
                    MY_API.CONFIG.space_article_title = keyword;
                    if(MY_API.CONFIG.space_article_title.length == 0)MY_API.CONFIG.space_article_title = ['互动抽奖']
                    dongtai.find('div[data-toggle="not_office_dynamic_go"] .num2').val(MY_API.CONFIG.space_article_title.toString());
                    MY_API.saveConfig();
                    MY_API.chatLog(`专栏标题关键词列表：${MY_API.CONFIG.space_article_title}`);
                });


                if(MY_API.CONFIG.detail_by_lid_live_ignore)dongtai.find('div[data-toggle="detail_by_lid_live_ignore"] input').attr('checked', '');
                dongtai.find('div[data-toggle="detail_by_lid_live_ignore"] input:checkbox').change(async function () {
                    MY_API.CONFIG.detail_by_lid_live_ignore = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`预约抽奖屏蔽词/房生效：${MY_API.CONFIG.detail_by_lid_live_ignore}`);
                })
                dongtai.find('div[data-toggle="detail_by_lid_flash"] .num').val(((MY_API.CONFIG.detail_by_lid_flash)).toString());
                dongtai.find('div[data-toggle="detail_by_lid_flash"] [data-action="save"]').click(function () {
                    let val = parseInt(dongtai.find('div[data-toggle="detail_by_lid_flash"] .num').val());
                    MY_API.CONFIG.detail_by_lid_flash = val;
                    MY_API.saveConfig()
                    MY_API.chatLog(`预约动态抽奖间隔设置：${MY_API.CONFIG.detail_by_lid_flash}`);
                })


                dongtai.find('div[data-toggle="AUTO_dynamic_create"] .num').val((parseInt(MY_API.CONFIG.AUTO_dynamic_create_flash)).toString());
                dongtai.find('div[data-toggle="AUTO_dynamic_create"] [data-action="save"]').click(function () {
                    let val = parseInt(dongtai.find('div[data-toggle="AUTO_dynamic_create"] .num').val());
                    if(val < 3) val = 3
                    MY_API.CONFIG.AUTO_dynamic_create_flash = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`自动发动态间隔已设置：${MY_API.CONFIG.AUTO_dynamic_create}<br>自动发动态间隔为随机：${val}-${1.25 * val}分钟`);
                });

                if(MY_API.CONFIG.AUTO_dynamic_create2)dongtai.find('div[data-toggle="AUTO_dynamic_create2"] input').attr('checked', '');
                dongtai.find('div[data-toggle="AUTO_dynamic_create2"] input:checkbox').change(async function () {
                    MY_API.CONFIG.AUTO_dynamic_create2 = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动转发视频投稿设置：${MY_API.CONFIG.AUTO_dynamic_create2}`);
                });

                if(MY_API.CONFIG.AUTO_dynamic_create)dongtai.find('div[data-toggle="AUTO_dynamic_create"] input').attr('checked', '');
                dongtai.find('div[data-toggle="AUTO_dynamic_create"] input:checkbox').change(async function () {
                    MY_API.CONFIG.AUTO_dynamic_create = $(this).prop('checked');
                    if(MY_API.CONFIG.AUTO_dynamic_create || MY_API.CONFIG.not_office_dynamic_go){
                        if(!MY_API.CONFIG.gsc && !MY_API.CONFIG.yyw && !MY_API.CONFIG.chp &&!MY_API.CONFIG.zdydj && !MY_API.CONFIG.zdydj_bendi) MY_API.CONFIG.gsc = true
                        let gsc_list = [],yyw_list = [],chp_list = [],zdydj_list = []
                        if(MY_API.CONFIG.gsc){
                            MY_API.chatLog('正在载入古诗词！')
                            gsc_list = await getMyJson("http://flyx.fun:1369/static/gsc.json");
                            if(gsc_list[0] == undefined || gsc_list.length == 0) return
                            MY_API.chatLog('载入古诗词完成！')
                            MY_API.chatLog(`古诗词:${gsc_list.length}条！`)
                            await sleep(2000)
                        }
                        if(MY_API.CONFIG.yyw){
                            MY_API.chatLog('正在载入一言文！')
                            yyw_list = await getMyJson("http://flyx.fun:1369/static/yyw.json");
                            if(yyw_list[0] == undefined || yyw_list.length == 0) return
                            MY_API.chatLog('载入一言文完成！')
                            MY_API.chatLog(`一言文:${yyw_list.length}条！`)

                        }
                        if(MY_API.CONFIG.chp){
                            MY_API.chatLog('正在载入彩虹屁！')
                            chp_list = await getMyJson("http://flyx.fun:1369/static/chp.json");
                            if(chp_list[0] == undefined || chp_list.length == 0) return
                            MY_API.chatLog('载入彩虹屁完成！')
                            MY_API.chatLog(`彩虹屁:${chp_list.length}条！`)
                        }
                        if(MY_API.CONFIG.zdydj && MY_API.CONFIG.zdydj_url){
                            MY_API.chatLog('正在载入自定义短句！')
                            zdydj_list = await getMyJson(MY_API.CONFIG.zdydj_url);
                            if(zdydj_list[0] == undefined || zdydj_list.length == 0) return
                            MY_API.chatLog('自定义短句完成！')
                            MY_API.chatLog(`自定义短句${zdydj_list.length}条！`)
                            await sleep(2000)
                        }
                        poison_chicken_soup = []
                        poison_chicken_soup = [].concat(gsc_list).concat(yyw_list).concat(chp_list).concat(zdydj_list)
                        if(MY_API.CONFIG.zdydj_bendi)poison_chicken_soup = poison_chicken_soup.concat(MY_API.CONFIG.bendi_zdydj)
                        MY_API.saveConfig();
                        MY_API.chatLog(`当前随机文库:${poison_chicken_soup.length}条！`)
                    }
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动发动态间隔已设置：${MY_API.CONFIG.AUTO_dynamic_create}`);
                });

                dongtai.find('div[data-toggle="lottery_result_uid_list"] .num1').val(((MY_API.CONFIG.lottery_result_uid_list)).toString());
                dongtai.find('div[data-toggle="lottery_result_uid_list"] [data-action="save2"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = true
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg'); //通过id获取该div
                    dt.innerHTML = dynamic_msg
                })
                dongtai.find('div[data-toggle="lottery_result_uid_list"] [data-action="save"]').click(async function () {
                    let val = (dongtai.find('div[data-toggle="lottery_result_uid_list"] .num1').val());
                    if(val == ''){
                        MY_API.CONFIG.lottery_result_uid_list = [Live_info.uid]
                    }else{
                        let word = val.split(",");
                        let list = []
                        for(let i = 0; i < word.length; i++){
                            if(list.indexOf(Number(word[i].replaceAll(' ', ''))) == -1 && word[i] && Number(word[i]) != 0){
                                list.push(Number(word[i].replaceAll(' ', '')))
                            }
                        }
                        if(list.indexOf(Live_info.uid)==-1)list.push(Live_info.uid)
                        MY_API.CONFIG.lottery_result_uid_list = list
                    }
                    MY_API.saveConfig();
                    MY_API.chatLog(`官方抽奖检查设置：<br>${MY_API.CONFIG.lottery_result_uid_list}`);
                })
                let lottery_result_uid_list_runmark = true
                dongtai.find('div[data-toggle="lottery_result_uid_list"] [data-action="save1"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = true
                    journal_popularity_red_pocket_console = false
                    if(!lottery_result_uid_list_runmark) return MY_API.chatLog(`官方抽奖检查：运行中！`);
                    lottery_result_uid_list_runmark = false
                    //官方抽奖检查
                    //API.CONFIG.lottery_result_uid_list  检查的uidlist
                    //lottery_result_data   已开奖数据临时存储id,data
                    dynamic_msg = []
                    for(let i=0;i<MY_API.CONFIG.lottery_result_uid_list.length;i++){
                        let data = await bili_get_dynamic_check(MY_API.CONFIG.lottery_result_uid_list[i]);
                        data = 'UID：'+ MY_API.CONFIG.lottery_result_uid_list[i] + ' 检查结果：<br>' + data.replaceAll('\n', '<br>').replaceAll('UP主：','UP主：<a target="_blank" href="https://message.bilibili.com/#/whisper/mid').replaceAll(' 奖品：','">私信</a> 奖品')
                        dynamic_msg.push('<br>' + data)
                        await sleep(5000)
                    }
                    let dt = document.getElementById('sessions_msg');
                    if(lottery_result_console)dt.innerHTML = dynamic_msg
                    MY_API.chatLog('【批量检查官方抽奖】已检查完成，点击查看！')
                    lottery_result_uid_list_runmark = true
                    //官方抽奖检查
                })


                dongtai.find('div[data-toggle="AUTO_dynamic_del"] .num').val((parseInt(MY_API.CONFIG.AUTO_dynamic_create_flash)).toString());
                let AUTO_dynamic_del_runmark = true
                dongtai.find('div[data-toggle="AUTO_dynamic_del"] [data-action="save"]').click(async function () { //money_min save按钮
                    let val = parseInt(dongtai.find('div[data-toggle="AUTO_dynamic_del"] .num').val());
                    MY_API.CONFIG.AUTO_dynamic_del = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`自动删动态设置：${MY_API.CONFIG.AUTO_dynamic_del}`);
                    if(AUTO_dynamic_del_runmark){
                        AUTO_dynamic_del_runmark = false
                        let get_space_history_dynamic_id_list_to_del = function(host_uid,offset){//获取已转动态抽奖id：API.CONFIG.dynamic_id_str_done_list
                            return BAPI.space_history(host_uid,offset).then(async function(data){
                                await sleep(5000)
                                //console.log('space_historydata',data,offset)
                                if(data.data.cards == undefined)return
                                let cards = data.data.cards
                                MY_API.chatLog(`正在动态回溯检查日期：${timestampToTime(cards[0].desc.timestamp)}`)
                                for(let i=0;i<cards.length;i++){
                                    if(cards[i].desc.timestamp + MY_API.CONFIG.AUTO_dynamic_del * 24 * 3600 < (ts_s()+s_diff)){
                                        if(cards[i].desc.type == 4 || cards[i].desc.type == 8 || cards[i].desc.type == 64)continue
                                        await BAPI.rm_dynamic(cards[i].desc.dynamic_id_str).then(async function(data){
                                            if(data.code==0){
                                                MY_API.chatLog(`【清理动态】成功删除一条动态！`);
                                                await sleep(1000)
                                            }else{
                                                MY_API.chatLog(`【清理动态】data：${data}`);
                                            }
                                        })
                                    }
                                }
                                if(data.data.has_more==1)return get_space_history_dynamic_id_list_to_del(Live_info.uid,cards[cards.length-1].desc.dynamic_id_str)
                            }, () => {
                                console.log('await error')
                                return MY_API.chatLog(`【清理动态】检索动态抽奖数据失败，请检查网络,稍后再试！`, 'warning');
                            })
                        }
                        await get_space_history_dynamic_id_list_to_del(Live_info.uid,0)
                        AUTO_dynamic_del_runmark = true
                    }else{
                        MY_API.chatLog(`【清理动态】正在执行中！`);
                    }
                });

                if(MY_API.CONFIG.zdydj_bendi)dongtai.find('div[data-toggle="zdydj_bendi"] input').attr('checked', '');
                dongtai.find('div[data-toggle="zdydj_bendi"] .url').val(((MY_API.CONFIG.bendi_zdydj)).toString());
                dongtai.find('div[data-toggle="zdydj_bendi"] input:checkbox').change(function () {
                    MY_API.CONFIG.zdydj_bendi = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自定义本地短句：${MY_API.CONFIG.zdydj_bendi}<br>刷新后或重新载入后生效！`);
                });
                dongtai.find('div[data-toggle="zdydj_bendi"] [data-action="save"]').click(async function () {
                    let val = dongtai.find('div[data-toggle="zdydj_bendi"] .url').val();
                    if(val == ''){
                        val = '本地自定义短句'
                    }
                    MY_API.CONFIG.bendi_zdydj = val.split(",");
                    MY_API.saveConfig()
                    MY_API.chatLog(`自定义短句：${MY_API.CONFIG.bendi_zdydj}<br>刷新后或重新载入后生效！`);
                })


                if(MY_API.CONFIG.zdydj)dongtai.find('div[data-toggle="zdydj"] input').attr('checked', '');
                dongtai.find('div[data-toggle="zdydj"] .url').val(((MY_API.CONFIG.zdydj_url)).toString());
                dongtai.find('div[data-toggle="zdydj"] input:checkbox').change(function () {
                    MY_API.CONFIG.zdydj = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自定义短句：${MY_API.CONFIG.zdydj}<br>刷新后或重新载入后生效！`);
                });

                dongtai.find('div[data-toggle="zdydj"] [data-action="save"]').click(async function () {
                    MY_API.CONFIG.zdydj_url = dongtai.find('div[data-toggle="zdydj"] .url').val();
                    MY_API.saveConfig()
                    MY_API.chatLog(`自定义短句：${MY_API.CONFIG.zdydj_url}<br>刷新后或重新载入后生效！`);
                })
                if(MY_API.CONFIG.gsc)dongtai.find('div[data-toggle="gsc"] input').attr('checked', '');
                dongtai.find('div[data-toggle="gsc"] input:checkbox').change(function () {
                    MY_API.CONFIG.gsc = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`古诗词：${MY_API.CONFIG.gsc}<br>刷新后或重新载入后生效！`);
                });
                if(MY_API.CONFIG.yyw)dongtai.find('div[data-toggle="yyw"] input').attr('checked', '');
                dongtai.find('div[data-toggle="yyw"] input:checkbox').change(function () {
                    MY_API.CONFIG.yyw = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`一言文：${MY_API.CONFIG.yyw}<br>刷新后或重新载入后生效！`);
                });
                if(MY_API.CONFIG.chp)dongtai.find('div[data-toggle="chp"] input').attr('checked', '');
                dongtai.find('div[data-toggle="chp"] input:checkbox').change(function () {
                    MY_API.CONFIG.chp = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`彩虹屁：${MY_API.CONFIG.chp}<br>刷新后或重新载入后生效！`);
                });
                dongtai.find('div[data-toggle="chp"] [data-action="save"]').click(async function () {
                    if(!MY_API.CONFIG.gsc && !MY_API.CONFIG.yyw && !MY_API.CONFIG.chp && !MY_API.CONFIG.zdydj && !MY_API.CONFIG.zdydj_bendi) MY_API.CONFIG.gsc = true
                    let gsc_list = [],yyw_list = [],chp_list = [],zdydj_list = []
                    if(MY_API.CONFIG.gsc){
                        MY_API.chatLog('正在载入古诗词！')
                        gsc_list = await getMyJson("http://flyx.fun:1369/static/gsc.json");
                        if(gsc_list[0] == undefined || gsc_list.length == 0) return
                        MY_API.chatLog('载入古诗词完成！')
                        MY_API.chatLog(`古诗词:${gsc_list.length}条！`)
                        await sleep(2000)
                    }
                    if(MY_API.CONFIG.yyw){
                        MY_API.chatLog('正在载入一言文！')
                        yyw_list = await getMyJson("http://flyx.fun:1369/static/yyw.json");
                        if(yyw_list[0] == undefined || yyw_list.length == 0) return
                        MY_API.chatLog('载入一言文完成！')
                        MY_API.chatLog(`一言文:${yyw_list.length}条！`)

                    }
                    if(MY_API.CONFIG.chp){
                        MY_API.chatLog('正在载入彩虹屁！')
                        chp_list = await getMyJson("http://flyx.fun:1369/static/chp.json");
                        if(chp_list[0] == undefined || chp_list.length == 0) return
                        MY_API.chatLog('载入彩虹屁完成！')
                        MY_API.chatLog(`彩虹屁:${chp_list.length}条！`)
                    }
                    if(MY_API.CONFIG.zdydj && MY_API.CONFIG.zdydj_url){
                        MY_API.chatLog('正在载入自定义短句！')
                        zdydj_list = await getMyJson(MY_API.CONFIG.zdydj_url);
                        if(zdydj_list[0] == undefined || zdydj_list.length == 0) return
                        MY_API.chatLog('自定义短句完成！')
                        MY_API.chatLog(`自定义短句${zdydj_list.length}条！`)
                        await sleep(2000)
                    }
                    poison_chicken_soup = []
                    poison_chicken_soup = [].concat(gsc_list).concat(yyw_list).concat(chp_list).concat(zdydj_list)
                    if(MY_API.CONFIG.zdydj_bendi)poison_chicken_soup = poison_chicken_soup.concat(MY_API.CONFIG.bendi_zdydj)
                    MY_API.saveConfig();
                    let soup_length = document.getElementById("soup_length")
                    soup_length.innerHTML = `立即重载随机文库（当前${poison_chicken_soup.length}条）`
                    MY_API.chatLog(`当前随机文库:${poison_chicken_soup.length}条！`)
                });
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(dongtai);

                let hongbao = $("<div class='zdbgjhongbao'>");//红包页
                hongbao.css(div_css);

                hongbao.append(`

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【电池道具红包抽奖】</legend>

<div data-toggle="popularity_red_pocket_join_switch">
<append style="font-size: 100%; color: #FF34B3" title="自动电池道具抽奖">
<input id = "popularity_red_pocket_join_switch" style="vertical-align: text-top;" type="checkbox" >自动电池道具抽奖
</div>

<div data-toggle="popularity_red_pocket_time_switch">
<append style="font-size: 100%; color: #FF34B3" title="勾选后生效：在以下各时段内自动开启道具红包抽奖，时段外则自动关闭！">
<input style="vertical-align: text-top;" type="checkbox" >启用分时段抽奖：<br>
<append style="font-size: 100%; color: blue">
勾选后电池道具抽奖仅在以下各时段内自动开启道具红包抽奖，时段外则自动关闭！<br>
格式举例：【8点10分到10点0分，11点0分到12点0分】不支持跨0点！<br>
<append style="font-size: 100%; color: #FF34B3">
<input class="num" style="width: 380px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>

<div data-toggle="popularity_red_pocket_time_switch2">
<append style="font-size: 100%; color: #FF34B3">
<input style="vertical-align: text-top;" type="checkbox" >无贡献时暂停抽奖<input class="num" style="width: 30px;vertical-align:inherit;" type="text">分钟
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>

<div data-toggle="popularity_red_pocket_onlineNum_switch">
<append style="font-size: 100%; color: #FF34B3">
<input style="vertical-align: text-top;" type="checkbox" >在线人数超过<input class="num" style="width: 30px;vertical-align:inherit;" type="text">时不参加
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>

<div data-toggle="popularity_red_pocket_onlineNum_switch2">
<append style="font-size: 100%; color: #FF34B3">
<input style="vertical-align: text-top;" type="checkbox" >人数超过奖品数<input class="num" style="width: 30px;vertical-align:inherit;" type="text">不参加
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>

<div data-toggle="popularity_red_pocket_only_official_switch">
<append style="font-size: 100%; color: #FF34B3" title="将仅参与官方的电池道具红包抽奖！">
<input style="vertical-align: text-top;" type="checkbox" >仅参与官方的电池道具抽奖
</div>

<div data-toggle="popularity_red_pocket_no_official_switch">
<append style="font-size: 100%; color: #FF34B3" title="将不参与官方的电池道具红包抽奖！">
<input style="vertical-align: text-top;" type="checkbox" >不参与官方的电池道具抽奖
</div>

<div data-toggle="score_auto_dm">
<append style="font-size: 100%; color: #FF34B3" title="自动发弹幕加贡献值！">
<input style="vertical-align: text-top;" type="checkbox" >自动点赞直播间
</div>

<div data-toggle="popularity_red_pocket_Followings_switch">
<append style="font-size: 100%; color: #FF34B3" title="仅参与关注的主播的电池道具抽奖，自动电池道具抽奖需开启！">
<input style="vertical-align: text-top;" type="checkbox" >仅参与关注的主播的电池道具抽奖<br>
红包总价值低于<input class="num" style="width: 40px;vertical-align:inherit;" type="text">元不参加<br>
剩余<input class="num2" style="width: 40px;vertical-align:inherit;" type="text">秒参加抽奖，
开奖后休眠<input class="num1" style="width: 40px;vertical-align:inherit;" type="text">秒
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>
</fieldset>
`)

                if(MY_API.CONFIG.popularity_red_pocket_join_switch)hongbao.find('div[data-toggle="popularity_red_pocket_join_switch"] input:checkbox').attr('checked', '');

                if(MY_API.CONFIG.popularity_red_pocket_Followings_switch)hongbao.find('div[data-toggle="popularity_red_pocket_Followings_switch"] input').attr('checked', '');
                if(MY_API.CONFIG.red_pocket_Followings_switch)hongbao.find('div[data-toggle="red_pocket_Followings_switch"] input').attr('checked', '');

                hongbao.find('div[data-toggle="popularity_red_pocket_Followings_switch"] input:checkbox').change(function () {
                    MY_API.CONFIG.popularity_red_pocket_Followings_switch = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`直播间电池道具设置：${MY_API.CONFIG.popularity_red_pocket_Followings_switch}<br>需勾选自动直播间电池道具抽奖！`);
                });

                hongbao.find('div[data-toggle="popularity_red_pocket_join_switch"] input:checkbox').change(function () {
                    MY_API.CONFIG.popularity_red_pocket_join_switch = $(this).prop('checked');
                    MY_API.saveConfig()
                    if(MY_API.CONFIG.popularity_red_pocket_join_switch && !MY_API.CONFIG.get_data_from_server){
                        MY_API.chatLog(`获取服务器直播间抽奖数据未开启，请在设置中开启`, 'warning');
                    }
                    MY_API.chatLog(`直播间电池道具设置：${MY_API.CONFIG.popularity_red_pocket_join_switch}`);
                });

                if(MY_API.CONFIG.score_auto_dm)hongbao.find('div[data-toggle="score_auto_dm"] input').attr('checked', '');
                hongbao.find('div[data-toggle="score_auto_dm"] input:checkbox').change(function () {
                    MY_API.CONFIG.score_auto_dm = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动点赞：${MY_API.CONFIG.score_auto_dm}`);
                });

                if(MY_API.CONFIG.popularity_red_pocket_no_official_switch)hongbao.find('div[data-toggle="popularity_red_pocket_no_official_switch"] input').attr('checked', '');
                hongbao.find('div[data-toggle="popularity_red_pocket_no_official_switch"] input:checkbox').change(function () {
                    MY_API.CONFIG.popularity_red_pocket_no_official_switch = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`不参加官方的直播间电池道具：${MY_API.CONFIG.popularity_red_pocket_no_official_switch}`);
                });

                if(MY_API.CONFIG.popularity_red_pocket_only_official_switch)hongbao.find('div[data-toggle="popularity_red_pocket_only_official_switch"] input').attr('checked', '');
                hongbao.find('div[data-toggle="popularity_red_pocket_only_official_switch"] input:checkbox').change(function () {
                    MY_API.CONFIG.popularity_red_pocket_only_official_switch = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`不参加官方的直播间电池道具：${MY_API.CONFIG.popularity_red_pocket_only_official_switch}`);
                });

                if(MY_API.CONFIG.popularity_red_pocket_time_switch)hongbao.find('div[data-toggle="popularity_red_pocket_time_switch"] input').attr('checked', '');
                hongbao.find('div[data-toggle="popularity_red_pocket_time_switch"] input:checkbox').change(function () {
                    MY_API.CONFIG.popularity_red_pocket_time_switch = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`直播间电池道具设置：${MY_API.CONFIG.popularity_red_pocket_time_switch}`);
                });

                if(MY_API.CONFIG.popularity_red_pocket_onlineNum_switch)hongbao.find('div[data-toggle="popularity_red_pocket_onlineNum_switch"] input').attr('checked', '');
                hongbao.find('div[data-toggle="popularity_red_pocket_onlineNum_switch"] input:checkbox').change(function () {
                    MY_API.CONFIG.popularity_red_pocket_onlineNum_switch = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`在线人数设置：${MY_API.CONFIG.popularity_red_pocket_onlineNum_switch}`);
                });
                hongbao.find('div[data-toggle="popularity_red_pocket_onlineNum_switch"] .num').val((MY_API.CONFIG.popularity_red_pocket_onlineNum.toString()));
                hongbao.find('div[data-toggle="popularity_red_pocket_onlineNum_switch"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.popularity_red_pocket_onlineNum = parseInt(hongbao.find('div[data-toggle="popularity_red_pocket_onlineNum_switch"] .num').val());
                    MY_API.saveConfig();
                    MY_API.chatLog(`在线人数设置：${MY_API.CONFIG.popularity_red_pocket_onlineNum}`);
                });

                if(MY_API.CONFIG.popularity_red_pocket_onlineNum_switch2)hongbao.find('div[data-toggle="popularity_red_pocket_onlineNum_switch2"] input').attr('checked', '');
                hongbao.find('div[data-toggle="popularity_red_pocket_onlineNum_switch2"] input:checkbox').change(function () {
                    MY_API.CONFIG.popularity_red_pocket_onlineNum_switch2 = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`在线人数奖品设置：${MY_API.CONFIG.popularity_red_pocket_onlineNum_switch2}`);
                });
                hongbao.find('div[data-toggle="popularity_red_pocket_onlineNum_switch2"] .num').val((MY_API.CONFIG.popularity_red_pocket_Num.toString()));
                hongbao.find('div[data-toggle="popularity_red_pocket_onlineNum_switch2"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.popularity_red_pocket_Num = parseInt(hongbao.find('div[data-toggle="popularity_red_pocket_onlineNum_switch2"] .num').val());
                    MY_API.saveConfig();
                    MY_API.chatLog(`在线人数奖品设置：${MY_API.CONFIG.popularity_red_pocket_Num}`);
                });

                if(MY_API.CONFIG.popularity_red_pocket_time_switch2)hongbao.find('div[data-toggle="popularity_red_pocket_time_switch2"] input').attr('checked', '');
                hongbao.find('div[data-toggle="popularity_red_pocket_time_switch2"] input:checkbox').change(function () {
                    MY_API.CONFIG.popularity_red_pocket_time_switch2 = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`风控休眠设置：${MY_API.CONFIG.popularity_red_pocket_time_switch2}`);
                });
                hongbao.find('div[data-toggle="popularity_red_pocket_time_switch"] .num').val((MY_API.CONFIG.popularity_red_pocket_time.toString()));
                hongbao.find('div[data-toggle="popularity_red_pocket_time_switch2"] .num').val((MY_API.CONFIG.popularity_red_pocket_time2.toString()));
                hongbao.find('div[data-toggle="popularity_red_pocket_time_switch"] [data-action="save"]').click(function () {
                    let val = (hongbao.find('div[data-toggle="popularity_red_pocket_time_switch"] .num').val());
                    MY_API.CONFIG.popularity_red_pocket_time = val
                    pocket_time_hours = []
                    pocket_time_mins = []
                    val = MY_API.CONFIG.popularity_red_pocket_time.replaceAll(' ', '').replaceAll('，', ',').split(",");
                    for(let i=0;i<val.length;i++){
                        let reg1 = /[0-9]+点/g;
                        let reg2 = /[0-9]+分/g;
                        let hours = val[i].match(reg1);
                        pocket_time_hours = pocket_time_hours.concat(hours)
                        let mins = val[i].match(reg2);
                        pocket_time_mins = pocket_time_mins.concat(mins)
                    }
                    if(pocket_time_hours.length != pocket_time_mins.length)return MY_API.chatLog(`直播间电池道具抽奖时段设置有误！`);
                    for(let i=0;i<pocket_time_hours.length;i++){
                        pocket_time_hours[i] = parseInt(pocket_time_hours[i])
                        pocket_time_mins[i] = parseInt(pocket_time_mins[i])
                    }
                    //console.log('popularity_red_pocket_time',val,pocket_time_hours,pocket_time_mins)
                    MY_API.saveConfig();
                    MY_API.chatLog(`直播间电池道具抽奖时段设置：${MY_API.CONFIG.popularity_red_pocket_time}<br>勾选后生效：在以上各时段内自动开启道具红包抽奖，其他时段自动关闭抽奖！`);
                });
                hongbao.find('div[data-toggle="popularity_red_pocket_time_switch2"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.popularity_red_pocket_time2 = parseInt(hongbao.find('div[data-toggle="popularity_red_pocket_time_switch2"] .num').val());
                    MY_API.saveConfig();
                    MY_API.chatLog(`无贡献疑似风控休眠时间设置：${MY_API.CONFIG.popularity_red_pocket_time2}`);
                });


                hongbao.find('div[data-toggle="popularity_red_pocket_Followings_switch"] .num').val(parseInt(MY_API.CONFIG.total_price.toString()));
                hongbao.find('div[data-toggle="popularity_red_pocket_Followings_switch"] .num1').val(parseInt(MY_API.CONFIG.popularity_red_pocket_flash.toString()));
                hongbao.find('div[data-toggle="popularity_red_pocket_Followings_switch"] .num2').val(parseInt(MY_API.CONFIG.popularity_red_pocket_open_left.toString()));
                hongbao.find('div[data-toggle="popularity_red_pocket_Followings_switch"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.total_price = parseInt(hongbao.find('div[data-toggle="popularity_red_pocket_Followings_switch"] .num').val());
                    MY_API.CONFIG.popularity_red_pocket_flash = parseInt(hongbao.find('div[data-toggle="popularity_red_pocket_Followings_switch"] .num1').val());
                    MY_API.CONFIG.popularity_red_pocket_open_left = parseInt(hongbao.find('div[data-toggle="popularity_red_pocket_Followings_switch"] .num2').val());
                    MY_API.saveConfig();
                    MY_API.chatLog(`直播间电池道具设置抽奖下限：${MY_API.CONFIG.total_price}<br>抽奖间隔（开奖后到新的抽奖的间隔）：${MY_API.CONFIG.popularity_red_pocket_flash}<br>剩余${MY_API.CONFIG.popularity_red_pocket_open_left}秒参加抽奖！`);
                });
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(hongbao);


                let peizhi = $("<div class='zdbgjpeizhi'>");//配置页
                peizhi.css(div_css);

                peizhi.append(`
<fieldset>
<legend append style="font-size: 100%;color: #FF34B3;text-align: left;">【配置操作】</legend>

<div data-toggle="auto_config">
<append style="font-size: 100%; color: #FF34B3" title="自动同步云配置参数">
<button data-action="save2" style="font-size: 100%;color:  #FF34B3">删除其他账号配置缓存</button><br>
<input style="vertical-align: text-top;" type="checkbox" >自动同步云配置参数<br>
云地址：<input class="url" style="width:330px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button><br>
<button data-action="save1" style="font-size: 100%;color:  #FF34B3">立即同步云配置参数</button><br>
<append style="font-size: 100%;color: blue">注：若需同步云配置，可先在云新建空的配置文件，复制出真实地址，再保存到云配置地址栏，勾选同步，导出配置，配置内容粘帖到云配置空文件中。启用云配置后，其他云同步失效。
</div>

<div>
<button data-action="exportConfig" style="font-size: 100%;color: red" title="导出配置按钮">导出配置参数</button>
<br><button data-action="CONFIG_DEFAULT" style="font-size: 100%;color: red" title="重置为默认参数">重置默认参数</button>
<br><button data-action="importConfig" style="font-size: 100%;color: red" title="导入配置按钮">导入配置参数</button>
<input type="file" id="ZDBGJ_config_file" name="json" accept=".json" >
<br><append style="font-size: 100%;color: blue">注：旧版本的配置文件可能会与新版不兼容，导致部分参数未导入。
</div>
</fieldset>
`)
                if(MY_API.CONFIG.auto_config){
                    peizhi.find('div[data-toggle="auto_config"] input').attr('checked', '');
                    MY_API.CONFIG.get_Anchor_ignore_keyword_switch1 = false
                    MY_API.CONFIG.get_Anchor_ignore_keyword_switch2 = false
                    MY_API.CONFIG.get_Anchor_unignore_keyword_switch2 = false
                    MY_API.CONFIG.get_Anchor_unignore_keyword_switch1 = false
                    MY_API.saveConfig()
                }
                peizhi.find('div[data-toggle="auto_config"] .url').val(((MY_API.CONFIG.auto_config_url)).toString());
                peizhi.find('div[data-toggle="auto_config"] input:checkbox').change(function () {
                    MY_API.CONFIG.auto_config = $(this).prop('checked');
                    if(MY_API.CONFIG.auto_config){
                        MY_API.CONFIG.get_Anchor_ignore_keyword_switch1 = false
                        MY_API.CONFIG.get_Anchor_ignore_keyword_switch2 = false
                        MY_API.CONFIG.get_Anchor_unignore_keyword_switch2 = false
                        MY_API.CONFIG.get_Anchor_unignore_keyword_switch1 = false
                    }
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动云同步配置参数：${MY_API.CONFIG.auto_config}<br>云屏蔽词、正则关键词同步已自动关闭！<br>同步后界面显示的参数可能与实际不符！刷新后恢复正确显示！`);
                });

                peizhi.find('div[data-toggle="auto_config"] [data-action="save"]').click(async function () {
                    MY_API.CONFIG.auto_config_url = peizhi.find('div[data-toggle="auto_config"] .url').val();
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动云同步配置参数：${MY_API.CONFIG.auto_config_url}`);
                })

                peizhi.find('div[data-toggle="auto_config"] [data-action="save2"]').click(async function () {
                    let CONFIG_keys = [];
                    $.each(localStorage, (key) => {
                        CONFIG_keys.push(key);
                    });
                    for (let i = 0; i < CONFIG_keys.length; i++) {
                        if(CONFIG_keys[i].indexOf("_CONFIG") > -1){
                            let getnumber = CONFIG_keys[i].match(/\d+/g)
                            let other_uid = getnumber[0]
                            if(other_uid == Live_info.uid) continue
                            console.log("other_uid",other_uid)
                            let value = localStorage.getItem(CONFIG_keys[i])
                            localStorage.removeItem(CONFIG_keys[i]);
                            MY_API.chatLog(`检测到账号${other_uid}的配置信息并已删除！`);

                        }
                    }
                })

                peizhi.find('div[data-toggle="auto_config"] [data-action="save1"]').click(async function () {
                    let cloud_Config = await getMyJson(MY_API.CONFIG.auto_config_url);
                    //console.log('cloud_Config',cloud_Config);
                    if(cloud_Config.auto_config_url == undefined){
                        return MY_API.chatLog(`无云数据或获取异常！`,'warning');
                    }
                    try {
                        let p = $.Deferred();
                        try {
                            let config = cloud_Config;
                            $.extend(true, MY_API.CONFIG, config);
                            for(let item in MY_API.CONFIG){
                                if(unlist.indexOf(item)>-1){
                                    //console.log('云导入配置过滤', item);
                                    continue
                                }else if(config[item] !== undefined && config[item] !== null){
                                    MY_API.CONFIG[item] = config[item];
                                    //console.log('云导入配置'+ item,config[item],MY_API.CONFIG[item]);
                                }
                                if(item =="get_Anchor_ignore_keyword_switch1" || item =="get_Anchor_ignore_keyword_switch2" || item =="get_Anchor_unignore_keyword_switch1" || item =="get_Anchor_unignore_keyword_switch2"){
                                    MY_API.CONFIG[item] = false
                                    //console.log('云导入配置'+ item,config[item],MY_API.CONFIG[item]);
                                }
                            }
                            p.resolve()
                        } catch (e){
                            p.reject()
                        };
                        MY_API.saveConfig()
                        MY_API.chatLog(`自动同步云配置参数成功！<br>同步后界面显示的参数可能与实际不符！刷新后恢复正确显示！`);
                    } catch (e){
                        console.log('导入配置importConfig error：', e);
                    }
                })
                peizhi.find('button[data-action="CONFIG_DEFAULT"]').click(() => { //重置配置按钮
                    MY_API.CONFIG = MY_API.CONFIG_DEFAULT;
                    MY_API.saveConfig();
                    MY_API.chatLog('重置为默认参数');
                    alert('配置重置成功，点击确定刷新页面');
                    window.location.reload()
                });
                peizhi.find('button[data-action="exportConfig"]').click(() => { //导出配置按钮
                    let CONFIG_OUT = {};
                    for(let item in MY_API.CONFIG){
                        if(unlist.indexOf(item)>-1){
                            //console.log('导出配置过滤',unlist.indexOf(item), item);
                            continue
                        }
                        CONFIG_OUT[item] = MY_API.CONFIG[item]
                    }
                    //console.log(CONFIG_OUT)
                    downFile('ZDBGJ_CONFIG.json', CONFIG_OUT);
                    MY_API.chatLog('配置已导出');
                });
                peizhi.find('button[data-action="importConfig"]').click(() => { //导入配置按钮
                    let selectedFile = document.getElementById("ZDBGJ_config_file").files[0];
                    let reader = new FileReader();
                    reader.readAsText(selectedFile);
                    reader.onload = async function () {
                        try {
                            readConfig = JSON.parse(this.result);
                            let p = $.Deferred();
                            try {
                                let config = readConfig;
                                $.extend(true, MY_API.CONFIG, config);
                                for(let item in MY_API.CONFIG){
                                    if(unlist.indexOf(item)>-1){
                                        //console.log('导入配置过滤', item);
                                        continue
                                    }
                                    if(config[item] !== undefined && config[item] !== null){
                                        MY_API.CONFIG[item] = config[item];
                                        //console.log('导入配置',config[item],MY_API.CONFIG[item]);
                                    }
                                }
                                p.resolve()
                            } catch (e){
                                p.reject()
                            };
                            alert('配置导入成功，点击确定刷新页面');
                            window.location.reload()
                        } catch (e){
                            console.log('导入配置importConfig error：', e);
                            return alert('文件格式错误')
                        }
                    };
                });
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(peizhi);

                let wanju = $("<div class='zdbgjwanju'>");//玩具页
                wanju.css(div_css);

                wanju.append(`
<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【视频评论抽奖】</legend>
<div data-toggle="Anchor_vedio">
<input style="font-size: 100%;color: #FF34B3;vertical-align: text-top;" type="checkbox"><append style="font-size: 100%;color: #FF34B3;">使用随机文库<br>
<append style="font-size: 100%;color: #FF34B3;">关注UP并评论：
<input class="str" style="width: 160px;vertical-align:inherit;" type="text"><br>到视频：
<input class="bv" style="width: 100px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color: #FF34B3">执行</button>
</div>
</fieldset>

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【直播弹幕抽奖】</legend>
<div data-toggle="Anchor_danmu_go">
<input style="font-size: 100%;color: #FF34B3;vertical-align: text-top;" type="checkbox"><append style="font-size: 100%;color: #FF34B3;">使用随机文库短句弹幕<br>
<append style="font-size: 100%;color: #FF34B3;">发送弹幕：
<input class="start" style="width: 160px;vertical-align:inherit;" type="text"><br>到直播间：
<input class="end" style="width: 80px;vertical-align:inherit;" type="text"><br>每
<input class="number1" style="width: 26px;vertical-align:inherit;" type="text">秒，共发送
<input class="number2" style="width: 26px;vertical-align:inherit;" type="text">次
<button data-action="save" style="font-size: 100%;color: #FF34B3">开始</button>
<button data-action="save1" style="font-size: 100%;color: #FF34B3">停止</button>
</div>
</fieldset>

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【私信异常测试】</legend>
<div data-toggle="unusual" style="font-size: 100%;color: #FF34B3">
接收UID：<input class="uid" style="width: 80px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color: #FF34B3">私信异常测试</button>
</div>
</fieldset>


<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【@信息、回复信息、私信已读、私信提取】</legend>
<div data-toggle="auto_get_sessions" style="font-size: 100%;color: #FF34B3">
<input style="font-size: 100%;color: #FF34B3;vertical-align: text-top;" type="checkbox">每天<input class="num1" style="width: 30px;vertical-align:inherit;" type="text">点自动提取<input class="num" style="width: 30px;vertical-align:inherit;" type="text">天内私信并推送
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>
<div data-toggle="msgfeed_reply" style="font-size: 100%;color: #FF34B3">
<input style="font-size: 100%;color: #FF34B3;vertical-align: text-top;" type="checkbox">关注的人回复信息自动推送
</div>
<div data-toggle="get_sessions" style="font-size: 100%;color: #FF34B3">
<input style="font-size: 100%;color: #FF34B3;vertical-align: text-top;" type="checkbox">关注的人@信息自动推送<br>
<button id="get_sessions" data-action="save" style="font-size: 100%;color: #FF34B3;" title="一键取私信已读">一键私信已读及提取</button><button data-action="save1" style="font-size: 100%;color: #FF34B3">查看提取</button></button><button data-action="save3" style="font-size: 100%;color: #FF34B3">已读标记重置</button><br>
关键词设置：<input class="keyword" style="width: 320px;vertical-align:inherit;" type="text"><button data-action="save2" style="font-size: 100%;color: #FF34B3">保存</button><br>
<button data-action="save4" style="font-size: 100%;color: #FF34B3">一键删除所有私信</button>
</div>
</fieldset>


<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【一键取关分组及满关注通知】</legend>

<div data-toggle="gzsl" style="font-size: 100%;color:#FF34B3;">
<input style="font-size: 100%;color: #FF34B3;vertical-align: text-top;" type="checkbox">满关注通知<br>
<a target="_blank" href="https://space.bilibili.com/${Live_info.uid}/fans/follow"><button id="gzsl" style="font-size: 100%;color: #FF34B3">当前关注：${MY_API.CONFIG.ALLFollowingList.length}</button></a>
<a target="_blank" href="https://greasyfork.org/zh-CN/scripts/428895"><button style="font-size: 100%;color: #FF34B3" title="关注管理器">关注管理器</button></a>
</div>

<div data-toggle="tags">
<button data-action="save" style="font-size: 100%;color: #FF34B3;" title="显示一键取关界面">默认关注一键分组及取关功能面板</button>
<br><append style="font-size: 100%;color: blue">注：请尽量支持关注主播！
</div>
</fieldset>
`)
                let remove_sessions_run_mark = true
                wanju.find('div[data-toggle="get_sessions"] [data-action="save4"]').click(async function () {//一键私信已读及提取
                    if(!remove_sessions_run_mark)return
                    remove_sessions_run_mark = false
                    let remove = async function(){
                        BAPI.get_sessions(0).then(async function(data){
                            if(data.code==0){
                                await sleep(300)
                                if(data.data.session_list == undefined)return
                                let session_list = data.data.session_list
                                for(let i=0;i<session_list.length;i++){
                                    await BAPI.remove_session(session_list[i].talker_id).then(async(data) => {
                                        if(data.code==0)MY_API.chatLog(`UID：${session_list[i].talker_id}私信已删除`)
                                    })
                                    await sleep(300)
                                }
                                if(data.data.has_more==1)return remove()
                            }
                        })
                    }
                    remove()
                    remove_sessions_run_mark = true
                })

                if(MY_API.CONFIG.auto_get_sessions)wanju.find('div[data-toggle="auto_get_sessions"] input').attr('checked', '');
                wanju.find('div[data-toggle="auto_get_sessions"] input:checkbox').change(function () {
                    MY_API.CONFIG.auto_get_sessions = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`私信自动已读并提取推送设置：${MY_API.CONFIG.auto_get_sessions}`);
                });
                wanju.find('div[data-toggle="auto_get_sessions"] .num').val(parseInt(MY_API.CONFIG.auto_get_sessions_day.toString()));
                wanju.find('div[data-toggle="auto_get_sessions"] .num1').val(parseInt(MY_API.CONFIG.auto_get_sessions_hour.toString()));
                wanju.find('div[data-toggle="auto_get_sessions"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.auto_get_sessions_day = parseInt(wanju.find('div[data-toggle="auto_get_sessions"] .num').val());
                    MY_API.CONFIG.auto_get_sessions_hour = parseInt(wanju.find('div[data-toggle="auto_get_sessions"] .num1').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`私信自动已读并提取推送设置：${MY_API.CONFIG.auto_get_sessions_day}<br>${MY_API.CONFIG.auto_get_sessions_hour}`);
                })
                if(MY_API.CONFIG.msgfeed_reply)wanju.find('div[data-toggle="msgfeed_reply"] input').attr('checked', '');
                wanju.find('div[data-toggle="msgfeed_reply"] input:checkbox').change(function () {
                    MY_API.CONFIG.msgfeed_reply = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`关注的人回复信息自动推送设置：${MY_API.CONFIG.msgfeed_reply}`);
                });

                if(MY_API.CONFIG.get_sessions)wanju.find('div[data-toggle="get_sessions"] input').attr('checked', '');
                wanju.find('div[data-toggle="get_sessions"] .keyword').val(MY_API.CONFIG.get_sessions_keyword.toString());

                wanju.find('div[data-toggle="get_sessions"] input:checkbox').change(function () {
                    MY_API.CONFIG.get_sessions = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`关注的人@信息自动推送设置：${MY_API.CONFIG.get_sessions}`);
                });

                wanju.find('div[data-toggle="get_sessions"] [data-action="save2"]').click(function () {
                    let val = $(wanju).find('div[data-toggle="get_sessions"] .keyword').val();
                    if(val == ''){
                        val = '私信提取关键词'
                    }
                    MY_API.CONFIG.get_sessions_keyword = val.split(",");
                    let word=[]
                    for(let i = 0; i < MY_API.CONFIG.get_sessions_keyword.length; i++){//本地去重、去空格、去空
                        if(MY_API.CONFIG.get_sessions_keyword[i] == '')continue
                        if(word.indexOf(MY_API.CONFIG.get_sessions_keyword[i].replaceAll(' ', '').toLowerCase()) == -1){
                            word.push(MY_API.CONFIG.get_sessions_keyword[i].replaceAll(' ', '').toLowerCase())
                        }
                    }
                    MY_API.CONFIG.get_sessions_keyword = word
                    MY_API.saveConfig();
                    MY_API.chatLog(`【一键已读及${MY_API.CONFIG.auto_get_sessions_day}天内私信提取】私信提取关键词已设置：<br>${MY_API.CONFIG.get_sessions_keyword}`);
                });
                let get_sessions_run_mark = true
                wanju.find('div[data-toggle="get_sessions"] [data-action="save"]').click(async function () {//一键私信已读及提取
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = true
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    let sixin = document.getElementById("get_sessions")
                    if(!get_sessions_run_mark)return MY_API.chatLog(`【一键已读及${MY_API.CONFIG.auto_get_sessions_day}天内私信提取】正在运行中！`);
                    let talker_id_list = []
                    let get_sessions_end_ts_last = MY_API.CONFIG.get_sessions_end_ts
                    let get_sessions = function(end_ts=0){//获取私信列表
                        return BAPI.get_sessions(end_ts).then(async function(data){
                            if(data.code==0){
                                if(end_ts==0){
                                    talker_id_list=[]
                                }
                                await sleep(300)
                                if(data.data.session_list == undefined)return console.log('data.data.session_list == undefined')
                                let session_list = data.data.session_list
                                for(let i=0;i<session_list.length;i++){
                                    await BAPI.update_ack(session_list[i].talker_id,session_list[i].max_seqno).then(async(data) => {
                                        if(data.code==0)console.log('私信已读',i+1)
                                    })
                                    sixin.innerHTML = `已读（${end_ts}）：${i+1}/${session_list.length}`
                                    if((ts_ms()+ms_diff)*1000-session_list[i].session_ts < MY_API.CONFIG.auto_get_sessions_day * 24 * 3600 * 1000 * 1000)talker_id_list.push(session_list[i].talker_id)
                                }
                                if(session_list[session_list.length-1].session_ts < MY_API.CONFIG.get_sessions_end_ts * 1000 || data.data.has_more==0){
                                    //console.log('session_list[session_list.length-1].session_ts',session_list[session_list.length-1].session_ts,MY_API.CONFIG.get_sessions_end_ts)
                                    MY_API.CONFIG.get_sessions_end_ts = (ts_ms()+ms_diff)
                                    return
                                }
                                if(data.data.has_more==1)return get_sessions(session_list[session_list.length-1].session_ts)
                            }
                        })
                    }
                    MY_API.chatLog(`【一键已读及${MY_API.CONFIG.auto_get_sessions_day}天内私信提取】开始获取数据！`);
                    get_sessions_run_mark = false
                    if(MY_API.CONFIG.get_sessions_end_ts == 0)MY_API.chatLog(`【一键已读及${MY_API.CONFIG.auto_get_sessions_day}天内私信提取】第一次运行，数据较多，请耐心等待！`);
                    await get_sessions()
                    MY_API.chatLog(`【一键已读及${MY_API.CONFIG.auto_get_sessions_day}天内私信提取】正在提取7天内关键词私信私信,共发现对话${talker_id_list.length}个！`);
                    sessions_msg = []
                    for(let i=0;i<talker_id_list.length;i++){
                        await sleep(200)
                        sixin.innerHTML = `提取：${i+1}/${talker_id_list.length}`
                        await BAPI.getMsg(talker_id_list[i]).then(async(data) => {//私信内容
                            if(data.code==0){
                                //console.log('私信提取',i+1)
                                let msg = data.data.messages
                                let un_keyword = ['有奖预约通知']//忽略的关键词
                                for(let n=0;n<msg.length;n++){
                                    if(msg[n].timestamp > get_sessions_end_ts_last/1000 && msg[n].sender_uid==talker_id_list[i] && MY_API.CONFIG.get_sessions_keyword.some(v => msg[n].content.toLowerCase().indexOf(v) > -1) && (ts_s()+s_diff)-msg[n].timestamp < MY_API.CONFIG.auto_get_sessions_day * 24 *3600 && !un_keyword.some(v => msg[n].content.toLowerCase().indexOf(v) > -1)){
                                        MY_API.chatLog(`【一键已读及${MY_API.CONFIG.auto_get_sessions_day}天内私信提取】：<br>${msg[n].content}<br><a target="_blank" href="https://message.bilibili.com/#/whisper/mid${talker_id_list[i]}">查看私信</a>`);
                                        //私信推送点
                                        if(MY_API.CONFIG.auto_get_sessions){
                                            await sleep(2000)
                                            let msgmsg = `【私信提取推送】【${MY_API.CONFIG.push_tag}】${Live_info.uname}【${hour()}点${minute()}分】\n${msg[n].content}`
                                            if(MY_API.CONFIG.switch_go_cqhttp && MY_API.CONFIG.go_cqhttp && MY_API.CONFIG.qq2){
                                                qq(MY_API.CONFIG.qq2,msgmsg,MY_API.CONFIG.go_cqhttp)
                                            }
                                            if(MY_API.CONFIG.qqbot && qq_run_mark){
                                                qq(MY_API.CONFIG.qq,msgmsg,qun_server[1],qun_server[3])
                                            }
                                            if(MY_API.CONFIG.switch_push_KEY){
                                                pushmsg(MY_API.CONFIG.push_KEY, msgmsg)
                                            }
                                            if(MY_API.CONFIG.switch_pushplus_KEY){
                                                pushplus(MY_API.CONFIG.pushplus_KEY, content)
                                            }
                                        }
                                        sessions_msg.unshift(`<br>${timestampToTime(msg[n].timestamp)}：内容：${msg[n].content}，<a target="_blank" href="https://message.bilibili.com/#/whisper/mid${talker_id_list[i]}">查看私信</a><br>`)
                                        let dt = document.getElementById('sessions_msg'); //通过id获取该div
                                        dt.innerHTML = sessions_msg
                                    }
                                }
                            }
                        })
                    }
                    sixin.innerHTML = `一键私信已读及提取`
                    get_sessions_run_mark = true
                    MY_API.chatLog(`【一键已读及${MY_API.CONFIG.auto_get_sessions_day}天内私信提取】私信已读及提取结束！`);
                    if(sessions_msg.length == 0)MY_API.chatLog(`【一键已读及${MY_API.CONFIG.auto_get_sessions_day}天内私信提取】未提取到关键词私信！`);
                    if(sessions_msg.length > 0)MY_API.chatLog(`【一键已读及${MY_API.CONFIG.auto_get_sessions_day}天内私信提取】提取到关键词私信：${sessions_msg.length}个！`);
                })

                wanju.find('div[data-toggle="get_sessions"] [data-action="save1"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = true
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg'); //通过id获取该div
                    dt.innerHTML = sessions_msg
                });
                wanju.find('div[data-toggle="get_sessions"] [data-action="save3"]').click(async function () {
                    MY_API.CONFIG.get_sessions_end_ts = 0
                    MY_API.saveConfig()
                    MY_API.chatLog(`已读标记重置：${MY_API.CONFIG.get_sessions_end_ts}`);
                });
                if(MY_API.CONFIG.ALLFollowingList_2000)wanju.find('div[data-toggle="gzsl"] input').attr('checked', '');
                wanju.find('div[data-toggle="gzsl"] input:checkbox').change(function () {
                    MY_API.CONFIG.ALLFollowingList_2000 = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`满关注通知设置：${MY_API.CONFIG.ALLFollowingList_2000}`);
                });

                wanju.find('div[data-toggle="tags"] [data-action="save"]').click(async function () {
                    $('.zdbgjtags').toggle()
                });
                wanju.find('div[data-toggle="unusual"] .uid').val(parseInt(MY_API.CONFIG.unusual_uid.toString())); //直播间号
                let unusual_uid_run_mark = true
                wanju.find('div[data-toggle="unusual"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.unusual_uid = parseInt(wanju.find('div[data-toggle="unusual"] .uid').val());
                    MY_API.saveConfig()
                    if(!unusual_uid_run_mark)return MY_API.chatLog(`私信测试功能设置：30秒CD中！`);
                    unusual_uid_run_mark = false
                    setTimeout(() => {
                        unusual_uid_run_mark = true
                    }, 30e3);
                    MY_API.chatLog(`私信测试功能设置：接收UID：${MY_API.CONFIG.unusual_uid}`);
                    let send = async function(unusual_uid){
                        const msg = {
                            sender_uid: Live_info.uid,
                            receiver_id: unusual_uid,
                            receiver_type: 1,
                            msg_type: 1,
                            msg_status: 0,
                            content: `{"content":"` + "我要中奖！！" + `"}`,
                            dev_id: getMsgDevId()
                        }
                        BAPI.sendMsg(msg).then((data) => {
                            //console.log('sendMsg', getMsgDevId())
                            //console.log('sendMsg', data)
                            if(data.code == 0){
                                MY_API.chatLog(`【私信测试功能测试】私信发送成功！`);
                            }else{
                                MY_API.chatLog(`【私信测试功能测试】${data.message}！`);
                            }
                        })
                    }
                    send(MY_API.CONFIG.unusual_uid)
                });
                if(MY_API.CONFIG.Anchor_vedio)wanju.find('div[data-toggle="Anchor_vedio"] input').attr('checked', '');
                wanju.find('div[data-toggle="Anchor_vedio"] input:checkbox').change(function () {
                    MY_API.CONFIG.Anchor_vedio = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`随机短文库评论设置：${MY_API.CONFIG.Anchor_vedio}`);
                });
                wanju.find('div[data-toggle="Anchor_vedio"] .str').val(MY_API.CONFIG.Anchor_vedio_text.toString());
                wanju.find('div[data-toggle="Anchor_vedio"] .bv').val(MY_API.CONFIG.Anchor_vedio_bv.toString());
                let Anchor_vedio_runmark = true
                wanju.find('div[data-toggle="Anchor_vedio"] [data-action="save"]').click(async function () {
                    if(!Anchor_vedio_runmark) return MY_API.chatLog(`10秒CD中！`);
                    Anchor_vedio_runmark = false
                    setTimeout(() => {
                        Anchor_vedio_runmark = true
                    }, 10e3);
                    MY_API.CONFIG.Anchor_vedio_text = wanju.find('div[data-toggle="Anchor_vedio"] .str').val()
                    let vedio_bv = wanju.find('div[data-toggle="Anchor_vedio"] .bv').val()
                    //console.log(vedio_bv)
                    if(vedio_bv == '') return MY_API.chatLog(`BV号不能为空！`);
                    if(vedio_bv.slice(0, 2) == 'bv') vedio_bv = 'BV' + vedio_bv.slice(2, vedio_bv.length)
                    if(vedio_bv.slice(0, 2) != 'BV' && vedio_bv.slice(0, 2) != 'bv') vedio_bv = 'BV' + vedio_bv
                    MY_API.CONFIG.Anchor_vedio_bv = vedio_bv
                    MY_API.saveConfig()
                    MY_API.chatLog(`评论设置：${MY_API.CONFIG.Anchor_vedio_bv}<br>${MY_API.CONFIG.Anchor_vedio_text}`);
                    let msg = poison_chicken_soup[Math.ceil(Math.random() * (poison_chicken_soup.length-1))]
                    if(!MY_API.CONFIG.Anchor_vedio) msg = MY_API.CONFIG.Anchor_vedio_text
                    await BAPI.view_bvid(MY_API.CONFIG.Anchor_vedio_bv).then(async(data) => {
                        //console.log('view_bvid',data)
                        if(data.code==0){
                            let oid = data.data.aid
                            let uid = data.data.owner.mid
                            let modify_mark = false
                            if(MY_API.CONFIG.ALLFollowingList.indexOf(uid) == -1){//未关注
                                await BAPI.modify(uid,1).then(function(data){//关注
                                    //console.log('modify',data)
                                    if(data.code==0){
                                        MY_API.chatLog(`UID：${uid}关注成功！`,'success')
                                        modify_mark = true
                                    }else{
                                        MY_API.chatLog(`UID：${uid}关注失败：${data.message}！`,'warning')
                                    }
                                })
                            }else{
                                MY_API.chatLog(`UID：${uid}已关注！`,'success')
                                modify_mark = true
                            }
                            if(!modify_mark) return
                            await BAPI.dynamic_postdiscuss(msg,oid,1).then(async function(data){//评论
                                //console.log('抽奖评论',data)
                                if(data.code==0){
                                    MY_API.chatLog(`【视频评论抽奖】抽奖评论成功！`,'success')
                                }else{
                                    MY_API.chatLog(`【视频评论抽奖】抽奖评论失败：${data.message}！`,'warning')
                                }
                            })
                        }
                    })
                })

                wanju.find('div[data-toggle="Anchor_danmu_go"] .end').val(parseInt(MY_API.CONFIG.Anchor_danmu_go_r.toString())); //直播间号
                wanju.find('div[data-toggle="Anchor_danmu_go"] .start').val(MY_API.CONFIG.Anchor_danmu_go_c.toString()); //弹幕内容
                wanju.find('div[data-toggle="Anchor_danmu_go"] .number1').val(parseInt(MY_API.CONFIG.Anchor_danmu_go_f.toString())); //间隔
                wanju.find('div[data-toggle="Anchor_danmu_go"] .number2').val(parseInt(MY_API.CONFIG.Anchor_danmu_go_t.toString())); //次数
                if(MY_API.CONFIG.Anchor_danmu_go_check)wanju.find('div[data-toggle="Anchor_danmu_go"] input').attr('checked', '');
                wanju.find('div[data-toggle="Anchor_danmu_go"] input:checkbox').change(function () {
                    MY_API.CONFIG.Anchor_danmu_go_check = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`随机短文库弹幕设置：${MY_API.CONFIG.Anchor_danmu_go_check}`);
                });
                var send_i = 0
                wanju.find('div[data-toggle="Anchor_danmu_go"] [data-action="save"]').click(async function () {
                    MY_API.CONFIG.Anchor_danmu_go_r = parseInt(wanju.find('div[data-toggle="Anchor_danmu_go"] .end').val());
                    MY_API.CONFIG.Anchor_danmu_go_c = wanju.find('div[data-toggle="Anchor_danmu_go"] .start').val();
                    MY_API.CONFIG.Anchor_danmu_go_f = parseInt(wanju.find('div[data-toggle="Anchor_danmu_go"] .number1').val());
                    MY_API.CONFIG.Anchor_danmu_go_t = parseInt(wanju.find('div[data-toggle="Anchor_danmu_go"] .number2').val());

                    if(MY_API.CONFIG.Anchor_danmu_go_c.length>20 && Live_info.user_level<20){
                        MY_API.CONFIG.Anchor_danmu_go_c = MY_API.CONFIG.Anchor_danmu_go_c.slice(0,20)
                        MY_API.chatLog(`弹幕字数超出限制！`);
                    }
                    if(MY_API.CONFIG.Anchor_danmu_go_c.length>30 && Live_info.user_level>=20){
                        MY_API.CONFIG.Anchor_danmu_go_c = MY_API.CONFIG.Anchor_danmu_go_c.slice(0,30)
                        MY_API.chatLog(`弹幕字数超出限制！`);
                    }
                    MY_API.saveConfig();
                    MY_API.chatLog(`自动弹幕设置【房间-内容-间隔-次数】：${MY_API.CONFIG.Anchor_danmu_go_r}-${MY_API.CONFIG.Anchor_danmu_go_c}-${MY_API.CONFIG.Anchor_danmu_go_f}-${MY_API.CONFIG.Anchor_danmu_go_t}`);
                    let send = async function(check){
                        let msg
                        if(check){
                            let check_msg_length = function () {
                                msg = poison_chicken_soup[Math.ceil(Math.random() * (poison_chicken_soup.length-1))]
                                if(msg.length>20 && Live_info.user_level<20)return check_msg_length()
                                if(msg.length>30 && Live_info.user_level>=20)return check_msg_length()
                            }
                            await check_msg_length()
                        }else{
                            msg = MY_API.CONFIG.Anchor_danmu_go_c
                        }
                        await BAPI.sendLiveDanmu(msg, MY_API.CONFIG.Anchor_danmu_go_r).then(async(data) => {
                            if(data.code==0 && data.message != "k"){
                                MY_API.chatLog(`【弹幕抽奖】已发送弹幕【${msg}】到直播间【${MY_API.CONFIG.Anchor_danmu_go_r}】！`);
                            }else if(data.message == "k"){
                                MY_API.chatLog(`【弹幕抽奖】已发送弹幕【${msg}】到直播间【${MY_API.CONFIG.Anchor_danmu_go_r}】失败，弹幕被吞了！`);
                            }else{
                                MY_API.chatLog(`【弹幕抽奖】已发送弹幕【${msg}】到直播间【${MY_API.CONFIG.Anchor_danmu_go_r}】：${data.message}`);
                            }
                        })
                    }
                    for(send_i=0;send_i<MY_API.CONFIG.Anchor_danmu_go_t;send_i++){
                        if(send_i==0)MY_API.chatLog(`开始发送弹幕！`);
                        await send(MY_API.CONFIG.Anchor_danmu_go_check)
                        await sleep(MY_API.CONFIG.Anchor_danmu_go_f * 1000)
                    }
                });
                wanju.find('div[data-toggle="Anchor_danmu_go"] [data-action="save1"]').click(async function () {
                    send_i = 999999999
                    MY_API.chatLog(`发送弹幕已停止！`);
                })
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(wanju);


                let songli = $("<div class='zdbgjsongli'>");//送礼页
                songli.css(div_css);

                songli.append(`
<fieldset>
<legend append style="font-size: 100%;color: #FF34B3">【自动投喂】</legend>
<div data-toggle="onedayLT">
<append style="font-size: 100%; color: #FF34B3" title="当天过期的辣条等，24点后会自然消失！">
<input style="vertical-align: text-top;" type="checkbox">当天过期礼物投喂房间
<input class="start" style="width: 90px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>

<div data-toggle="YIYUAN">
<append style="font-size: 100%; color: #FF34B3" title="按顺序投喂亿圆！">
<input style="vertical-align: text-top;" type="checkbox">按顺序投喂亿圆：<br>每个直播间投喂数量：<input class="num" style="width: 30px;vertical-align:inherit;" type="text"><br>
直播间：<input class="list" style="width: 340px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>
</fieldset>

<fieldset>
<legend append style="font-size: 100%;color: #FF34B3">【日抛小号快速投喂】</legend>
<div data-toggle="send_bag_gift_now">
<append style="font-size: 100%; color: #FF34B3" title="日抛小号快速投喂包裹礼物！">
<input style="vertical-align: text-top;" type="checkbox">开启日抛小号快速投喂<br>
红包礼物投喂直播间：<input class="start" style="width: 120px;vertical-align:inherit;" type="text">
但高于<input class="start1" style="width: 40px;vertical-align:inherit;" type="text">电池时不投喂
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button><br>
<button data-action="save2" style="font-size: 100%;color: #FF34B3">清空日抛小号快速投喂日志</button><br>
<append style="font-size: 100%;color: blue">注：换号后可手动清空日志，否则上个号会计入总数！。
</div>
</fieldset>
`)
                if(MY_API.CONFIG.GIFT_AUTO)songli.find('div[data-toggle="onedayLT"] input').attr('checked', '');
                songli.find('div[data-toggle="onedayLT"] .start').val(MY_API.CONFIG.GIFT_ROOM.toString());
                songli.find('div[data-toggle="onedayLT"] input:checkbox').change(function () {
                    MY_API.CONFIG.GIFT_AUTO = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`当天过期礼物设置：${MY_API.CONFIG.GIFT_AUTO}`);
                });

                songli.find('div[data-toggle="onedayLT"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.GIFT_ROOM = parseInt(songli.find('div[data-toggle="onedayLT"] .start').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`当天过期礼物设置：${MY_API.CONFIG.GIFT_ROOM}`);
                });

                if(MY_API.CONFIG.YIYUAN_AUTO)songli.find('div[data-toggle="YIYUAN"] input').attr('checked', '');
                songli.find('div[data-toggle="YIYUAN"] input:checkbox').change(function () {
                    MY_API.CONFIG.YIYUAN_AUTO = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动每日亿元投喂：${MY_API.CONFIG.YIYUAN_AUTO}<br>注意：更改列表顺序等时先关闭投喂`);
                });

                songli.find('div[data-toggle="YIYUAN"] .list').val(MY_API.CONFIG.YIYUAN_roomid_list.toString());
                songli.find('div[data-toggle="YIYUAN"] .num').val(MY_API.CONFIG.YIYUAN_send_num);
                songli.find('div[data-toggle="YIYUAN"] [data-action="save"]').click(function () {
                    let val = songli.find('div[data-toggle="YIYUAN"] .list').val();
                    MY_API.CONFIG.YIYUAN_send_num = parseInt(songli.find('div[data-toggle="YIYUAN"] .num').val());
                    val = val.replaceAll(' ', '').replaceAll('，', ',').split(",");
                    let list = []
                    let roomlist = []
                    let NEW_YIYUAN = []
                    for(let i=0;i<MY_API.CONFIG.YIYUAN.length;i++){
                        if(roomlist.indexOf(MY_API.CONFIG.YIYUAN[i].roomid) == -1)roomlist.push(MY_API.CONFIG.YIYUAN[i].roomid)
                    }
                    for(let i=0;i<val.length;i++){
                        if(val[i] == '')continue
                        if(list.indexOf(Number(val[i])) == -1){
                            list.push(Number(val[i]))
                            if(roomlist.indexOf(Number(val[i])) == -1){
                                NEW_YIYUAN.push({roomid:Number(val[i]),count:0})
                            }else{
                                let num = roomlist.indexOf(Number(val[i]))
                                NEW_YIYUAN.push({roomid:Number(val[i]),count:MY_API.CONFIG.YIYUAN[num].count})
                            }
                        }
                    }
                    MY_API.CONFIG.YIYUAN_roomid_list = list
                    MY_API.CONFIG.YIYUAN = NEW_YIYUAN
                    MY_API.saveConfig();
                    songli.find('div[data-toggle="YIYUAN"] .list').val(MY_API.CONFIG.YIYUAN_roomid_list.toString());
                    console.log('YIYUAN',MY_API.CONFIG.YIYUAN,MY_API.CONFIG.YIYUAN_roomid_list)
                    MY_API.chatLog(`亿元投喂设置：<br>列表${MY_API.CONFIG.YIYUAN_roomid_list}<br>数量：${MY_API.CONFIG.YIYUAN_send_num}<br>注意：更改列表顺序等时先关闭投喂`);
                });
                if(MY_API.CONFIG.send_bag_gift_now)songli.find('div[data-toggle="send_bag_gift_now"] input').attr('checked', '');
                songli.find('div[data-toggle="send_bag_gift_now"] input:checkbox').change(function () {
                    MY_API.CONFIG.send_bag_gift_now = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`快速投喂礼物设置：${MY_API.CONFIG.send_bag_gift_now}`);
                });

                songli.find('div[data-toggle="send_bag_gift_now"] .start').val(MY_API.CONFIG.send_bag_gift_now_room.toString());
                songli.find('div[data-toggle="send_bag_gift_now"] .start1').val(MY_API.CONFIG.send_bag_gift_now_price.toString());
                songli.find('div[data-toggle="send_bag_gift_now"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.send_bag_gift_now_room = parseInt(songli.find('div[data-toggle="send_bag_gift_now"] .start').val());
                    MY_API.CONFIG.send_bag_gift_now_price = parseInt(songli.find('div[data-toggle="send_bag_gift_now"] .start1').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`快速投喂礼物设置：${MY_API.CONFIG.send_bag_gift_now_room}<br>${MY_API.CONFIG.send_bag_gift_now_price}`);
                });

                songli.find('div[data-toggle="send_bag_gift_now"] [data-action="save2"]').click(function () {
                    GM_setValue('popularity_red_pocket_send_record_count_num', [0,0,''])
                    MY_API.chatLog(`快速投喂礼物日志已清空！`);
                });

                $('.player-section.p-relative.border-box.none-select.z-player-section').append(songli);

                let tuisong = $("<div class='zdbgjtuisong'>");//推送页
                tuisong.css(div_css);

                tuisong.append(`
<fieldset>
<legend style="font-size: 100%;color:#FF34B3;">【中奖推送】</legend>

<div data-toggle="push_tag">
<append style="font-size: 100%; color:  #FF34B3" title="推送消息带分组标签。">
推送消息标签：<input class="hour" style="width:160px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
</div>

<fieldset>
<legend style="font-size: 100%;color:#FF34B3;">【防漏监控推送】</legend>
<div data-toggle="push_msg_oneday">
<append style="font-size: 100%; color:  #FF34B3" title="监控推送天选/实物/@及回复信息。">
<input style="vertical-align: text-top;" type="checkbox" >监控推送天选/实物/@及回复信息<br>
</div>

<div data-toggle="push_Select1" style="font-size: 100%;color: #FF34B3">
<input name="push_Select" style="font-size: 100%;color: #FF34B3;vertical-align:middle;" type="radio">每隔<input class="time" style="width: 30px;vertical-align:inherit;" type="text">分钟
</div>
<div data-toggle="push_Select2" style="font-size: 100%;color: #FF34B3">
<input name="push_Select" style="font-size: 100%;color: #FF34B3;vertical-align:middle;" type="radio">每天
<input class="hour" style="width:30px;vertical-align:inherit;" type="text">点整<br>
推送<input class="days" style="width:30px;vertical-align:inherit;" type="text">日内中奖信息
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button><br>
<append style="font-size: 100%;color:blue;">注：仅在勾选使用不限次数的PUSH即时达、QQ私有推送时生效！！！
</div>
<div data-toggle="sleep_TIMEAREADISABLE">
<append style="font-size: 100%; color: #FF34B3">
<input style="vertical-align: text-top;" type="checkbox">启用
<input class="start" style="width: 30px;vertical-align:inherit;" type="text">点至
<input class="end" style="width: 30px;vertical-align:inherit;" type="text">点不监控
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>

</fieldset>

<div data-toggle="ServerChan_SCKEY1">
<append style="font-size: 100%; color:  #FF34B3" title="从点击按钮测试">推送测试按钮<br>
<button data-action="save" style="font-size: 100%;color:  #FF34B3">Turbo</button>
<button data-action="save1" style="font-size: 100%;color:  #FF34B3">Pushplus</button>
<button data-action="save2" style="font-size: 100%;color:  #FF34B3">Push</button>
<button data-action="save3" style="font-size: 100%;color:  #FF34B3">Gocq</button>
</div>

<div data-toggle="ServerChan_SCKEY">
<append style="font-size: 100%; color:  #FF34B3" title="Server酱Turbo版微信推送中奖消息">
<input style="vertical-align: text-top;" type="checkbox" >Server酱Turbo版<br>KEY：<input class="num" style="width:260px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
<a target="_blank" href="https://www.bilibili.com/video/BV1S64y1S7p3"><button title="Server酱Turbo版：https://sct.ftqq.com/，填写SendKey,保存"  style="font-size: 100%;color:#FF34B3;">教程</button></a>
<a target="_blank" href="https://sct.ftqq.com"><button title="Server酱Turbo版：https://sct.ftqq.com/，填写SendKey,保存"  style="font-size: 100%;color:#FF34B3;">注册</button></a>
</div>

<div data-toggle="pushplus_KEY">
<append style="font-size: 100%; color:  #FF34B3" title="https://www.pushplus.plus/微信推送中奖消息">
<input style="vertical-align: text-top;" type="checkbox" >PUSHPLUS微信推送<br/>KEY：<input class="num" style="width:260px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
<a target="_blank" href="https://www.bilibili.com/video/BV1S64y1S7p3"><button title="https://www.pushplus.plus/，填写KEY,保存"  style="font-size: 100%;color:#FF34B3;">教程</button></a>
<a target="_blank" href="https://www.pushplus.plus/"><button title="https://www.pushplus.plus/，填写KEY,保存"  style="font-size: 100%;color:#FF34B3;">注册</button></a>
</div>

<div data-toggle="push_KEY">
<append style="font-size: 100%; color:  #FF34B3" title="http://push.ijingniu.cn微信推送中奖消息">
<input style="vertical-align: text-top;" type="checkbox" >PUSH即时达微信推送<br/>KEY：<input class="num" style="width:260px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
<a target="_blank" href="https://www.bilibili.com/video/BV1S64y1S7p3"><button title="http://push.ijingniu.cn，填写KEY,保存"  style="font-size: 100%;color:#FF34B3;">教程</button></a>
<a target="_blank" href="http://push.ijingniu.cn"><button title="http://push.ijingniu.cn，填写KEY,保存"  style="font-size: 100%;color:#FF34B3;">注册</button></a>
</div>

<div data-toggle="go_cqhttp">
<append style="font-size: 100%; color:  #FF34B3" title="go_cqhttp私有QQ推送中奖消息">
<input style="vertical-align: text-top;" type="checkbox" >gocq自架私有QQ推送<br/>接收QQ：<input class="num1" style="width:120px;vertical-align:inherit;" type="text"><br/>IP：<input class="num" style="width:180px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button>
<a target="_blank" href="https://wwp.lanzouo.com/ikQqNxjf2dc"><button title="填写服务器IP地址,保存"  style="font-size: 100%;color:#FF34B3;">教程</button></a>
<a target="_blank" href="https://wwp.lanzouo.com/ikQqNxjf2dc"><button style="font-size: 100%;color:#FF34B3;">架设</button></a>
</div>

</fieldset>
`)
                tuisong.find('div[data-toggle="push_tag"] .hour').val(((MY_API.CONFIG.push_tag)).toString());
                tuisong.find('div[data-toggle="push_tag"] [data-action="save"]').click(function () {
                    let val = tuisong.find('div[data-toggle="push_tag"] .hour').val();
                    MY_API.CONFIG.push_tag = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`分组标签设置：${MY_API.CONFIG.push_tag}`);
                });

                if(MY_API.CONFIG.push_msg_oneday_check)tuisong.find('div[data-toggle="push_msg_oneday"] input').attr('checked', '');
                if(MY_API.CONFIG.push_msg_oneday_hour_check)tuisong.find('div[data-toggle="push_Select2"] input').attr('checked', '');
                if(MY_API.CONFIG.push_msg_oneday_time_check){
                    MY_API.CONFIG.push_msg_oneday_time_s = (ts_s()+s_diff)
                    MY_API.saveConfig()
                    tuisong.find('div[data-toggle="push_Select1"] input').attr('checked', '');
                }
                tuisong.find('div[data-toggle="push_msg_oneday"] input:checkbox').change(function () {
                    MY_API.CONFIG.push_msg_oneday_check = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动推送设置：${MY_API.CONFIG.push_msg_oneday_check}`);
                });

                tuisong.find('div[data-toggle="push_Select1"] input:radio').change(function () {
                    MY_API.CONFIG.push_msg_oneday_time_check = $(this).prop('checked');
                    MY_API.CONFIG.push_msg_oneday_hour_check = !MY_API.CONFIG.push_msg_oneday_time_check
                    if(MY_API.CONFIG.push_msg_oneday_time_check)MY_API.CONFIG.push_msg_oneday_time_s = (ts_s()+s_diff)
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动推送设置：${MY_API.CONFIG.push_msg_oneday_time_check}-${MY_API.CONFIG.push_msg_oneday_hour_check}`);
                });
                tuisong.find('div[data-toggle="push_Select2"] input:radio').change(function () {
                    MY_API.CONFIG.push_msg_oneday_hour_check = $(this).prop('checked');
                    MY_API.CONFIG.push_msg_oneday_time_check = !MY_API.CONFIG.push_msg_oneday_hour_check
                    if(MY_API.CONFIG.push_msg_oneday_time_check)MY_API.CONFIG.push_msg_oneday_time_s = (ts_s()+s_diff)
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动推送设置：${MY_API.CONFIG.push_msg_oneday_time_check}-${MY_API.CONFIG.push_msg_oneday_hour_check}`);
                });
                tuisong.find('div[data-toggle="push_Select1"] .time').val((parseInt(MY_API.CONFIG.push_msg_oneday_time)).toString());
                tuisong.find('div[data-toggle="push_Select2"] .hour').val((parseInt(MY_API.CONFIG.push_msg_oneday_hour)).toString());
                tuisong.find('div[data-toggle="push_Select2"] .days').val((parseInt(MY_API.CONFIG.push_msg_oneday_days)).toString());
                tuisong.find('div[data-toggle="push_Select2"] [data-action="save"]').click(function () {
                    let val = parseInt(tuisong.find('div[data-toggle="push_Select2"] .hour').val());
                    if(val<0 || val>23) return MY_API.chatLog('请设置0-23');
                    MY_API.CONFIG.push_msg_oneday_hour = val;
                    MY_API.CONFIG.push_msg_oneday_days = parseInt(tuisong.find('div[data-toggle="push_Select2"] .days').val());
                    MY_API.CONFIG.push_msg_oneday_time = parseInt(tuisong.find('div[data-toggle="push_Select1"] .time').val());
                    if(MY_API.CONFIG.push_msg_oneday_time < 30){
                        MY_API.chatLog('太快了吧，起码得30分钟！');
                        MY_API.CONFIG.push_msg_oneday_time = 30
                        tuisong.find('div[data-toggle="push_Select1"] .time').val("30".toString());
                    }
                    MY_API.saveConfig();
                    MY_API.chatLog(`自动推送设置：${MY_API.CONFIG.push_msg_oneday_time}-${MY_API.CONFIG.push_msg_oneday_hour}-${MY_API.CONFIG.push_msg_oneday_days}`);
                });

                tuisong.find('div[data-toggle="ServerChan_SCKEY"] .num').val((MY_API.CONFIG.ServerChan_SCKEY).toString());
                tuisong.find('div[data-toggle="ServerChan_SCKEY"] [data-action="save"]').click(function () {
                    let val = tuisong.find('div[data-toggle="ServerChan_SCKEY"] .num').val();
                    MY_API.CONFIG.ServerChan_SCKEY = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`ServerChan设置：${MY_API.CONFIG.switch_ServerChan_SCKEY}-${MY_API.CONFIG.ServerChan_SCKEY}`);
                });
                if(MY_API.CONFIG.switch_ServerChan_SCKEY)
                    tuisong.find('div[data-toggle="ServerChan_SCKEY"] input').attr('checked', '');
                tuisong.find('div[data-toggle="ServerChan_SCKEY"] input:checkbox').change(function () {
                    MY_API.CONFIG.switch_ServerChan_SCKEY = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`ServerChan设置：${MY_API.CONFIG.switch_ServerChan_SCKEY}-${MY_API.CONFIG.ServerChan_SCKEY}`);
                });
                tuisong.find('div[data-toggle="go_cqhttp"] .num').val((MY_API.CONFIG.go_cqhttp).toString());
                tuisong.find('div[data-toggle="go_cqhttp"] .num1').val((MY_API.CONFIG.qq2).toString());
                tuisong.find('div[data-toggle="go_cqhttp"] [data-action="save"]').click(function () {
                    let val = tuisong.find('div[data-toggle="go_cqhttp"] .num').val();
                    MY_API.CONFIG.go_cqhttp = val;
                    val = tuisong.find('div[data-toggle="go_cqhttp"] .num1').val();
                    MY_API.CONFIG.qq2 = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`go_cqhttp已设置：${MY_API.CONFIG.switch_go_cqhttp}-${MY_API.CONFIG.qq2}-${MY_API.CONFIG.go_cqhttp}`);
                });

                if(MY_API.CONFIG.switch_go_cqhttp)tuisong.find('div[data-toggle="go_cqhttp"] input:checkbox').attr('checked', '');
                tuisong.find('div[data-toggle="go_cqhttp"] input:checkbox').change(function () {
                    MY_API.CONFIG.switch_go_cqhttp = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`go_cqhttp已设置：${MY_API.CONFIG.switch_go_cqhttp}-${MY_API.CONFIG.go_cqhttp}`);
                });

                tuisong.find('div[data-toggle="pushplus_KEY"] .num').val((MY_API.CONFIG.pushplus_KEY).toString());
                tuisong.find('div[data-toggle="pushplus_KEY"] [data-action="save"]').click(function () {
                    let val = tuisong.find('div[data-toggle="pushplus_KEY"] .num').val();
                    MY_API.CONFIG.pushplus_KEY = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`pushplus_KEY已设置：${MY_API.CONFIG.switch_pushplus_KEY}-${MY_API.CONFIG.pushplus_KEY}`);
                });
                if(MY_API.CONFIG.switch_pushplus_KEY)
                    tuisong.find('div[data-toggle="pushplus_KEY"] input').attr('checked', '');
                tuisong.find('div[data-toggle="pushplus_KEY"] input:checkbox').change(function () {
                    MY_API.CONFIG.switch_pushplus_KEY = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`push_KEY已设置：${MY_API.CONFIG.switch_pushplus_KEY}-${MY_API.CONFIG.pushplus_KEY}`);
                });


                tuisong.find('div[data-toggle="push_KEY"] .num').val((MY_API.CONFIG.push_KEY).toString());
                tuisong.find('div[data-toggle="push_KEY"] [data-action="save"]').click(function () {
                    let val = tuisong.find('div[data-toggle="push_KEY"] .num').val();
                    MY_API.CONFIG.push_KEY = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`push_KEY已设置：${MY_API.CONFIG.switch_push_KEY}-${MY_API.CONFIG.push_KEY}`);
                });
                if(MY_API.CONFIG.switch_push_KEY)tuisong.find('div[data-toggle="push_KEY"] input').attr('checked', '');
                tuisong.find('div[data-toggle="push_KEY"] input:checkbox').change(function () {
                    MY_API.CONFIG.switch_push_KEY = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`push_KEY已设置：${MY_API.CONFIG.switch_push_KEY}-${MY_API.CONFIG.push_KEY}`);
                });
                if(MY_API.CONFIG.sleep_TIMEAREADISABLE)tuisong.find('div[data-toggle="sleep_TIMEAREADISABLE"] input').attr('checked', '');
                tuisong.find('div[data-toggle="sleep_TIMEAREADISABLE"] .start').val(MY_API.CONFIG.sleep_TIMEAREASTART.toString());
                tuisong.find('div[data-toggle="sleep_TIMEAREADISABLE"] .end').val(MY_API.CONFIG.sleep_TIMEAREAEND.toString());
                tuisong.find('div[data-toggle="sleep_TIMEAREADISABLE"] input:checkbox').change(function () {
                    MY_API.CONFIG.sleep_TIMEAREADISABLE = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`休眠时间设置：${MY_API.CONFIG.sleep_TIMEAREADISABLE}<br>${MY_API.CONFIG.sleep_TIMEAREASTART}-${MY_API.CONFIG.sleep_TIMEAREAEND}`);
                });

                tuisong.find('div[data-toggle="sleep_TIMEAREADISABLE"] [data-action="save"]').click(function () {
                    let TIMEAREASTART = parseInt(tuisong.find('div[data-toggle="sleep_TIMEAREADISABLE"] .start').val());
                    let TIMEAREAEND = parseInt(tuisong.find('div[data-toggle="sleep_TIMEAREADISABLE"] .end').val());
                    if(TIMEAREASTART < 0 || TIMEAREASTART > 23 || TIMEAREAEND < 0 || TIMEAREAEND > 23)return MY_API.chatLog('时间设置错误，请输入【0-23】！');
                    MY_API.CONFIG.sleep_TIMEAREASTART = parseInt(tuisong.find('div[data-toggle="sleep_TIMEAREADISABLE"] .start').val());
                    MY_API.CONFIG.sleep_TIMEAREAEND = parseInt(tuisong.find('div[data-toggle="sleep_TIMEAREADISABLE"] .end').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`休眠时间设置：${MY_API.CONFIG.sleep_TIMEAREADISABLE}<br>${MY_API.CONFIG.sleep_TIMEAREASTART}-${MY_API.CONFIG.sleep_TIMEAREAEND}`);
                });
                let run_SCKEY_mark1 = 1
                tuisong.find('div[data-toggle="ServerChan_SCKEY1"] [data-action="save"]').click(function () {
                    if(!MY_API.CONFIG.ServerChan_SCKEY || !MY_API.CONFIG.switch_ServerChan_SCKEY)
                        return MY_API.chatLog(`参数有误：${MY_API.CONFIG.ServerChan_SCKEY}-${MY_API.CONFIG.switch_ServerChan_SCKEY}<br>请检查是否打勾、保存，刷新后重新尝试！`);
                    if(run_SCKEY_mark1){
                        ServerChan2(MY_API.CONFIG.ServerChan_SCKEY, `【天选众】【${MY_API.CONFIG.push_tag}】${Live_info.uname}：ServerChan推送测试消息！${year()}年${month()}月${day()}日${hour()}点${minute()}分！`).then(async function(data){
                            //console.log(data)
                            if(data.code==0){
                                MY_API.chatLog(`ServerChan推送测试消息发送成功！`);
                            }else{
                                MY_API.chatLog(`ServerChan推送测试消息：${data.message}`);
                            }
                        })
                    }else{
                        MY_API.chatLog(`CD中！`);
                        return
                    }
                    run_SCKEY_mark1 = 0
                    setTimeout(() => {
                        run_SCKEY_mark1 = 1;
                    }, 10e3);

                });
                let run_SCKEY_mark8 = 1
                tuisong.find('div[data-toggle="ServerChan_SCKEY1"] [data-action="save1"]').click(function () {
                    if(!MY_API.CONFIG.pushplus_KEY || !MY_API.CONFIG.switch_pushplus_KEY)
                        return MY_API.chatLog(`设置有误：${MY_API.CONFIG.pushplus_KEY}-${MY_API.CONFIG.switch_pushplus_KEY}<br>请检查是否打勾、保存，刷新后重新尝试！`);
                    if(run_SCKEY_mark8){
                        pushplus(MY_API.CONFIG.pushplus_KEY, `【天选众】【${MY_API.CONFIG.push_tag}】${Live_info.uname}：Pushplus推送测试消息！${year()}年${month()}月${day()}日${hour()}点${minute()}分！`).then(async function(data){
                            //console.log('pushplus',data)
                            if(data.msg == "请求成功" && data.code == 200 ){
                                MY_API.chatLog(`pushplus推送测试消息发送成功！`);
                            }else{
                                MY_API.chatLog(`pushplus推送测试消息：${data.msg}`);
                            }
                        })
                    }else{
                        MY_API.chatLog(`CD中！`);
                        return
                    }
                    run_SCKEY_mark8 = 0
                    setTimeout(() => {
                        run_SCKEY_mark8 = 1;
                    }, 10e3);

                });

                let run_SCKEY_mark3 = 1
                tuisong.find('div[data-toggle="ServerChan_SCKEY1"] [data-action="save2"]').click(function () {
                    if(!MY_API.CONFIG.push_KEY || !MY_API.CONFIG.switch_push_KEY)
                        return MY_API.chatLog(`设置有误：${MY_API.CONFIG.push_KEY}-${MY_API.CONFIG.switch_push_KEY}<br>请检查是否打勾、保存，刷新后重新尝试！`);
                    if(run_SCKEY_mark3){
                        pushmsg(MY_API.CONFIG.push_KEY, `【天选众】【${MY_API.CONFIG.push_tag}】${Live_info.uname}：Push推送测试消息！${year()}年${month()}月${day()}日${hour()}点${minute()}分！`).then(async function(data){
                            //console.log('pushmsg',data)
                            if(data.status == true ){
                                MY_API.chatLog(`Push推送测试消息发送成功！`);
                            }else{
                                MY_API.chatLog(`Push推送测试消息：${data.message}`);
                            }
                        })
                    }else{
                        MY_API.chatLog(`CD中！`);
                        return
                    }
                    run_SCKEY_mark3 = 0
                    setTimeout(() => {
                        run_SCKEY_mark3 = 1;
                    }, 10e3);

                });
                let run_SCKEY_mark4 = 1
                tuisong.find('div[data-toggle="ServerChan_SCKEY1"] [data-action="save3"]').click(function () {
                    if(!MY_API.CONFIG.go_cqhttp || !MY_API.CONFIG.switch_go_cqhttp)
                        return MY_API.chatLog(`设置有误：${MY_API.CONFIG.go_cqhttp}-${MY_API.CONFIG.switch_go_cqhttp}<br>请检查是否打勾、保存，刷新后重新尝试！`);
                    if(run_SCKEY_mark4){
                        qq(MY_API.CONFIG.qq2, `【天选众】【${MY_API.CONFIG.push_tag}】${Live_info.uname}：私有QQ推送测试消息！${year()}年${month()}月${day()}日${hour()}点${minute()}分！`,MY_API.CONFIG.go_cqhttp).then(async function(data){
                            //console.log(data)
                            if(data.retcode==0){
                                MY_API.chatLog(`私有QQ推送测试消息发送成功！`);
                            }else{
                                MY_API.chatLog(`私有QQ推送测试消息：${data.retmsg}`);
                            }
                        })
                    }else{
                        MY_API.chatLog(`CD中！`);
                        return
                    }
                    run_SCKEY_mark4 = 0
                    setTimeout(() => {
                        run_SCKEY_mark4 = 1;
                    }, 10e3);

                });

                $('.player-section.p-relative.border-box.none-select.z-player-section').append(tuisong);


                let shiwuhuodong = $("<div class='zdbgjshiwuhuodong'>");//实物活动页
                shiwuhuodong.css(div_css);

                shiwuhuodong.append(`

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【实物宝箱抽奖】</legend>
<div data-toggle="AUTO_GOLDBOX">
<append style="font-size: 100%; color: #FF34B3" title="自动金宝箱实物抽奖，主要是各种厂商官方活动抽奖">
<input id = "AUTO_GOLDBOX" style="vertical-align: text-top;" type="checkbox" >自动实物宝箱抽奖
</div>

<div data-toggle="AUTO_GOLDBOX_sever2">
<append style="font-size: 100%; color: #FF34B3" title="依赖群主云服务器数据">
<input id = "AUTO_GOLDBOX_sever2" style="vertical-align: text-top;" type="checkbox" >群主的云宝箱模式
</div>
</fieldset>


<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【活动抽奖】</legend>
<div data-toggle="AUTO_activity_lottery2">
<append style="font-size: 100%; color: #FF34B3" title="自动定时获取抽奖次数">
<input style="vertical-align: text-top;" type="checkbox" title="自动开始活动抽奖">自动定时获取抽奖次数
</div>

<div data-toggle="AUTO_activity_lottery">
<append style="font-size: 100%; color: #FF34B3" title="自动定时开始活动抽奖">
<input style="vertical-align: text-top;" type="checkbox" title="自动开始活动抽奖">自动定时开始活动抽奖<br>
<button data-action="save" style="font-size: 100%;color: #FF34B3">立即获取抽奖次数并抽奖</button><br>
<button data-action="save1" style="font-size: 100%;color: #FF34B3">清空过期盘记录【用于检查或复活盘抽奖】</button>
</div>

<div data-toggle="AUTO_activity_lottery_time">
<append style="font-size: 100%; color: #FF34B3" title="定时活动抽奖">
活动定时：<input class="hour" style="width:19px;vertical-align:inherit;" type="text">点
<input class="min" style="width:19px;vertical-align:inherit;" type="text">分
<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button><br>
</div>
</fieldset>
`)

                if(MY_API.CONFIG.AUTO_GOLDBOX)shiwuhuodong.find('div[data-toggle="AUTO_GOLDBOX"] input').attr('checked', '');
                if(MY_API.CONFIG.AUTO_GOLDBOX_sever2)shiwuhuodong.find('div[data-toggle="AUTO_GOLDBOX_sever2"] input').attr('checked', '');

                let AUTO_GOLDBOX_run_mark = true
                shiwuhuodong.find('div[data-toggle="AUTO_GOLDBOX"] input:checkbox').change(function () {
                    MY_API.CONFIG.AUTO_GOLDBOX = $(this).prop('checked');
                    if(MY_API.CONFIG.AUTO_GOLDBOX_sever2)document.getElementById("AUTO_GOLDBOX_sever2").click()
                    if(MY_API.CONFIG.AUTO_GOLDBOX && AUTO_GOLDBOX_run_mark){
                        AUTO_GOLDBOX_run_mark = false
                        setTimeout(() => {
                            MY_API.chatLog(`设置已保存，60秒后运行！`);
                            AUTO_GOLDBOX_run_mark = true
                            MY_API.MaterialObject.run();
                        }, 60e3);
                    }
                    MY_API.saveConfig();
                    MY_API.chatLog(`金宝箱：${MY_API.CONFIG.AUTO_GOLDBOX},群主云金宝箱：${MY_API.CONFIG.AUTO_GOLDBOX_sever2}`);
                });

                let AUTO_GOLDBOX_run_mark2 = true
                shiwuhuodong.find('div[data-toggle="AUTO_GOLDBOX_sever2"] input:checkbox').change(async function () {
                    MY_API.CONFIG.AUTO_GOLDBOX_sever2 = $(this).prop('checked');
                    if(MY_API.CONFIG.AUTO_GOLDBOX)document.getElementById("AUTO_GOLDBOX").click()
                    if(MY_API.CONFIG.AUTO_GOLDBOX_sever2 && AUTO_GOLDBOX_run_mark2){
                        AUTO_GOLDBOX_run_mark2 = false
                        setTimeout(async() => {
                            let get_GOLDBOX = async function () {
                                let url = "http://flyx.fun:1369/sync/GOLDBOX";
                                let w_MaterialObject = await getMyJson(url);
                                if(w_MaterialObject[0]== undefined){
                                    MaterialObject = []
                                    MY_API.chatLog(`无云数据或获取异常！`);
                                }else{
                                    MaterialObject = w_MaterialObject
                                }
                                //console.log('群主云宝箱数据',MaterialObject)
                            }
                            await get_GOLDBOX()
                            AUTO_GOLDBOX_run_mark2 = true
                        }, 60e3);
                    }
                    MY_API.saveConfig();
                    MY_API.chatLog(`金宝箱：${MY_API.CONFIG.AUTO_GOLDBOX},群主云金宝箱：${MY_API.CONFIG.AUTO_GOLDBOX_sever2}`);

                });


                if(MY_API.CONFIG.AUTO_activity_lottery)shiwuhuodong.find('div[data-toggle="AUTO_activity_lottery"] input:checkbox').attr('checked', '');
                shiwuhuodong.find('div[data-toggle="AUTO_activity_lottery"] input:checkbox').change(async function () {
                    MY_API.CONFIG.AUTO_activity_lottery = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`【活动抽奖】自动定时抽奖开关设置：${MY_API.CONFIG.AUTO_activity_lottery}！`);
                });

                if(MY_API.CONFIG.AUTO_activity_lottery2)shiwuhuodong.find('div[data-toggle="AUTO_activity_lottery2"] input:checkbox').attr('checked', '');
                shiwuhuodong.find('div[data-toggle="AUTO_activity_lottery2"] input:checkbox').change(async function () {
                    MY_API.CONFIG.AUTO_activity_lottery2 = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`【活动抽奖】自动获取抽奖次数设置：${MY_API.CONFIG.AUTO_activity_lottery2}！`);
                });

                shiwuhuodong.find('div[data-toggle="AUTO_activity_lottery"] [data-action="save"]').click(async function () {
                    if(activity_lottery_run_mark){
                        await MY_API.new_activity_lottery(true)
                    }else{
                        MY_API.chatLog(`【活动抽奖】请勿重复操作！`);
                    }
                });
                shiwuhuodong.find('div[data-toggle="AUTO_activity_lottery"] [data-action="save1"]').click(async function () {
                    MY_API.CONFIG.activity_lottery_gone = []
                    MY_API.saveConfig()
                    MY_API.chatLog(`【活动抽奖】：过期盘本地记录信息已清空！`);
                });
                shiwuhuodong.find('div[data-toggle="AUTO_activity_lottery_time"] .hour').val((parseInt(MY_API.CONFIG.AUTO_activity_lottery_time_hour)).toString());
                shiwuhuodong.find('div[data-toggle="AUTO_activity_lottery_time"] .min').val((parseInt(MY_API.CONFIG.AUTO_activity_lottery_time_min)).toString());

                shiwuhuodong.find('div[data-toggle="AUTO_activity_lottery_time"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.AUTO_activity_lottery_time_hour = parseInt(shiwuhuodong.find('div[data-toggle="AUTO_activity_lottery_time"] .hour').val());
                    if(MY_API.CONFIG.AUTO_activity_lottery_time_hour < 0 || MY_API.CONFIG.AUTO_activity_lottery_time_hour > 23){
                        MY_API.chatLog('请设置0-23');
                    }
                    MY_API.CONFIG.AUTO_activity_lottery_time_min = parseInt(shiwuhuodong.find('div[data-toggle="AUTO_activity_lottery_time"] .min').val());
                    if(MY_API.CONFIG.AUTO_activity_lottery_time_min < 0 || MY_API.CONFIG.AUTO_activity_lottery_time_min > 59){
                        MY_API.chatLog('请设置0-59');
                    }
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动设置【时-分】：${MY_API.CONFIG.AUTO_activity_lottery_time_hour}-${MY_API.CONFIG.AUTO_activity_lottery_time_min}`);
                });


                $('.player-section.p-relative.border-box.none-select.z-player-section').append(shiwuhuodong);

                let meiri = $("<div class='zdbgjmeiri'>");
                meiri.css(div_css);

                meiri.append(`
<fieldset>
<legend append style="font-size: 100%;color: #FF34B3">【日常任务】</legend>
<div data-toggle="nice">
<append style="font-size: 100%; color: #FF34B3">
<button data-action="save" style="font-size: 100%;color: #FF34B3">点击按钮关注支持</button><br>
<input style="vertical-align: text-top;" type="checkbox" title="年度大会员B币券充电支持">年度B币券充电支持
</div>
<div data-toggle="get_b">
<append style="font-size: 100%; color: #FF34B3">
<input style="vertical-align: text-top;" type="checkbox">自动领取年度哔币券
</div>

<div data-toggle="b_to_gold">
<append style="font-size: 100%; color: #FF34B3">
<input style="vertical-align: text-top;" type="checkbox">哔币券自动兑换电池
</div>
<div data-toggle="AUTO_BOX">
<append style="font-size: 100%; color: #FF34B3">
<input style="vertical-align: text-top;" type="checkbox">自动银瓜子兑换硬币
</div>

<div data-toggle="AUTO_COIN">
<append style="font-size: 100%; color: #FF34B3">
<input id = "AUTO_COIN" style="vertical-align: text-top;" type="checkbox">自动投视频五币经验
</div>

<div data-toggle="AUTO_COIN2">
<append style="font-size: 100%; color: #FF34B3">
<input id = "AUTO_COIN2" style="vertical-align: text-top;" type="checkbox">自动投专栏五币经验
</div>

<div data-toggle="AUTO_DailyReward">
<append style="font-size: 100%; color: #FF34B3" title="获取主站登陆、观看、转发（不显示在动态）经验">
<input style="vertical-align: text-top;" type="checkbox" title="获取主站登陆、观看、转发（不显示在动态）经验">主站登陆观看及转发<br>
<append style="font-size: 100%;color:blue;">
注：大会员积分签到、直播间任务电池、自动领开播奖励等功能自动运行。<br>
</div>

<div data-toggle="auto_medal_task">
<append style="font-size: 100%; color: #FF34B3">
<input id = "auto_medal_task" style="vertical-align: text-top;" type="checkbox">自动勋章观看任务
</div>

<div data-toggle="auto_light">
<append style="font-size: 100%; color: #FF34B3">
<input style="font-size: 100%;color:  #FF34B3;vertical-align: text-top;" type="checkbox">自动点亮勋章
</div>

<div data-toggle="medal_level_pass">
<append style="font-size: 100%; color: #FF34B3" title="跳过勋章房间">
<input style="vertical-align: text-top;" type="checkbox" title="跳过勋章房间">跳过<input class="num" style="width:30px;vertical-align:inherit;" type="text">级及以上勋章<button data-action="save" style="font-size: 100%;color:  #FF34B3">保存</button><br>
</div>


<div data-toggle="medal_pass_uid">
<append style="font-size: 100%;color: #FF34B3">
不执行观看任务主播UID[逗号隔开]<br>
<input class="keyword" style="width: 330px;vertical-align:inherit;" type="text"><button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button><br>
</div>

<div data-toggle="medal_first_uid">
<append style="font-size: 100%;color: #FF34B3">
优先执行观看任务主播UID[逗号隔开]<br>
<input class="keyword" style="width: 330px;vertical-align:inherit;" type="text"><button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button><br>
</div>

<div data-toggle="sort">
<append style="font-size: 100%;color: #FF34B3">
<input style="font-size: 100%;color:  #FF34B3;vertical-align: text-top;" type="checkbox">升级升序或降序排序
</div>

<append style="font-size: 100%;color:blue;">
注：第一次勾选会刷新网页。<br>
20级以上默认不执行观看任务。<br>
部分功能刷新后生效。<br>
B站网页已集成勋章展示及自动切换功能，弹幕框左侧点击勋章-展示设置。

</fieldset>
`)
                if (MY_API.CONFIG.auto_light)meiri.find('div[data-toggle="auto_light"] input').attr('checked', '');
                meiri.find('div[data-toggle="auto_light"] input:checkbox').change(function () {
                    MY_API.CONFIG.auto_light = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动点亮勋章设置：${MY_API.CONFIG.auto_light}`);
                });

                meiri.find('div[data-toggle="medal_pass_uid"] .keyword').val(MY_API.CONFIG.medal_pass_uid);
                meiri.find('div[data-toggle="medal_pass_uid"] [data-action="save"]').click(function () {
                    let val = meiri.find('div[data-toggle="medal_pass_uid"] .keyword').val();
                    if(val == ''){
                        MY_API.CONFIG.medal_pass_uid = []
                        MY_API.saveConfig();
                        MY_API.chatLog(`【观看跳过】主播UID已设置：<br>${MY_API.CONFIG.medal_pass_uid}`);
                        return
                    }
                    val = val.replaceAll('，', ',')
                    let word = val.split(",");
                    let list = []
                    for(let i = 0; i < word.length; i++){
                        if(word[i] == '')continue
                        if(list.indexOf(Number(word[i].replaceAll(' ', ''))) == -1){
                            list.push(Number(word[i].replaceAll(' ', '')))
                        }
                    }
                    MY_API.CONFIG.medal_pass_uid = list
                    MY_API.saveConfig();
                    MY_API.chatLog(`【观看跳过】主播UID已设置：<br>${MY_API.CONFIG.medal_pass_uid}`);
                });

                meiri.find('div[data-toggle="medal_first_uid"] .keyword').val(MY_API.CONFIG.medal_first_uid);
                meiri.find('div[data-toggle="medal_first_uid"] [data-action="save"]').click(function () {
                    let val = meiri.find('div[data-toggle="medal_first_uid"] .keyword').val();
                    if(val == ''){
                        MY_API.CONFIG.medal_first_uid = []
                        MY_API.saveConfig();
                        MY_API.chatLog(`【观看优先】主播UID已设置：<br>${MY_API.CONFIG.medal_first_uid}`);
                        return
                    }
                    val = val.replaceAll('，', ',')
                    let word = val.split(",");
                    let list = []
                    for(let i = 0; i < word.length; i++){
                        if(word[i] == '')continue
                        if(list.indexOf(Number(word[i].replaceAll(' ', ''))) == -1){
                            list.push(Number(word[i].replaceAll(' ', '')))
                        }
                    }
                    MY_API.CONFIG.medal_first_uid = list
                    MY_API.saveConfig();
                    MY_API.chatLog(`【观看优先】主播UID已设置：<br>${MY_API.CONFIG.medal_first_uid}`);
                });

                if(MY_API.CONFIG.nice)meiri.find('div[data-toggle="nice"] input').attr('checked', '');
                meiri.find('div[data-toggle="nice"] input:checkbox').change(async function () {
                    MY_API.CONFIG.nice = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`充电打赏：${MY_API.CONFIG.nice}`);
                    if(MY_API.CONFIG.nice){
                        MY_API.chatLog(`感谢支持！`,'success');
                        window.toast('感谢支持！','success',30000);
                        MY_API.CONFIG.b_to_gold = false
                        MY_API.CONFIG.get_b = true
                    }
                    MY_API.saveConfig()
                });
                meiri.find('div[data-toggle="nice"] [data-action="save"]').click(async function () {
                    BAPI.modify(qun_server[2], 1)
                    await sleep(2000)
                    if(dynamic_lottery_tags_tagid)BAPI.tags_addUsers(qun_server[2], dynamic_lottery_tags_tagid)
                    MY_API.chatLog(`感谢支持！`,'success');
                    window.toast('感谢支持！','success',30000);
                });
                if(MY_API.CONFIG.get_b)meiri.find('div[data-toggle="get_b"] input').attr('checked', '');
                meiri.find('div[data-toggle="get_b"] input:checkbox').change(function () {
                    MY_API.CONFIG.get_b = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动领取年度B币券：${MY_API.CONFIG.get_b}`);
                });
                if(MY_API.CONFIG.b_to_gold)meiri.find('div[data-toggle="b_to_gold"] input').attr('checked', '');
                meiri.find('div[data-toggle="b_to_gold"] input:checkbox').change(function () {
                    MY_API.CONFIG.b_to_gold = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动B币券兑换电池/金瓜子：${MY_API.CONFIG.b_to_gold}`);
                });
                if(MY_API.CONFIG.AUTO_BOX)meiri.find('div[data-toggle="AUTO_BOX"] input').attr('checked', '');
                meiri.find('div[data-toggle="AUTO_BOX"] input:checkbox').change(function () {
                    MY_API.CONFIG.AUTO_BOX = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动银瓜子兑换硬币设置：${MY_API.CONFIG.AUTO_BOX}`);
                    if(MY_API.CONFIG.AUTO_BOX){
                        setTimeout(() => {
                            MY_API.Exchange.run();
                        }, 3e3);
                    }
                });
                if(MY_API.CONFIG.AUTO_COIN)meiri.find('div[data-toggle="AUTO_COIN"] input').attr('checked', '');
                let AUTO_COIN_run_mark = true
                meiri.find('div[data-toggle="AUTO_COIN"] input:checkbox').change(function () {
                    MY_API.CONFIG.AUTO_COIN = $(this).prop('checked');
                    if(MY_API.CONFIG.AUTO_COIN2)document.getElementById("AUTO_COIN2").click()
                    if(MY_API.CONFIG.AUTO_COIN && AUTO_COIN_run_mark){
                        AUTO_COIN_run_mark = false
                        setTimeout(() => {
                            MY_API.chatLog(`【自动投币】设置已保存，60秒后运行！`);
                            AUTO_COIN_run_mark = true
                            MY_API.DailyReward.dynamic()
                        }, 60e3);
                    }
                    MY_API.saveConfig();
                    MY_API.chatLog(`视频投币：${MY_API.CONFIG.AUTO_COIN},专栏投币：${MY_API.CONFIG.AUTO_COIN2}`);
                });
                if(MY_API.CONFIG.AUTO_COIN2)meiri.find('div[data-toggle="AUTO_COIN2"] input').attr('checked', '');
                let AUTO_COIN_run_mark2 = true
                meiri.find('div[data-toggle="AUTO_COIN2"] input:checkbox').change(function () {
                    MY_API.CONFIG.AUTO_COIN2 = $(this).prop('checked');
                    if(MY_API.CONFIG.AUTO_COIN)document.getElementById("AUTO_COIN").click()
                    if(MY_API.CONFIG.AUTO_COIN2 && AUTO_COIN_run_mark2){
                        AUTO_COIN_run_mark2 = false
                        setTimeout(() => {
                            MY_API.chatLog(`【自动投币】设置已保存，60秒后运行！`);
                            AUTO_COIN_run_mark2 = true
                            MY_API.DailyReward.dynamic()
                        }, 60e3);
                    }
                    MY_API.saveConfig();
                    MY_API.chatLog(`视频投币：${MY_API.CONFIG.AUTO_COIN},专栏投币：${MY_API.CONFIG.AUTO_COIN2}`);
                });
                if(MY_API.CONFIG.AUTO_DailyReward)meiri.find('div[data-toggle="AUTO_DailyReward"] input').attr('checked', '');
                meiri.find('div[data-toggle="AUTO_DailyReward"] input:checkbox').change(function () {
                    MY_API.CONFIG.AUTO_DailyReward = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动每日任务设置：${MY_API.CONFIG.AUTO_DailyReward}`);
                    if(MY_API.CONFIG.AUTO_DailyReward){
                        setTimeout(async() => {
                            MY_API.DailyReward.login();
                            MY_API.DailyReward.dynamic();
                        }, 3e3);
                    }
                });

                if(MY_API.CONFIG.sort)meiri.find('div[data-toggle="sort"] input').attr('checked', '');
                meiri.find('div[data-toggle="sort"] input:checkbox').change(function () {
                    MY_API.CONFIG.sort = $(this).prop('checked');
                    MY_API.saveConfig()
                    if(MY_API.CONFIG.sort){
                        MY_API.chatLog(`勋章升级升序排序`);
                    }else{
                        MY_API.chatLog(`勋章升级降序排序`);
                    }
                });

                if(MY_API.CONFIG.medal_level_pass)meiri.find('div[data-toggle="medal_level_pass"] input').attr('checked', '');
                meiri.find('div[data-toggle="medal_level_pass"] input:checkbox').change(function () {
                    MY_API.CONFIG.medal_level_pass = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`勋章跳过设置：${MY_API.CONFIG.medal_level_pass}`);
                });

                meiri.find('div[data-toggle="medal_level_pass"] .num').val(parseInt(MY_API.CONFIG.medal_pass_level.toString()));
                meiri.find('div[data-toggle="medal_level_pass"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.medal_pass_level = parseInt(meiri.find('div[data-toggle="medal_level_pass"] .num').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`勋章跳过等级：${MY_API.CONFIG.medal_pass_level}`);
                });


                if(MY_API.CONFIG.auto_medal_task){
                    meiri.find('div[data-toggle="auto_medal_task"] input').attr('checked', '');
                }
                meiri.find('div[data-toggle="auto_medal_task"] input:checkbox').change(function () {
                    MY_API.CONFIG.auto_medal_task = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`勋章升级设置：${MY_API.CONFIG.auto_medal_task}`);
                    if(MY_API.CONFIG.auto_medal_task){
                        window.location.reload();
                    }
                });


                $('.player-section.p-relative.border-box.none-select.z-player-section').append(meiri);

                let ohb = $("<div class='zdbgjohb'>"); //欧皇榜 抽奖日志
                ohb.css(div_css);
                let lunar = sloarToLunar(year(),month(),day())
                ohb.append(`
<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【抽奖日志】</legend>
<div id="COUNT_GOLDBOX" style="font-size: 100%;color:blue;">
已参加抽奖次数：<span>${MY_API.CONFIG.COUNT_GOLDBOX}</span>次<br>
</div>

<div style="font-size: 100%;color:blue;" data-toggle="medal_change">
<button data-action="save4" style="font-size: 100%;color:  #FF34B3">天选日志全</button>
<button data-action="save" style="font-size: 100%;color:  #FF34B3">消费天选</button>
<button data-action="save1" style="font-size: 100%;color:  #FF34B3">免费类</button><br>
<button data-action="save2" style="font-size: 100%;color:  #FF34B3">轮盘抽奖</button>
<button data-action="save3" style="font-size: 100%;color:  #FF34B3">实物宝箱</button>
<button data-action="save5" style="font-size: 100%;color:  #FF34B3">广告招租</button><br>
<button data-action="save6" style="font-size: 100%;color:  #FF34B3">直播预约</button>
<button data-action="save8" style="font-size: 100%;color:  #FF34B3">动态抽奖</button>
<button data-action="save7" style="font-size: 100%;color:  #FF34B3">中奖日志</button><br>
<button data-action="save11" style="font-size: 100%;color:  #FF34B3">屏蔽日志</button>
<button data-action="save12" style="font-size: 100%;color:  #FF34B3">勋章类</button>
<button data-action="save13" style="font-size: 100%;color:  #FF34B3">道具红包全</button>
</div>
</fieldset>
`);

                let tj = $("<div class='zdbgjtj'>");
                tj.css(div_css);

                tj.append(`
<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【休眠设置等】</legend>
<div data-toggle="TALK">
<input style="vertical-align: text-top;" type="checkbox" ><append style="font-size: 100%;color: #FF34B3">隐藏抽奖等反馈信息
</div>

<div data-toggle="tips_show">
<input style="vertical-align: text-top;" type="checkbox" ><append style="font-size: 100%;color: #FF34B3">中奖等弹框提示显示
</div>

<div data-toggle="isnotLogin_push">
<input style="vertical-align: text-top;" type="checkbox" ><append style="font-size: 100%;color: #FF34B3">检测推送未登录状态
</div>

<div data-toggle="pushawardlist" style="font-size: 100%;color:#FF34B3;">
<button id="pushaward" data-action="save" style="font-size: 100%;color: #FF34B3">点击关闭群友中奖播报</button>
</div>

<div data-toggle="TIMEAREADISABLE">
<append style="font-size: 100%; color: #FF34B3">
<input style="vertical-align: text-top;" type="checkbox">
<input class="start" style="width: 30px;vertical-align:inherit;" type="text">点至
<input class="end" style="width: 30px;vertical-align:inherit;" type="text">点不抽奖（0-23）
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>
</fieldset>

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【直播间抽奖数据检索设置】</legend>
<div data-toggle="Anchor_room_send" >
<append style="font-size: 100%;color: #FF34B3" title="手动推送抽奖直播间到服务器等" >推送抽奖直播间
<input class="Anchor_room_send" style="width: 80px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color: #FF34B3">推送</button>
</div>
</fieldset>

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【直播间抽奖数据获取设置】</legend>

<div data-toggle="get_data_from_server">
<append style="font-size: 100%; color: #FF34B3" title="获取服务器直播间抽奖数据抽奖！">
<input style="vertical-align: text-top;" type="checkbox" >获取服务器直播间抽奖数据抽奖
</div>

<div data-toggle="AnchorserverFLASH" title="范围：20-50">
<append style="font-size: 100%;color: #FF34B3" title="获取抽奖数据的间隔，范围：8-50" >获取数据间隔
<input class="AnchorserverFLASH" style="width: 30px;vertical-align:inherit;" type="text">秒
<button data-action="save" style="font-size: 100%;color: #FF34B3" title="范围：8-50，">保存</button>
</div>
</fieldset>

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【自动刷新设置】</legend>
<div data-toggle="refresh" style="font-size: 100%;color: #FF34B3;">
<input style="font-size: 100%;color: #FF34B3;vertical-align: text-top;" type="checkbox">自动刷新直播间
<button data-action="save" style="font-size: 100%;color: #FF34B3">保存</button>
</div>
<div data-toggle="refresh_Select1" style="font-size: 100%;color: #FF34B3">
<input name="refresh_Select" style="font-size: 100%;color: #FF34B3;vertical-align: middle;" type="radio">每隔<input class="time1" style="width: 40px;vertical-align:inherit;" type="text">分自动刷新直播间
</div>
<div data-toggle="refresh_Select2" style="font-size: 100%;color: #FF34B3">
<input name="refresh_Select" style="font-size: 100%;color: #FF34B3;vertical-align: middle;" type="radio">每天<input class="time2" style="width: 40px;vertical-align:inherit;" type="text">点自动刷新直播间【0-23】
</div>
</fieldset>
`);
                /*
                <div data-toggle="sever_modle">
<append style="font-size: 100%; color: #FF34B3" title="获取群主专栏直播间抽奖数据抽奖！">
<input style="vertical-align: text-top;" type="checkbox" >获取群主专栏直播间抽奖数据抽奖
</div>

<div data-toggle="switch_sever">
<append style="font-size: 100%; color: #FF34B3" title="开启天选、道具红包等检索并互助推送！">
<input style="vertical-align: text-top;" type="checkbox" >开启抽奖数据检索并互助推送<br>
<append style="font-size: 100%;color:blue;">
注：可不用勾选开启，或者同一个IP仅一个脚本开启。
</div>

<div data-toggle="AnchorcheckFLASH" title="范围：10-5000">
<append style="font-size: 100%;color: #FF34B3" >抽奖数据检索休眠时间
<input class="AnchorcheckFLASH" style="width: 30px;vertical-align:inherit;" type="text">秒
<button data-action="save" style="font-size: 100%;color: #FF34B3" title="范围：10-5000">保存</button>
</div>

    */
                if(MY_API.CONFIG.refresh)tj.find('div[data-toggle="refresh"] input').attr('checked', '');
                tj.find('div[data-toggle="refresh"] input:checkbox').change(function () {
                    MY_API.CONFIG.refresh = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动刷新设置：${MY_API.CONFIG.refresh}`);
                });
                tj.find('div[data-toggle="refresh"] [data-action="save"]').click(function () {
                    MY_API.CONFIG.refresh_Select1_time = parseInt(tj.find('div[data-toggle="refresh_Select1"] .time1').val());
                    MY_API.CONFIG.refresh_Select2_time = parseInt(tj.find('div[data-toggle="refresh_Select2"] .time2').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动刷新设置：${MY_API.CONFIG.refresh_Select1}-${MY_API.CONFIG.refresh_Select1_time}<br>${MY_API.CONFIG.refresh_Select2}-${MY_API.CONFIG.refresh_Select2_time}`);
                })

                if(MY_API.CONFIG.refresh_Select1)tj.find('div[data-toggle="refresh_Select1"] input:radio').attr('checked', '');
                if(MY_API.CONFIG.refresh_Select2)tj.find('div[data-toggle="refresh_Select2"] input:radio').attr('checked', '');

                tj.find('div[data-toggle="refresh_Select1"] .time1').val(parseInt(MY_API.CONFIG.refresh_Select1_time.toString()));
                tj.find('div[data-toggle="refresh_Select2"] .time2').val(parseInt(MY_API.CONFIG.refresh_Select2_time.toString()));

                tj.find('div[data-toggle="refresh_Select1"] input:radio').change(function () {
                    MY_API.CONFIG.refresh_Select1 = $(this).prop('checked');
                    MY_API.CONFIG.refresh_Select2 = !MY_API.CONFIG.refresh_Select1
                    MY_API.CONFIG.refresh_Select1_time = parseInt(tj.find('div[data-toggle="refresh_Select1"] .time1').val());
                    MY_API.CONFIG.refresh_Select2_time = parseInt(tj.find('div[data-toggle="refresh_Select2"] .time2').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动刷新设置：${MY_API.CONFIG.refresh_Select1}-${MY_API.CONFIG.refresh_Select1_time}<br>${MY_API.CONFIG.refresh_Select2}-${MY_API.CONFIG.refresh_Select2_time}`);
                });
                tj.find('div[data-toggle="refresh_Select2"] input:radio').change(function () {
                    MY_API.CONFIG.refresh_Select2 = $(this).prop('checked');
                    MY_API.CONFIG.refresh_Select1 = !MY_API.CONFIG.refresh_Select2
                    MY_API.CONFIG.refresh_Select1_time = parseInt(tj.find('div[data-toggle="refresh_Select1"] .time1').val());
                    MY_API.CONFIG.refresh_Select2_time = parseInt(tj.find('div[data-toggle="refresh_Select2"] .time2').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`自动刷新设置：${MY_API.CONFIG.refresh_Select1}-${MY_API.CONFIG.refresh_Select1_time}<br>${MY_API.CONFIG.refresh_Select2}-${MY_API.CONFIG.refresh_Select2_time}`);
                });

                ohb.find('div[data-toggle="medal_change"] [data-action="save11"]').click(async function () {
                    journal_pb_console = true
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.journal_pb
                });
                ohb.find('div[data-toggle="medal_change"] [data-action="save"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = true
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.goldjournal
                });

                ohb.find('div[data-toggle="medal_change"] [data-action="save2"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = true
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.freejournal2
                });
                ohb.find('div[data-toggle="medal_change"] [data-action="save4"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = true
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.freejournal4
                });
                ohb.find('div[data-toggle="medal_change"] [data-action="save6"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = true
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.freejournal6
                });
                ohb.find('div[data-toggle="medal_change"] [data-action="save8"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = true
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.freejournal8
                });
                ohb.find('div[data-toggle="medal_change"] [data-action="save12"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = true
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.journal_medal
                });
                ohb.find('div[data-toggle="medal_change"] [data-action="save13"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = true
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.journal_popularity_red_pocket
                });
                ohb.find('div[data-toggle="medal_change"] [data-action="save3"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = true
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.freejournal3
                });
                ohb.find('div[data-toggle="medal_change"] [data-action="save7"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = true
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.freejournal7
                });
                ohb.find('div[data-toggle="medal_change"] [data-action="save1"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = true
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.freejournal
                });
                ohb.find('div[data-toggle="medal_change"] [data-action="save5"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = true
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.freejournal5
                });


                let tpp = $("<div class='zdbgjtpp'>"); //海报
                let tpw = $('.head-info-section.live-skin-coloration-area.p-relative.border-box.z-head-info.bg-bright-filter').width()
                let tph = $('.chat-history-list.h-100.p-relative.border-box.ps.ps--theme_default.ps--active-y').height() + 60
                tpp.css({
                    'position': 'absolute',
                    'z-index': '88',
                    'overflow': 'hidden',
                    'top': '0px',
                    'right': '0px',
                    'height': `${tph}px`,
                });
                //https://api.dujin.org/pic/
                tpp.append(`
<img id="img2" src='https://i0.hdslb.com/bfs/album/e394b0007c41373860af96a943bd1322a055b50a.jpg' width=${tpw+2}px></img>
`);


                tj.find('div[data-toggle="pushawardlist"] [data-action="save"]').click(async function () {
                    let pushaward = document.getElementById('pushaward');
                    if(MY_API.CONFIG.qqawardlist_switch){
                        MY_API.CONFIG.qqawardlist_switch = false
                        pushaward.innerHTML = '点击开启群友中奖播报'
                    }else{
                        MY_API.CONFIG.qqawardlist_switch = true
                        pushaward.innerHTML = '点击关闭群友中奖播报'
                    }
                });

                div.append(`
<fieldset>
<legend style="font-size: 100%;color: #FF34B3;text-align: left;">欢迎来到<span>${ZBJ}</span>的直播间</legend>
<div id="user_info" style="font-size: 100%;color:  green;">
<img src=${Live_info.face_url} height="100" /><br>
昵称：${Live_info.uname}<br>UID：${Live_info.uid}<br>
直播消费：${Live_info.cost}<br>会员等级：${Live_info.vipTypetext}<br>
主站等级：Lv${Live_info.Blever}<br>硬币数量：${Live_info.coin}<br>
注册时间：${timestampToTime1(Live_info.jointime)}
</div>
</fieldset>

<fieldset>
<legend style="font-size: 100%;color: #FF34B3;text-align: left;">查询注册时间</legend>
<div data-toggle="getinfo">
<append style="font-size: 100%; color: green">
</button>UID：<input class="uid" style="width:150px;vertical-align:inherit;" type="text">
<button data-action="save" style="font-size: 100%;color:  green">查询
</div>
</fieldset>

<fieldset>
<legend style="font-size: 100%;color: #FF34B3;text-align: left;">我欲成仙丨快乐无边</legend>
<div id="CJ" style="font-size: 100%;color:  green;">
${lunar.lunarYear}年&nbsp;&nbsp;&nbsp;&nbsp;${lunar.lunarMonth}月${lunar.lunarDay}&nbsp;&nbsp;&nbsp;&nbsp;${getShiChen()}<br>
修为：${CJ}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;今日修仙指数：${MY_API.CONFIG.COUNT}<br>
攻击：${MY_API.CONFIG.TTCOUNT}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;防御：${MY_API.CONFIG.TTLOVE_COUNT}<br>
灵力：${MY_API.CONFIG.BPJY}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;等级：Lv${MY_API.CONFIG.BPDJ}
</div>
</fieldset>

<fieldset>
<legend append style="font-size: 100%;color: #FF34B3">【QQ群娱乐机器人】</legend>
<append id="setu_bot_start">
<div><button id="setu_bot_start_t" data-action="setu_bot_start" style="font-size: 100%;color: red">点击开启QQ群娱乐机器人脚本</button><br>
<a target="_blank" href="https://www.bilibili.com/video/BV1Q3411K7z7"><button style="font-size: 100%;color: red">架设教程！</button></a>
<a target="_blank" href="https://wwt.lanzouq.com/iTW2d05ga3fa"><button style="font-size: 100%;color: red">配套程序！</button></a>
</div>

<div><a target="_blank" href="${GM_info.script.homepage}"><button style="font-size: 100%;color: red" title="点击安装最新脚本">脚本更新！</button></a>
<a target="_blank" href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=SbDJuLdqUTC2YiGYPzlUDod-9qr_B3kh&authKey=miZXl51EHdpe2GNipY5gKZHQwh%2FDIaccGpIrCMTMv18DjsFSMHTMaDlB8jNXyQqS&noverify=0&group_code=746790091"><button style="font-size: 100%;color: red" title="点击加入QQ交流群：746790091">加入扣群！</button></a>
</div>

<append id="giftCountsent">
<div><button data-action="countsent" style="font-size: 100%;color: red" title="点击发送修仙等级、指数弹幕">低调使用！</button>
<button data-action="countsentt" style="font-size: 100%;color: red" title="NICE!!!">闷声发财！</button>
</div>
</fieldset>

`);

                if(div.find('div[data-toggle="getinfo"] .uid').val() == ''|| uid == 0 )div.find('div[data-toggle="getinfo"] .uid').val(Live_info.uid);
                let getinfocd = true
                div.find('div[data-toggle="getinfo"] [data-action="save"]').click(async function () {
                    if(!getinfocd) return window.toast('查询CD中！','error',1000);
                    getinfocd = false
                    let uid = parseInt(div.find('div[data-toggle="getinfo"] .uid').val());
                    if(uid==''|| uid==0 ){
                        div.find('div[data-toggle="getinfo"] .uid').val(Live_info.uid);
                        uid = Live_info.uid
                    }
                    let info = await bili_get_info(uid)
                    window.toast(info,'success',5000,1);
                    await sleep(5000)
                    getinfocd = true
                });


                let award = $("<div class='zdbgjaward'>");
                award.css({
                    'width': '260px',
                    'height': '300px',
                    'max-height': `${heightmax}px`,
                    'position': 'absolute',
                    'top': '160px',
                    'right': '10px',
                    'background': 'rgba(255,255,255,1)',
                    'padding': '10px',
                    'z-index': '999',
                    'border-radius': '12px',
                    'transition': 'height .3s',
                    'overflow': 'auto',
                    'line-height': '15px',
                });

                award.append(`
<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">最新中奖信息
<a target="_blank" href="https://message.bilibili.com/#/whisper"><button style="font-size: 100%;color:#FF34B3;position:absolute;right:10%">消息中心-我的消息</button></a></legend>

<div style="font-size: 100%;color:blue;" data-toggle="showaward">
<button data-action="save" style="font-size: 100%;color:  #FF34B3">中奖日志</button><br>

<div id="award" style="font-size: 100%;color:#FF34B3;">
<a target="_blank" href="https://link.bilibili.com/p/center/index#/user-center/my-info/celestial"><button style="font-size: 100%;color:#FF34B3;">天选时刻</button></a><br>

<span>${anchor_name}</span>：
<span>${award_name}</span>
<span>${end_time}</span>
<a target="_blank" id = 'anchor_uid' href="https://message.bilibili.com/#/whisper/mid${anchor_uid}"><button style="font-size: 100%;color:#FF34B3;">私信</button></a>
<a target="_blank" id = 'anchor_room' href="https://live.bilibili.com/${anchor_room}"><button style="font-size: 100%;color:#FF34B3;">直播间</button></a>

<br>
<span>${anchor_name1}</span>：
<span>${award_name1}</span>
<span>${end_time1}</span>
<a target="_blank" id = 'anchor_uid1' href="https://message.bilibili.com/#/whisper/mid${anchor_uid1}"><button style="font-size: 100%;color:#FF34B3;">私信</button></a>
<a target="_blank" id = 'anchor_room1' href="https://live.bilibili.com/${anchor_room1}"><button style="font-size: 100%;color:#FF34B3;">直播间</button></a>
<br>
<span>${anchor_name2}</span>：
<span>${award_name2}</span>
<span>${end_time2}</span>
<a target="_blank" id = 'anchor_uid2' href="https://message.bilibili.com/#/whisper/mid${anchor_uid2}"><button style="font-size: 100%;color:#FF34B3;">私信</button></a>
<a target="_blank" id = 'anchor_room2' href="https://live.bilibili.com/${anchor_room2}"><button style="font-size: 100%;color:#FF34B3;">直播间</button></a>
<br>
<a target="_blank" href="https://link.bilibili.com/p/center/index#/user-center/my-info/award"><button style="font-size: 100%;color:#FF34B3;">实物宝箱</button></a><br>
<span>${awardlist_list[0]}</span>
<br>
<a target="_blank" href="https://message.bilibili.com/#/at"><button style="font-size: 100%;color:#FF34B3;">关注的@信息</button></a><br>
<span>${at_list}</span><br>

<a target="_blank" href="https://message.bilibili.com/#/reply"><button style="font-size: 100%;color:#FF34B3;">关注的回复信息</button></a><br>
<span>${reply_list}</span>
</div>
</fieldset>
`);
                award.find('div[data-toggle="showaward"] [data-action="save"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = true
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = MY_API.CONFIG.freejournal7
                })

                let sessions = $("<div class='zdbgjsessions'>");
                sessions.css({
                    'width': '800px',
                    'height': '550px',
                    'max-height': `${heightmax}px`,
                    'position': 'absolute',
                    'top': '10px',
                    'right': '10px',
                    'background': 'rgba(255,255,255,1)',
                    'padding': '10px',
                    'z-index': '9999',
                    'border-radius': '12px',
                    'transition': 'height .3s',
                    'overflow': 'auto',
                    'line-height': '15px',
                    'user-select': 'text',
                });
                sessions.append(`
<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【日志】</legend>

<div data-toggle="journal_clear">
<button data-action="save" style="font-size: 100%;color: #FF34B3;" >清空日志</button>
</div>

<div id="sessions_msg" style="font-size: 100%;color:#FF34B3;">
<span>${sessions_msg}</span>
</div>

<div data-toggle="journal_shutdown">
<button data-action="save" style="font-size: 100%;color: #FF34B3;position:absolute;top:10px;right:10%" >关闭</button>
</div>
</fieldset>
`);

                $('.player-section.p-relative.border-box.none-select.z-player-section').append(sessions);
                $('.zdbgjsessions').hide()
                sessions.find('div[data-toggle="journal_shutdown"] [data-action="save"]').click(async function () {
                    journal_pb_console = false
                    journal_medal_console = false
                    goldjournal_console = false
                    freejournal_console = false
                    freejournal2_console = false
                    freejournal3_console = false
                    freejournal4_console = false
                    freejournal5_console = false
                    freejournal6_console = false
                    freejournal7_console = false
                    freejournal8_console = false
                    get_sessions_console = false
                    lottery_result_console = false
                    journal_popularity_red_pocket_console = false
                    $('.zdbgjsessions').toggle()
                })
                sessions.find('div[data-toggle="journal_clear"] [data-action="save"]').click(async function () {
                    if(journal_pb_console)MY_API.CONFIG.journal_pb = []
                    if(journal_medal_console)MY_API.CONFIG.journal_medal = []
                    if(goldjournal_console)MY_API.CONFIG.goldjournal = []
                    if(freejournal_console)MY_API.CONFIG.freejournal = []
                    if(freejournal2_console)MY_API.CONFIG.freejournal2 = []
                    if(freejournal3_console)MY_API.CONFIG.freejournal3 = []
                    if(freejournal4_console)MY_API.CONFIG.freejournal4 = []
                    if(freejournal5_console)MY_API.CONFIG.freejournal5 = []
                    if(freejournal6_console)MY_API.CONFIG.freejournal6 = []
                    if(freejournal7_console)MY_API.CONFIG.freejournal7 = []
                    if(freejournal8_console)MY_API.CONFIG.freejournal8 = []
                    if(get_sessions_console)MY_API.CONFIG.get_sessions = []
                    if(lottery_result_console)MY_API.CONFIG.lottery_result = []
                    if(journal_popularity_red_pocket_console)MY_API.CONFIG.journal_popularity_red_pocket = []
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = ''
                })


                let tags = $("<div class='zdbgjtags'>");
                tags.css(div_css);
                var now_num = 0,
                    now_p = '无',
                    num_length = 0,
                    getmsg_now_p = '无',
                    getmsg_now_num = 0,
                    getmsg_num_length = 0
                tags.append(`
<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【一键分组及取关】</legend>

<append style="font-size: 100%;color:blue;">
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp同时勾选时：将按优先级顺序天选中奖主播、低粉主播、动态鸽子对默认关注分组依次进行分组！请勿重复点击！<br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp如果有卡住的情况，大多是获取数据过频被限制访问了，可去掉卡住的进度项，刷新后再次尝试！<br>
<br>
<div id="now_num" style="font-size: 100%;color:#FF34B3;">
当前操作：<span>${now_p}</span>进度：<span>${now_num}</span>/<span>${num_length}</span>
</div>

<div data-toggle="tags1">
<append style="font-size: 100%;color:#FF34B3;">
<button data-action="save" style="font-size: 100%;color: #FF34B3" >对默认关注分组进行一键分组！</button>
</div>

<div data-toggle="tags6">
<append style="font-size: 100%;color:#FF34B3;">
<input style="vertical-align: text-top;" type="checkbox">天选中奖主播：天选抽奖中过奖的主播<br>
</div>

<div data-toggle="tags2">
<append style="font-size: 100%;color:#FF34B3;">
<input style="vertical-align: text-top;" type="checkbox">低粉丝量主播：粉丝数量低于<input class="num" style="width: 50px;vertical-align:inherit;" type="text">的主播
<button data-action="save" style="font-size: 100%;color: #FF34B3" >保存</button>
<button data-action="save1" style="font-size: 100%;color: #FF34B3" >一键取关！</button>
</div>

<div data-toggle="tags5">
<append style="font-size: 100%;color:#FF34B3;">
<input style="vertical-align: text-top;" type="checkbox">动态鸽子主播：超过<input class="num" style="width: 30px;vertical-align:inherit;" type="text">天未发动态的主播
<button data-action="save" style="font-size: 100%;color: #FF34B3" >保存</button>
<button data-action="save1" style="font-size: 100%;color: #FF34B3" >一键取关！</button><br>
</div>

<div data-toggle="tags_shutdown">
<button data-action="save" style="font-size: 100%;color: #FF34B3;position:absolute;top:10px;right:15%" >关闭</button>
</div>
</fieldset>

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【无私信/关注自动回复一键取关】</legend>
<append style="font-size: 100%;color:blue;">
注：仅操作默认分组！每满50取关，暂停一分钟！

<div data-toggle="getmsg">
<append style="font-size: 100%; color: #FF34B3">
<input style="vertical-align: text-top;" type="checkbox">关注直播主播数量大于<input class="num" style="width: 50px;vertical-align:inherit;" type="text">时自动取关无私信主播
<button data-action="save1" style="font-size: 100%;color: #FF34B3" >保存</button><br>
<button id="getmsg" data-action="save" style="font-size: 100%;color: #FF34B3" >一键取关无私信主播</button>
</div>
</fieldset>

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【一键取关默认分组】</legend>
<append style="font-size: 100%;color:#FF34B3;">
<div data-toggle="tags7">
<button id = "tags7" data-action="save" style="font-size: 100%;color: #FF34B3" >一键取关默认分组主播</button>
</div>
</fieldset>

<fieldset>
<legend  style="font-size: 100%;color:#FF34B3;">【一键屏蔽主播直播间】</legend>
<append style="font-size: 100%;color:#FF34B3;">
<div data-toggle="tags3">
<button id = "tags3" data-action="save" style="font-size: 100%;color: #FF34B3" >一键屏蔽主播直播间！</button><br>
<append style="font-size: 100%;color:blue;">
填写直播间真实房间号，英文逗号【,】隔开：
</div>
<br>
<textarea id="textareainput" rows="8" cols="64" style="position: relative; bottom :10px; left: 0px;z-index:999;color: #00000075;border-radius: 2px;border: solid;border-width: 1px;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">${MY_API.CONFIG.ignore_room}</textarea>
</fieldset>
`);

                let txskty = $("<div class='txskty'>");
                txskty.css({
                    'width': '280px',
                    'height': '330px',
                    'position': 'absolute',
                    'top': '100px',
                    'left': `${heightmax/2+140}px`,
                    'background-image': `url(${txskdatu})`,
                    'padding': '10px',
                    'z-index': '9999',
                    'transition': 'height .3s',
                    'overflow': 'auto',
                    'line-height': '15px',
                    'user-select': 'text',
                });
                let txxx = $(`<img id="txxx" width="54" height="54"  style="position: absolute; top: 84px; left: ${heightmax/2+400}px;z-index:99999;" src=${xxxx} />`)
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(txxx);
                $('#txxx').hide()
                txxx.click(function () {
                    $('.txskty').hide()
                    $('#txxx').hide()
                });
                txskty.append(`
<br><br><br><br><br>
<div style="font-size: 100%;color:#FF34B3;" data-toggle="txskty">
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp天选时刻模拟器
<br><br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp奖品：<input class="num" style="width: 124px;vertical-align:inherit;" type="text"><br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp奖品数量：<input class="num1" style="width: 100px;vertical-align:inherit;" type="text"><br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp总参与数：<input class="num2" style="width: 100px;vertical-align:inherit;" type="text"><br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp参与次数：<input class="num3" style="width: 100px;vertical-align:inherit;" type="text"><br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<button id="txskty_start" data-action="save" style="font-size: 100%;color: #FF34B3" >开始抽奖</button><br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<l id = "txskty_djs">开奖倒计时：5</l><br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<l id = "txskty_zj"></l>
</div>
`);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(txskty);
                $('.txskty').hide()
                txskty.find('div[data-toggle="txskty"] .num').val(("苹果13 PRO").toString());
                txskty.find('div[data-toggle="txskty"] .num1').val(("10").toString());
                txskty.find('div[data-toggle="txskty"] .num2').val(("1000").toString());
                txskty.find('div[data-toggle="txskty"] .num3').val(("1").toString());
                let txskty_run = true
                txskty.find('div[data-toggle="txskty"] [data-action="save"]').click(async function () {
                    if(!txskty_run)return
                    txskty_run = false
                    let jp = txskty.find('div[data-toggle="txskty"] .num').val()
                    let jp_num = parseInt(txskty.find('div[data-toggle="txskty"] .num1').val())
                    let num_max = parseInt(txskty.find('div[data-toggle="txskty"] .num2').val())//参与人数
                    let jp_join_n = parseInt(txskty.find('div[data-toggle="txskty"] .num3').val())//参与次数
                    let u_num = []//参与序号
                    let zj_num = []//中奖序号
                    if(jp_join_n > num_max || jp_num > num_max){
                        alert('设置有误！')
                        txskty_run = true
                        return
                    }
                    let dt = document.getElementById('txskty_djs')
                    let zjdt = document.getElementById('txskty_zj')
                    zjdt.innerHTML = ``
                    for(let i=0;i<5;i++){//参与随机序号
                        setTimeout(() => {
                            dt.innerHTML = `开奖倒计时：${4 - i}`
                        }, i * 1000)
                    }
                    for(let i=0;i<jp_join_n;i++){//参与随机序号
                        let nn = Math.ceil(Math.random() * num_max);
                        if(u_num.indexOf(nn) == -1){
                            u_num.push(nn)
                        }else{
                            i--
                        }
                    }
                    for(let i=0;i<jp_num;i++){//中奖随机序号
                        let nn = Math.ceil(Math.random() * num_max);
                        if(zj_num.indexOf(nn) == -1){
                            zj_num.push(nn)
                        }else{
                            i--
                        }
                    }
                    setTimeout(() => {
                        MY_API.chatLog(`【天选时刻模拟抽奖】<br>中奖序号：${zj_num}<br>你的序号：${u_num}`);
                    }, 5000)
                    setTimeout(() => {
                        txskty_run = true
                        let cou = 0
                        for(let i=0;i<u_num.length;i++){//中奖随机序号
                            if(zj_num.indexOf(u_num[i]) > -1)cou++
                        }
                        if(cou==0){
                            zjdt.innerHTML = `你个非酋，没有中奖哦！`
                        }else{
                            zjdt.innerHTML = `恭喜你获得了${jp}*${cou}！`
                        }
                    }, 5000)
                });


                let ignore_room_array = []
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(tags);
                $('.zdbgjtags').hide()


                tags.find('div[data-toggle="tags3"] [data-action="save"]').click(async function () {
                    MY_API.CONFIG.ignore_room = $("#textareainput").val().split(",");
                    if(MY_API.CONFIG.ignore_room == '' || MY_API.CONFIG.ignore_room[0] == 0){
                        MY_API.chatLog(`【一键屏蔽】名单为空！`);
                        return;
                    }
                    for(let i = 0; i < MY_API.CONFIG.ignore_room.length; i++){
                        ignore_room_array[i] = Number(MY_API.CONFIG.ignore_room[i])
                    }
                    for(let i = 0; i < MY_API.CONFIG.ignore_room.length; i++){
                        let num1 = MY_API.CONFIG.Anchor_ignore_room.indexOf(Number(MY_API.CONFIG.ignore_room[i]))
                        if(num1 == -1)MY_API.CONFIG.Anchor_ignore_room.push(Number(MY_API.CONFIG.ignore_room[i]));
                    }
                    MY_API.saveConfig();
                    MY_API.chatLog(`【一键屏蔽】屏蔽黑名单：${MY_API.CONFIG.Anchor_ignore_room}！`);
                });
                let get_tags_mid_list = async function(pn,group_tag_id){
                    await sleep(100)
                    if(pn == 1)
                        tags_mid_list = [];
                    return BAPI.get_tags_mid(Live_info.uid, group_tag_id, pn).then((data) => { //0默认关注分组-10特别关注分组
                        let midlist = data.data
                        if(midlist.length > 0){
                            now_p = '【获取分组数据】'
                            now_num = tags_mid_list.length
                            num_length = tags_mid_list.length
                            $('#now_num span:eq(0)').text(now_p);
                            $('#now_num span:eq(1)').text(now_num);
                            $('#now_num span:eq(2)').text(num_length);
                            for(let i = 0; i < midlist.length; i++){
                                tags_mid_list.push(midlist[i].mid)
                            }
                            return get_tags_mid_list(pn + 1,group_tag_id)
                        }
                    }, () => {
                        console.log('await error')
                        return MY_API.chatLog('获取数据出错！', 'warning');
                    })
                }
                let get_tags_data = async function () { //获取分组数据
                    await BAPI.get_tags().then(async(data) => {
                        //console.log(tags_name, tags_tagid)
                        let tags_data = data.data
                        tags_name = []
                        tags_tagid = []
                        for(let i = 0; i < tags_data.length; i++){
                            tags_name[i] = tags_data[i].name
                            tags_tagid[i] = tags_data[i].tagid
                        }
                        //console.log(tags_name, tags_tagid)
                    });
                }
                tags.find('div[data-toggle="tags7"] [data-action="save"]').click(async function () {
                    if(!groupmove_mark) return MY_API.chatLog('正在执行中！', 'warning');
                    let r = confirm("点击确定，一键取关默认分组主播!");
                    if(r == true){
                        MY_API.chatLog(`【一键取关】开始获取默认分组数据！`);
                        await get_tags_mid_list(1,0)//0默认分组
                        MY_API.chatLog(`【一键取关】完成获取默认分组数据！`);
                        //console.log(tags_mid_list)
                        groupmove_mark = false
                        if(tags_mid_list.length == 0){
                            return MY_API.chatLog(`【一键取关】默认分组无数据！`);
                        }
                        MY_API.chatLog(`【一键取关】默认分组开始取关！`);
                        let err = false
                        for(let i = 0; i < tags_mid_list.length; i++){
                            await sleep(1000)
                            if(i % 2 == 0){
                                $("#tags7").css("color", "red")
                            }else{
                                $("#tags7").css("color", "#FF34B3")
                            }
                            now_p = '【一键取关默认分组】'
                            now_num = i + 1
                            num_length = tags_mid_list.length
                            $('#now_num span:eq(0)').text(now_p);
                            $('#now_num span:eq(1)').text(now_num);
                            $('#now_num span:eq(2)').text(num_length);
                            BAPI.modify(tags_mid_list[i], 2).then((data) => {
                                //console.log('默认分组主播', data)
                                if(data.code == 0){
                                    MY_API.chatLog(`【一键取关】默认分组主播：${tags_mid_list[i]}取关成功`);
                                }else{
                                    err = true
                                    i--
                                }
                            })
                            if(err){
                                MY_API.chatLog(`【一键取关】取关出错，大概是风控了！`);
                                now_p = '【风控暂停60秒】'
                                $('#now_num span:eq(0)').text(now_p);
                                await sleep(60*1000)
                                err = false
                            }
                        }
                        now_p = '【一键取关默认分组完成】'
                        $('#now_num span:eq(0)').text(now_p);
                        groupmove_mark = true
                        $("#tags7").css("color", "#FF34B3")
                        MY_API.chatLog(`【一键取关】默认分组取关结束！`);
                    }
                })

                tags.find('div[data-toggle="tags1"] [data-action="save"]').click(async function () {
                    if(!groupmove_mark) return MY_API.chatLog('正在执行中！', 'warning');
                    groupmove_mark = false
                    $('#now_num span:eq(0)').text('开始获取分组数据');
                    MY_API.chatLog(`【一键分组】同时勾选时：将按优先级顺序天选中奖主播、低粉主播、动态鸽子对默认关注分组依次进行分组！`);
                    await get_tags_data()
                    if(tags_name.indexOf('中奖主播')==-1){
                        await BAPI.tag_create('中奖主播').then(async(data) => {
                            //console.log(data)
                            if(data.code == 0){
                                MY_API.chatLog(`【一键分组】中奖主播分组创建成功！`);
                            }else{
                                MY_API.chatLog(`【一键分组】中奖主播分组:${data.message}`);
                            }
                        });
                    }
                    if(tags_name.indexOf('低粉主播')==-1){
                        await BAPI.tag_create('低粉主播').then(async(data) => {
                            await sleep(2000)
                            //console.log(data)
                            if(data.code == 0){
                                MY_API.chatLog(`【一键分组】低粉主播分组创建成功！`);
                            }else{
                                MY_API.chatLog(`【一键分组】低粉主播分组${data.message}`);
                            }
                        });
                    }
                    if(tags_name.indexOf('动态鸽子')==-1){
                        await BAPI.tag_create('动态鸽子').then(async(data) => {
                            await sleep(2000)
                            //console.log(data)
                            if(data.code == 0){
                                MY_API.chatLog(`【一键分组】动态鸽子主播分组分组创建成功！`);
                            }else{
                                MY_API.chatLog(`【一键分组】动态鸽子主播分组${data.message}`);
                            }
                        });
                    }
                    await sleep(5000)
                    await get_tags_data()
                    if(MY_API.CONFIG.tags6_checkbox){
                        MY_API.chatLog(`【一键分组】正在获取默认关注分组数据`);
                        await get_tags_mid_list(1,0)//0默认分组
                        //console.log('第一次默认分组数据', tags_mid_list)
                        MY_API.chatLog(`【一键分组】获取默认关注分组数据已完成`);
                        MY_API.chatLog(`【一键分组】正在获取天选中奖数据`);
                        let AnchorRecord_uid = []//天选信息uid
                        let get_AnchorRecord = async function(pn = 1){
                            now_p = '【获取天选中奖数据】'
                            now_num = AnchorRecord_uid.length
                            num_length = AnchorRecord_uid.length
                            $('#now_num span:eq(0)').text(now_p);
                            $('#now_num span:eq(1)').text(now_num);
                            $('#now_num span:eq(2)').text(num_length);
                            await sleep(100)
                            if(pn == 1)
                                AnchorRecord_uid = [];
                            await BAPI.Lottery.anchor.AnchorRecord(pn).then((data) => {
                                //console.log('AnchorRecord_uid', data)
                                let adata = data.data.list
                                for(let i = 0; i < adata.length; i++){
                                    AnchorRecord_uid.push(adata[i].anchor_uid)
                                }
                                //console.log('获取天选中奖信息', AnchorRecord_uid)
                                if(pn < data.data.page_count)
                                    return get_AnchorRecord(pn + 1)
                            }, async() => {
                                MY_API.chatLog('【一键分组】获取中奖数据出错，暂停10分钟！', 'warning');
                                now_p = '【风控暂停】'
                                await sleep(600000)
                                return get_AnchorRecord(pn)
                            });
                        };
                        await get_AnchorRecord()
                        MY_API.chatLog(`【一键分组】获取天选中奖数据已完成`);
                        MY_API.chatLog(`【一键分组】正在移动至天选中奖主播分组`);
                        let move_AnchorRecord_uid = async function () {
                            let auid = tags_name.indexOf('中奖主播')
                            if(auid==-1)return
                            for(let i = 0; i < AnchorRecord_uid.length; i++){
                                now_p = '【移动至天选中奖分组】'
                                now_num = i + 1
                                num_length = AnchorRecord_uid.length
                                $('#now_num span:eq(0)').text(now_p);
                                $('#now_num span:eq(1)').text(now_num);
                                $('#now_num span:eq(2)').text(num_length);
                                if(tags_mid_list.indexOf(AnchorRecord_uid[i]) > -1){
                                    await sleep(1000)
                                    BAPI.tags_addUsers(AnchorRecord_uid[i], tags_tagid[auid]).then((data) => {
                                        //console.log('move中奖主播', data)
                                    })
                                }
                            }
                        }
                        await move_AnchorRecord_uid()
                        now_p = '【移动至天选中奖分组完成】'
                        $('#now_num span:eq(0)').text(now_p);
                        MY_API.chatLog(`【一键分组】天选中奖主播分组已完成`);
                    }

                    if(MY_API.CONFIG.tags2_checkbox && MY_API.CONFIG.tags2_min){
                        await get_tags_mid_list(1,0)//0默认分组//刷新默认分组数据
                        //console.log('刷新默认分组数据', tags_mid_list)
                        MY_API.chatLog(`【一键分组】正在获取主播粉丝数量及移动至低粉主播分组`);
                        let move_lowfans_uid = async function () {
                            if(MY_API.CONFIG.tags2_min == 0)return
                            let auid = tags_name.indexOf('低粉主播')
                            if(auid==-1)return
                            for(let i = 0; i < tags_mid_list.length; i++){
                                now_p = '【获取粉丝数量及移动分组】'
                                now_num = i + 1
                                num_length = tags_mid_list.length
                                $('#now_num span:eq(0)').text(now_p);
                                $('#now_num span:eq(1)').text(now_num);
                                $('#now_num span:eq(2)').text(num_length);
                                await sleep(1000)
                                await BAPI.web_interface_card(tags_mid_list[i]).then(async(data) => {
                                    let fansnum = data.data.follower
                                    if(fansnum < MY_API.CONFIG.tags2_min){
                                        //console.log('粉丝数量', fansnum,tags_tagid[auid])
                                        await BAPI.tags_addUsers(tags_mid_list[i], tags_tagid[auid]).then((data) => {
                                            lowfans_uid.push(tags_mid_list[i])
                                            //console.log('move低粉主播', data)
                                        })
                                    }
                                },async() => {
                                    MY_API.chatLog(`【低粉主播】获取粉丝数据出错，暂停1分钟！`, 'warning');
                                    now_p = '【低粉主播】暂停中'
                                    $('#now_num span:eq(0)').text(now_p);
                                    await sleep(60000)
                                    i--
                                })
                            }
                        }
                        await move_lowfans_uid()
                        now_p = '【低粉主播分组完成】'
                        $('#now_num span:eq(0)').text(now_p);
                        MY_API.chatLog(`【一键分组】低粉主播分组完成`);
                    }
                    if(MY_API.CONFIG.tags5_checkbox && MY_API.CONFIG.tags5_min){//动态鸽子
                        await get_tags_mid_list(1,0)//0默认分组//刷新默认分组数据
                        //console.log('刷新默认分组数据', tags_mid_list)
                        MY_API.chatLog(`【一键分组】开始动态鸽子主播分组`);
                        for(let i = 0; i < tags_mid_list.length; i++){
                            now_p = '【获取动态鸽子主播数据及移动分组】'
                            now_num = i + 1
                            num_length = tags_mid_list.length
                            $('#now_num span:eq(0)').text(now_p);
                            $('#now_num span:eq(1)').text(now_num);
                            $('#now_num span:eq(2)').text(num_length);
                            await BAPI.space_history(tags_mid_list[i]).then(function(data){
                                //console.log('data',data)
                                if(data.data.cards ==undefined || data.data.cards[0].desc ==undefined)return space_history_uid.push(tags_mid_list[i])
                                let cards = data.data.cards
                                let timestamp = cards[0].desc.timestamp
                                if(cards[1] != undefined && cards[1].desc != undefined && timestamp<cards[1].desc.timestamp)return timestamp = cards[1].desc.timestamp
                                if((ts_s()+s_diff)-timestamp>MY_API.CONFIG.tags5_min * 3600 *24)space_history_uid.push(tags_mid_list[i])
                            })
                            await sleep(5000)
                        }
                        now_p = '【动态鸽子主播分组完成】'
                        $('#now_num span:eq(0)').text(now_p);
                        MY_API.chatLog(`【一键分组】动态鸽子主播分组完成`);
                    }
                    groupmove_mark = true
                });

                tags.find('div[data-toggle="tags2"] .num').val(parseInt(MY_API.CONFIG.tags2_min.toString()))
                tags.find('div[data-toggle="tags2"] [data-action="save"]').click(async function () {
                    MY_API.CONFIG.tags2_min = parseInt(tags.find('div[data-toggle="tags2"] .num').val())
                    MY_API.saveConfig()
                    MY_API.chatLog(`低粉主播设置：${MY_API.CONFIG.tags2_min}`);
                });
                tags.find('div[data-toggle="tags_shutdown"] [data-action="save"]').click(async function () {
                    $('.zdbgjtags').toggle()
                });

                if(MY_API.CONFIG.tags2_checkbox)tags.find('div[data-toggle="tags2"] input').attr('checked', '');
                tags.find('div[data-toggle="tags2"] input:checkbox').change(function () {
                    MY_API.CONFIG.tags2_checkbox = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`低粉主播设置：${MY_API.CONFIG.tags2_checkbox}`);
                });

                if(MY_API.CONFIG.tags6_checkbox)tags.find('div[data-toggle="tags6"] input').attr('checked', '');
                tags.find('div[data-toggle="tags6"] input:checkbox').change(function () {
                    MY_API.CONFIG.tags6_checkbox = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`中奖主播设置：${MY_API.CONFIG.tags6_checkbox}`);
                });

                if(MY_API.CONFIG.tags5_checkbox)tags.find('div[data-toggle="tags5"] input').attr('checked', '');
                tags.find('div[data-toggle="tags5"] input:checkbox').change(function () {
                    MY_API.CONFIG.tags5_checkbox = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`动态鸽子设置：${MY_API.CONFIG.tags5_checkbox}`);
                });

                tags.find('div[data-toggle="tags5"] .num').val(parseInt(MY_API.CONFIG.tags5_min.toString()))
                tags.find('div[data-toggle="tags5"] [data-action="save"]').click(async function () {
                    MY_API.CONFIG.tags5_min = parseInt(tags.find('div[data-toggle="tags5"] .num').val())
                    MY_API.saveConfig()
                    MY_API.chatLog(`动态鸽子设置：${MY_API.CONFIG.tags5_min}`);
                });

                tags.find('div[data-toggle="tags5"] [data-action="save1"]').click(async function () {
                    let r = confirm("点击确定，一键取关动态鸽子主播!");
                    if(r == true){
                        if(!groupmove_mark) return MY_API.chatLog('正在执行中！', 'warning');
                        groupmove_mark = false
                        await get_tags_data()
                        let num = tags_name.indexOf('动态鸽子')
                        if(space_history_uid.length == 0 && num==-1){
                            return MY_API.chatLog(`【一键取关】动态鸽子主播分组无数据！`);
                        }
                        await get_tags_mid_list(1,tags_tagid[num])
                        for(let i=0;i<tags_mid_list.length;i++){
                            if(space_history_uid.indexOf(tags_mid_list[i])==-1)space_history_uid.push(tags_mid_list[i])
                        }
                        let err = false
                        for(let i = 0; i < space_history_uid.length; i++){
                            now_p = '【一键取关】取关动态鸽子主播'
                            now_num = i + 1
                            num_length = space_history_uid.length
                            $('#now_num span:eq(0)').text(now_p);
                            $('#now_num span:eq(1)').text(now_num);
                            $('#now_num span:eq(2)').text(num_length);
                            await sleep(1000)
                            BAPI.modify(space_history_uid[i], 2).then((data) => {
                                //console.log('动态鸽子主播取关', data)
                                if(data.code == 0){
                                    MY_API.chatLog(`【一键取关】动态鸽子主播UID：${space_history_uid[i]}取关成功`);
                                }else{
                                    err = true
                                    i--
                                }
                            })
                            if(err){
                                MY_API.chatLog(`【一键取关】取关出错，大概是风控了！`);
                                now_p = '【风控暂停60秒】'
                                $('#now_num span:eq(0)').text(now_p);
                                await sleep(60*1000)
                                err = false
                            }
                        }
                        now_p = '【取关动态鸽子主播完成】'
                        $('#now_num span:eq(0)').text(now_p);
                        groupmove_mark = true
                    }
                })

                if(MY_API.CONFIG.getmsg)tags.find('div[data-toggle="getmsg"] input').attr('checked', '');
                tags.find('div[data-toggle="getmsg"] input:checkbox').change(function () {
                    MY_API.CONFIG.getmsg = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`无私信主播设置：${MY_API.CONFIG.getmsg}`);
                });

                tags.find('div[data-toggle="getmsg"] .num').val(parseInt(MY_API.CONFIG.getmsg_num.toString()))
                tags.find('div[data-toggle="getmsg"] [data-action="save1"]').click(async function () {
                    let val = parseInt(tags.find('div[data-toggle="getmsg"] .num').val())
                    if(val > 3000 ){
                        MY_API.chatLog('直播主播数量不包含未直播的UP！上限不大于3000，建议2900', 'warning');
                        val = 3000
                    }
                    MY_API.CONFIG.getmsg_num = val
                    MY_API.saveConfig()
                    MY_API.chatLog(`无私信主播设置：${MY_API.CONFIG.getmsg_num}`);
                });

                tags.find('div[data-toggle="getmsg"] [data-action="save"]').click(async function () {
                    if(getmsg_mark == false || groupmove_mark == false) return MY_API.chatLog('正在执行中！', 'warning');
                    getmsg_mark = false
                    groupmove_mark = false
                    await get_tags_mid_list(1,0)//0默认分组
                    let modify_count = 0
                    for(let i = 0; i < tags_mid_list.length; i++){
                        now_p = '【获取私信数据并取关】'
                        now_num = i + 1
                        num_length = tags_mid_list.length
                        $('#now_num span:eq(0)').text(now_p);
                        $('#now_num span:eq(1)').text(now_num);
                        $('#now_num span:eq(2)').text(num_length);
                        if(MY_API.CONFIG.haveMsg_uid_list.indexOf(tags_mid_list[i])>-1)continue
                        await sleep(1000)
                        let err = false
                        await BAPI.getMsg(tags_mid_list[i]).then(async(data) => {
                            let msg = data.data.messages
                            //console.log('无私信主播取关getMsg', msg)
                            if(msg == null){
                                if(modify_count && modify_count % 50 == 0){
                                    now_p = '【获取私信数据】取关暂停中'
                                    $('#now_num span:eq(0)').text(now_p);
                                    await sleep(60000) //取关达到50，暂停一分钟
                                }
                                modify_count++;
                                BAPI.modify(tags_mid_list[i], 2).then((data) => {
                                    //console.log('无私信主播取关', data)
                                    if(data.code == 0){
                                        MY_API.chatLog(`【获取私信数据并取关】无私信UID：${tags_mid_list[i]}取关成功！<br>本次已取关${modify_count}个！`);
                                    }else{
                                        err = true
                                        i--
                                    }
                                })
                            }else{
                                MY_API.CONFIG.haveMsg_uid_list.push(tags_mid_list[i])
                                MY_API.saveConfig()
                            }
                        },async() => {
                            MY_API.chatLog(`【获取私信数据并取关】获取私信数据出错，暂停1分钟！`, 'warning');
                            now_p = '【获取私信数据并取关】取关暂停中'
                            $('#now_num span:eq(0)').text(now_p);
                            await sleep(60000)
                            i--
                        })
                        if(err){
                            MY_API.chatLog(`【获取私信数据并取关】取关出错，大概是风控了！`);
                            now_p = '【获取私信数据并取关】取关暂停中'
                            $('#now_num span:eq(0)').text(now_p);
                            await sleep(60000)
                        }
                    }
                    now_p = `【无私信取关完成】本次取关成功${modify_count}个！`
                    $('#now_num span:eq(0)').text(now_p);
                    getmsg_mark = true
                    groupmove_mark = true
                });

                tags.find('div[data-toggle="tags2"] [data-action="save1"]').click(async function () {
                    let r = confirm("点击确定，一键取关低粉主播!");
                    if(r == true){
                        if(!groupmove_mark) return MY_API.chatLog('正在执行中！', 'warning');
                        groupmove_mark = false
                        await get_tags_data()
                        let num = tags_name.indexOf('低粉主播')
                        if(lowfans_uid.length == 0 && num==-1){
                            return MY_API.chatLog(`【一键取关】低粉主播分组无数据！`);
                        }
                        await get_tags_mid_list(1,tags_tagid[num])
                        for(let i=0;i<tags_mid_list.length;i++){
                            if(lowfans_uid.indexOf(tags_mid_list[i])==-1)lowfans_uid.push(tags_mid_list[i])
                        }
                        let err = false
                        for(let i = 0; i < lowfans_uid.length; i++){
                            now_p = '【一键取关】取关低粉主播'
                            now_num = i + 1
                            num_length = lowfans_uid.length
                            $('#now_num span:eq(0)').text(now_p);
                            $('#now_num span:eq(1)').text(now_num);
                            $('#now_num span:eq(2)').text(num_length);
                            await sleep(1000)
                            BAPI.modify(lowfans_uid[i], 2).then((data) => {
                                //console.log('低粉主播取关', data)
                                if(data.code == 0){
                                    MY_API.chatLog(`【一键取关】低粉主播UID：${lowfans_uid[i]}取关成功`);
                                }else{
                                    err = true
                                    i--
                                }
                            })
                            if(err){
                                MY_API.chatLog(`【一键取关】取关出错，大概是风控了！`);
                                now_p = '【风控暂停60秒】'
                                $('#now_num span:eq(0)').text(now_p);
                                await sleep(60*1000)
                                err = false
                            }
                        }
                        now_p = '【取关低粉主播完成】'
                        $('#now_num span:eq(0)').text(now_p);
                        groupmove_mark = true
                    }
                })

                $('.chat-history-panel').append(award);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(ohb);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(tpp);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(tj);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(div);
                //页面切换
                let chang_page_div1 = $('<button id="chang_page_div1" style="position: absolute; top: 10px; right: 535px;z-index:999;background-color:yellow;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '首<br>页</button>');
                let chang_page_div2 = $('<button id="chang_page_div2" style="position: absolute; top: 90px; right: 535px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '设<br>置</button>');
                let chang_page_div3 = $('<button id="chang_page_div3" style="position: absolute; top: 290px; right: 535px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '日<br>志</button>');
                let chang_page_div4 = $('<button id="chang_page_div4" style="position: absolute; top: 130px; right: 535px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '天<br>选</button>');
                let chang_page_div5 = $('<button id="chang_page_div5" style="position: absolute; top: 170px; right: 535px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '红<br>包</button>');
                let chang_page_div6 = $('<button id="chang_page_div6" style="position: absolute; top: 370px; right: 535px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '推<br>送</button>');
                let chang_page_div7 = $('<button id="chang_page_div7" style="position: absolute; top: 210px; right: 535px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '实<br>活</button>');
                let chang_page_div8 = $('<button id="chang_page_div8" style="position: absolute; top: 50px; right: 535px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '每<br>日</button>');
                let chang_page_div9 = $('<button id="chang_page_div9" style="position: absolute; top: 250px; right: 535px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '动<br>态</button>');
                let chang_page_div10 = $('<button id="chang_page_div10" style="position: absolute; top: 450px; right: 535px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '配<br>导</button>');
                let chang_page_div11 = $('<button id="chang_page_div11" style="position: absolute; top: 330px; right: 535px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '投<br>喂</button>');
                let chang_page_div12 = $('<button id="chang_page_div12" style="position: absolute; top: 410px; right: 535px;z-index:999;background-color:GhostWhite;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                    '其<br>他</button>');
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div1);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div2);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div3);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div4);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div5);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div6);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div7);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div8);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div9);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div10);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div11);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(chang_page_div12);



                chang_page_div1.click(function () {//首页
                    chang_page_div1.css({"background-color":"yellow"})
                    chang_page_div2.css({"background-color":"GhostWhite"})
                    chang_page_div3.css({"background-color":"GhostWhite"})
                    chang_page_div4.css({"background-color":"GhostWhite"})
                    chang_page_div5.css({"background-color":"GhostWhite"})
                    chang_page_div6.css({"background-color":"GhostWhite"})
                    chang_page_div7.css({"background-color":"GhostWhite"})
                    chang_page_div8.css({"background-color":"GhostWhite"})
                    chang_page_div9.css({"background-color":"GhostWhite"})
                    chang_page_div10.css({"background-color":"GhostWhite"})
                    chang_page_div11.css({"background-color":"GhostWhite"})
                    chang_page_div12.css({"background-color":"GhostWhite"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '98'})
                    songli.css({'z-index': '98'})
                    peizhi.css({'z-index': '98'})
                    meiri.css({'z-index': '98'})
                    shiwuhuodong.css({'z-index': '98'})
                    dongtai.css({'z-index': '98'})
                    tuisong.css({'z-index': '98'})
                    hongbao.css({'z-index': '98'})
                    tianxuanshike.css({'z-index': '98'})
                    ohb.css({'z-index': '98'})
                    div.css({'z-index': '99'})
                    tj.css({'z-index': '98'})
                });

                chang_page_div2.click(function () {//抽奖
                    chang_page_div1.css({"background-color":"GhostWhite"})
                    chang_page_div2.css({"background-color":"yellow"})
                    chang_page_div3.css({"background-color":"GhostWhite"})
                    chang_page_div4.css({"background-color":"GhostWhite"})
                    chang_page_div5.css({"background-color":"GhostWhite"})
                    chang_page_div6.css({"background-color":"GhostWhite"})
                    chang_page_div7.css({"background-color":"GhostWhite"})
                    chang_page_div8.css({"background-color":"GhostWhite"})
                    chang_page_div9.css({"background-color":"GhostWhite"})
                    chang_page_div10.css({"background-color":"GhostWhite"})
                    chang_page_div11.css({"background-color":"GhostWhite"})
                    chang_page_div12.css({"background-color":"GhostWhite"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '98'})
                    songli.css({'z-index': '98'})
                    peizhi.css({'z-index': '98'})
                    meiri.css({'z-index': '98'})
                    shiwuhuodong.css({'z-index': '98'})
                    dongtai.css({'z-index': '98'})
                    tuisong.css({'z-index': '98'})
                    hongbao.css({'z-index': '98'})
                    tianxuanshike.css({'z-index': '98'})
                    ohb.css({'z-index': '98'})
                    div.css({'z-index': '98'})
                    tj.css({'z-index': '99'})
                });

                chang_page_div3.click(function () {//奖品
                    chang_page_div1.css({"background-color":"GhostWhite"})
                    chang_page_div2.css({"background-color":"GhostWhite"})
                    chang_page_div3.css({"background-color":"yellow"})
                    chang_page_div4.css({"background-color":"GhostWhite"})
                    chang_page_div5.css({"background-color":"GhostWhite"})
                    chang_page_div6.css({"background-color":"GhostWhite"})
                    chang_page_div7.css({"background-color":"GhostWhite"})
                    chang_page_div8.css({"background-color":"GhostWhite"})
                    chang_page_div9.css({"background-color":"GhostWhite"})
                    chang_page_div10.css({"background-color":"GhostWhite"})
                    chang_page_div11.css({"background-color":"GhostWhite"})
                    chang_page_div12.css({"background-color":"GhostWhite"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '98'})
                    songli.css({'z-index': '98'})
                    peizhi.css({'z-index': '98'})
                    meiri.css({'z-index': '98'})
                    shiwuhuodong.css({'z-index': '98'})
                    dongtai.css({'z-index': '98'})
                    tuisong.css({'z-index': '98'})
                    hongbao.css({'z-index': '98'})
                    tianxuanshike.css({'z-index': '98'})
                    ohb.css({'z-index': '99'})
                    div.css({'z-index': '98'})
                    tj.css({'z-index': '98'})
                });
                chang_page_div4.click(function () {//天选
                    chang_page_div1.css({"background-color":"GhostWhite"})
                    chang_page_div2.css({"background-color":"GhostWhite"})
                    chang_page_div3.css({"background-color":"GhostWhite"})
                    chang_page_div4.css({"background-color":"yellow"})
                    chang_page_div5.css({"background-color":"GhostWhite"})
                    chang_page_div6.css({"background-color":"GhostWhite"})
                    chang_page_div7.css({"background-color":"GhostWhite"})
                    chang_page_div8.css({"background-color":"GhostWhite"})
                    chang_page_div9.css({"background-color":"GhostWhite"})
                    chang_page_div10.css({"background-color":"GhostWhite"})
                    chang_page_div11.css({"background-color":"GhostWhite"})
                    chang_page_div12.css({"background-color":"GhostWhite"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '98'})
                    songli.css({'z-index': '98'})
                    peizhi.css({'z-index': '98'})
                    meiri.css({'z-index': '98'})
                    shiwuhuodong.css({'z-index': '98'})
                    dongtai.css({'z-index': '98'})
                    tuisong.css({'z-index': '98'})
                    hongbao.css({'z-index': '98'})
                    tianxuanshike.css({'z-index': '99'})
                    ohb.css({'z-index': '98'})
                    div.css({'z-index': '98'})
                    tj.css({'z-index': '98'})
                });
                chang_page_div5.click(function () {//红包
                    chang_page_div1.css({"background-color":"GhostWhite"})
                    chang_page_div2.css({"background-color":"GhostWhite"})
                    chang_page_div3.css({"background-color":"GhostWhite"})
                    chang_page_div4.css({"background-color":"GhostWhite"})
                    chang_page_div5.css({"background-color":"yellow"})
                    chang_page_div6.css({"background-color":"GhostWhite"})
                    chang_page_div7.css({"background-color":"GhostWhite"})
                    chang_page_div8.css({"background-color":"GhostWhite"})
                    chang_page_div9.css({"background-color":"GhostWhite"})
                    chang_page_div10.css({"background-color":"GhostWhite"})
                    chang_page_div11.css({"background-color":"GhostWhite"})
                    chang_page_div12.css({"background-color":"GhostWhite"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '98'})
                    songli.css({'z-index': '98'})
                    peizhi.css({'z-index': '98'})
                    meiri.css({'z-index': '98'})
                    shiwuhuodong.css({'z-index': '98'})
                    dongtai.css({'z-index': '98'})
                    tuisong.css({'z-index': '98'})
                    hongbao.css({'z-index': '99'})
                    tianxuanshike.css({'z-index': '98'})
                    ohb.css({'z-index': '98'})
                    div.css({'z-index': '98'})
                    tj.css({'z-index': '98'})
                });
                chang_page_div6.click(function () {//推送
                    chang_page_div1.css({"background-color":"GhostWhite"})
                    chang_page_div2.css({"background-color":"GhostWhite"})
                    chang_page_div3.css({"background-color":"GhostWhite"})
                    chang_page_div4.css({"background-color":"GhostWhite"})
                    chang_page_div5.css({"background-color":"GhostWhite"})
                    chang_page_div6.css({"background-color":"yellow"})
                    chang_page_div7.css({"background-color":"GhostWhite"})
                    chang_page_div8.css({"background-color":"GhostWhite"})
                    chang_page_div9.css({"background-color":"GhostWhite"})
                    chang_page_div10.css({"background-color":"GhostWhite"})
                    chang_page_div11.css({"background-color":"GhostWhite"})
                    chang_page_div12.css({"background-color":"GhostWhite"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '98'})
                    songli.css({'z-index': '98'})
                    peizhi.css({'z-index': '98'})
                    meiri.css({'z-index': '98'})
                    shiwuhuodong.css({'z-index': '98'})
                    dongtai.css({'z-index': '98'})
                    tuisong.css({'z-index': '99'})
                    hongbao.css({'z-index': '98'})
                    tianxuanshike.css({'z-index': '98'})
                    ohb.css({'z-index': '98'})
                    div.css({'z-index': '98'})
                    tj.css({'z-index': '98'})
                });
                chang_page_div7.click(function () {//实物活动
                    chang_page_div1.css({"background-color":"GhostWhite"})
                    chang_page_div2.css({"background-color":"GhostWhite"})
                    chang_page_div3.css({"background-color":"GhostWhite"})
                    chang_page_div4.css({"background-color":"GhostWhite"})
                    chang_page_div5.css({"background-color":"GhostWhite"})
                    chang_page_div6.css({"background-color":"GhostWhite"})
                    chang_page_div7.css({"background-color":"yellow"})
                    chang_page_div8.css({"background-color":"GhostWhite"})
                    chang_page_div9.css({"background-color":"GhostWhite"})
                    chang_page_div10.css({"background-color":"GhostWhite"})
                    chang_page_div11.css({"background-color":"GhostWhite"})
                    chang_page_div12.css({"background-color":"GhostWhite"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '98'})
                    songli.css({'z-index': '98'})
                    peizhi.css({'z-index': '98'})
                    meiri.css({'z-index': '98'})
                    shiwuhuodong.css({'z-index': '99'})
                    dongtai.css({'z-index': '98'})
                    tuisong.css({'z-index': '98'})
                    hongbao.css({'z-index': '98'})
                    tianxuanshike.css({'z-index': '98'})
                    ohb.css({'z-index': '98'})
                    div.css({'z-index': '98'})
                    tj.css({'z-index': '98'})
                });
                chang_page_div8.click(function () {//每日
                    chang_page_div1.css({"background-color":"GhostWhite"})
                    chang_page_div2.css({"background-color":"GhostWhite"})
                    chang_page_div3.css({"background-color":"GhostWhite"})
                    chang_page_div4.css({"background-color":"GhostWhite"})
                    chang_page_div5.css({"background-color":"GhostWhite"})
                    chang_page_div6.css({"background-color":"GhostWhite"})
                    chang_page_div7.css({"background-color":"GhostWhite"})
                    chang_page_div8.css({"background-color":"yellow"})
                    chang_page_div9.css({"background-color":"GhostWhite"})
                    chang_page_div10.css({"background-color":"GhostWhite"})
                    chang_page_div11.css({"background-color":"GhostWhite"})
                    chang_page_div12.css({"background-color":"GhostWhite"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '98'})
                    songli.css({'z-index': '98'})
                    peizhi.css({'z-index': '98'})
                    meiri.css({'z-index': '99'})
                    shiwuhuodong.css({'z-index': '98'})
                    dongtai.css({'z-index': '98'})
                    tuisong.css({'z-index': '98'})
                    hongbao.css({'z-index': '98'})
                    tianxuanshike.css({'z-index': '98'})
                    ohb.css({'z-index': '98'})
                    div.css({'z-index': '98'})
                    tj.css({'z-index': '98'})
                });
                chang_page_div9.click(function () {//动态
                    chang_page_div1.css({"background-color":"GhostWhite"})
                    chang_page_div2.css({"background-color":"GhostWhite"})
                    chang_page_div3.css({"background-color":"GhostWhite"})
                    chang_page_div4.css({"background-color":"GhostWhite"})
                    chang_page_div5.css({"background-color":"GhostWhite"})
                    chang_page_div6.css({"background-color":"GhostWhite"})
                    chang_page_div7.css({"background-color":"GhostWhite"})
                    chang_page_div8.css({"background-color":"GhostWhite"})
                    chang_page_div9.css({"background-color":"yellow"})
                    chang_page_div10.css({"background-color":"GhostWhite"})
                    chang_page_div11.css({"background-color":"GhostWhite"})
                    chang_page_div12.css({"background-color":"GhostWhite"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '98'})
                    songli.css({'z-index': '98'})
                    peizhi.css({'z-index': '98'})
                    meiri.css({'z-index': '98'})
                    shiwuhuodong.css({'z-index': '98'})
                    dongtai.css({'z-index': '99'})
                    tuisong.css({'z-index': '98'})
                    hongbao.css({'z-index': '98'})
                    tianxuanshike.css({'z-index': '98'})
                    ohb.css({'z-index': '98'})
                    div.css({'z-index': '98'})
                    tj.css({'z-index': '98'})
                });
                chang_page_div10.click(function () {//配置
                    chang_page_div1.css({"background-color":"GhostWhite"})
                    chang_page_div2.css({"background-color":"GhostWhite"})
                    chang_page_div3.css({"background-color":"GhostWhite"})
                    chang_page_div4.css({"background-color":"GhostWhite"})
                    chang_page_div5.css({"background-color":"GhostWhite"})
                    chang_page_div6.css({"background-color":"GhostWhite"})
                    chang_page_div7.css({"background-color":"GhostWhite"})
                    chang_page_div8.css({"background-color":"GhostWhite"})
                    chang_page_div9.css({"background-color":"GhostWhite"})
                    chang_page_div10.css({"background-color":"yellow"})
                    chang_page_div11.css({"background-color":"GhostWhite"})
                    chang_page_div12.css({"background-color":"GhostWhite"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '98'})
                    songli.css({'z-index': '98'})
                    peizhi.css({'z-index': '99'})
                    meiri.css({'z-index': '98'})
                    shiwuhuodong.css({'z-index': '98'})
                    dongtai.css({'z-index': '98'})
                    tuisong.css({'z-index': '98'})
                    hongbao.css({'z-index': '98'})
                    tianxuanshike.css({'z-index': '98'})
                    ohb.css({'z-index': '98'})
                    div.css({'z-index': '98'})
                    tj.css({'z-index': '98'})
                });
                chang_page_div11.click(function () {//送礼
                    chang_page_div1.css({"background-color":"GhostWhite"})
                    chang_page_div2.css({"background-color":"GhostWhite"})
                    chang_page_div3.css({"background-color":"GhostWhite"})
                    chang_page_div4.css({"background-color":"GhostWhite"})
                    chang_page_div5.css({"background-color":"GhostWhite"})
                    chang_page_div6.css({"background-color":"GhostWhite"})
                    chang_page_div7.css({"background-color":"GhostWhite"})
                    chang_page_div8.css({"background-color":"GhostWhite"})
                    chang_page_div9.css({"background-color":"GhostWhite"})
                    chang_page_div10.css({"background-color":"GhostWhite"})
                    chang_page_div11.css({"background-color":"yellow"})
                    chang_page_div12.css({"background-color":"GhostWhite"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '98'})
                    songli.css({'z-index': '99'})
                    peizhi.css({'z-index': '98'})
                    meiri.css({'z-index': '98'})
                    shiwuhuodong.css({'z-index': '98'})
                    dongtai.css({'z-index': '98'})
                    tuisong.css({'z-index': '98'})
                    hongbao.css({'z-index': '98'})
                    tianxuanshike.css({'z-index': '98'})
                    ohb.css({'z-index': '98'})
                    div.css({'z-index': '98'})
                    tj.css({'z-index': '98'})
                });
                chang_page_div12.click(function () {//玩具
                    chang_page_div1.css({"background-color":"GhostWhite"})
                    chang_page_div2.css({"background-color":"GhostWhite"})
                    chang_page_div3.css({"background-color":"GhostWhite"})
                    chang_page_div4.css({"background-color":"GhostWhite"})
                    chang_page_div5.css({"background-color":"GhostWhite"})
                    chang_page_div6.css({"background-color":"GhostWhite"})
                    chang_page_div7.css({"background-color":"GhostWhite"})
                    chang_page_div8.css({"background-color":"GhostWhite"})
                    chang_page_div9.css({"background-color":"GhostWhite"})
                    chang_page_div10.css({"background-color":"GhostWhite"})
                    chang_page_div11.css({"background-color":"GhostWhite"})
                    chang_page_div12.css({"background-color":"yellow"})
                    $('.zdbgjsessions').hide()
                    $('.zdbgjget_medal').hide()
                    $('.zdbgjtags').hide()
                    wanju.css({'z-index': '99'})
                    songli.css({'z-index': '98'})
                    peizhi.css({'z-index': '98'})
                    meiri.css({'z-index': '98'})
                    shiwuhuodong.css({'z-index': '98'})
                    dongtai.css({'z-index': '98'})
                    tuisong.css({'z-index': '98'})
                    hongbao.css({'z-index': '98'})
                    tianxuanshike.css({'z-index': '98'})
                    ohb.css({'z-index': '98'})
                    div.css({'z-index': '98'})
                    tj.css({'z-index': '98'})
                });
                let award_c = false
                award.click(function () {
                    if(award_c)return
                    award_c = true
                    setTimeout(() => {
                        award_c = false
                    },5000)
                });
                //对应配置状态
                if(GM_getValue('btn1'))btn1.click()
                if(GM_getValue('btn2'))btn2.click()
                if(MY_API.CONFIG.background_show){
                    $('.zdbgjtpp').show()
                }else{
                    $('.zdbgjtpp').hide()
                }

                let get_medal = $("<div class='zdbgjget_medal'>");
                get_medal.css(div_css);
                get_medal.append(`
<fieldset>
<div data-toggle="tags_shutdown">
<button data-action="save" style="font-size: 100%;color: #FF34B3;position:absolute;top:10px;right:15%" >关闭</button>
</div>
<legend  style="font-size: 100%;color:#FF34B3;">【一键批量获取勋章】</legend>
<div data-toggle="get_medal">
<append style="font-size: 100%;color:#FF34B3;">
<button data-action="save" style="font-size: 100%;color: #FF34B3" >一键批量获取勋章！</button><br>
<button id="move_medal" data-action="save1" style="font-size: 100%;color: #FF34B3" >将默认分组中有勋章的主播移动到勋章分组</button>
</div>
<div data-toggle="BKL_check">
<append style="font-size: 100%; color: #FF34B3" title="使用免费灯牌获得勋章">
<input name="medal_get" style="vertical-align: text-top;" type="radio" >选择使用免费灯牌
</div>

<div data-toggle="fans_gold_check">
<append style="font-size: 100%; color: #FF34B3" title="使用粉丝团灯牌获得勋章">
<input name="medal_get" style="vertical-align: text-top;" type="radio" >选择使用粉丝团灯牌<br>
<append style="font-size: 100%;color:blue;">
填写直播间真实房间号，英文逗号【,】隔开：<br>
</div><br>
<textarea id="get_medal_textareainput" rows="12" cols="64" style="position: relative; bottom :10px; left: 0px;z-index:999;color: #00000075;border-radius: 2px;border: solid;border-width: 1px;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">${MY_API.CONFIG.get_medal_room}</textarea>
</fieldset>
`);
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(get_medal);
                $('.zdbgjget_medal').hide()

                let GJTP_Timer = () => {
                    let kd = $('.head-info-section.live-skin-coloration-area.p-relative.border-box.z-head-info.bg-bright-filter').width()
                    let gd = $('.chat-history-list.h-100.p-relative.border-box.ps.ps--theme_default.ps--active-y').height() + 60
                    $("#img2").width(kd+2)
                    heightmax = $('.chat-history-list.h-100.p-relative.border-box.ps.ps--theme_default.ps--active-y').height() - 50
                    //console.log('heightmax',heightmax)
                    ohb.css({'max-height': `${heightmax}px`})
                    div.css({'max-height': `${heightmax}px`})
                    tj.css({'max-height': `${heightmax}px`})
                    tags.css({'max-height': `${heightmax}px`})
                    sessions.css({'max-height': `${heightmax}px`})
                    get_medal.css({'max-height': `${heightmax}px`})
                    tuisong.css({'max-height': `${heightmax}px`})
                    hongbao.css({'max-height': `${heightmax}px`})
                    tianxuanshike.css({'max-height': `${heightmax}px`})
                    meiri.css({'max-height': `${heightmax}px`})
                    shiwuhuodong.css({'max-height': `${heightmax}px`})
                    dongtai.css({'max-height': `${heightmax}px`})
                    wanju.css({'max-height': `${heightmax}px`})
                    peizhi.css({'max-height': `${heightmax}px`})
                    songli.css({'max-height': `${heightmax}px`})
                };
                GJTP_Timer()
                setTimeout(() => {
                    GJTP_Timer();
                },5000)
                $("html").scrollLeft(10000);//滚动到右侧

                window.onresize = function () {
                    let kd = $('.head-info-section.live-skin-coloration-area.p-relative.border-box.z-head-info.bg-bright-filter').width()
                    let gd = $('.chat-history-list.h-100.p-relative.border-box.ps.ps--theme_default.ps--active-y').height() + 60
                    $("#img2").width(kd+2)
                    $("html").scrollLeft(10000);//滚动到右侧
                    heightmax = $('.chat-history-list.h-100.p-relative.border-box.ps.ps--theme_default.ps--active-y').height()
                    ohb.css({'max-height': `${heightmax}px`})
                    div.css({'max-height': `${heightmax}px`})
                    tj.css({'max-height': `${heightmax}px`})
                    tags.css({'max-height': `${heightmax}px`})
                    sessions.css({'max-height': `${heightmax}px`})
                    get_medal.css({'max-height': `${heightmax}px`})
                    tuisong.css({'max-height': `${heightmax}px`})
                    hongbao.css({'max-height': `${heightmax}px`})
                    tianxuanshike.css({'max-height': `${heightmax}px`})
                    meiri.css({'max-height': `${heightmax}px`})
                    shiwuhuodong.css({'max-height': `${heightmax}px`})
                    dongtai.css({'max-height': `${heightmax}px`})
                    wanju.css({'max-height': `${heightmax}px`})
                    peizhi.css({'max-height': `${heightmax}px`})
                    songli.css({'max-height': `${heightmax}px`})
                }


                get_medal.find('div[data-toggle="tags_shutdown"] [data-action="save"]').click(async function () {
                    $('.zdbgjget_medal').toggle()
                });
                if(MY_API.CONFIG.BKL_check_get_medal)get_medal.find('div[data-toggle="BKL_check"] input:radio').attr('checked', '');
                if(MY_API.CONFIG.fans_gold_check_get_medal)get_medal.find('div[data-toggle="fans_gold_check"] input:radio').attr('checked', '');
                get_medal.find('div[data-toggle="BKL_check"] input:radio').change(function () {
                    MY_API.CONFIG.BKL_check_get_medal = $(this).prop('checked');
                    MY_API.CONFIG.fans_gold_check_get_medal = !MY_API.CONFIG.BKL_check_get_medal
                    MY_API.saveConfig()
                    MY_API.chatLog(`批量获取勋章投喂设置：免费灯牌：${MY_API.CONFIG.BKL_check_get_medal}<br>粉丝团灯牌：${MY_API.CONFIG.fans_gold_check_get_medal}`);
                });
                get_medal.find('div[data-toggle="fans_gold_check"] input:radio').change(function () {
                    MY_API.CONFIG.fans_gold_check_get_medal = $(this).prop('checked');
                    MY_API.CONFIG.BKL_check_get_medal = !MY_API.CONFIG.fans_gold_check_get_medal
                    MY_API.saveConfig()
                    MY_API.chatLog(`批量获取勋章投喂设置：免费灯牌：${MY_API.CONFIG.BKL_check_get_medal}<br>粉丝团灯牌：${MY_API.CONFIG.fans_gold_check_get_medal}`);
                });
                get_medal.find('div[data-toggle="get_medal"] [data-action="save1"]').click(async function () {
                    MY_API.chatLog(`【一键勋章分组】注意！请在勋章数据更新后使用该功能，勋章数据循环更新为间隔10分钟！<br>值移动移动有勋章的并且在默认分组的主播，主要用于防止默认分组取关时误取关！`, 'warning');
                    alert(`【一键勋章分组】注意！请在勋章数据更新后使用该功能，勋章数据循环更新为间隔10分钟！<br>值移动移动有勋章的并且在默认分组的主播，主要用于防止默认分组取关时误取关！`);
                    let dt = document.getElementById('move_medal'); //通过id获取该div
                    let get_tags_data = async function () { //获取分组数据
                        await BAPI.get_tags().then(async(data) => {
                            //console.log(tags_name, tags_tagid)
                            let tags_data = data.data
                            tags_name = []
                            tags_tagid = []
                            for(let i = 0; i < tags_data.length; i++){
                                tags_name[i] = tags_data[i].name
                                tags_tagid[i] = tags_data[i].tagid
                            }
                            //console.log(tags_name, tags_tagid)
                        });
                    }
                    let get_tags_mid_list = async function(pn,group_tag_id){
                        await sleep(100)
                        if(pn == 1)
                            tags_mid_list = [];
                        return BAPI.get_tags_mid(Live_info.uid, group_tag_id, pn).then((data) => { //0默认关注分组-10特别关注分组
                            let midlist = data.data
                            if(midlist.length > 0){
                                for(let i = 0; i < midlist.length; i++){
                                    tags_mid_list.push(midlist[i].mid)
                                }
                                dt.innerHTML = `获取默认数据${tags_mid_list.length}/${tags_mid_list.length}`
                                return get_tags_mid_list(pn + 1,group_tag_id)
                            }
                        }, () => {
                            console.log('await error')
                            return MY_API.chatLog('获取数据出错！', 'warning');
                        })
                    }
                    MY_API.chatLog(`【一键勋章分组】开始分组数据处理！`, 'success');
                    await BAPI.tag_create('勋章主播').then(async(data) => {
                        //console.log(data)
                        if(data.code == 0){
                            MY_API.chatLog(`【一键勋章分组】勋章主播分组创建成功！`);
                        }else{
                            MY_API.chatLog(`【一键勋章分组】勋章主播分组:${data.message}`, 'warning');
                        }
                    });
                    await get_tags_data()
                    MY_API.chatLog(`【一键勋章分组】开始获取默认分组数据！`, 'success');
                    await get_tags_mid_list(1,0)//0默认分组
                    let num = tags_name.indexOf('勋章主播')
                    if(num>-1){
                        for(let i = 0; i < MY_API.CONFIG.medal_uid_list.length; i++){
                            if(tags_mid_list.indexOf(MY_API.CONFIG.medal_uid_list[i]) > -1){
                                await sleep(1000)
                                BAPI.tags_addUsers(MY_API.CONFIG.medal_uid_list[i], tags_tagid[num]).then((data) => {
                                    //console.log('move勋章主播', data)
                                    MY_API.chatLog(`【一键勋章分组】UID：${MY_API.CONFIG.medal_uid_list[i]}移动成功！`);
                                })
                                dt.innerHTML = `检查勋章数据${i}/${MY_API.CONFIG.medal_uid_list.length}`
                            }
                        }
                    }else{
                        MY_API.chatLog(`【一键勋章分组】勋章主播分组未找到`, 'warning');
                    }
                    MY_API.chatLog(`【一键勋章分组】一键勋章分组结束！`, 'success');
                    dt.innerHTML = `【一键勋章分组】一键勋章分组结束！`
                    await sleep(2000)
                    dt.innerHTML = `将默认分组中有勋章的主播移动到勋章分组`
                })
                get_medal.find('div[data-toggle="get_medal"] [data-action="save"]').click(async function () {
                    MY_API.CONFIG.get_medal_room = $("#get_medal_textareainput").val().split(",");
                    if(MY_API.CONFIG.get_medal_room == '' || MY_API.CONFIG.get_medal_room[0] == 0){
                        MY_API.chatLog(`【一键批量获取勋章】名单为空！`, 'warning');
                        return;
                    }
                    let word=[]
                    for(let i = 0; i < MY_API.CONFIG.get_medal_room.length; i++){//本地去重、去空格、去空
                        if(word.indexOf(MY_API.CONFIG.get_medal_room[i].replaceAll(' ', '').toLowerCase()) == -1 && MY_API.CONFIG.get_medal_room[i] && Number(MY_API.CONFIG.get_medal_room[i]) != 0){
                            word.push(MY_API.CONFIG.get_medal_room[i].replaceAll(' ', '').toLowerCase())
                        }
                    }
                    MY_API.CONFIG.get_medal_room = word
                    //console.log($("#get_medal_textareainput").val());
                    //console.log(MY_API.CONFIG.get_medal_room)
                    for(let i = 0; i < MY_API.CONFIG.get_medal_room.length; i++){
                        //console.log(MY_API.CONFIG.get_medal_room[i])
                        let num = MY_API.CONFIG.room_ruid.indexOf(MY_API.CONFIG.get_medal_room[i])
                        if(num == -1){
                            await BAPI.live_user.get_anchor_in_room(MY_API.CONFIG.get_medal_room[i]).then(async(da) => {
                                if(da.code==0 && da.data.info !== undefined){
                                    let anchor_uid = da.data.info.uid;
                                    MY_API.CONFIG.room_ruid.push(MY_API.CONFIG.get_medal_room[i])
                                    MY_API.CONFIG.room_ruid.push(anchor_uid)
                                }else{
                                    MY_API.chatLog(`【一键批量获取勋章】直播间房间号：${MY_API.CONFIG.get_medal_room[i]}可能不存在！`, 'warning');
                                }
                            }, () => {
                                console.log('await error')
                                i = 9999999
                                return MY_API.chatLog(`【一键批量获取勋章】直播间用户UID获取失败，请稍后再试！`, 'warning');
                            })
                        }
                        num = MY_API.CONFIG.room_ruid.indexOf(MY_API.CONFIG.get_medal_room[i])
                        let fans_medal_info = true
                        await BAPI.fans_medal_info(MY_API.CONFIG.room_ruid[num+1],MY_API.CONFIG.get_medal_room[i]).then(async function(data){
                            if(data.code==0){
                                fans_medal_info = data.data.has_fans_medal
                                //console.log('fans_medal_info',fans_medal_info)
                            }
                        }, () => {
                            console.log('await error')
                            i = 9999999
                            return MY_API.chatLog(`【一键批量获取勋章】勋章数据获取失败，请稍后再试！`, 'warning');
                        })
                        if(fans_medal_info){
                            await sleep(1000)
                            MY_API.chatLog(`【一键批量获取勋章】房间号：${MY_API.CONFIG.get_medal_room[i]}已拥有勋章！`, 'success');
                            continue
                        }
                        if(!fans_medal_info && MY_API.CONFIG.BKL_check_get_medal){
                            let BKL_coin_num = await get_BKL_num_bagid()//0：免费灯牌数，1:bagid
                            if(BKL_coin_num[1]==0) return MY_API.chatLog(`【一键批量获取勋章】免费灯牌数量不足！`, 'warning');
                            await BAPI.gift.bag_send(Live_info.uid, 31738, MY_API.CONFIG.room_ruid[num+1], 1, BKL_coin_num[1], MY_API.CONFIG.get_medal_room[i], (ts_ms()+ms_diff)).then(async function(result){
                                if(result.code === 0 && result.message === '0'){
                                    MY_API.chatLog(`【免费灯牌】房间号：${MY_API.CONFIG.get_medal_room[i]}投喂成功！`, 'success');

                                    MY_API.CONFIG.journal_medal.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：【一键批量获取勋章】房间号：<a href="https://live.bilibili.com/${MY_API.CONFIG.get_medal_room[i]}" target="_blank">${MY_API.CONFIG.get_medal_room[i]}</a>免费灯牌投喂成功！`)
                                    if(MY_API.CONFIG.journal_medal.length > 200){
                                        MY_API.CONFIG.journal_medal.splice(150, 200);
                                    }
                                    MY_API.saveConfig();
                                    if(journal_medal_console && MY_API.CONFIG.journal_medal.length){
                                        let dt = document.getElementById('sessions_msg');
                                        dt.innerHTML = MY_API.CONFIG.journal_medal
                                    }
                                }else if(result.code == 200009){
                                    MY_API.chatLog(`【免费灯牌】赠送失败：${result.message}`, 'warning');
                                }else{
                                    i = 9999999
                                    MY_API.chatLog('【免费灯牌】赠送失败，请稍后再试', 'warning');
                                }
                            });
                        }
                        if(!fans_medal_info && MY_API.CONFIG.fans_gold_check_get_medal){
                            //console.log(MY_API.CONFIG.get_medal_room[i])
                            await BAPI.gift.sendGold(Live_info.uid, 31164, MY_API.CONFIG.room_ruid[num+1], 1, MY_API.CONFIG.get_medal_room[i], (ts_ms()+ms_diff),100).then(async function(result){
                                if(result.code === 0 && result.message === '0'){
                                    MY_API.chatLog(`【粉丝团灯牌】房间号：${MY_API.CONFIG.get_medal_room[i]}粉丝团灯牌投喂成功！` , 'success');

                                    MY_API.CONFIG.journal_medal.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：【一键批量获取勋章】房间号：<a href="https://live.bilibili.com/${MY_API.CONFIG.get_medal_room[i]}" target="_blank">${MY_API.CONFIG.get_medal_room[i]}</a>粉丝团灯牌投喂成功！`)
                                    if(MY_API.CONFIG.journal_medal.length > 200){
                                        MY_API.CONFIG.journal_medal.splice(150, 200);
                                    }
                                    MY_API.saveConfig();
                                    if(journal_medal_console && MY_API.CONFIG.journal_medal.length){
                                        let dt = document.getElementById('sessions_msg');
                                        dt.innerHTML = MY_API.CONFIG.journal_medal
                                    }
                                }else if(result.code == 200009){
                                    MY_API.chatLog(`【粉丝团灯牌】赠送失败：${result.message}`, 'warning');
                                }else{
                                    i = 9999999
                                    MY_API.chatLog(`【粉丝团灯牌】赠送失败：${result.message}，请稍后再试`, 'warning');
                                }
                            });
                        }
                        await sleep(5000)
                    }
                    MY_API.chatLog(`【一键批量获取勋章】一键批量获取勋章结束！`, 'success');
                });

                MY_API.CONFIG.switch_sever = false
                MY_API.CONFIG.sever_modle = false

                if(MY_API.CONFIG.get_data_from_server)tj.find('div[data-toggle="get_data_from_server"] input').attr('checked', '');

                tj.find('div[data-toggle="get_data_from_server"] input:checkbox').change(function () {
                    MY_API.CONFIG.get_data_from_server = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`获取服务器天选数据抽奖设置：${MY_API.CONFIG.get_data_from_server}`);
                });


                if(MY_API.CONFIG.isnotLogin_push)tj.find('div[data-toggle="isnotLogin_push"] input').attr('checked', '');
                if(MY_API.CONFIG.TALK)tj.find('div[data-toggle="TALK"] input').attr('checked', '');
                if(MY_API.CONFIG.tips_show)tj.find('div[data-toggle="tips_show"] input').attr('checked', '');

                if(MY_API.CONFIG.TIMEAREADISABLE)tj.find('div[data-toggle="TIMEAREADISABLE"] input').attr('checked', '');
                tj.find('div[data-toggle="AnchorserverFLASH"] .AnchorserverFLASH').val((parseInt(MY_API.CONFIG.AnchorserverFLASH)).toString());
                //tj.find('div[data-toggle="AnchorcheckFLASH"] .AnchorcheckFLASH').val((parseInt(MY_API.CONFIG.AnchorcheckFLASH)).toString());
                tj.find('div[data-toggle="Anchor_room_send"] .Anchor_room_send').val((parseInt(MY_API.CONFIG.Anchor_room_send)).toString());
                tj.find('div[data-toggle="TIMEAREADISABLE"] .start').val(MY_API.CONFIG.TIMEAREASTART.toString());
                tj.find('div[data-toggle="TIMEAREADISABLE"] .end').val(MY_API.CONFIG.TIMEAREAEND.toString());
                tj.find('div[data-toggle="AnchorserverFLASH"] [data-action="save"]').click(function () {
                    let val = parseInt(tj.find('div[data-toggle="AnchorserverFLASH"] .AnchorserverFLASH').val());
                    if(MY_API.CONFIG.AnchorserverFLASH === val){
                        MY_API.chatLog('改都没改保存嘛呢');
                        return
                    }
                    if(val < 20){
                        MY_API.chatLog('男人不能太快哦ლ(╹◡╹ლ)');
                        val = 20
                    }else if(val > 50){
                        MY_API.chatLog('太慢了Σ( ° △ °|||)︴');
                        val = 50
                    }
                    MY_API.CONFIG.AnchorserverFLASH = val;
                    MY_API.saveConfig()
                    MY_API.chatLog(`获取专栏/简介天选数据间隔设置：${MY_API.CONFIG.AnchorserverFLASH}`);
                });

                tj.find('div[data-toggle="Anchor_room_send"] [data-action="save"]').click(async function () {//手动推送
                    let val = parseInt(tj.find('div[data-toggle="Anchor_room_send"] .Anchor_room_send').val());
                    MY_API.CONFIG.Anchor_room_send = val;
                    MY_API.saveConfig();
                    MY_API.chatLog(`天选手动推送设置：${MY_API.CONFIG.Anchor_room_send}`);
                    await BAPI.getLotteryInfoWeb(MY_API.CONFIG.Anchor_room_send).then(async(data) => {
                        console.log('手动推送getLotteryInfoWeb',data)
                        if(data.code==0){
                            let anchor_data = data.data.anchor
                            let red_pocket_data = data.data.red_pocket
                            let popularity_red_pocket_data = data.data.popularity_red_pocket
                            if(anchor_data != null){
                                console.log('手动推送getLotteryInfoWeb：anchor_data',anchor_data)
                                let time = anchor_data.time
                                let id = anchor_data.id
                                let gift_price = anchor_data.gift_price
                                let gift_id = anchor_data.gift_id
                                let gift_num = anchor_data.gift_num
                                let require_type = anchor_data.require_type
                                let require_text = anchor_data.require_text
                                let award_name = anchor_data.award_name;
                                let require_value = anchor_data.require_value
                                let cur_gift_num = anchor_data.cur_gift_num
                                let current_time = anchor_data.current_time

                                Anchor_room_list.push(MY_API.CONFIG.Anchor_room_send);
                                Anchor_award_id_list.push(id);
                                Anchor_award_nowdate.push(ts_ten_m());

                                const post_data_stringify = {
                                    "type":"anchor"
                                }
                                const post_data = {id:id,room_id:val,data:JSON.stringify(post_data_stringify)}
                                post_data_to_server(post_data,qun_server[0]).then((data) => {
                                    //console.log('【天选】post_data_to_server',post_data)
                                    MY_API.chatLog('推送手动提交的抽奖房间到服务器成功！');
                                })
                                return
                            }
                            if(popularity_red_pocket_data != null){
                                //console.log('手动推送getLotteryInfoWeb：popularity_red_pocket_data',popularity_red_pocket_data)
                                for(let i=0;i<popularity_red_pocket_data.length;i++){
                                    Anchor_room_list.push(val);
                                    Anchor_award_id_list.push(popularity_red_pocket_data[i].lot_id);
                                    Anchor_award_nowdate.push(ts_ten_m());
                                    //上传服务器
                                    const post_data_stringify = {
                                        "type":"popularity_red_pocket"
                                    }
                                    const post_data = {id:popularity_red_pocket_data[i].lot_id,room_id:val,data:JSON.stringify(post_data_stringify)}
                                    post_data_to_server(post_data,qun_server[0]).then((data) => {
                                        console.log('【道具红包】post_data_to_server',post_data)
                                        MY_API.chatLog('推送手动提交的抽奖房间到服务器成功！');
                                    })
                                    //上传服务器
                                }
                                return
                            }
                        }
                    })
                });

                tj.find('div[data-toggle="isnotLogin_push"] input:checkbox').change(function () {
                    MY_API.CONFIG.isnotLogin_push = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`未登录状态推送设置：${MY_API.CONFIG.isnotLogin_push}`);
                });
                tj.find('div[data-toggle="TALK"] input:checkbox').change(function () {
                    MY_API.CONFIG.TALK = $(this).prop('checked');
                    if(MY_API.CONFIG.TALK == true){ //自定义提示开关
                        $('.zdbgjMsg').hide(); //隐藏反馈信息
                    }
                    MY_API.saveConfig()
                    MY_API.chatLog(`反馈信息设置：${MY_API.CONFIG.TALK}`);
                });
                tj.find('div[data-toggle="tips_show"] input:checkbox').change(function () {
                    MY_API.CONFIG.tips_show = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`中奖等弹框显示设置：${MY_API.CONFIG.tips_show}`);
                });


                tj.find('div[data-toggle="TIMEAREADISABLE"] input:checkbox').change(function () {
                    MY_API.CONFIG.TIMEAREADISABLE = $(this).prop('checked');
                    MY_API.saveConfig()
                    MY_API.chatLog(`休眠时间设置：${MY_API.CONFIG.TIMEAREADISABLE}<br>${MY_API.CONFIG.TIMEAREASTART}-${MY_API.CONFIG.TIMEAREAEND}`);
                });

                tj.find('div[data-toggle="TIMEAREADISABLE"] [data-action="save"]').click(function () {
                    let TIMEAREASTART = parseInt(tj.find('div[data-toggle="TIMEAREADISABLE"] .start').val());
                    let TIMEAREAEND = parseInt(tj.find('div[data-toggle="TIMEAREADISABLE"] .end').val());
                    if(TIMEAREASTART < 0 || TIMEAREASTART > 23 || TIMEAREAEND < 0 || TIMEAREAEND > 23)return MY_API.chatLog('时间设置错误，请输入【0-23】！');
                    MY_API.CONFIG.TIMEAREASTART = parseInt(tj.find('div[data-toggle="TIMEAREADISABLE"] .start').val());
                    MY_API.CONFIG.TIMEAREAEND = parseInt(tj.find('div[data-toggle="TIMEAREADISABLE"] .end').val());
                    MY_API.saveConfig()
                    MY_API.chatLog(`休眠时间设置：${MY_API.CONFIG.TIMEAREADISABLE}<br>${MY_API.CONFIG.TIMEAREASTART}-${MY_API.CONFIG.TIMEAREAEND}`);
                });

                div.find('#setu_bot_start [data-action="setu_bot_start"]').click(function () {
                    let r = confirm("请确保QQ机器人程序已运行，机器人程序可进群群文件下载获取。点击确定后刷新生效！");
                    if(r == true){
                        MY_API.CONFIG.setu_bot_start = !MY_API.CONFIG.setu_bot_start
                        MY_API.saveConfig()
                        window.location.reload()
                    }
                });
                if(MY_API.CONFIG.setu_bot_start){
                    let dt = document.getElementById('setu_bot_start_t');
                    dt.innerHTML = '点击关闭QQ群娱乐机器人脚本'
                }
            },
            pushpush: async (content) => {
                if(MY_API.CONFIG.switch_go_cqhttp && MY_API.CONFIG.go_cqhttp && MY_API.CONFIG.qq2){
                    qq(MY_API.CONFIG.qq2,content,MY_API.CONFIG.go_cqhttp)
                }
                if(MY_API.CONFIG.qqbot && qq_run_mark){
                    qq(MY_API.CONFIG.qq, content,qun_server[1],qun_server[3])
                }
                if(MY_API.CONFIG.switch_ServerChan_SCKEY){
                    ServerChan2(MY_API.CONFIG.ServerChan_SCKEY, content)
                }
                if(MY_API.CONFIG.switch_pushplus_KEY){
                    pushplus(MY_API.CONFIG.pushplus_KEY, content)
                }
                if(MY_API.CONFIG.switch_push_KEY){
                    pushmsg(MY_API.CONFIG.push_KEY, content)
                }
            },
            new_activity_lottery:async function (do_now = false) {
                if(!MY_API.CONFIG.AUTO_activity_lottery2 && !MY_API.CONFIG.AUTO_activity_lottery && !do_now)return
                activity_lottery_run_mark = false
                MY_API.chatLog(`【活动抽奖】开始活动抽奖！`);
                let url = "http://flyx.fun:1369/sync/new_activities";
                let myjson = await getMyJson(url);
                if(myjson[0]== undefined)return MY_API.chatLog(`【活动抽奖】云数据获取异常！`);
                let myjson_p=[]
                for(let i = 0; i < myjson.length; i++){
                    if(!MY_API.CONFIG.activity_lottery_gone.some(v => v ==myjson[i].sid))myjson_p.push(myjson[i])
                }
                myjson=myjson_p
                //console.log('myjson',myjson)
                let sidtimes = []
                for(let i = 0; i < myjson.length; i++){
                    if(!MY_API.CONFIG.AUTO_activity_lottery2 && !do_now)break
                    if(i == 0)
                        MY_API.chatLog(`【活动抽奖】开始获取抽奖次数！`);
                    sidtimes[i] = 0
                    for(let t = 0; t < 21; t++){
                        await sleep(200)
                        let action_type = 3
                        if(myjson[i].action_type != undefined)action_type = myjson[i].action_type
                        if(myjson[i].sid.indexOf("newLottery") > -1){
                            await BAPI.new_activity_lottery.addtimes(myjson[i].sid,action_type).then(async(data) => {
                                console.log('BAPI.new_activity_lottery.addtimes', data,myjson[i].sid)
                                if(data.code == 75001 || data.code == 75003 || data.code == 170001){
                                    t = 999
                                    MY_API.CONFIG.activity_lottery_gone.push(myjson[i].sid)
                                    MY_API.saveConfig()
                                    return
                                } //活动不存在/活动已结束
                                if(data.code == 75405){
                                    t = 999
                                    return
                                } //抽奖机会用尽啦
                            })
                        }else if(myjson[i].business != undefined && myjson[i].business && myjson[i].taskId != undefined && myjson[i].taskId){
                            await BAPI.new_activity_lottery.send_points(myjson[i].taskId,myjson[i].business).then(async(data) => {
                                console.log('BAPI.new_activity_lottery.send_points', data,myjson[i].sid)
                                if(data.code == 75001 || data.code == 75003 || data.code == 170001){
                                    t = 999
                                    MY_API.CONFIG.activity_lottery_gone.push(myjson[i].sid)
                                    MY_API.saveConfig()
                                    return
                                } //活动不存在/活动已结束
                                if(data.code == 75405){
                                    t = 999
                                    return
                                } //抽奖机会用尽啦
                            })
                            await sleep(1000)
                        }
                        await BAPI.new_activity_lottery.mytimes(myjson[i].sid).then(async(data) => {
                            console.log('BAPI.new_activity_lottery.mytimes', data)
                            if(data.data == undefined || data.data.times == 0){
                                MY_API.chatLog(`【活动抽奖】正在获取抽奖次数（${i+1}/${myjson.length}）：${myjson[i].name}(${sidtimes[i]})！`);
                                t = 999
                                return
                            }
                            if(sidtimes[i] == data.data.times){
                                MY_API.chatLog(`【活动抽奖】正在获取抽奖次数（${i+1}/${myjson.length}）：${myjson[i].name}(${sidtimes[i]})！`);
                                t = 999
                                return
                            }
                            sidtimes[i] = data.data.times
                        })


                    }
                    if(i == myjson.length-1)
                        MY_API.chatLog(`【活动抽奖】获取抽奖次数结束！`);
                }

                for(let t = 0; t < 5000; t++){
                    if(!MY_API.CONFIG.AUTO_activity_lottery && !do_now)break
                    if(sidtimes.length == 0){
                        for(let i = 0; i < myjson.length; i++){
                            sidtimes[i] = 0
                            await BAPI.new_activity_lottery.mytimes(myjson[i].sid).then(async(data) => {
                                console.log('BAPI.new_activity_lottery.mytimes', data)
                                if(data.code ==0 && data.data != undefined || data.data.times != undefined){
                                    sidtimes[i] = data.data.times
                                }
                            })
                        }
                    }
                    if(sidtimes.length == 0){
                        MY_API.chatLog(`【活动抽奖】抽奖次数数据为空！`);
                        break
                    }
                    let sidtimes_mark = true
                    for(let u = 0; u < sidtimes.length; u++){
                        if(sidtimes[u] > 0){
                            sidtimes_mark = false
                            break
                        }
                    }
                    if(!sidtimes_mark) await sleep(1000)
                    if(sidtimes.length != 0 && t == 0)MY_API.chatLog(`【活动抽奖】开始抽奖！`);
                    if(sidtimes.length != 0 && t == 4999) MY_API.chatLog(`【活动抽奖】抽奖结束！`);
                    if(sidtimes_mark) continue
                    for(let i = 0; i < myjson.length; i++){
                        if(sidtimes[i] <= 0)continue
                        await sleep(1000)
                        await BAPI.new_activity_lottery.do(myjson[i].sid).then(async(data) => {
                            console.log('BAPI.new_activity_lottery.do', data)
                            if(data.code == 75401 || data.code == 75415 || data.code == 170415 ){ //170415、75415次数不足//74501无抽奖资格|| data.data == undefined
                                sidtimes[i] = 0
                                return
                            }
                            if(data.code == 75400){
                                i--
                                return
                            } //75400频繁
                            if(data.code == 0){
                                MY_API.chatLog(`【活动抽奖】正在抽奖（${i+1}/${myjson.length}）：${myjson[i].name}(${sidtimes[i]})！`);
                                MY_API.chatLog(`【活动抽奖】（${i+1}/${myjson.length}）${myjson[i].name}：${data.data[0].gift_name}！`);
                                sidtimes[i] = sidtimes[i] - 1
                                MY_API.CONFIG.freejournal2.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：<a target="_blank" href="${myjson[i].url}">${myjson[i].name}</a>(${sidtimes[i]+1}，${data.data[0].gift_name})`)
                                if(MY_API.CONFIG.freejournal2.length > 200){
                                    MY_API.CONFIG.freejournal2.splice(150, 200);
                                }
                                if(freejournal2_console && MY_API.CONFIG.freejournal2.length){
                                    let dt = document.getElementById('sessions_msg');
                                    dt.innerHTML = MY_API.CONFIG.freejournal2
                                }
                                MY_API.saveConfig()
                            }
                            if(data.data !== undefined && data.data[0].gift_name && data.data[0].gift_name != "未中奖0"){
                                const post_data = {id:(ts_ms()+ms_diff),room_id:Live_info.uid,data:`【活动抽奖】${Xname}：${data.data[0].gift_name}`}
                                post_data_to_server(post_data,qun_server[0]).then((data) => {
                                    //console.log('post_data_to_server',data)
                                })

                                MY_API.CONFIG.freejournal7.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：【活动抽奖】：<a target="_blank" href="${myjson[i].url}">${myjson[i].name}</a>：${data.data[0].gift_name}`)
                                if(MY_API.CONFIG.freejournal7.length > 200){
                                    MY_API.CONFIG.freejournal7.splice(150, 200);
                                }
                                MY_API.saveConfig()
                                if(freejournal7_console && MY_API.CONFIG.freejournal7.length){
                                    let dt = document.getElementById('sessions_msg');
                                    dt.innerHTML = MY_API.CONFIG.freejournal7
                                }
                                let tt = `【活动抽奖】【${MY_API.CONFIG.push_tag}】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`
                                let rr = `【活抽】【${MY_API.CONFIG.push_tag}】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`//屏蔽词规避
                                if(MY_API.CONFIG.tips_show)tip(tt)
                                MY_API.chatLog(tt);
                                if(MY_API.CONFIG.switch_go_cqhttp && MY_API.CONFIG.go_cqhttp && MY_API.CONFIG.qq2){
                                    qq(MY_API.CONFIG.qq2,tt,MY_API.CONFIG.go_cqhttp)
                                }
                                if(MY_API.CONFIG.qqbot && qq_run_mark){
                                    qq(MY_API.CONFIG.qq,tt,qun_server[1],qun_server[3])
                                }
                                if(MY_API.CONFIG.switch_ServerChan_SCKEY){
                                    ServerChan2(MY_API.CONFIG.ServerChan_SCKEY, tt)
                                }
                                if(MY_API.CONFIG.switch_pushplus_KEY){
                                    pushplus(MY_API.CONFIG.pushplus_KEY, tt)
                                }
                                if(MY_API.CONFIG.switch_push_KEY){
                                    pushmsg(MY_API.CONFIG.push_KEY, tt)
                                }
                            }
                        })
                    }
                }
                setTimeout(async function () {
                    activity_lottery_run_mark = true
                },60 * 1000)
            },
            chatLog: function(text, type = 'info',time=0,room=0,tip=false,movetime=0){ //自定义提示
                let div = $("<div class='zdbgjMsg'>");
                let msg = $("<div>");
                let tips = $("<div>");
                let rooms = $("<div>");
                let t = $("<div>");
                let ct = $('#chat-items');
                let myDate = new Date();
                let ctt = $('#chat-history-list');
                msg.html(text);
                tips.html(`<a href="https://greasyfork.org/en/scripts/429508-fetchcut" target="_blank">安装省流脚本</a>`);
                rooms.html(`<a href="https://live.bilibili.com/${room}?fetchcut" target="_blank">省流进入直播间</a>`);
                t.html(`开奖倒计时：${time}秒`);
                //msg.text(text);
                div.text(myDate.toLocaleString());
                div.append(msg);
                if(time){
                    div.append(t);
                    for(let i=0,tt=time;tt>=0;i++,tt--){
                        setTimeout(() => {
                            t.html(`开奖倒计时：${tt}秒`)
                        },1000*i)
                    }
                    setTimeout(() => {
                        t.html(`该抽奖已开奖！`)
                    },1000*time+100)
                    setTimeout(() => {
                        $(div).remove();
                        scrollTop_mark = true
                    },1000*time+30000)
                }else{
                    setTimeout(() => {
                        $(div).remove();
                        scrollTop_mark = true
                    },1000*movetime+30000)
                }
                if(tip){
                    div.append(rooms);
                    div.append(tips);
                }
                div.css({
                    'text-align': 'center',
                    'border-radius': '4px',
                    'min-height': '30px',
                    'width': '256px',
                    'color': '#00B2EE',
                    'line-height': '30px',
                    'padding': '0 10px',
                    'margin': '10px auto',
                });
                msg.css({
                    'word-wrap': 'break-word',
                    'width': '100%',
                    'line-height': '20px',
                    'margin-bottom': '10px',
                });
                t.css({
                    'word-wrap': 'break-word',
                    'width': '100%',
                    'line-height': '10px',
                    'margin-bottom': '10px',
                });
                tips.css({
                    'word-wrap': 'break-word',
                    'width': '100%',
                    'line-height': '10px',
                    'margin-bottom': '10px',
                });
                rooms.css({
                    'word-wrap': 'break-word',
                    'width': '100%',
                    'line-height': '10px',
                    'margin-bottom': '10px',
                });
                switch (type){
                    case 'warning':
                        div.css({
                            'border': '1px solid rgb(236, 221, 192)',
                            'color': 'rgb(218, 142, 36)',
                            'background': 'rgb(245, 235, 221) none repeat scroll 0% 0%',
                        });
                        break;
                    case 'success':
                        div.css({
                            'border': '1px solid rgba(22, 140, 0, 0.28)',
                            'color': 'rgb(69, 171, 69)',
                            'background': 'none 0% 0% repeat scroll rgba(16, 255, 0, 0.18)',
                        });
                        break;
                    default:
                        div.css({
                            'border': '1px solid rgb(203, 195, 255)',
                            'background': 'rgb(233, 230, 255) none repeat scroll 0% 0%',
                        });
                }
                if(MY_API.CONFIG.TALK == false ){ //自定义提示开关
                    ct.append(div); //向聊天框加入信息
                    if(GM_getValue('go_down')){
                        ctt.animate({
                            scrollTop: ctt.prop("scrollHeight")
                        }, 0); //滚动到底部
                    }
                }
            },
            auto_light:async() => {
                let start_ts = ts_s()
                if(medal_list_now.length){
                    for (let i = 0; i < medal_list_now.length; i++) {
                        if(!medal_list_now[i].medal.is_lighted){
                            if(!MY_API.CONFIG.TALK)window.toast(`【自动点亮】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}]`)
                            shuffle(dmlist)
                            await BAPI.sendLiveDanmu_dm_type(dmlist[0], medal_list_now[i].room_info.room_id).then(async(data) => {
                                if(data.code==0){
                                    medal_list_now[i].medal.is_lighted = 1
                                    if(!MY_API.CONFIG.TALK)window.toast(`【自动点亮】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}] 表情包弹幕发送成功`);
                                }else{
                                    if(!MY_API.CONFIG.TALK)window.toast(`【自动点亮】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}] 表情包弹幕：${data.message}切换为文弹幕`);
                                    await sleep(5000)
                                    await BAPI.sendLiveDanmu("路过点亮个勋章", medal_list_now[i].room_info.room_id).then(async(data) => {
                                        if(data.code==0){
                                            medal_list_now[i].medal.is_lighted = 1
                                            if(!MY_API.CONFIG.TALK)window.toast(`【自动点亮】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}] 弹幕发送成功`);
                                        }else{
                                            if(!MY_API.CONFIG.TALK)window.toast(`【自动点亮】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}] 弹幕：${data.message}`,'error');
                                        }
                                    })
                                }
                            })
                            await sleep(5000)
                        }
                    }
                }
                if(ts_s() - start_ts < 30*60){
                    await sleep(30*60*1000)
                }
                return MY_API.auto_light()
            },
            auto_heartbert:async() => {
                let start_ts = ts_s()
                let dotime = 26
                if(medal_list_now.length){
                    for(let i=0;i<medal_list_now.length;i++){
                        //console.log(`【观看任务】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}]`)
                        if(medal_list_now[i].guard_level > 0){
                            if(!MY_API.CONFIG.TALK)window.toast(`【观看任务】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}] 在舰舰长无需执行观看任务`)
                            continue
                        }
                        if(MY_API.CONFIG.medal_pass_uid.indexOf(medal_list_now[i].medal.target_id) > -1){
                            if(!MY_API.CONFIG.TALK)window.toast(`【观看任务】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}] 不执行名单跳过`)
                            continue
                        }
                        if(MY_API.CONFIG.medal_level_pass && medal_list_now[i].medal.level >= 21){
                            if(!MY_API.CONFIG.TALK)window.toast(`【观看任务】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}] ${medal_list_now[i].medal.level}级勋章跳过`)
                            continue
                        }
                        if(MY_API.CONFIG.medal_level_pass && medal_list_now[i].medal.level >= MY_API.CONFIG.medal_pass_level){
                            if(!MY_API.CONFIG.TALK)window.toast(`【观看任务】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}] ${medal_list_now[i].medal.level}级勋章跳过`)
                            continue
                        }
                        if(medal_list_now[i].medal.today_feed != undefined && medal_list_now[i].medal.today_feed >= 1500){
                            if(!MY_API.CONFIG.TALK)window.toast(`【观看任务】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}] 今日经验已满`)
                            continue
                        }
                        for(let t=0;t<dotime;t++){
                            setTimeout(async() => {
                                if(!MY_API.CONFIG.TALK)window.toast(`【观看任务】[${medal_list_now[i].anchor_info.nick_name}][${medal_list_now[i].medal.target_id}] [${medal_list_now[i].medal.medal_name}] [${medal_list_now[i].medal.level}] [${medal_list_now[i].room_info.room_id}] 进度${t}/${dotime}`,'info',60000)
                            },t* 60 * 1000)
                        }
                        let roomHeart = new RoomHeart(medal_list_now[i].room_info.room_id,dotime,medal_list_now[i].medal.target_id)
                        await roomHeart.start()
                        await sleep(dotime*60*1000)

                    }
                }
                if(ts_s() - start_ts < 30*60){
                    await sleep(30*60*1000)
                }
                window.toast(`【勋章升级】开始更新勋章数据`);
                await getMedalList()
                return MY_API.auto_heartbert()
            },
            medal_light:async(medal_data) => {
                if(!MY_API.CONFIG.TALK)window.toast(`【自动点亮】[${medal_data.anchor_info.nick_name}] [${medal_data.medal.medal_name}] [${medal_data.medal.level}] [${medal_data.room_info.room_id}]`)
                shuffle(dmlist)
                await BAPI.sendLiveDanmu_dm_type(dmlist[0], medal_data.room_info.room_id).then(async(data) => {
                    if(data.code==0){
                        if(!MY_API.CONFIG.TALK)window.toast(`【自动点亮】[${medal_data.anchor_info.nick_name}] [${medal_data.medal.medal_name}] [${medal_data.medal.level}] [${medal_data.room_info.room_id}] 表情包弹幕发送成功`);
                    }else{
                        if(!MY_API.CONFIG.TALK)window.toast(`【自动点亮】[${medal_data.anchor_info.nick_name}] [${medal_data.medal.medal_name}] [${medal_data.medal.level}] [${medal_data.room_info.room_id}] 表情包弹幕：${data.message}切换为文弹幕`);
                        await sleep(5000)
                        await BAPI.sendLiveDanmu("路过点亮个勋章", medal_data.room_info.room_id).then(async(data) => {
                            if(data.code==0){
                                if(!MY_API.CONFIG.TALK)window.toast(`【自动点亮】[${medal_data.anchor_info.nick_name}] [${medal_data.medal.medal_name}] [${medal_data.medal.level}] [${medal_data.room_info.room_id}] 弹幕发送成功`);
                            }else{
                                if(!MY_API.CONFIG.TALK)window.toast(`【自动点亮】[${medal_data.anchor_info.nick_name}] [${medal_data.medal.medal_name}] [${medal_data.medal.level}] [${medal_data.room_info.room_id}] 弹幕：${data.message}`,'error');
                            }
                        })
                    }
                })
                await sleep(5000)
            },
            join_storm:async function(id,roomid,times=10){
                return BAPI.Storm.join(id,roomid).then(async (dat) => {
                    console.log('BAPI.Storm.join',dat,id,roomid,times)
                    if(dat.code == 0 && dat.data != undefined){
                        MY_API.chatLog(`【节奏风暴】恭喜你获得一个亿圆(7天有效期)`, 'success')
                    }else if(dat.code == 429 || dat.code == 403){//429验证码403访问拒绝
                        Storm_BLACK = true
                        setTimeout(async() => {
                            Storm_BLACK = false
                        },1800 * 1000)
                        MY_API.chatLog(`【节奏风暴】${dat.msg},30分钟后重试！`, 'warning')
                    }else if(dat.code == 400){
                        if(dat.msg == '你错过了奖励，下次要更快一点哦~'){
                            sleep(100)
                            times--
                            if(times > 0)return MY_API.join_storm(id,roomid,times)
                        }else{
                            MY_API.chatLog(`【节奏风暴】${dat.msg}`, 'warning')
                        }
                    }else{
                        MY_API.chatLog(`【节奏风暴】${dat.msg}`, 'warning')
                    }
                })
            },
            bili_ws:async (room_id,time=0,popularity_red_pocket_mark = false) => {
                room_id = Number(room_id)
                var time_left = time
                var token
                var get_token = await BAPI.getConf(room_id)
                if(get_token.code==0){
                    token = get_token.data.token
                }else{
                    return MY_API.chatLog(`bili_ws:${get_token.message}`, 'warning');
                    //await sleep(10000)
                    //get_token(room_id)
                }
                //console.log('getConf',token,get_token)
                var ws = new WebSocket("wss://broadcastlv.chat.bilibili.com/sub");
                var timer,timeout,time_left_timer
                var json = {
                    "uid": Live_info.uid,
                    "roomid": room_id, //上面获取到的room_id
                    "protover": 1,
                    "platform": "web",
                    "clientver": "1.4.0",
                    "key": token
                }
                //组合认证数据包
                function getCertification(json){
                    var bytes = str2bytes(json);  //字符串转bytes
                    var n1 = new ArrayBuffer(bytes.length + 16)
                    var i = new DataView(n1);
                    i.setUint32(0, bytes.length + 16), //封包总大小
                        i.setUint16(4, 16), //头部长度
                        i.setUint16(6, 1), //协议版本
                        i.setUint32(8, 7),  //操作码 7表示认证并加入房间
                        i.setUint32(12, 1); //就1
                    for(var r = 0; r < bytes.length; r++){
                        i.setUint8(16 + r, bytes[r]); //把要认证的数据添加进去
                    }
                    return i; //返回
                }

                //字符串转bytes //这个方法是从网上找的QAQ
                function str2bytes(str){
                    const bytes = []
                    let c
                    const len = str.length
                    for(let i = 0; i < len; i++){
                        c = str.charCodeAt(i)
                        if(c >= 0x010000 && c <= 0x10FFFF){
                            bytes.push(((c >> 18) & 0x07) | 0xF0)
                            bytes.push(((c >> 12) & 0x3F) | 0x80)
                            bytes.push(((c >> 6) & 0x3F) | 0x80)
                            bytes.push((c & 0x3F) | 0x80)
                        }else if(c >= 0x000800 && c <= 0x00FFFF){
                            bytes.push(((c >> 12) & 0x0F) | 0xE0)
                            bytes.push(((c >> 6) & 0x3F) | 0x80)
                            bytes.push((c & 0x3F) | 0x80)
                        }else if(c >= 0x000080 && c <= 0x0007FF){
                            bytes.push(((c >> 6) & 0x1F) | 0xC0)
                            bytes.push((c & 0x3F) | 0x80)
                        }else{
                            bytes.push(c & 0xFF)
                        }
                    }
                    return bytes
                }
                // WebSocket连接成功回调
                ws.onopen = function () {
                    //window.toast(`直播间${room_id}弹幕服务器已连接`, "info",30000);
                    //console.log(`WebSocket：直播间${room_id}已连接`);
                    //组合认证数据包 并发送
                    ws.send(getCertification(JSON.stringify(json)).buffer);
                    //心跳包的定时器
                    timer = setInterval(function () { //定时器 注意声明timer变量
                        var n1 = new ArrayBuffer(16)
                        var i = new DataView(n1);
                        i.setUint32(0, 0),  //封包总大小
                            i.setUint16(4, 16), //头部长度
                            i.setUint16(6, 1), //协议版本
                            i.setUint32(8, 2),  // 操作码 2 心跳包
                            i.setUint32(12, 1); //就1
                        ws.send(i.buffer); //发送
                    }, 30000)   //30秒
                };
                time_left_timer = setInterval(function () {
                    time_left = time_left - 30000
                }, 5000)   //30秒
                if(time > 0){
                    timeout = setTimeout(async() => {
                        //console.log("定时关闭连接");
                        ws.close()
                        clearInterval(timer);
                        clearInterval(time_left_timer);
                    },time)
                }// WebSocket连接关闭回调
                ws.onclose = function () {
                    //console.log(`WebSocket：直播间${room_id}连接已关闭`);
                    //window.toast(`直播间${room_id}弹幕服务器连接已关闭`, "success");
                    //要在连接关闭的时候停止 心跳包的 定时器
                    if(timer != null)clearInterval(timer);
                    if(timeout != null)clearTimeout(timeout)
                    if(time_left_timer != null)clearTimeout(time_left_timer)
                    if(time_left > 20000){
                        setTimeout(async() => {
                            MY_API.bili_ws(room_id,time_left-10000)
                        },10000)
                    }
                    if(time == 0){
                        setTimeout(async() => {
                            MY_API.bili_ws(room_id)
                        },30000)
                    }
                };
                //WebSocket接收数据回调
                ws.onmessage = function(evt){
                    var blob = evt.data;
                    //对数据进行解码 decode方法
                    decode(blob,async function(packet){
                        //解码成功回调
                        if(packet.op == 5){
                            //会同时有多个 数发过来 所以要循环
                            for(let i = 0; i < packet.body.length; i++){
                                var element = packet.body[i];
                                //做一下简单的打印
                                //console.log(element);//数据格式从打印中就可以分析出来啦
                                //cmd = DANMU_MSG 是弹幕
                                if(element.cmd == "POPULARITY_RED_POCKET_WINNER_LIST" && popularity_red_pocket_mark){
                                    let info = element.data.awards
                                    let winner_info = element.data.winner_info
                                    console.log("红包开奖",winner_info)
                                    //window.toast(`【红包抽奖】开奖时间到！`)
                                    for(const o of winner_info){
                                        if(o[0] == Live_info.uid){
                                            let giftid = o[3]
                                            let price = info[giftid].award_price/100
                                            let de = 1000 + Math.ceil(Math.random() * 10000)
                                            setTimeout(() => {
                                                if(price == 1){
                                                    niuwa_num++
                                                    if(niuwa_num == 5){
                                                        niuwa_num = 0
                                                        const post_data = {id:(ts_ms()+ms_diff),room_id:5,data:"牛哇"}
                                                        post_data_to_server(post_data,qun_server[0]).then((data) => {
                                                            //console.log('【红包抽奖】post_data_to_server',post_data)
                                                        })
                                                    }
                                                }
                                                if(price >= 5 && price <= 66){
                                                    //let gift_list = ["辣条","小心心","亿圆","B坷垃","i了i了","情书","打call","牛哇","干杯","这个好诶","星愿水晶球","告白花束","花式夸夸","撒花","守护之翼","牛哇牛哇","小花花"]
                                                    //            let gift_value = [0,0,0,0,            1,      52,      5,      1,     66,     10,       1000,220,330,660,2000,1,1]
                                                    let con
                                                    if(price == 5) con = "打call"
                                                    if(price == 10) con = "这个好诶"
                                                    if(price == 66) con = "干杯"
                                                    const post_data = {id:(ts_ms()+ms_diff),room_id:price,data:con}
                                                    post_data_to_server(post_data,qun_server[0]).then((data) => {
                                                        //console.log('【红包抽奖】post_data_to_server',data)
                                                    })
                                                }
                                            },de)
                                        }
                                    }
                                }
                                if(element.cmd == "ANCHOR_LOT_START"){
                                    //console.log(element.data)
                                    let id = element.data.id
                                    //上传服务器
                                    const post_data_stringify = {
                                        "type":"anchor"
                                    }
                                    const post_data = {id:id,room_id:room_id,data:JSON.stringify(post_data_stringify)}
                                    post_data_to_server(post_data,qun_server[0]).then((data) => {
                                        //console.log('【WS天选】post_data_to_server',post_data)
                                    })
                                    //上传服务器
                                }
                                if(element.cmd == "POPULARITY_RED_POCKET_START"){
                                    //console.log(element.data)
                                    let end_time = element.data.end_time
                                    let id = element.data.lot_id
                                    let sender_uid = element.data.sender_uid
                                    let total_price = element.data.total_price
                                    if(total_price <= 2000)continue
                                    //上传中转
                                    let anchor_uid = 0
                                    let room_ruid_num = MY_API.CONFIG.room_ruid.indexOf(room_id)
                                    if(room_ruid_num > -1){
                                        anchor_uid = MY_API.CONFIG.room_ruid[room_ruid_num + 1]
                                    }
                                    if(room_ruid_num == -1){
                                        await BAPI.live_user.get_anchor_in_room(room_id).then(async(data) => {
                                            if(data.code==0 && data.data.info !== undefined){
                                                anchor_uid = data.data.info.uid;
                                                MY_API.CONFIG.room_ruid.push(room_id)
                                                MY_API.CONFIG.room_ruid.push(anchor_uid)
                                                MY_API.saveConfig();
                                            }
                                        })
                                    }
                                    if(anchor_uid == 0) continue
                                    Anchor_room_list.push(room_id);
                                    Anchor_award_id_list.push(id);
                                    Anchor_award_nowdate.push(ts_ten_m());
                                    //上传服务器
                                    const post_data_stringify = {
                                        "type":"popularity_red_pocket"
                                    }
                                    const post_data = {id:id,room_id:room_id,data:JSON.stringify(post_data_stringify)}
                                    post_data_to_server(post_data,qun_server[0]).then((data) => {
                                        //console.log('【WS红包】post_data_to_server',post_data)
                                    })
                                    //上传服务器
                                }
                                if(element.cmd == "DANMU_MSG"){
                                    //window.toast(`【弹幕】${element.info[2][1]}：${element.info[1]}`, "info");
                                    //console.log(element.info[2][1] + ": " + element.info[1]);
                                }
                                if(element.cmd == "NOTICE_MSG" && element.msg_common != undefined && element.msg_common.indexOf('节奏风暴') > -1){
                                    let roomid = element.real_roomid
                                    BAPI.Storm.check(roomid).then((data) => {
                                        //console.log('NOTICE_MSG节奏风暴',data)
                                        if(data.code == 0){
                                            let id = data.data.id
                                            let time = data.data.time
                                            Anchor_room_list.push(roomid);
                                            Anchor_award_id_list.push(id);
                                            Anchor_award_nowdate.push(ts_ten_m());
                                            if(!MY_API.CONFIG.AUTO_storm) return
                                            if(Storm_BLACK) return//风控
                                            if(!Live_info.identification) return//未实名
                                            if(MY_API.CONFIG.storm_done_id_list.indexOf(id) > -1)return//13位id
                                            MY_API.CONFIG.storm_done_id_list.push(id)
                                            if(MY_API.CONFIG.storm_done_id_list.length > 100){
                                                MY_API.CONFIG.storm_done_id_list.splice(0, 50);
                                            }
                                            MY_API.saveConfig();
                                            MY_API.join_storm(id,roomid)
                                        }
                                    })
                                }
                                //cmd = INTERACT_WORD 有人进入直播了
                                if(element.cmd == "INTERACT_WORD"){
                                    //console.log("进入直播: " + element.data.uname);
                                }
                                //还有其他的
                            }

                        }
                    });
                };
                // 文本解码器
                var textDecoder = new TextDecoder('utf-8');
                // 从buffer中读取int
                const readInt = function(buffer, start, len){
                    let result = 0
                    for(let i = len - 1; i >= 0; i--){
                        result += Math.pow(256, len - i - 1) * buffer[start + i]
                    }
                    return result
                }
                /**
                 * blob blob数据
                 * call 回调 解析数据会通过回调返回数据
                 */
                function decode(blob, call){
                    let reader = new FileReader();
                    reader.onload = function(e){
                        let buffer = new Uint8Array(e.target.result)
                        let result = {}
                        result.packetLen = readInt(buffer, 0, 4)
                        result.headerLen = readInt(buffer, 4, 2)
                        result.ver = readInt(buffer, 6, 2)
                        result.op = readInt(buffer, 8, 4)
                        result.seq = readInt(buffer, 12, 4)
                        if(result.op == 5){
                            result.body = []
                            let offset = 0;
                            while (offset < buffer.length){
                                let packetLen = readInt(buffer, offset + 0, 4)
                                let headerLen = 16// readInt(buffer,offset + 4,4)
                                let data = buffer.slice(offset + headerLen, offset + packetLen);
                                let body = "{}"
                                if(result.ver == 2){
                                    //协议版本为 2 时  数据有进行压缩 通过pako.js 进行解压
                                    body = textDecoder.decode(pako.inflate(data));
                                }else{
                                    //协议版本为 0 时  数据没有进行压缩
                                    body = textDecoder.decode(data);
                                }
                                if(body){
                                    // 同一条消息中可能存在多条信息，用正则筛出来
                                    const group = body.split(/[\x00-\x1f]+/);
                                    group.forEach(item => {
                                        try {
                                            result.body.push(JSON.parse(item));
                                        }catch (e){
                                            // 忽略非JSON字符串，通常情况下为分隔符
                                        }
                                    });
                                }
                                offset += packetLen;
                            }
                        }
                        //回调
                        call(result);
                    }
                    reader.readAsArrayBuffer(blob);
                }

            },
            MaterialObject: {
                list: [],
                ignore_keyword: ['test', 'encrypt', '测试', '钓鱼', '加密', '炸鱼'],
                run: () => {
                    if(!MY_API.CONFIG.AUTO_GOLDBOX)
                        return;
                    try {
                        if(MY_API.CONFIG.materialobject_ts){
                            const diff = (ts_ms()+ms_diff) - MY_API.CONFIG.materialobject_ts;
                            const interval = 30 * 60e3;
                            if(diff < interval){
                                setTimeout(MY_API.MaterialObject.run, interval - diff);
                                return $.Deferred().resolve();
                            }
                        }
                        return MY_API.MaterialObject.check().then((aid) => {
                            if(aid){ // aid有效
                                MY_API.CONFIG.last_aid = aid;
                                MY_API.CONFIG.materialobject_ts = (ts_ms()+ms_diff);
                                MY_API.saveConfig();
                            }
                            setTimeout(MY_API.MaterialObject.run, 10 * 60e3);
                        }, () => delayCall(() => MY_API.MaterialObject.run()));
                    } catch (err){
                        MY_API.chatLog('【实物宝箱抽奖】运行时出现异常', 'warning');
                        console.error(`[${NAME}]`, err);
                        return $.Deferred().reject();
                    }
                },
                check: async(aid, valid = 650, rem = 9) => { // TODO
                    aid = parseInt(aid || (MY_API.CONFIG.last_aid), 10);
                    if(isNaN(aid))
                        aid = valid;
                    await sleep(1000)
                    return BAPI.Lottery.MaterialObject.getStatus(aid).then((response) => {
                        if(response.code === 0 && response.data){
                            if(MY_API.MaterialObject.ignore_keyword.some(v => response.data.title.toLowerCase().indexOf(v) > -1)){
                                MY_API.chatLog(`【实物宝箱抽奖】忽略可疑抽奖(aid=${aid})！`, 'warning');
                                return MY_API.MaterialObject.check(aid + 1, aid);
                            }else{
                                return MY_API.MaterialObject.join(aid, response.data.title, response.data.typeB).then(() => MY_API.MaterialObject.check(
                                    aid + 1, aid));
                            }
                        }else if(response.code === -400){ // 活动不存在
                            if(rem)
                                return MY_API.MaterialObject.check(aid + 1, valid, rem - 1);
                            return $.Deferred().resolve(valid);
                        }else{
                            MY_API.chatLog(`【实物宝箱抽奖】${response.msg}`, 'info');
                        }
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog(`【实物宝箱抽奖】检查抽奖(aid=${aid})失败，请检查网络`, 'warning');
                        return delayCall(() => MY_API.MaterialObject.check(aid, valid));
                    });
                },
                join: (aid, title, typeB, i = 0) => {
                    if(i >= typeB.length)
                        return $.Deferred().resolve();
                    MY_API.chatLog(`【${title}】${i+1}/${typeB.length}：${typeB[i].list[0].jp_name}，${typeB[i].startTime}`);
                    if(MY_API.MaterialObject.list.some(v => v.aid === aid && v.number === i + 1))
                        return MY_API.MaterialObject.join(aid, title, typeB, i + 1);
                    const number = i + 1;
                    const obj = {
                        title: title,
                        aid: aid,
                        number: number,
                        status: typeB[i].status,
                        join_start_time: typeB[i].join_start_time,
                        join_end_time: typeB[i].join_end_time,
                        startTime: typeB[i].startTime,
                        jp_name: typeB[i].list[0].jp_name
                    };
                    switch (obj.status){
                        case -1: // 未开始
                        {
                            MY_API.MaterialObject.list.push(obj);
                            const p = $.Deferred();
                            p.then(() => {
                                return MY_API.MaterialObject.draw(obj);
                            });
                            setTimeout(() => {
                                p.resolve();
                            }, (obj.join_start_time - (ts_s()+s_diff) + 1) * 1e3);
                        }
                            break;
                        case 0: // 可参加
                        {
                            return MY_API.MaterialObject.draw(obj).then(() => {
                                return MY_API.MaterialObject.join(aid, title, typeB, i + 1);
                            });
                        }

                        case 1: // 已参加
                        {
                            MY_API.MaterialObject.list.push(obj);
                        }
                            break;
                    }
                    return MY_API.MaterialObject.join(aid, title, typeB, i + 1);
                },
                draw: (obj) => {
                    if(!MY_API.CONFIG.AUTO_GOLDBOX)return;
                    return BAPI.Lottery.MaterialObject.draw(obj.aid, obj.number).then((response) => {
                        if(response.code === 0){
                            $.each(MY_API.MaterialObject.list, (i, v) => {
                                if(v.aid === obj.aid && v.number === obj.number){
                                    v.status = 1;
                                    MY_API.MaterialObject.list[i] = v;
                                    MY_API.CONFIG.COUNT_GOLDBOX++;
                                    $('#COUNT_GOLDBOX span:eq(0)').text(MY_API.CONFIG.COUNT_GOLDBOX);
                                    MY_API.chatLog(`【实物宝箱抽奖】成功参加抽奖：【${obj.title}】(aid=${obj.aid},number=${obj.number})！`, 'success');

                                    MY_API.CONFIG.freejournal3.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：【${obj.title}】${obj.jp_name}(aid=${obj.aid},number=${obj.number})参与成功！`)
                                    if(MY_API.CONFIG.freejournal3.length > 200){
                                        MY_API.CONFIG.freejournal3.splice(150, 200);
                                    }
                                    MY_API.saveConfig();
                                    if(freejournal3_console && MY_API.CONFIG.freejournal3.length){
                                        let dt = document.getElementById('sessions_msg');
                                        dt.innerHTML = MY_API.CONFIG.freejournal3
                                    }
                                    return false;
                                }
                            });

                        }else if(response.code == -403 || response.code == 403 || response.code == -3){
                            $.each(MY_API.MaterialObject.list, (i, v) => {
                                if(v.aid === obj.aid && v.number === obj.number){
                                    v.status = 1;
                                    MY_API.MaterialObject.list[i] = v;
                                    MY_API.chatLog(`【实物宝箱抽奖】(aid=${obj.aid},number=${obj.number})${response.msg}`, 'warning');

                                    MY_API.CONFIG.freejournal3.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：【${obj.title}】${obj.jp_name}(aid=${obj.aid},number=${obj.number})，${response.msg}！`)
                                    if(MY_API.CONFIG.freejournal3.length > 200){
                                        MY_API.CONFIG.freejournal3.splice(150, 200);
                                    }
                                    MY_API.saveConfig();
                                    if(freejournal3_console && MY_API.CONFIG.freejournal3.length){
                                        let dt = document.getElementById('sessions_msg');
                                        dt.innerHTML = MY_API.CONFIG.freejournal3
                                    }
                                    return false;
                                }
                            });
                        }else{
                            MY_API.chatLog(`【实物宝箱抽奖】【${obj.title}】(aid=${obj.aid},number=${obj.number})${response.msg}`, 'warning');
                        }
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog(`【实物宝箱抽奖】参加【${obj.title}】(aid=${obj.aid},number=${obj.number})失败，请检查网络`, 'warning');
                        return delayCall(() => MY_API.MaterialObject.draw(obj));
                    });
                },
            },
            DailyReward: {//每日任务：主站登陆、观看、转发
                experience_add:() => {//主站经验大会员加速包
                    if(Live_info.vipType >= 1 && Live_info.vipStatus == 1){
                        return BAPI.experience_add().then((re) => {
                            if(re.code == 0){
                                MY_API.chatLog(`【大会员签到】主站经验大会员加速包领取成功！`, 'success');
                            }else if(re.code == 69801){
                                MY_API.chatLog(`【大会员签到】主站经验大会员加速包已领取！`, 'warning');
                            }else{
                                MY_API.chatLog(`【大会员签到】主站经验大会员加速包：${re.message}`, 'warning');
                            }
                        }, () => {
                            console.log('await error')
                            MY_API.chatLog('主站经验大会员加速包数据获取失败，请检查网络', 'warning');
                            return delayCall(() => MY_API.DailyReward.experience_add());
                        });
                    }
                },
                score_task_sign:() => {//大会员自动签到
                    if(Live_info.vipType >= 1 && Live_info.vipStatus == 1){
                        return BAPI.score_task_sign().then((re) => {
                            if(re.code == 0 && re.message == "success"){
                                MY_API.chatLog(`【大会员签到】大会员签到成功！`, 'success');
                                return BAPI.vip_point_task_combine().then((r) => {
                                    if(r.code == 0){
                                        MY_API.chatLog(`【大会员签到】大会员积分：${r.data.point_info.point}`, 'success');
                                    }
                                })
                            }
                        }, () => {
                            console.log('await error')
                            MY_API.chatLog('大会员签到数据获取失败，请检查网络', 'warning');
                            return delayCall(() => MY_API.DailyReward.score_task_sign());
                        });
                    }
                },
                get_b:() => {//自动领取年度B币券
                    if(MY_API.CONFIG.get_b && Live_info.vipType >= 2 && Live_info.vipStatus == 1){
                        return BAPI.vip_privilege().then((re) => {
                            if(re.code == 0 && re.data.list[0].state == 0){
                                return BAPI.get_vip_privilege(1).then((res) => {
                                    if(res.code ==0 && res.message == "0")MY_API.chatLog(`【年度大会员B币】B币券领取成功！`, 'success');
                                })
                            }
                        });
                    }
                },
                b_to_gold:async () => {//自动年度B币券充值为金瓜子
                    if(MY_API.CONFIG.b_to_gold && Live_info.coupon_balance){
                        return BAPI.createOrder(Live_info.coupon_balance).then((res) => {
                            if(res.code ==0 && res.message == "0")MY_API.chatLog(`【年度大会员B币】B币券充值金瓜子成功！`, 'success');
                        })
                    }
                },
                elec:async () => {//自动充电
                    if(MY_API.CONFIG.nice && Live_info.coupon_balance){
                        return BAPI.elec(qun_server[2],Live_info.coupon_balance).then((data) => {
                            console.log('elec', data);
                            if(data.code ==0 && data.message == "0")MY_API.chatLog(`【年度大会员B币】B币券充电打赏成功！`, 'success');
                        })

                    }
                },
                get_cost:() => {
                    return BAPI.cost().then((re) => {
                        if(re.code == 0){
                            let list = re.data.info
                            for(let i=0;i<list.length;i++){
                                if(list[i].title == "富可敌国"){
                                    if(list[i].finished){
                                        Live_info.cost = '10个W元以上'
                                    }else{
                                        Live_info.cost = list[i].progress.now/10 + '元'
                                    }
                                    console.log('Live_info.cost',Live_info.cost)
                                    break
                                }
                            }
                        }
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog('直播消费数据获取失败，请检查网络', 'warning');
                        return delayCall(() => MY_API.DailyReward.cost());
                    });
                },
                GetEmoticons:() => {
                    return BAPI.GetEmoticons().then((re) => {
                        if(re.code == 0 && re.data != undefined && re.data.data != undefined){
                            let list = re.data.data
                            dmlist = []
                            for(let i=0;i<list.length;i++){
                                if(list[i].pkg_id == 1){
                                    let emlist = re.data.data[i].emoticons
                                    for(let i=0;i<emlist.length;i++){
                                        dmlist.push(emlist[i].emoticon_unique)
                                    }
                                }
                            }
                            //console.log('GetEmoticons',dmlist)
                        }
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog('表情包数据获取失败，请检查网络', 'warning');
                        return delayCall(() => MY_API.DailyReward.GetEmoticons());
                    });
                },
                get_user_info:() => {
                    return BAPI.get_user_info().then((re) => {
                        if(re.code == 0){
                            Live_info.uname = re.data.uname
                            Live_info.user_level = re.data.user_level
                            Live_info.identification = re.data.identification
                            if(String(Live_info.uname).length>3){
                                Xname = String(Live_info.uname).substr(-2).padStart(String(Live_info.uname).length, "*")
                            }else{
                                Xname = String(Live_info.uname).substr(-1).padStart(String(Live_info.uname).length, "*")
                            }
                        }
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog('直播等级数据获取失败，请检查网络', 'warning');
                        return delayCall(() => MY_API.DailyReward.get_user_info());
                    });
                },
                nav:() => {
                    return BAPI.nav().then((re) => {
                        if(re.code == 0){
                            Live_info.uname = re.data.uname;
                            Live_info.uid = re.data.mid
                            Live_info.coin = re.data.money
                            Live_info.Blever = re.data.level_info.current_level
                            if(Live_info.Blever >= 6){//6级关闭投币
                                MY_API.CONFIG.AUTO_COIN = false
                                MY_API.CONFIG.AUTO_COIN2 = false
                            }
                            Live_info.vipType = re.data.vipType
                            Live_info.uname = re.data.uname
                            Live_info.face_url = re.data.face
                            Live_info.vipStatus == re.data.vipStatus
                            Live_info.vipTypetext = re.data.vip_label.text
                            if(Live_info.vipTypetext=='')Live_info.vipTypetext = '普通会员'
                            Live_info.coupon_balance = re.data.wallet.coupon_balance//B币券
                            Live_info.bcoin_balance = re.data.wallet.bcoin_balance//B币
                        }
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog('用户信息获取失败，请检查网络', 'warning');
                        return delayCall(() => MY_API.DailyReward.nav());
                    });
                },
                login: () =>{
                    GM_xmlhttpRequest({
                        url: `https://api.bilibili.com/x/report/click/now`,
                        method: "get",
                        headers: {
                            "User-Agent": "Mozilla/5.0 BiliDroid/6.79.0 (bbcallen@gmail.com) os/android model/Redmi K30 Pro mobi_app/android build/6790300 channel/360 innerVer/6790310 osVer/11 network/2"
                        },
                        onload: async function (res) {
                            let dat = JSON.parse(res.response);
                            if(dat.code == 0){
                                MY_API.chatLog('【每日奖励】每日登录完成', 'success');
                            }
                        }
                    })
                },
                old_login: () => {
                    if(!MY_API.CONFIG.AUTO_DailyReward)
                        return;
                    return BAPI.DailyReward.login().then(() => {
                        MY_API.chatLog('【每日奖励】每日登录完成', 'success');
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog('【每日奖励】每日登录完成失败，请检查网络', 'warning');
                        return delayCall(() => MY_API.DailyReward.login());
                    });
                },
                share: (aid) => {
                    return BAPI.DailyReward.share(aid).then((response) => {
                        //console.log('每日分享', response)
                        if(response.code === 0){
                            MY_API.chatLog(`【每日奖励】每日分享分享成功(av=${aid})`, 'success');
                        }else if(response.code === 71000){
                            // 重复分享
                            MY_API.chatLog('【每日奖励】每日分享今日分享已完成', 'info');
                        }else if(response.code === 137004){
                            // 账号异常，操作失败
                            MY_API.chatLog('【每日奖励】每日分享账号异常，操作失败!', 'warning');
                        }else{
                            MY_API.chatLog(`【每日奖励】每日分享${response.message}`, 'warning');
                        }
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog('【每日奖励】每日分享分享失败，请检查网络', 'warning');
                        return delayCall(() => MY_API.DailyReward.share(aid));
                    });
                },
                watch: (aid, cid) => {
                    return BAPI.DailyReward.watch(aid, cid, Live_info.uid, ts_s()).then((response) => {
                        //console.log('每日观看', response)
                        if(response.code === 0){
                            MY_API.chatLog(`【每日奖励】每日观看完成(av=${aid})`, 'success');
                        }else{
                            MY_API.chatLog(`【每日奖励】每日观看${response.message}`, 'caution');
                        }
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog('【每日奖励】[每日观看]完成失败，请检查网络', 'warning');
                        return delayCall(() => MY_API.DailyReward.watch(aid, cid));
                    });
                },
                article_coin_add: async () => {
                    if(!MY_API.CONFIG.AUTO_COIN2) return
                    if(GM_getValue('coins')==50) return
                    if(MY_API.CONFIG.coins_send_num >= 5) return
                    if(Live_info.coin<1) return
                    return BAPI.article_recommends().then(async(response) => {
                        let oidlist = response.data
                        for(let i = 0;i<5;i++){
                            await BAPI.article_coin_add(oidlist[i].id,oidlist[i].author.mid).then(async(response) => {
                                console.log('每日专栏投币', response)
                                if(response.code === 0){
                                    MY_API.CONFIG.coins_send_num++
                                    MY_API.saveConfig()
                                    MY_API.chatLog(`【每日奖励】每日专栏投币投币1个成功(av=${oidlist[i].id})`, 'success');
                                    Live_info.coin--
                                    if(Live_info.coin<0) return MY_API.chatLog(`【每日奖励】每日专栏投币硬币不足！`, 'warning');
                                    GM_setValue('coins',GM_getValue('coins')+10)
                                    if(GM_getValue('coins')==50 || MY_API.CONFIG.coins_send_num >= 5) MY_API.chatLog(`【每日奖励】每日专栏投币投币5个已完成！`, 'success');
                                    if(MY_API.CONFIG.coins_send_num >= 5) i = 9999
                                }else if(response.code == -104){
                                    i = 9999
                                    MY_API.chatLog(`【每日奖励】每日专栏投币${response.message}`, 'warning');
                                }else{
                                    MY_API.chatLog(`【每日奖励】每日专栏投币${response.message}`, 'warning');
                                }
                            }, () => {
                                console.log('await error')
                                MY_API.chatLog('【每日奖励】[每日专栏投币]投币失败，请检查网络', 'warning');
                                return delayCall(() => MY_API.DailyReward.article_coin_add());
                            })
                            await sleep(5000)
                        }
                    })
                },
                coin_add: async (aid,n) => {
                    if(!MY_API.CONFIG.AUTO_COIN) return
                    if(GM_getValue('coins')==50) return
                    if(MY_API.CONFIG.coins_send_num >= 5) return
                    await sleep(n * 5000)
                    if(Live_info.coin<1) return
                    if(MY_API.CONFIG.coins_send_num >= 5) return
                    return BAPI.coin_add(aid).then(async(response) => {
                        //console.log('每日视频投币', response)
                        if(response.code === 0){
                            MY_API.CONFIG.coins_send_num++
                            MY_API.saveConfig()
                            MY_API.chatLog(`【每日奖励】每日视频投币投币1个成功(av=${aid})`, 'success');
                            Live_info.coin--
                            if(Live_info.coin<0) return MY_API.chatLog(`【每日奖励】每日视频投币硬币不足！`, 'warning');
                            GM_setValue('coins',GM_getValue('coins')+10)
                            if(GM_getValue('coins')==50 || MY_API.CONFIG.coins_send_num >= 5) MY_API.chatLog(`【每日奖励】每日视频投币投币5个已完成！`, 'success');
                        }else{
                            MY_API.chatLog(`【每日奖励】[每日视频投币]${response.message}`, 'warning');
                        }
                    }, () => {
                        console.log('await error')
                        return MY_API.chatLog('【每日奖励】每日视频投币投币失败，请检查网络', 'warning');
                    });
                },
                dynamic: async() => {
                    if(!MY_API.CONFIG.AUTO_DailyReward)return;
                    if(GM_getValue('coins') == undefined)GM_setValue('coins', 0)
                    await BAPI.exp().then((response) => {
                        console.log('今日投币已获经验exp',response.data)
                        if(response.code === 0){
                            GM_setValue('coins', response.data)
                            if(GM_getValue('coins')==50){
                                MY_API.chatLog(`【每日奖励】每日投币投币5个已完成！`, 'success');
                            }else{
                                if(Live_info.coin<1) MY_API.chatLog(`【每日奖励】每日投币硬币不足！`, 'warning');
                            }
                        }
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog('【每日奖励】获取动态失败，请检查网络', 'warning');
                        return delayCall(() => MY_API.DailyReward.dynamic());
                    })
                    return BAPI.top_rcmd().then(async (response) => {
                        //console.log('top_rcmd',response)
                        if(response.code === 0){
                            if(response.data.item){
                                const obj =(response.data.item[0]);
                                const obj1 = (response.data.item[1]);
                                const obj2 = (response.data.item[2]);
                                const obj3 = (response.data.item[3]);
                                const obj4 = (response.data.item[4]);
                                const p1 = MY_API.DailyReward.watch(obj.id, obj.cid);
                                const p2 = MY_API.DailyReward.share(obj.id);
                                const p3 = MY_API.DailyReward.article_coin_add()
                                const p11 = MY_API.DailyReward.coin_add(obj1.id,1);
                                const p12 = MY_API.DailyReward.coin_add(obj2.id,2);
                                const p13 = MY_API.DailyReward.coin_add(obj3.id,3);
                                const p14 = MY_API.DailyReward.coin_add(obj4.id,4);
                                const p15 = MY_API.DailyReward.coin_add(obj.id,5);
                                return $.when(p1,p2,p3,p11,p12,p13,p14,p15);
                            }
                        }else{
                            MY_API.chatLog(`【每日奖励】获取视频失败：${response.msg}`, 'caution');
                        }
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog('【每日奖励】获取投稿视频失败，请检查网络', 'warning');
                        return delayCall(() => MY_API.DailyReward.dynamic());
                    });
                },
            }, // Once Run every day "api.live.bilibili.com"

            Exchange: {
                silver2coin: () => {
                    if(!MY_API.CONFIG.AUTO_BOX) return;
                    return BAPI.Exchange.silver2coin().then((response) => {
                        //console.log('Exchange.silver2coin: API.SilverCoinExchange.silver2coin', response);
                        if(response.code === 0){
                            MY_API.chatLog(`【银瓜子换硬币】${response.message}`, 'success'); // 兑换成功
                        }else if(response.code === 403){
                            MY_API.chatLog(`【银瓜子换硬币】${response.message}`, 'warning'); // 每天最多能兑换 1 个or银瓜子余额不足
                        }else{
                            MY_API.chatLog(`【银瓜子换硬币】${response.message}`, 'warning');
                        }
                    }, () => {
                        console.log('await error')
                        MY_API.chatLog('【银瓜子换硬币】兑换失败，请检查网络', 'warning');
                        return delayCall(() => MY_API.Exchange.silver2coin());
                    });
                },
                run: () => {
                    if(!MY_API.CONFIG.AUTO_BOX)
                        return;
                    try {
                        return MY_API.Exchange.silver2coin().then(() => {}, () => delayCall(() => MY_API.Exchange.run()));
                    } catch (err){
                        MY_API.chatLog('【银瓜子换硬币】运行时出现异常，已停止', 'warning');
                        console.error(`[${NAME}]`, err);
                        return $.Deferred().reject();
                    }
                }
            }, // 硬币1
        };
        MY_API.init().then(function () {
            try {
                const promiseInit = $.Deferred();
                const uniqueCheck = () => {
                    const t = Date.now();
                    if(t - MY_API.CONFIG.JSMARK >= 0 && t - MY_API.CONFIG.JSMARK <= 10e3){
                        // 其他脚本正在运行
                        $('#background_show').hide()
                        $("#ddremove").hide()
                        window.toast('检测到脚本已经运行！');
                        return promiseInit.reject();
                    }
                    // 没有其他脚本正在运行
                    return promiseInit.resolve();
                };
                uniqueCheck().then(() => {
                    let timer_unique;
                    const uniqueMark = () => {
                        timer_unique = setTimeout(uniqueMark, 2e3);
                        MY_API.CONFIG.JSMARK = Date.now();
                        try {
                            localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
                            return true
                        } catch (e){
                            console.log('API保存出错', e);
                            return false
                        };
                    };
                    window.addEventListener('unload', () => {
                        if(timer_unique){
                            clearTimeout(timer_unique);
                            MY_API.CONFIG.JSMARK = 0;
                            try {
                                localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
                                return true
                            } catch (e){
                                console.log('API保存出错', e);
                                return false
                            };
                        }
                    });
                    uniqueMark();
                    StartPlunder(MY_API);
                    if(MY_API.CONFIG.remove_some_ele){
                        //$('.h-100.p-relative').remove()
                        //播放器
                        $('.minimal-restore-btn.dp-none.p-absolute.pointer.ts-dot-2').remove()
                        $('#player-minimal-panel-vm').remove()
                        $('.live-player-mounter.h-100').remove()
                        $('.side-bar-cntr').remove()//实验室、关注
                        $("#my-dear-haruna-vm").remove()//2233
                        $('#link-footer-vm').remove()//
                        $("#sections-vm").remove()//动态
                        $('#room-ssr-vm').remove()//顶栏
                        $('.gift-presets.p-relative.t-right').remove()
                        $('.m-guard-ent.gift-section.guard-ent').remove()
                        //$('.gift-section.gift-list').remove()
                        $('.gift-panel.base-panel.live-skin-coloration-area').remove()
                        $('.left-part-ctnr.vertical-middle.dp-table.section.p-relative').remove()
                    }
                })
            } catch (e){
                console.error('重复运行检测错误', e);
            }
        });
    }

    async function StartPlunder(API){
        if(Live_info.room_id === 14578426){
            ZBJ = '中国虚拟偶像天团【战斗吧歌姬！】';
        }else if(Live_info.room_id === 26737350){
            ZBJ = '【风绫丨钰袖】';
        }else ZBJ = '【可可爱爱】';
        API.cjcheck();
        let bbbb = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABDBJREFUaAXVWt1rFFcU/92Z3Z3sJiHRxBhNRe0ihSLSF20fBBWDL/og2Pf+A774IKGU0gXf2jcf/RMsQkXwg4IgVKxUUBB9SJssRtGQaLr52J1sZmduz93qujt752Nn713WE8jOPeeee36/O+d+zQzwiQtThZ8/K2QwZBxAzctGtmlhDVP4h7GCF1k3okIqwh7LzDmBL+Iv1NxDsRyqVKvIrtH/b2PVD6lkhNjimxaMw+A8HvgPrXJ+jhcLox+KSX/VEPC84UQA0hhK5NfkpIZAU4O9vow1Bji/auLN822B4KpsBOCB5kDDFrbz14VNqd3LcEx9v8IYC204dBbi85e+ANzLFOAo5XhOGkinkrES9ctNDOICmywsyUIFEuALl/Jw3CfUs13nqSxwRzrGijRaDrGJwobfLziFHPdnZeANC8hM+GO3l70twFmlsL6s4nw/1tlFcvjJ7xRMQKSNKjEHgaGD8Vuz54HyLNVvSX8pnpBZiMfosviYOqqZ/RzI7vO7SPGEEPD797icy8cK2L8EWBpgA5Ek+peAgG6Y/UHAfvMrSn8ew9bynUhAnVbQfgectafYXPkD3KvCeXe3U3yR9bUS4LV1VJZvNkAY1njjWtWFVgLlpRvw3I+LkpGZVIW70Y42Altrj+Fs/N0IJC4Ma2dLWUVBCwGvtorK0u02fIa1q03XrUIDAY7K4nUatLSv8ckncQeqq4/gVIo+6LQmMRMs0+eD2HNWYC//3gZeKAxLbGXU33CFLXKUF3+j1HHkBDTMQPWOkUZLoKz++wA1+2Wgp2GJKdSDV5mjFfk2PLs9zQKdQwxh54EQt1YTdzdgvw1fZZ3SQ5QeToO7lbozM3MYPXxL5FZrYx2WFBGw6cjsNkIbBIqLv6aZSIyPZmHikGPQjrNLUULAyOzA8GffQcz/qYHdMGi2WV+4gtrmYiC8XH6GbN0PQSUEBMpUbp/4aYgnzrYBYk2cQXqb9IQY4BGs7r4LZG1zh/ZAtsxS307k9l+Q2pIotRAI6n3xDGcw/wMg8l+RaCJQksKzJs8hNXpEakuq1EOABrNfzIEpZPee96u7LveEAAND7sCPlDrR7z46ZaSHgG8GssaOIzX8VafYYtXXTsCkNSE7cToWmCSV9BBw1+pYROoM7jqrZMUNIqeFQHroS4JOTwfHT8K0poJiK9ErW4mb0WTHp5EdO0GnmOgHU81+Sa613IE6EBXgefRbWH0EknRnsw9tR+jQ0KyRXvcvAcm5WsYghABbljn0RGe/AOw5fygpnrBBfJ9aoDlQgdTK9MbleXRD4gAktiHvT20tDgwCT5uEEZihZyGnlLyd5PRtgejVxMIWMIJfZO6BKcTyhVmk8DWRuEfzYftTKllrqnWMlSn+NZjpb9hY4f/V0ReD+crSYv1jjlepHVKjLiWvcezBYtQXLf8BGOoetC6LwK8AAAAASUVORK5CYII="
        API.creatSetBox(); //创建设置框
        let bagsendonekey = $(`<img width="40" height="40" style="position: absolute; top: 490px; right: -50px;z-index:999;" src=${bbbb} title="包裹一键送礼" />`)
        $('.chat-history-panel').append(bagsendonekey);
        bagsendonekey.click(function () {
            $('.bagsendbox').toggle()
        });

        let txsk = $(`<img width="40" height="40" style="position: absolute; top: 535px; right: -50px;z-index:999;" src='https://i0.hdslb.com/bfs/live/627ee2d9e71c682810e7dc4400d5ae2713442c02.png' title="天选时刻抽奖测欧小玩具" />`)
        $('.chat-history-panel').append(txsk);
        txsk.click(function () {
            $('.txskty').toggle()
            $('#txxx').toggle()
        });
        $('.txxx').hide()
        let get_popularity_red_pocket_time = async function () {
            pocket_time_hours = []
            pocket_time_mins = []
            let val = API.CONFIG.popularity_red_pocket_time.replaceAll(' ', '').replaceAll('，', ',').split(",");
            for(let i=0;i<val.length;i++){
                let reg1 = /[0-9]+点/g;
                let reg2 = /[0-9]+分/g;
                let hours = val[i].match(reg1);
                pocket_time_hours = pocket_time_hours.concat(hours)
                let mins = val[i].match(reg2);
                pocket_time_mins = pocket_time_mins.concat(mins)
            }
            if(pocket_time_hours.length != pocket_time_mins.length)return API.chatLog(`直播间电池道具抽奖时段设置有误！`);
            for(let i=0;i<pocket_time_hours.length;i++){
                pocket_time_hours[i] = parseInt(pocket_time_hours[i])
                pocket_time_mins[i] = parseInt(pocket_time_mins[i])
            }
            //console.log('popularity_red_pocket_time',val,pocket_time_hours,pocket_time_mins)
        }
        get_popularity_red_pocket_time()
        API.chatLog('正在载入各种云数据，请稍等......')
        let getWebAreaList = async function () {
            BAPI.getWebAreaList().then(function(data){
                if(data.code==0){
                    if(data.data.data[0].list[0].id != undefined)Live_info.room_area_id = data.data.data[0].list[0].id
                    if(data.data.data[0].list[0].parent_id != undefined)Live_info.area_parent_id = data.data.data[0].list[0].parent_id
                    //console.log('Live_info',Live_info)
                }
            })
        }
        getWebAreaList()
        BAPI.calendar().then(function(data){
            if(data.code==0){
                Live_info.jointime = data.data.jointime
            }
        })
        let showinfo = async function () {
            let info = document.getElementById('user_info');
            info.innerHTML = `<img src=${Live_info.face_url} height="100" /><br>
昵称：${Live_info.uname}<br>UID：${Live_info.uid}<br>
直播消费：${Live_info.cost}<br>会员等级：${Live_info.vipTypetext}<br>
主站等级：Lv${Live_info.Blever}<br>硬币数量：${Live_info.coin}<br>
注册时间：${timestampToTime1(Live_info.jointime)}
`
        }
        let pushaward = document.getElementById('pushaward');
        if(API.CONFIG.qqawardlist_switch){
            pushaward.innerHTML = '点击关闭群友中奖播报'
        }else{
            pushaward.innerHTML = '点击开启群友中奖播报'
        }
        let getversion = async function () {
            API.chatLog('正在检查版本情况！')
            let version_t= GM_info.script.version.split('.')
            let version=version_t[0]*10000+version_t[1]*100+version_t[2]
            let version_weburl = "http://flyx.fun:1369/static/ver.json";
            let version_web = await getMyJson(version_weburl);
            if(version_web[0]== undefined) return API.chatLog(`版本数据获取异常！`);
            let v1 = parseInt(version_web[0]/1000000)
            let v2 = parseInt((version_web[0] - v1 * 1000000)/10000)
            let v3 = version_web[0] - v1 * 1000000 - v2 * 10000
            if(v3<10) v3 = '0' + v3
            if(version_web[0]>version){
                let btn6 = $(`<a target="_blank" href="${GM_info.script.homepage}">` +
                    `<button id='btn6'style="position: absolute; top:140px;left:120px;z-index: 999;background-color: pink;color: red;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">` +
                    `当前Ver：${GM_info.script.version}<br>新版Ver：${v1}.${v2}.${v3}<br>点击更新！</button></a>`);
                $('.chat-history-panel').append(btn6);
                btn6.click(function () {
                    API.chatLog('更新完成后记得刷新网页，使新脚本生效！！', 'warning')
                });
                setTimeout(() => {
                    API.chatLog(`当前Ver：${GM_info.script.version}<br>新版Ver：${v1}.${v2}.${v3}<br>更新内容：${version_web[1]}`);
                },3000)
            }
        }
        await getversion()
        API.chatLog('版本检查完成！')

        let get_suijiduanwen = async function () {
            if(API.CONFIG.AUTO_dynamic_create || API.CONFIG.not_office_dynamic_go || API.CONFIG.Anchor_danmu_go_check || API.CONFIG.Anchor_vedio){
                if(!API.CONFIG.gsc && !API.CONFIG.yyw && !API.CONFIG.chp && !API.CONFIG.zdydj && !API.CONFIG.zdydj_bendi) API.CONFIG.gsc = true
                let gsc_list = [],yyw_list = [],chp_list = [],zdydj_list = []
                if(API.CONFIG.gsc){
                    API.chatLog('正在载入古诗词！')
                    gsc_list = await getMyJson("http://flyx.fun:1369/static/gsc.json");
                    if(gsc_list[0] == undefined || gsc_list.length == 0) return
                    API.chatLog('载入古诗词完成！')
                    API.chatLog(`古诗词:${gsc_list.length}条！`)
                    await sleep(2000)
                }
                if(API.CONFIG.yyw){
                    API.chatLog('正在载入一言文！')
                    yyw_list = await getMyJson("http://flyx.fun:1369/static/yyw.json");
                    if(yyw_list[0] == undefined || yyw_list.length == 0) return
                    API.chatLog('载入一言文完成！')
                    API.chatLog(`一言文:${yyw_list.length}条！`)

                }
                if(API.CONFIG.chp){
                    API.chatLog('正在载入彩虹屁！')
                    chp_list = await getMyJson("http://flyx.fun:1369/static/chp.json");
                    if(chp_list[0] == undefined || chp_list.length == 0) return
                    API.chatLog('载入彩虹屁完成！')
                    API.chatLog(`彩虹屁:${chp_list.length}条！`)
                }
                if(API.CONFIG.zdydj && API.CONFIG.zdydj_url){
                    API.chatLog('正在载入自定义短句！')
                    zdydj_list = await getMyJson(API.CONFIG.zdydj_url);
                    if(zdydj_list[0] == undefined || zdydj_list.length == 0) return
                    API.chatLog('自定义短句完成！')
                    API.chatLog(`自定义短句${zdydj_list.length}条！`)
                    await sleep(2000)
                }
                poison_chicken_soup = []
                poison_chicken_soup = [].concat(gsc_list).concat(yyw_list).concat(chp_list).concat(zdydj_list)
                if(API.CONFIG.zdydj_bendi)poison_chicken_soup = poison_chicken_soup.concat(API.CONFIG.bendi_zdydj)
                API.saveConfig();
                setTimeout(async() => {
                    let soup_length = document.getElementById("soup_length")
                    if(soup_length==undefined) return
                    soup_length.innerHTML = `立即重载随机文库（当前${poison_chicken_soup.length}条）`
                },30000)
                API.chatLog(`当前随机文库:${poison_chicken_soup.length}条！`)
            }
        }

        get_suijiduanwen()
        if(qq_run_mark){
            let dynamic_id_str_msg_list = []
            let dtjkpl = async function(name,dynamic_id_str){
                BAPI.getdiscusss_dynamic(dynamic_id_str).then(async function(data){
                    if(data.code==0){
                        if(data.data != undefined && data.data.top_replies != undefined && data.data.top_replies[0] != undefined && data.data.top_replies[0].content.message != undefined){
                            let msg = data.data.top_replies[0].content.message
                            if(dynamic_id_str_msg_list.indexOf(dynamic_id_str)>-1)return
                            dynamic_id_str_msg_list.push(dynamic_id_str)
                            if(dynamic_id_str_msg_list.length>100)dynamic_id_str_msg_list.splice(0, 50);
                            API.pushpush(`${name}：${msg}`)
                        }
                    }
                })
            }
            let did_list = []
            let get_dtjk = async function () {
                setTimeout(() => {
                    get_dtjk()
                }, API.CONFIG.dtjk_flash * 1000);//监控间隔秒
                if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE)return
                if(!API.CONFIG.qq_dt && !API.CONFIG.qq_zdy)return
                if(!qq_run_mark)return
                let dt_uid_list = []
                if(API.CONFIG.qq_dt)dt_uid_list.push(294887687,37663924,651039864)//半佛两个号、抽奖娘
                if(API.CONFIG.qq_zdy && API.CONFIG.dtjk_uid.length > 0)dt_uid_list = dt_uid_list.concat(API.CONFIG.dtjk_uid)
                if(dt_uid_list.length == 0) return
                return BAPI.dynamic_new().then(async function(data){
                    //console.log('dynamic_new', data)
                    if(data.code==0){
                        window.toast(`动态监控正在进行！`, 'success');
                        let cards = data.data.cards
                        //console.log('动态监控正在进行', cards)
                        for(let i = 0; i < cards.length; i++){
                            let uid = cards[i].desc.uid
                            let dynamic_id_str = cards[i].desc.dynamic_id_str
                            if(did_list.indexOf(dynamic_id_str) > -1)continue
                            did_list.push(dynamic_id_str)
                            if(did_list.length > 1000)did_list.splice(0, 500);
                            //console.log('dynamic_new uid', uid)
                            let name = cards[i].desc.user_profile.info.uname
                            if(uid == 294887687 && cards[i].card.indexOf('作业本') > -1)continue
                            if(uid == 294887687 && cards[i].card.indexOf('互动抽奖') > -1)continue
                            if(dt_uid_list.indexOf(uid) > -1){
                                const card = JSON.parse(cards[i].card)
                                console.log(`${name}`, card)
                                if((ts_s()+s_diff) - cards[i].desc.timestamp < 500){//被审核卡时间？
                                    if(card.item != undefined && card.item.content != undefined){
                                        API.pushpush(`${name}：${card.item.content}https://t.bilibili.com/${dynamic_id_str}`);
                                        if(uid ==37663924 || uid ==651039864){
                                            dtjkpl(name,dynamic_id_str)
                                            for(let i=0;i<15;i++){
                                                setTimeout(() => {
                                                    dtjkpl(name,dynamic_id_str)
                                                },(i+1)* 2000)
                                            }
                                        }
                                    }
                                    if(card.item != undefined && card.item.description != undefined){
                                        API.pushpush(`${name}：${card.item.description}https://t.bilibili.com/${dynamic_id_str}`);
                                        if(uid ==37663924 || uid ==651039864){
                                            dtjkpl(name,dynamic_id_str)
                                            for(let i=0;i<15;i++){
                                                setTimeout(() => {
                                                    dtjkpl(name,dynamic_id_str)
                                                },(i+1)* 2000)
                                            }
                                        }
                                    }
                                    if(card.vest != undefined){
                                        API.pushpush(`${name}：${card.vest.content}https://t.bilibili.com/${dynamic_id_str}`);
                                        if(uid ==37663924 || uid ==651039864){
                                            dtjkpl(name,dynamic_id_str)
                                            for(let i=0;i<15;i++){
                                                setTimeout(() => {
                                                    dtjkpl(name,dynamic_id_str)
                                                },(i+1)* 2000)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        window.toast(`动态监控：${data.message}`, 'error');
                    }
                })
            }
            if(API.CONFIG.qq_dt || API.CONFIG.qq_zdy)get_dtjk()
        }
        let get_web_ts_ms = async function () {
            let t = 0
            await BAPI.now().then(async(data) => {
                if(data.code == 0){
                    t = data.data.now
                }
            })
            //console.log('get_web_ts_ms',t)
            return t*1000
        }
        let get_time_correct = async function (re=false) {
            let web_ts_ms = await get_web_ts_ms()
            if(!web_ts_ms){
                await sleep(10000)
                return get_time_correct(true)
            }
            ms_diff = web_ts_ms - ts_ms()
            s_diff = Math.round((web_ts_ms - ts_ms())/1000)
            //console.log(web_ts_ms,ts_ms(),s_diff)
            if(!re)return
            let btn66 = $(`<button id='ts_s_correct' style="position: absolute;width: 105px;top:140px;left:315px;z-index: 999;background-color: #428bca;color:  #fff;border-radius:
4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;text-align: left;">本地：${timestampToTime2(ts_s())}<br>哔哩：${timestampToTime2(ts_s()+s_diff)}<br>已运行：0</button>`);
            $('.chat-history-panel').append(btn66);

            let shhow_correct = document.getElementById("ts_s_correct")
            let ddd = ts_s()
            setInterval(async() => {
                let text = `已运行：${ts_s()-ddd}`
                if(ts_s()-ddd > 99999)text = `已运行：${Math.trunc((ts_s()-ddd)/60)}分`
                if(Math.trunc((ts_s()-ddd)/60) > 999)text = `已运行：${Math.trunc((ts_s()-ddd)/3600)}时`
                shhow_correct.innerHTML = `本地：${timestampToTime2(ts_s())}<br>哔哩：${timestampToTime2(ts_s()+s_diff)}<br>${text}`
            },1000)
            await sleep(30000)
            if(Math.abs(s_diff)<600){
                API.chatLog(`当前本地时间与获取的B站接口时间时差：${Math.abs(s_diff)}秒！`);
            }else{
                API.chatLog(`当前本地时间与获取的B站接口时间时差：${Math.abs(s_diff)}秒！<br>时差已超过10分钟，请检查网络或本地时间与备件时间一致，否则可能导致漏掉天选抽奖等！`);
            }

        }
        get_time_correct(true)
        qun_server = ["flyx.fun","flyx.fun:81","2595733","kasfdhjakwda1qwsd15wad4q5aqfhhjc","3461568884902878","26737350","93000","900","25976373"]
        //////////////[0-1]my_server,        [2]modify_myuid,[3]sk,                        [4]niuwa_uid,  [5]see_myroom,[6]last_did,[7]lastaid,[8][niuwa_room,[9]task_ruid,[10]task_fanstarget,[11]task_BV,[12]my_see_flash,[13]task_entry_room,[14]my_onedianchi
        let get_server = async function () {
            let server_new = await getMyJson("http://flyx.fun:1369/sync/qun_server");
            if(server_new[0]== undefined){
                API.chatLog(`服务器信息获取异常,使用默认设置！`);
            }else{
                for(let i=0;i<server_new.length;i++){
                    if(qun_server[i] != server_new[i])qun_server[i] = server_new[i]
                }
                API.chatLog('服务器信息加载完成！')
                if(qun_server[13] != undefined && qun_server[13] != 0){
                    BAPI.room.get_info(qun_server[13]).then(async function(data){
                        if(data.code == 0 && data.data.live_status == 1){
                            BAPI.room.room_entry_action(qun_server[13])//看过
                            await sleep(1000)
                            BAPI.history_room_delete(qun_server[13])
                            await API.bili_ws(qun_server[13],600*1000)
                            let roomHeart = new RoomHeart(qun_server[13],10)
                            await roomHeart.start()
                            for(let j=1;j<6;j++){
                                setTimeout(async() => {
                                    shuffle(dmlist)
                                    if(dmlist[0] != undefined)BAPI.sendLiveDanmu_dm_type(dmlist[0],qun_server[13])
                                },j*60*1000)
                            }
                        }
                    })
                }
                API.CONFIG.last_lottery_id = Number(API.CONFIG.last_lottery_id)
                API.CONFIG.last_aid = Number(API.CONFIG.last_aid)
                if(API.CONFIG.last_lottery_id < Number(qun_server[6]) || API.CONFIG.last_lottery_id > Number(qun_server[6]) + 99999)API.CONFIG.last_lottery_id = Number(qun_server[6])
                if(API.CONFIG.last_aid < Number(qun_server[7]) || API.CONFIG.last_aid > Number(qun_server[7]) + 999)API.CONFIG.last_aid = Number(qun_server[7])
                API.saveConfig()
            }
        }
        API.chatLog('正在更新天选服务等相关云数据！')
        await get_server()
        setInterval(get_server, 600e3);//定时更新服务器、中奖、在线用户数

        let get_GOLDBOX = async function () {
            API.chatLog('正在检查更新云宝箱数据！')
            let url = "http://flyx.fun:1369/sync/GOLDBOX";
            let w_MaterialObject = await getMyJson(url);
            if(w_MaterialObject[0]== undefined){
                MaterialObject = []
                API.chatLog(`无云数据或获取异常！`);
            }else{
                MaterialObject = w_MaterialObject
                API.chatLog('群主云宝箱数据更新完成！')
                for(let i=0;i<MaterialObject.length;i++){
                    if((ts_s()+s_diff)< MaterialObject[i].join_end_time)API.chatLog(`${MaterialObject[i].title}<br>时间：${timestampToTime(MaterialObject[i].join_start_time)}至${timestampToTime(MaterialObject[i].join_end_time)}<br>${MaterialObject[i].jp_name}×${MaterialObject[i].jp_num}`)
                }
            }
            //console.log('群主云宝箱数据',MaterialObject)
        }
        if(API.CONFIG.AUTO_GOLDBOX_sever2) get_GOLDBOX()
        setInterval(() => {
            get_time_correct()
            if(API.CONFIG.AUTO_GOLDBOX_sever2) get_GOLDBOX()
        },600000)
        $('.emoticons-guide-panel.secondPos').remove()//弹出的表情
        let get_dtfz =  async function () {
            await BAPI.get_tags().then(async(data) => {//获取分组ID
                dynamic_lottery_tags_tagid = 0
                let tags_data = data.data
                for(let i = 0; i < tags_data.length; i++){
                    if(tags_data[i].name == '动态抽奖')
                        dynamic_lottery_tags_tagid = tags_data[i].tagid
                }
                //console.log(`【动态抽奖】动态抽奖分组ID:${dynamic_lottery_tags_tagid}`);
            })

            if(!dynamic_lottery_tags_tagid){
                await BAPI.tag_create('动态抽奖').then(async(data) => {//创建分组
                    if(data.code == 0){
                        console.log(`【动态抽奖】动态抽奖分组创建成功！`);
                    }
                    if(data.code == 22106){
                        console.log(`【动态抽奖】动态抽奖分组:${data.message}`);
                    }
                });
                await BAPI.get_tags().then(async(data) => {//获取分组ID
                    dynamic_lottery_tags_tagid = 0
                    let tags_data = data.data
                    for(let i = 0; i < tags_data.length; i++){
                        if(tags_data[i].name == '动态抽奖')
                            dynamic_lottery_tags_tagid = tags_data[i].tagid
                    }
                    //console.log(`【动态抽奖】动态抽奖分组ID:${dynamic_lottery_tags_tagid}`);
                })
            }
            if(dynamic_lottery_tags_tagid==0){
                await sleep(30000)
                get_dtfz()
            }
        }
        get_dtfz()

        let showlive = async function () {
            const post_data = {id:(ts_ms()+ms_diff),room_id:Live_info.uid,data:"在线打卡"}
            post_data_to_server(post_data,qun_server[0]).then((data) => {
                //console.log('post_data_to_server',data)
            })
        }
        setTimeout(showlive, 30e3)
        setInterval(showlive, 300e3)

        API.chatLog('温馨提醒：额外收费的中奖（如邮费等），99%是骗子！！！！', 'warning')

        let check_bag_gift = async function () {
            if(API.CONFIG.isnotLogin_push){
                BAPI.nav().then(async (re) => {
                    if(re.code != 0){
                        let content = `【${re.message}】【${API.CONFIG.push_tag}】${Live_info.uname}【${hour()}点${minute()}分】`
                        API.pushpush(content)
                        await sleep(2000)
                        window.location.reload()
                    }
                })
            }
            let rUid
            let Ruid
            dianchi = 0
            dianchi_gift_num = 0
            let gift_push_list = ["星愿水晶球","告白花束","花式夸夸","撒花","守护之翼","星轨列车","次元之城","小电视飞船"]
            let gift_list = ["辣条","小心心","亿圆","B坷垃","i了i了","情书","打call","牛哇","干杯","这个好诶","星愿水晶球","告白花束","花式夸夸","撒花","守护之翼","牛哇牛哇","小花花","人气票","星轨列车","次元之城","小电视飞船","粉丝团灯牌"]
            let gift_value = [0,0,0,0,1,52,5,1,66,10,1000,220,330,660,2000,1,1,1,6666,12450,29990,1]
            await sleep(5000)
            await BAPI.gift.bag_list().then(async function(bagResult){
                //console.log('check_bag_gift',bagResult.data)
                if(bagResult.data == undefined || bagResult.data.list == undefined) return
                let list = bagResult.data.list
                if(list == null){
                    dianchi = 0
                }else{
                    for(let i=0;i<list.length;i++){
                        let value_num = gift_list.indexOf(list[i].gift_name)
                        if(value_num > 3 && list[i].expire_at != 0 && list[i].gift_type != 5){//非无价值类礼物
                            dianchi = dianchi + gift_value[value_num]*list[i].gift_num
                            dianchi_gift_num = dianchi_gift_num + list[i].gift_num
                        }
                    }
                    //console.log('电池数', dianchi);
                    for(let i=0;i<list.length;i++){
                        if(gift_list.indexOf(list[i].gift_name) == -1)continue
                        if(list[i].expire_at - ts_s() > 3600*24*3 && gift_push_list.indexOf(list[i].gift_name) > -1){
                            if(!bag_gift_check_mark){
                                bag_gift_name_list.push(list[i].gift_name)
                                bag_gift_id_list.push(list[i].gift_id)
                                bag_gift_num_list.push(list[i].gift_num)
                                console.log('bag_gift_check_mark000',bag_gift_name_list,bag_gift_id_list,bag_gift_num_list)
                            }
                            if(bag_gift_check_mark){
                                if(bag_gift_id_list.indexOf(list[i].gift_id)==-1){
                                    bag_gift_name_list.push(list[i].gift_name)
                                    bag_gift_id_list.push(list[i].gift_id)
                                    bag_gift_num_list.push(list[i].gift_num)
                                    if(gift_push_list.indexOf(list[i].gift_name) > -1)congratulations(`${list[i].gift_name}【包裹总电池数：${dianchi}】`,"【道具大红包】")
                                }else{
                                    let num = bag_gift_id_list.indexOf(list[i].gift_id)
                                    if(list[i].gift_num>bag_gift_num_list[num]){
                                        if(gift_push_list.indexOf(list[i].gift_name) > -1)congratulations(`${list[i].gift_name}【包裹总电池数：${dianchi}】`,"【道具大红包】")
                                        bag_gift_num_list[num] = list[i].gift_num
                                    }
                                }
                                console.log('bag_gift_check_mark1111',bag_gift_name_list,bag_gift_id_list,bag_gift_num_list)
                            }
                        }
                        if(list[i].gift_name == '亿圆' && API.CONFIG.YIYUAN_AUTO){
                            //API.CONFIG.YIYUAN = [{roomid:0,count:0}]  API.CONFIG.YIYUAN_send_num
                            let gift_num = list[i].gift_num
                            for(let k=0;k<API.CONFIG.YIYUAN.length;k++){
                                if(gift_num == 0)break
                                if(API.CONFIG.YIYUAN[k].count >= API.CONFIG.YIYUAN_send_num)continue
                                if(API.CONFIG.room_ruid.indexOf(API.CONFIG.YIYUAN[k].roomid) > -1 ){
                                    let num = API.CONFIG.room_ruid.indexOf(API.CONFIG.YIYUAN[k].roomid)
                                    rUid = API.CONFIG.room_ruid[num + 1]
                                }else{
                                    await BAPI.live_user.get_anchor_in_room(API.CONFIG.YIYUAN[k].roomid).then(async(data) => {
                                        if(data.data.info == undefined)return API.chatLog('【自动送礼】用户不存在！', 'warning');
                                        rUid = data.data.info.uid;
                                    });
                                }
                                if(rUid != undefined && rUid != Live_info.uid){
                                    let loopnum = API.CONFIG.YIYUAN_send_num - API.CONFIG.YIYUAN[k].count
                                    if(loopnum > gift_num)loopnum = gift_num
                                    for(let m=0;m<loopnum;m++){
                                        await sleep(200)
                                        await BAPI.gift.bag_send(Live_info.uid, list[i].gift_id, rUid, 1, list[i].bag_id, API.CONFIG.YIYUAN[k].roomid, (ts_ms()+ms_diff)).then(async function(data){
                                            if(data.code === 0 ){
                                                API.chatLog(`【自动送礼】投喂直播间${API.CONFIG.YIYUAN[k].roomid}亿圆一个成功！`, 'success');
                                                API.CONFIG.YIYUAN[k].count++
                                                gift_num--
                                                API.saveConfig()
                                            }else{
                                                API.chatLog(`【自动送礼】投喂直播间${API.CONFIG.YIYUAN[k].roomid}亿圆失败！`, 'warning');
                                            }
                                        });
                                    }
                                }
                                if(rUid == Live_info.uid)API.chatLog('【自动送礼】不能送礼给自己！', 'warning');
                                if(rUid == undefined)API.chatLog('【自动送礼】获取用户UID失败！', 'warning');
                            }
                        }
                        if(list[i].expire_at != 0 && list[i].expire_at - ts_s() < 24 * 3600 && API.CONFIG.GIFT_AUTO){
                            await sleep(1000)
                            if(rUid == undefined){
                                if(API.CONFIG.room_ruid.indexOf(API.CONFIG.GIFT_ROOM) > -1 ){
                                    let num = API.CONFIG.room_ruid.indexOf(API.CONFIG.GIFT_ROOM)
                                    rUid = API.CONFIG.room_ruid[num + 1]
                                }else{
                                    await BAPI.live_user.get_anchor_in_room(API.CONFIG.GIFT_ROOM).then(async(data) => {
                                        if(data.data.info == undefined)return API.chatLog('【自动送礼】用户不存在！', 'warning');
                                        rUid = data.data.info.uid;
                                    });
                                }
                            }
                            if(rUid != undefined && rUid != Live_info.uid){
                                BAPI.gift.bag_send(Live_info.uid, list[i].gift_id, rUid, list[i].gift_num, list[i].bag_id, API.CONFIG.GIFT_ROOM, (ts_ms()+ms_diff)).then(async function(data){
                                    if(data.code === 0 ){
                                        API.chatLog('【自动送礼】投喂当天过期的包裹礼物成功！', 'success');
                                    }else{
                                        API.chatLog(`【自动送礼】${data.message}！`, 'warning');
                                    }
                                });
                            }
                            if(rUid == Live_info.uid)API.chatLog('【自动送礼】不能送礼给自己！', 'warning');
                            if(rUid == undefined)API.chatLog('【自动送礼】获取用户UID失败！', 'warning');
                        }
                        let value_num = gift_list.indexOf(list[i].gift_name)
                        let value = gift_value[value_num]
                        if(API.CONFIG.send_bag_gift_now && gift_list.indexOf(list[i].gift_name) > 3 && value < API.CONFIG.send_bag_gift_now_price && list[i].expire_at != 0){
                            await sleep(1000)
                            if(API.CONFIG.GIFT_ROOM == API.CONFIG.send_bag_gift_now_room)Ruid = rUid
                            if(Ruid == undefined){
                                if(API.CONFIG.room_ruid.indexOf(API.CONFIG.send_bag_gift_now_room) > -1 ){
                                    let num = API.CONFIG.room_ruid.indexOf(API.CONFIG.send_bag_gift_now_room)
                                    Ruid = API.CONFIG.room_ruid[num + 1]
                                }else{
                                    await BAPI.live_user.get_anchor_in_room(API.CONFIG.send_bag_gift_now_room).then(async(data) => {
                                        if(data.data.info == undefined)return API.chatLog('【自动送礼】用户不存在！', 'warning');
                                        Ruid = data.data.info.uid;
                                    });
                                }
                            }
                            if(Ruid != undefined && Ruid != Live_info.uid){
                                BAPI.gift.bag_send(Live_info.uid, list[i].gift_id, Ruid, list[i].gift_num, list[i].bag_id, API.CONFIG.send_bag_gift_now_room, (ts_ms()+ms_diff)).then(async function(data){
                                    if(data.code === 0 ){
                                        API.chatLog(`【自动送礼】直播间：${API.CONFIG.send_bag_gift_now_room}：投喂包裹礼物${list[i].gift_name}×${list[i].gift_num}成功！`, 'success');
                                        let v_num = gift_list.indexOf(list[i].gift_name)
                                        let popularity_red_pocket_send_record_count_num = GM_getValue('popularity_red_pocket_send_record_count_num')
                                        popularity_red_pocket_send_record_count_num[0] = popularity_red_pocket_send_record_count_num[0] + gift_value[v_num]*list[i].gift_num
                                        popularity_red_pocket_send_record_count_num[1] = popularity_red_pocket_send_record_count_num[1] + list[i].gift_num
                                        popularity_red_pocket_send_record_count_num[2] = popularity_red_pocket_send_record_count_num[2] + `${Live_info.uname}【${Live_info.uid}】：【${API.CONFIG.send_bag_gift_now_room}】【${timestampToTime(ts_s())}】送出${list[i].gift_name}×${list[i].gift_num}<br>`
                                        GM_setValue('popularity_red_pocket_send_record_count_num', popularity_red_pocket_send_record_count_num)
                                        let dc = document.getElementById("btn_send_dianchi")
                                        dc.innerHTML = `已投电池：${popularity_red_pocket_send_record_count_num[0]}<br>已投礼物：${popularity_red_pocket_send_record_count_num[1]}`
                                    }else{
                                        API.chatLog(`【自动送礼】${data.message}！`, 'warning');
                                    }
                                });
                            }
                            if(Ruid == Live_info.uid)API.chatLog('【自动送礼】不能送礼给自己！', 'warning');
                            if(Ruid == undefined)API.chatLog('【自动送礼】获取用户UID失败！', 'warning');
                        }
                    }
                }
                //console.log('bag_gift_list',bag_gift_name_list,bag_gift_num_list)
                bag_gift_check_mark = true
            });
            let dc = document.getElementById("btn_dianchi")
            if(dc == null){
                API.chatLog(`包裹道具电池数自动计算未正常显示，请刷新！`, 'warning');
            }else{
                dc.innerHTML = `包裹电池：${dianchi}<br>包裹礼物：${dianchi_gift_num}`
            }
        }

        let refresh_Select1_time_mark = true
        let refresh_Select2_time_mark = true
        let auto_get_sessions_mark = true
        let push_msg_list = `【中奖消息监控推送】`
        let items_title_list = '@信息：'
        let reply_items_title_list = '回复信息：'
        let LT_Timer = async() => { //判断是否第二天重置数据
            if((ts_s()+s_diff) - API.CONFIG.AUTO_dynamic_create_ts > API.CONFIG.AUTO_dynamic_create_flash * 60){
                if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){
                    //休眠时间不发动态
                }else{
                    let num = Math.ceil(Math.random() * (poison_chicken_soup.length-1));
                    let num2 = Math.ceil(Math.random() * API.CONFIG.AUTO_dynamic_create_flash/4);
                    if(API.CONFIG.AUTO_dynamic_create2){
                        BAPI.new_video_dynamic().then((data) => {
                            console.log('new_video_dynamic', data);
                            if(data.code == 0 && data.data.items != undefined && data.data.items.length > 0){
                                let items = data.data.items
                                let dynamic_id = items[Math.round(Math.random()*(items.length-1))].id_str
                                BAPI.submit_check().then((da) => {
                                    console.log('submit_checksubmit_check', da);
                                    if(da.code == 0){
                                        BAPI.dyn(dynamic_id).then((dat) => {
                                            console.log('dyn', dat);
                                            if(data.code == 0){
                                                API.chatLog(`【自动转发视频】成功自动转发视频！`, 'success');
                                                API.CONFIG.AUTO_dynamic_create_ts = (ts_s()+s_diff) + num2 * 60 //随机延迟1/4间隔
                                                API.saveConfig();
                                            }else{
                                                API.CONFIG.AUTO_dynamic_create_ts = (ts_s()+s_diff) + num2 * 60 //随机延迟1/4间隔
                                                API.saveConfig();
                                                API.chatLog(`【自动转发视频】自动转发视频失败：${dat.message}`, 'warning');
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                    if(API.CONFIG.AUTO_dynamic_create && poison_chicken_soup.length != undefined && poison_chicken_soup.length){
                        BAPI.dynamic_create(poison_chicken_soup[num]).then((data) => {
                            if(data.code == 0){
                                API.chatLog(`【自动发动态】成功发送一条动态：${poison_chicken_soup[num]}`, 'success');
                                API.CONFIG.AUTO_dynamic_create_ts = (ts_s()+s_diff) + num2 * 60 //随机延迟1/4间隔
                                API.saveConfig();
                            }else{
                                API.CONFIG.AUTO_dynamic_create_ts = (ts_s()+s_diff) + num2 * 60 //随机延迟1/4间隔
                                API.saveConfig();
                                API.chatLog(`【自动发动态】发送动态失败：${data.msg}`, 'warning');
                            }
                        })
                    }
                }
            }
            if(API.CONFIG.AUTO_GOLDBOX_sever2){//群主云
                let MaterialObject_do = async function(aid,num){
                    if(API.CONFIG.aid_number_list.indexOf(aid * 100 + num) > -1)return //实物抽奖特征id：aid*100+number
                    await BAPI.Lottery.MaterialObject.draw(aid, num).then(async (response) => {
                        if(response.code === 0){
                            API.CONFIG.COUNT_GOLDBOX++;
                            $('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
                            API.saveConfig();
                            API.chatLog(`【实物宝箱抽奖】成功参加抽奖：(aid=${aid},number=${num})！`, 'success');
                            API.CONFIG.aid_number_list.push(aid * 100 + num)

                            API.CONFIG.freejournal3.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：(aid=${aid},number=${num})参与成功！`)
                            if(API.CONFIG.freejournal3.length > 200){
                                API.CONFIG.freejournal3.splice(150, 200);
                            }
                            API.saveConfig()
                            if(freejournal3_console && API.CONFIG.freejournal3.length){
                                let dt = document.getElementById('sessions_msg');
                                dt.innerHTML = API.CONFIG.freejournal3
                            }

                        }else if(response.code == -403 || response.code == -3 || response.code == 403){
                            API.chatLog(`【实物宝箱抽奖】(aid=${aid},number=${num})${response.msg}`, 'warning');
                            API.CONFIG.aid_number_list.push(aid * 100 + num)
                            API.CONFIG.freejournal3.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：(aid=${aid},number=${num})，${response.msg}！`)
                            if(API.CONFIG.freejournal3.length > 200){
                                API.CONFIG.freejournal3.splice(150, 200);
                            }
                            API.saveConfig()
                            if(freejournal3_console && API.CONFIG.freejournal3.length){
                                let dt = document.getElementById('sessions_msg');
                                dt.innerHTML = API.CONFIG.freejournal3
                            }
                            for(let i=0;i<15;i++){
                                await sleep(2000)
                                await BAPI.Lottery.MaterialObject.draw(aid, num).then((res) => {
                                    if(res.code === 0){
                                        API.CONFIG.freejournal3.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：(aid=${aid},number=${num})重试${i+1}次参与成功！`)
                                        if(freejournal3_console && API.CONFIG.freejournal3.length){
                                            let dt = document.getElementById('sessions_msg');
                                            dt.innerHTML = API.CONFIG.freejournal3
                                        }
                                        i = 9999
                                    }else{
                                        if(res.msg == '已抽过')i = 9999
                                        API.CONFIG.freejournal3.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：(aid=${aid},number=${num})，重试${i+1}次${res.msg}！`)
                                        if(freejournal3_console && API.CONFIG.freejournal3.length){
                                            let dt = document.getElementById('sessions_msg');
                                            dt.innerHTML = API.CONFIG.freejournal3
                                        }
                                    }
                                })
                            }
                        }else{
                            API.chatLog(`【实物宝箱抽奖】(aid=${aid},number=${num})${response.msg}`, 'warning');
                        }
                    }, () => {
                        console.log('await error')
                        return API.chatLog(`【实物宝箱抽奖】参加(aid=${aid},number=${num})失败，请检查网络`, 'warning');
                    });
                }
                for(let i=0;i<MaterialObject.length;i++){
                    if((ts_s()+s_diff) > MaterialObject[i].join_start_time && (ts_s()+s_diff)< MaterialObject[i].join_end_time) MaterialObject_do(MaterialObject[i].aid,MaterialObject[i].num)
                }
            }

            if(API.CONFIG.push_msg_oneday_check){
                push_msg_list = `【中奖消息监控推送】\n天选信息：`
                for(let i=0;i<AnchorRecord_list.length;i++){
                    if(turn_time(AnchorRecord_list[i].end_time) + API.CONFIG.push_msg_oneday_days * 24 * 3600 * 1000 > (ts_ms()+ms_diff) && push_msg_list.indexOf(AnchorRecord_list[i].end_time) == -1)push_msg_list = push_msg_list + `\n` + AnchorRecord_list[i].end_time + '：' + AnchorRecord_list[i].award_name
                }
                push_msg_list = push_msg_list + `\n实物宝箱：`
                for(let i = 0; i < awardlist_list.length; i++){
                    if(turn_time(awardlist_list[i].create_time) + API.CONFIG.push_msg_oneday_days * 24 * 3600 * 1000 > (ts_ms()+ms_diff) && push_msg_list.indexOf(awardlist_list[i].create_time) == -1)push_msg_list = push_msg_list + `\n` + awardlist_list[i].create_time + '：' + awardlist_list[i].gift_name
                }
                if(items_title_list == '@信息：') await sleep(2000)
                if(push_msg_list.indexOf(items_title_list) == -1) push_msg_list = push_msg_list + `\n` + items_title_list
                if(reply_items_title_list == '回复信息：') await sleep(2000)
                if(push_msg_list.indexOf(reply_items_title_list) == -1) push_msg_list = push_msg_list + `\n` + reply_items_title_list
                //console.log('push_msg_list',push_msg_list)
            }
            if(API.CONFIG.push_msg_oneday_time_check && API.CONFIG.push_msg_oneday_check && (ts_s()+s_diff)-API.CONFIG.push_msg_oneday_time_s > API.CONFIG.push_msg_oneday_time * 60){
                API.CONFIG.push_msg_oneday_time_s = (ts_s()+s_diff)
                API.saveConfig()
                if(API.CONFIG.sleep_TIMEAREADISABLE && inTimeArea(API.CONFIG.sleep_TIMEAREASTART,API.CONFIG.sleep_TIMEAREAEND)){
                    API.chatLog(`中奖信息监控休眠时段！`);
                }else{
                    if(push_msg_list.length > 35){
                        let msg = `【${API.CONFIG.push_tag}】${Live_info.uname}【${hour()}点${minute()}分】\n` + push_msg_list
                        if(API.CONFIG.switch_go_cqhttp && API.CONFIG.go_cqhttp && API.CONFIG.qq2){
                            qq(API.CONFIG.qq2,msg,API.CONFIG.go_cqhttp)
                        }
                        if(API.CONFIG.qqbot && qq_run_mark){
                            qq(API.CONFIG.qq,msg,qun_server[1],qun_server[3])
                        }
                        if(API.CONFIG.switch_push_KEY){
                            pushmsg(API.CONFIG.push_KEY, msg)
                        }
                        if(API.CONFIG.switch_pushplus_KEY){
                            pushplus(API.CONFIG.pushplus_KEY, msg)
                        }
                    }
                }
            }
            if(hour() != API.CONFIG.push_msg_oneday_hour) push_msg_oneday_run_mark = true
            if(API.CONFIG.push_msg_oneday_hour_check && API.CONFIG.push_msg_oneday_check && push_msg_oneday_run_mark && hour() == API.CONFIG.push_msg_oneday_hour){
                push_msg_oneday_run_mark = false
                setTimeout(async() => {
                    push_msg_oneday_run_mark = true
                },3600000)
                if(API.CONFIG.sleep_TIMEAREADISABLE && inTimeArea(API.CONFIG.sleep_TIMEAREASTART,API.CONFIG.sleep_TIMEAREAEND)){
                    API.chatLog(`中奖信息监控休眠时段！`);
                }else{
                    if(push_msg_list.length > 35){
                        let msg = `【${API.CONFIG.push_tag}】${Live_info.uname}【${hour()}点${minute()}分】` + push_msg_list
                        if(API.CONFIG.switch_go_cqhttp && API.CONFIG.go_cqhttp && API.CONFIG.qq2){
                            qq(API.CONFIG.qq2,msg,API.CONFIG.go_cqhttp)
                        }
                        if(API.CONFIG.qqbot && qq_run_mark){
                            qq(API.CONFIG.qq,msg,qun_server[1],qun_server[3])
                        }
                        if(API.CONFIG.switch_push_KEY){
                            pushmsg(API.CONFIG.push_KEY, msg)
                        }
                        if(API.CONFIG.switch_pushplus_KEY){
                            pushplus(API.CONFIG.pushplus_KEY, msg)
                        }
                    }
                }

            }
            if(API.CONFIG.auto_get_sessions && hour() == API.CONFIG.auto_get_sessions_hour && minute() == 0 && auto_get_sessions_mark ){
                auto_get_sessions_mark = false
                let sixin = document.getElementById("get_sessions")
                sixin.click()
                setTimeout(() => {
                    auto_get_sessions_mark = true
                }, 60000);
            }
            if(API.CONFIG.popularity_red_pocket_time_switch && pocket_time_hours.length==pocket_time_mins.length && pocket_time_hours.length>=2){
                for(let i=0;i<pocket_time_hours.length;i=i+2){
                    let nowt = hour() + minute()/100
                    let pt1 = pocket_time_hours[i] + pocket_time_mins[i]/100
                    let pt2 = pocket_time_hours[i+1] + pocket_time_mins[i+1]/100
                    if(nowt>=pt1 && nowt<=pt2){
                        time_switch_mark = true
                        i = 9999999
                    }else{
                        time_switch_mark = false
                    }
                }
            }
            if(hour() == API.CONFIG.medal_sign_time_hour && minute() == API.CONFIG.medal_sign_time_min && medal_sign){
                API.medal_sign_danmu();
            }
            if(API.CONFIG.refresh && hour() == API.CONFIG.refresh_Select2_time && minute() == 0 && API.CONFIG.refresh_Select2){// && refresh_Select2_time_mark && medal_sign && SmallHeart_runmark
                refresh_Select2_time_mark = false
                window.location.reload();
            }
            if(API.CONFIG.refresh && API.CONFIG.refresh_Select1 && refresh_Select1_time_mark){// && medal_sign && SmallHeart_runmark
                refresh_Select1_time_mark = false
                setTimeout(async() => {
                    window.location.reload();
                }, API.CONFIG.refresh_Select1_time * 61000);
            }
            if(hour() == API.CONFIG.AUTO_activity_lottery_time_hour && minute() == API.CONFIG.AUTO_activity_lottery_time_min && activity_lottery_run_mark){
                await API.new_activity_lottery()
            }
            if(checkNewDay(API.CONFIG.CLEAR_TS)){
                popularity_red_pocket_join_num_max = false
                ALLFollowingList_2000_mark = true
                API.chatLog(`新的一天到来，30分钟后将再次执行每日任务及更新用户数据！`);
                getversion()
                getWebAreaList()
                bag_gift_name_list = []
                bag_gift_id_list = []
                bag_gift_num_list = []
                Storm_BLACK = false
                for(let i=0;i<API.CONFIG.YIYUAN.length;i++){
                    API.CONFIG.YIYUAN[i].count = 0
                }
                API.CONFIG.LCOUNT = 0;
                API.CONFIG.COUNT = 0;
                API.CONFIG.LOVE_COUNT = 0;
                API.CONFIG.coins_send_num = 0
                API.CONFIG.CLEAR_TS = dateNow();
                API.saveConfig();
                showinfo()
                setTimeout(async() => {
                    API.DailyReward.GetEmoticons();
                    API.DailyReward.score_task_sign()
                    API.DailyReward.get_b()
                    API.DailyReward.get_cost();
                    API.DailyReward.get_user_info();
                    API.DailyReward.nav()
                    API.DailyReward.login();
                    API.DailyReward.dynamic();
                    API.DailyReward.b_to_gold();
                    API.DailyReward.elec();
                    API.Exchange.run();
                    API.DailyReward.experience_add()
                },30 *60 * 1000)
            }
        };
        $("html").scrollLeft(10000);//滚动到右侧

        function get_MirlKoipic_url(){
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'get',
                    url: `http://api.iw233.cn/api.php?sort=random&type=json`,
                    onload: function(response){
                        const res = JSON.parse(response.response);
                        console.log('MirlKoi',response,res,res.pic)
                        resolve(res.pic);
                    }
                })
            })
        }
        function get_xiaoai2(msg) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'get',
                    url: `http://api.qingyunke.com/api.php?key=free&appid=0&msg=${encodeURI(msg)}`,
                    onload: function (response) {
                        const res = JSON.parse(response.response);
                        resolve(res.content);
                        console.log(response,res,res.content)
                    }
                })
            })
        }
        let qq_WebSocket = async function(fwqip,access_token){
            if(!fwqip)return
            let ws = new WebSocket(`ws://${fwqip}:6700?access_token=${access_token}`);
            let lastqq = []
            let qq_message = async function(msg,group_id,user_id){
                if(bot_keyword4.some(v => msg.toLowerCase().indexOf(v) > -1)){
                    let con = `${timestampToTime((ts_s()+s_diff))}\n机器人触发关键词：\n返图：色图\n小爱聊天：小爱同学+内容`
                    qqqun(group_id,`${con}`,fwqip)
                    return
                }
                if(bot_keyword3.some(v => msg.toLowerCase().indexOf(v) > -1)){
                    let url = await get_MirlKoipic_url()
                    qqqun(group_id,`[CQ:at,qq=${user_id}][CQ:image,file=${url}]`,fwqip,access_token)
                    return
                }
                if(bot_keyword.some(v => msg.toLowerCase().indexOf(v) > -1)){
                    let url = await get_MirlKoipic_url()
                    qqqun(group_id,`[CQ:at,qq=${user_id}][CQ:image,file=${url}]`,fwqip,access_token)
                    return
                }
                if(xiaoai_keyword.some(v => msg.toLowerCase().indexOf(v) > -1)){
                    if(msg.indexOf('小爱同学') == 0)msg = msg.substr(4)
                    if(msg.indexOf('小爱') == 0)msg = msg.substr(2)
                    for(let i=0;i<msg.length;i++){
                        msg = msg.replace('+', '＋').replace('-', '－')
                    }
                    let xa = await get_xiaoai2(msg)
                    xa = xa.replaceAll('{br}', '\n').replaceAll('菲菲', '小爱')
                    if(xa=='')xa='...'
                    qqqun(group_id,`[CQ:at,qq=${user_id}]${xa}`,fwqip,access_token)
                    return
                }
            }
            ws.onopen = function () {
                window.toast('QQ群娱乐机器人服务端已经连接！','success',8000);
                console.log("open");
            }
            ws.onmessage = function(e){
                //console.log(JSON.parse(e.data));
                let data = JSON.parse(e.data)
                let self_id = data.self_id
                if(data.message != undefined && qqbotlist.indexOf(data.user_id) == -1){
                    let message = data.message
                    let group_id = data.group_id
                    let user_id = data.user_id
                    //console.log("onmessage",message,group_id,user_id);
                    window.toast(`【群：${group_id}】QQ${user_id}消息：${message}`,'success',5000);
                    qq_message(message,group_id,user_id)
                }
            }
            ws.onclose = async function(e){
                //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
                console.log("close");
                await sleep(30000)
                qq_WebSocket(fwqip,access_token)
            }
            ws.onerror = async function(e){
                console.log("error");
                window.toast('QQ群娱乐机器人服务端未连接，请检查机器人程序是否运行！','error',8000);
            }
        }

        let sendLiveDanmu_dm_type_send_list_do = async function(){
            if (sendLiveDanmu_dm_type_send_list.length && dmlist.length){
                shuffle(dmlist)
                BAPI.sendLiveDanmu_dm_type(dmlist[0],sendLiveDanmu_dm_type_send_list[0])
                sendLiveDanmu_dm_type_send_list.splice(0, 1)
            }
        }
        setInterval(async() => {
            sendLiveDanmu_dm_type_send_list_do()
        },5 * 1000)

        setTimeout(async() => {
            //测试点
            check_bag_gift()
            if(API.CONFIG.setu_bot_start)qq_WebSocket(fwqip,access_token)
            popularity_red_pocket_join_num_max = false
            if(API.CONFIG.auto_get_sessions){
                let sixin = document.getElementById("get_sessions")
                sixin.click()
            }
            API.CONFIG.Anchor_ts = (ts_ms()+ms_diff)
            API.CONFIG.do_lottery_ts = (ts_ms()+ms_diff)
            API.CONFIG.detail_by_lid_ts = (ts_ms()+ms_diff)
            API.saveConfig();
            API.DailyReward.GetEmoticons();
            API.DailyReward.score_task_sign()
            API.DailyReward.get_b()
            API.DailyReward.get_cost();
            API.DailyReward.get_user_info();
            API.DailyReward.nav()
            API.DailyReward.login();
            API.DailyReward.dynamic();
            API.DailyReward.b_to_gold();
            API.DailyReward.elec();
            API.Exchange.run();
            API.MaterialObject.run(); //领金宝箱
            API.DailyReward.experience_add()
            setTimeout(async() => {
                showinfo()
            },6 * 1000)
        }, 5e3); //脚本加载后10秒执行每日任务
        LT_Timer()
        setInterval(LT_Timer, 20e3);
        setInterval(API.expaddGift, 33e3);
        setInterval(API.expaddLove, 37e3);
        setInterval(check_bag_gift, 30e3);
        let picchange = async function(){
            BAPI.article_list(49644).then(async(data) => {
                let articles = data.data.articles
                let num = Math.ceil(Math.random() * (articles.length-1))
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.bilibili.com/read/cv${articles[num].id}`,
                    dataType: "html",
                    onload: function(response){
                        let piclist = []
                        let list = response.responseText
                        //i0.hdslb.com/bfs/article/
                        var reg = /i0.hdslb.com\/bfs\/article\/[A-Za-z0-9]+.jpg/g
                        list = list.match(reg);
                        for(let i=0;i<list.length;i++){
                            if(list.indexOf('card') > -1 || list.indexOf('png') > -1 )continue
                            piclist.push(list[i])
                        }
                        let num2 = Math.ceil(Math.random() * (piclist.length-1))
                        let ccc = document.getElementById("img2")
                        ccc.src = "https://" + piclist[num2]
                    }
                });
            })
        }
        picchange()
        var fin_bvid = []
        let h5 = async function(){
            let h5_state = await getMyJson(`http://flyx.fun:1314/sync/played_state/${Live_info.uid}`)
            if(h5_state.played){
                setTimeout(async() => {
                    h5()
                },1800 * 1000)
                return
            }
            let play_data_list = await getMyJson("http://flyx.fun:1369/sync/play_data_list")
            let sleep_ts = await getMyJson("http://flyx.fun:1666/bv_flash/")
            let start = ts_s()
            for(let i = 0;i<play_data_list.length;i++){
                if(play_data_list[i].bvid != "0" && play_data_list[i].bvid != undefined && play_data_list[i].bvid.indexOf("BV") > -1 && fin_bvid.indexOf(play_data_list[i].bvid) == -1){
                    let bvid = play_data_list[i].bvid
                    let target_num = play_data_list[i].num
                    let data = await view_bvid(bvid)
                    if(data.code == 0){
                        let playnum = data.data.stat.view
                        let aid = data.data.aid
                        let cid = data.data.cid
                        if(playnum < target_num){
                            if(sleep_ts.modle == "old"){
                                h5_old(aid, cid, bvid)
                            }else{
                                h5_new(aid, cid, bvid)
                            }
                        }else{
                            fin_bvid.push(bvid)
                            if(fin_bvid.length > 1000)fin_bvid = fin_bvid.slice(0,100)
                        }
                    }
                    await sleep(sleep_ts.sleep_ts*1000)
                }
            }
            let end = ts_s()
            if(end - start > sleep_ts.lap_time){
                h5()
            }else{
                await sleep((sleep_ts.lap_time - end + start)*1000)
                h5()
            }
        }
        setTimeout(async() => {
            h5()
        },60 * 1000)

        setInterval(async() => {
            get_img_key_sub_key()
        },3 * 60 * 1000)

        let FollowingList_now = []
        let FollowingList_now_data = []

        let getFollowingList = async function(page = 1){ //关注直播数据，同时获取room_uid数据
            if(page == 1){
                FollowingList_now = []
                FollowingList_now_data = [];
            }
            await sleep(2000)
            await BAPI.Lottery.anchor.getFollowings(page).then((data) => {
                FollowingList_now_data = FollowingList_now_data.concat(data.data.list);
                if(page < data.data.totalPage)return getFollowingList(page + 1);
                if(page == data.data.totalPage){
                    for(let i=0;i<FollowingList_now_data.length;i++){
                        FollowingList_now[i]=FollowingList_now_data[i].uid
                        if(API.CONFIG.room_ruid.indexOf(FollowingList_now_data[i].uid)==-1){
                            API.CONFIG.room_ruid.push(FollowingList_now_data[i].roomid)
                            API.CONFIG.room_ruid.push(FollowingList_now_data[i].uid)
                        }
                    }
                    API.saveConfig()
                }
            }, () => {
                console.log('await error')
                return delayCall(() => getFollowingList());
            });
        };
        setTimeout(async() => {
            if (API.CONFIG.auto_medal_task || API.CONFIG.auto_light) {
                window.toast(`【勋章升级】开始获取勋章数据`);
                await getMedalList()
                if(medal_list_now.length){
                    if(API.CONFIG.sort){
                        medal_list_now.sort(function(a, b) { return a.medal.level - b.medal.level;});
                    }else{
                        medal_list_now.sort(function(a, b) { return b.medal.level - a.medal.level;});
                    }
                    if(API.CONFIG.medal_first_uid.length){
                        let new_medal_list_now = []
                        let first_medal_list = []
                        for(let i=0;i<medal_list_now.length;i++){
                            if(API.CONFIG.medal_first_uid.indexOf(medal_list_now[i].medal.target_id) > -1){
                                first_medal_list.push(medal_list_now[i])
                            }else{
                                new_medal_list_now.push(medal_list_now[i])
                            }
                        }
                        medal_list_now = [].concat(first_medal_list).concat(new_medal_list_now)
                    }
                }
                if(API.CONFIG.auto_light){
                    setTimeout(async() => {
                        API.auto_light()
                    }, 10 * 1000);
                }
                if(API.CONFIG.auto_medal_task)API.auto_heartbert()
            }
        },10 * 1000)

        let getguardsList = async function(page = 1){ //舰长数据
            if(page == 1)guardsListdata = [];
            await sleep(100)
            return BAPI.Lottery.anchor.guards(page, 10).then((data) => {
                guardsListdata = guardsListdata.concat(data.data.list);
                if(data.data.pageinfo.curPage < data.data.pageinfo.totalPage)return getguardsList(page + 1);
            }, () => {
                console.log('await error')
                return delayCall(() => getguardsList());
            });
        };
        var gzsl = document.getElementById('gzsl');
        let getguardsList_ALLFollowingList_update = async() => {
            await getguardsList()//舰长数据
            console.log('大航海数据', guardsListdata.length)
            if(guardsListdata.length == API.CONFIG.guardroom.length && API.CONFIG.guard_level.length==API.CONFIG.guardroom_activite.length && API.CONFIG.guardroom.length == API.CONFIG.guard_level.length){
                //舰长数据
            }else{
                console.log('舰长数据长度异常清空')
                API.CONFIG.guardroom=[]
                API.CONFIG.guard_level=[]
                API.CONFIG.guardroom_activite=[]
            }
            for(let i = 0; i < guardsListdata.length; i++){
                API.CONFIG.guardroom[i] = guardsListdata[i].room_id
                API.CONFIG.guard_level[i] = guardsListdata[i].guard_level
                API.CONFIG.guardroom_activite[i] = guardsListdata[i].activite
            }
            //console.log('大航海数据', API.CONFIG.guardroom, API.CONFIG.guard_level, API.CONFIG.guardroom_activite)
            //舰长数据

            //关注数据
            if(API.CONFIG.Following_ts == 0 | (ts_ms()+ms_diff) - API.CONFIG.Following_ts > 299 * 1000){
                API.CONFIG.Following_ts = (ts_ms()+ms_diff)
                API.saveConfig()
                await getFollowingList()//获取真实room_uid数据
                BAPI.get_attention_list().then(async(data) => {
                    if(data.code==0){
                        console.log('全部关注数', data.data.list.length)
                        API.CONFIG.ALLFollowingList = data.data.list
                        API.saveConfig()
                        if(ALLFollowingList_2000_mark && API.CONFIG.ALLFollowingList_2000 && data.data.list.length >= 3000){
                            ALLFollowingList_2000_mark = false
                            //通知满关注
                            let content = `【关注已满2000】【${API.CONFIG.push_tag}】${Live_info.uname}【${hour()}点${minute()}分】`
                            API.pushpush(content)
                        }
                        if(data.data.list.length>2900){
                            API.chatLog(`直播主播关注数达到${data.data.list.length}，注意满2000关注后，将无法新增关注，会影响中奖！`, 'warning')
                        }
                        if(API.CONFIG.getmsg &&　data.data.list.length>=API.CONFIG.getmsg_num){
                            API.chatLog(`直播主播关注数达到${data.data.list.length}，开始取关无私信直播主播！`, 'warning')
                            $('#getmsg').click()
                        }
                    }
                })
            }
            gzsl.innerHTML = `当前关注：${API.CONFIG.ALLFollowingList.length}`
        }

        setTimeout(async() => {
            if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){ //判断时间段
                return
            }
            getguardsList_ALLFollowingList_update()
        }, 10 * 1000)
        setInterval(async() => {
            if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){ //判断时间段
                return
            }
            getguardsList_ALLFollowingList_update()
        }, 600 * 1000)


        let congratulations = function(gift_name,title){
            let tt = `${title}【${API.CONFIG.push_tag}】${Live_info.uname}：恭喜你获得${gift_name}！`
            if(API.CONFIG.tips_show)tip(tt)
            API.chatLog(tt, 'success')
            const post_data = {id:(ts_ms()+ms_diff),room_id:Live_info.uid,data:`${title}${Xname}：${gift_name}`}
            post_data_to_server(post_data,qun_server[0]).then((data) => {
                //console.log('post_data_to_server',data)
            })
            if(GM_getValue('read'))read_list.push(tt)
            API.pushpush(tt)
        }

        let re_id_list = []
        let at_id_list = []
        let get_msgfeed_reply = function () {
            if(!API.CONFIG.msgfeed_reply)return
            BAPI.msgfeed_reply().then(async function(data){
                //console.log('获取回复信息',data)
                if(data.code==0){
                    reply_items_title_list = '回复消息：'
                    let re_id_list_7 = [],reply_items_title_list_7 = '回复消息：'
                    let items = data.data.items
                    for(let i=0;i<items.length;i++){
                        if(re_id_list.indexOf(items[i].id)==-1 && API.CONFIG.ALLFollowingList.indexOf(items[i].user.mid)>-1 && items[i].reply_time + API.CONFIG.push_msg_oneday_days * 24 * 3600 > (ts_s()+s_diff)){
                            re_id_list.push(items[i].id)
                            reply_items_title_list = reply_items_title_list + `你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].reply_time)}】回复了你：${items[i].item.source_content.substr(0, 36)}`+'...'
                        }
                        if(re_id_list_7.indexOf(items[i].id)==-1 && API.CONFIG.ALLFollowingList.indexOf(items[i].user.mid)>-1 && items[i].reply_time + 7 * 24 * 3600 > (ts_s()+s_diff)){
                            re_id_list_7.push(items[i].id)
                            reply_items_title_list_7 = reply_items_title_list_7 + `你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].reply_time)}】回复了你：${items[i].item.source_content.substr(0, 36)}`+'...'
                            $('#award span:eq(11)').text(reply_items_title_list_7);
                        }
                        if(API.CONFIG.msgfeed_reply_id_list.indexOf(items[i].id)==-1 && API.CONFIG.ALLFollowingList.indexOf(items[i].user.mid)>-1 && items[i].reply_time + 7 * 24 * 3600 > (ts_s()+s_diff)){
                            API.CONFIG.msgfeed_reply_id_list.push(items[i].id)
                            API.saveConfig()
                            let tt = `【${API.CONFIG.push_tag}】${Live_info.uname}：你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].reply_time)}】回复了你：${items[i].item.source_content.substr(0, 36)}`
                            if(API.CONFIG.tips_show)tip(tt)
                            API.chatLog(tt,'success')
                            API.pushpush(tt)
                            await sleep(5000)
                        }
                    }
                }
            })
        }
        setTimeout(get_msgfeed_reply, 10e3);
        setInterval(get_msgfeed_reply,600 *1000)


        let get_msgfeed_at = function () {
            if(!API.CONFIG.get_sessions)return
            BAPI.msgfeed_at().then(async function(data){
                //console.log('获取@信息',data)
                if(data.code==0){
                    let at_id_list_7 = [],items_title_list_7 = '@消息：'
                    let items = data.data.items
                    items_title_list = '@消息：'
                    for(let i=0;i<items.length;i++){
                        if(at_id_list.indexOf(items[i].id)==-1 && API.CONFIG.ALLFollowingList.indexOf(items[i].user.mid)>-1 && items[i].at_time + API.CONFIG.push_msg_oneday_days * 24 * 3600 > (ts_s()+s_diff)){
                            at_id_list.push(items[i].id)
                            items_title_list = items_title_list + `你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].at_time)}】@了你：${items[i].item.source_content.substr(0, 36)}` + '...'
                        }
                        if(at_id_list_7.indexOf(items[i].id)==-1 && API.CONFIG.ALLFollowingList.indexOf(items[i].user.mid)>-1 && items[i].at_time + 7 * 24 * 3600 > (ts_s()+s_diff)){
                            at_id_list_7.push(items[i].id)
                            items_title_list_7 = items_title_list_7 + `你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].at_time)}】@了你：${items[i].item.source_content.substr(0, 36)}` + '...'
                            $('#award span:eq(10)').text(items_title_list_7);
                        }
                        if(API.CONFIG.msgfeed_at_id_list.indexOf(items[i].id)==-1 && API.CONFIG.ALLFollowingList.indexOf(items[i].user.mid)>-1 && items[i].at_time + 7 * 24 * 3600 > (ts_s()+s_diff)){
                            API.CONFIG.msgfeed_at_id_list.push(items[i].id)
                            API.saveConfig()
                            let tt = `【${API.CONFIG.push_tag}】${Live_info.uname}：你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].at_time)}】@了你：${items[i].item.source_content.substr(0, 36)}`
                            if(API.CONFIG.tips_show)tip(tt)
                            API.chatLog(tt,'success')
                            API.pushpush(tt)
                            await sleep(5000)
                        }
                    }
                }
            })
        }
        setTimeout(get_msgfeed_at, 10e3);
        setInterval(get_msgfeed_at,600 *1000)


        //API.CONFIG.dynamic_id_str_done_list 已转所有动态
        //官方动态抽奖中奖检查
        //API.CONFIG.official_dynamic_data = [{dynamic_id:dynamic_id,lottery_time:lottery_time}] 官方抽奖动态
        //API.CONFIG.official_business_data = [{business_id:business_id,lottery_time:lottery_time}] 官方预约动态
        if(GM_getValue('space_history_offset_t') == undefined){//只运行一次，重置动态数据
            API.CONFIG.space_history_offset_t = 0
            API.saveConfig()
            GM_setValue('space_history_offset_t', true)
        }
        let get_space_history_dynamic_id_list = async function(host_uid,offset){//获取已转动态抽奖id：API.CONFIG.dynamic_id_str_done_list
            console.log('时间标签',API.CONFIG.space_history_offset_t)
            let official_dynamic_data_id = []
            for(let i=0;i<API.CONFIG.official_dynamic_data.length;i++){
                official_dynamic_data_id.push(API.CONFIG.official_dynamic_data[i])
            }
            await BAPI.space_history(host_uid,offset).then(async function(data){
                if(data.code==0){
                    API.CONFIG.detail_by_lid_ts = (ts_ms()+ms_diff)
                    //API.saveConfig()
                    await sleep(5000)
                    API.chatLog(`【动态抽奖】正在更新已转动态数据<br>offset：${offset}`, 'success');
                    //console.log('space_historydata',data,offset)
                    if(data.data.cards == undefined){
                        API.CONFIG.space_history_offset_t = (ts_s()+s_diff)
                        API.saveConfig()
                        //console.log('获取历史动态的时间标签',API.CONFIG.space_history_offset_t)
                        return
                    }
                    let cards = data.data.cards
                    let get_space_break = false
                    //console.log('cards',cards)
                    for(let i=0;i<cards.length;i++){
                        if(cards[i].desc != undefined && cards[i].desc.origin != undefined){//已转的动态原ID
                            await sleep(5000)
                            let origin_dynamic_id_str = cards[i].desc.origin.dynamic_id_str
                            if(official_dynamic_data_id.indexOf(origin_dynamic_id_str) > -1)continue
                            await BAPI.dynamic_lottery_notice(origin_dynamic_id_str).then(async function(dat){//判断是否是自动转发的未过期的抽奖，否，则加入中奖检查
                                //console.log('dynamic_lottery_notice',dat)
                                if(dat.code==0){
                                    let lottery_time = dat.data.lottery_time
                                    if(lottery_time>(ts_s()+s_diff)){
                                        let d = {"dynamic_id":origin_dynamic_id_str,"lottery_time":lottery_time}
                                        if(API.CONFIG.official_dynamic_data.indexOf(d) == -1)API.CONFIG.official_dynamic_data.push(d)
                                        official_dynamic_data_id.push(origin_dynamic_id_str)
                                        API.saveConfig()
                                    }
                                }
                            }, () => {
                                i = 99999999
                                return console.log('await error')
                            })
                            if(i==99999999){
                                get_space_break = true
                                return
                            }
                            if(API.CONFIG.dynamic_id_str_done_list.indexOf(origin_dynamic_id_str)==-1)API.CONFIG.dynamic_id_str_done_list.push(origin_dynamic_id_str)
                            if(API.CONFIG.dynamic_id_str_done_list.length>5000)API.CONFIG.dynamic_id_str_done_list.splice(0,1000)
                            API.saveConfig()
                        }
                    }
                    if(get_space_break) return API.chatLog(`【动态抽奖】已转动态：数据获取失败！`, 'warning');
                    if(data.data.has_more==0 || cards[cards.length-1].desc.timestamp < API.CONFIG.space_history_offset_t || cards[cards.length-1].desc.timestamp + 30 * 24 * 3600 < (ts_s()+s_diff)){
                        API.CONFIG.space_history_offset_t = (ts_s()+s_diff)
                        API.saveConfig()
                        //console.log('获取历史动态的时间标签',API.CONFIG.space_history_offset_t)
                    }
                    if(data.data.has_more==1 && cards[cards.length-1].desc.timestamp >= API.CONFIG.space_history_offset_t){
                        //console.log('获取历史动态的时间标签',data.data.has_more,cards[cards.length-1].desc.timestamp,API.CONFIG.space_history_offset_t)
                        return get_space_history_dynamic_id_list(Live_info.uid,cards[cards.length-1].desc.dynamic_id_str)
                    }
                }else{
                    return API.chatLog(`【动态抽奖】获取空间动态：code：${data.code}，msg：${data.msg}`, 'warning');
                }
            }, () => {
                console.log('await error')
                return API.chatLog(`【动态抽奖】获取抽奖动态信息出错！`, 'warning');
            })
        }




        let get_dynamic_id_list = async function(oid){//提取专栏抽奖动态id
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.bilibili.com/read/cv${oid}`,
                    dataType: "html",
                    onload: function(response){
                        //console.log('提取专栏抽奖动态id',response);
                        let dynamic_id_list = []
                        let list = response.responseText
                        var reg = /https:\/\/[A-Za-z0-9+/.]+[0-9]/g;
                        list = list.match(reg);
                        //console.log('dynamic_id_listdynamic_id_list',list);
                        for(let i =0;i<list.length;i++){
                            if(list[i].indexOf("https://t.bilibili.com/") == -1 && list[i].indexOf("https://www.bilibili.com/opus/") == -1)continue
                            if(list[i].indexOf("635932563238551585") > -1)continue
                            if(list[i]==null)continue
                            let did_num = list[i].match(/\d+/g)
                            if(did_num==null)continue
                            if(String(did_num[0]).length < 18 || String(did_num[0]).length > 19)continue
                            let str = String(did_num[0])
                            if(dynamic_id_list.indexOf(str)==-1)dynamic_id_list.push(str);
                        }
                        //console.log('dynamic_id_listdynamic_id_list',dynamic_id_list);
                        const res = dynamic_id_list
                        resolve(res);
                    }
                });
            })
        }

        let get_business_id_list = async function(oid){//提取专栏抽奖动态id
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.bilibili.com/read/cv${oid}`,
                    dataType: "html",
                    onload: function(response){
                        let business_id_list = []
                        let list = response.responseText
                        var reg = /business_id=[A-Za-z0-9+/.]+[0-9]/g;
                        list = list.match(reg);
                        //https://www.bilibili.com/h5/lottery/result?business_id=1506860&business_type=10
                        //console.log('business_id',list);
                        for(let i =0;i<list.length;i++){
                            if(list[i]==null)continue
                            let num = list[i].indexOf("business_id=")
                            if(num == -1)continue
                            let ddd = list[i].substr(num)
                            let did_num = ddd.match(/\d+/g)
                            if(did_num==null)continue
                            let str = String(did_num[0])
                            if(business_id_list.indexOf(str)==-1)business_id_list.push(str);
                        }
                        //console.log('business_id_list',business_id_list);
                        const res = business_id_list
                        resolve(res);
                    }
                });
            })
        }
        let repost_done = false
        let not_office_dynamic_do = async function(did){
            repost_done = false
            let err_mark = false
            if(dynamic_lottery_tags_tagid == 0)API.chatLog(`【动态抽奖】获取动态分组出错！`, 'warning');
            API.CONFIG.detail_by_lid_ts = (ts_ms()+ms_diff)
            //API.saveConfig()
            let oid,sender_uid,uname,type,content,ctrl,contents//oid,uid,uname
            let discuss = '点赞的人中！'
            let keyword = []
            let num = Math.ceil(Math.random() * (poison_chicken_soup.length-1));
            if(poison_chicken_soup.length) discuss = poison_chicken_soup[num]
            let lottery_id,lottery_time
            await sleep(5000)
            await BAPI.dynamic_lottery_notice(did).then(async function(dat){//判断是否是自动转发的未过期的抽奖，否，则加入中奖检查
                //console.log('判断是否是官方抽奖',dat)
                if(dat.code==0){
                    lottery_time = dat.data.lottery_time
                }
            }, () => {
                err_mark = true
                console.log('await error')
                return API.chatLog(`【动态抽奖】获取动态数据出错！`, 'warning');
            })
            if(err_mark)return
            if(lottery_time != undefined && lottery_time < (ts_s()+s_diff))return
            await BAPI.get_dynamic_detail(did).then(async function(data){
                console.log('get_dynamic_detail',data)
                if(data.code==0 && data.data.card !=undefined && data.data.card.desc !=undefined){
                    oid = data.data.card.desc.rid_str
                    sender_uid = data.data.card.desc.uid
                    uname = data.data.card.desc.user_profile.info.uname
                    //ALLFollowingList = data.data.attentions.uids
                    //API.CONFIG.ALLFollowingList = ALLFollowingList
                    if(data.data.card.desc.type == 2){
                        type=11
                    }else if(data.data.card.desc.type == 4 || data.data.card.desc.type == 1){
                        type=17
                    }else if(data.data.card.desc.type == 8){
                        type=1
                    }else{
                        type=0
                    }
                    if(type==17){
                        if(data.data.card.desc.origin !=undefined && data.data.card.desc.origin.dynamic_id_str!=undefined){
                            console.log('not_office_dynamic_do尝试转发关注原动态',data.data.card.desc.origin.dynamic_id_str)
                            if(API.CONFIG.dynamic_id_str_done_list.indexOf(data.data.card.desc.origin.dynamic_id_str)==-1){
                                console.log('【动态抽奖】该原动态未转发，尝试转发！')
                                await not_office_dynamic_do(data.data.card.desc.origin.dynamic_id_str)
                                await sleep(API.CONFIG.detail_by_lid_flash * 1000)//间隔
                            }else{
                                console.log('【动态抽奖】该原动态已转发！')
                            }
                        }
                        oid = data.data.card.desc.dynamic_id_str
                        let msg = JSON.parse(data.data.card.card)
                        if(msg.item.content.indexOf("话题")>-1 || msg.item.content.indexOf("带上#")>-1 || msg.item.content.indexOf("带#")>-1 || msg.item.content.indexOf("参与#")>-1){
                            await BAPI.getdiscusss_dynamic(oid).then(async (data) => {
                                console.log('getdiscusss_dynamic',data)
                                if(data.data.replies == undefined)return
                                let replies = data.data.replies
                                for(let i = 0; i < replies.length; i++){ //拼接
                                    if(replies[i].content.message.indexOf("#")>-1)keyword = keyword.concat(replies[i].content.message)
                                }
                            })
                            if(keyword.length>0){
                                let nu = Math.ceil(Math.random() * (keyword.length-1));
                                discuss = keyword[nu] //随机热门带话题复制评论
                            }
                        }
                        let msg_content = "转发动态//@" + uname + ":" + msg.item.content
                        content = msg_content
                        ctrl = msg.item.ctrl
                        contents = [{"raw_text": "转发动态//","type": 1,"biz_id": ""},{"raw_text": "@"+uname,"type": 2,"biz_id": String(sender_uid)},{"raw_text": ":"+ msg.item.content,"type": 1,"biz_id": ""}]
                    }else{
                        content = "转发动态"
                        ctrl = "[]"
                        contents = [{"raw_text": "转发动态","type": 1,"biz_id": ""}]
                    }
                    if(lottery_time != undefined){//官方抽奖恢复默认
                        type=0
                        content = "转发动态"
                        contents = [{"raw_text": "转发动态","type": 1,"biz_id": ""}]
                        ctrl = "[]"
                        API.chatLog(`【动态抽奖】判断是官方抽奖，取消评论！`,'success')
                    }
                    let IsUserFollow_mark = false
                    await BAPI.IsUserFollow(sender_uid).then(async(data) => {
                        if(data.code == 0){
                            if(data.data.follow == 1){
                                IsUserFollow_mark = true
                            }
                        }
                    })
                    if(API.CONFIG.not_office_dynamic_only_modify && !IsUserFollow_mark){
                        API.chatLog(`UID：${sender_uid}未关注UP的动态，跳过！`,'warning')
                        repost_done = true
                        return//仅关注开关 未关注
                    }
                    if(API.CONFIG.dynamic_id_str_done_list.indexOf(did) == -1){//未转发
                        let modify_mark = false
                        if(!IsUserFollow_mark){//未关注
                            await BAPI.modify(sender_uid,1).then(function(data){//关注
                                console.log('modify',data)
                                if(data.code==0){
                                    API.chatLog(`UID：${sender_uid}关注成功！`,'success')
                                    modify_mark = true
                                }else{
                                    API.chatLog(`UID：${sender_uid}关注失败：${data.message}！`,'warning')
                                }
                            })
                        }else{
                            API.chatLog(`UID：${sender_uid}已关注！`,'success')
                            modify_mark = true
                        }
                        if(modify_mark){
                            IsUserFollow_mark = false
                            await sleep(5000)
                            await BAPI.IsUserFollow(sender_uid).then(async(data) => {
                                if(data.code == 0){
                                    if(data.data.follow == 1){
                                        IsUserFollow_mark = true
                                    }
                                }
                            })
                            if(!IsUserFollow_mark){
                                API.chatLog(`UID：${sender_uid}关注失败，暂停！`,'warning')
                                return
                            }
                            if(API.CONFIG.dynamic_lottery_up_move){
                                await BAPI.tags_addUsers(sender_uid, dynamic_lottery_tags_tagid).then((data) => {//移动到动态抽奖分组，防止在默认组被取关
                                    if(data.code == 0)API.chatLog(`【动态抽奖】成功转移UP至动态分组！`, 'success');
                                    console.log('成功转移UP至动态分组', data,dynamic_lottery_tags_tagid)
                                }, () => {
                                    console.log('await error')
                                    return API.chatLog(`【动态抽奖】转移至动态分组出错！`, 'warning');
                                })
                            }
                            if(type == 0){//
                                await BAPI.dynamic_like(did).then(async function(data){//点赞
                                    if(data.code == 0){
                                        API.chatLog(`【动态抽奖】成功点赞该条抽奖动态！`, 'success');
                                    }else{
                                        console.log("点赞该条抽奖动态失败",data)
                                        API.chatLog(`【动态抽奖】点赞该条抽奖动态失败`, 'warning');
                                    }
                                }, () => {
                                    console.log('await error')
                                    return API.chatLog(`【动态抽奖】点赞该条抽奖动态出错！`, 'warning');
                                })
                            }else{
                                await BAPI.dynamic_postdiscuss(discuss,oid,type).then(async function(data){//评论
                                    //console.log('专栏动态抽奖评论',data)
                                    if(data.code==0){
                                        API.chatLog(`【动态抽奖】专栏动态抽奖评论成功！`,'success')
                                    }else{
                                        API.chatLog(`【动态抽奖】专栏动态抽奖评论失败：${data.message}！`,'warning')
                                    }
                                }, () => {
                                    console.log('await error')
                                    return API.chatLog(`【动态抽奖】专栏动态抽奖评论出错！`, 'warning');
                                })
                                await BAPI.dynamic_like(did).then(async function(data){//点赞
                                    if(data.code == 0){
                                        API.chatLog(`【动态抽奖】成功点赞该条抽奖动态！`, 'success');
                                    }else{
                                        console.log("点赞该条抽奖动态失败",data)
                                        API.chatLog(`【动态抽奖】点赞该条抽奖动态失败`, 'warning');
                                    }
                                }, () => {
                                    console.log('await error')
                                    return API.chatLog(`【动态抽奖】点赞该条抽奖动态出错！`, 'warning');
                                })
                            }
                            if(!API.CONFIG.use_old_repost_api){
                                await BAPI.submit_check(contents).then(async function(da){
                                    console.log('submit_checksubmit_check', da);
                                    if(da.code == 0){
                                        await BAPI.dyn(did,contents).then((dat) => {
                                            console.log('dyn', dat);
                                            if(data.code == 0){
                                                let d = {"dynamic_id":did,"lottery_time":lottery_time}
                                                if(API.CONFIG.official_dynamic_data.indexOf(d) == -1){
                                                    API.CONFIG.official_dynamic_data.push(d)
                                                    API.saveConfig()
                                                }
                                                API.CONFIG.dynamic_id_str_done_list.push(did)
                                                API.CONFIG.COUNT_GOLDBOX++
                                                $('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX)
                                                API.chatLog(`【动态抽奖】成功转发一条抽奖动态！`, 'success')
                                                API.CONFIG.freejournal8.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：用户名：${uname}，<a target="_blank" href="https://t.bilibili.com/${did}">动态页</a>`)
                                                if(API.CONFIG.freejournal8.length > 500){
                                                    API.CONFIG.freejournal8.splice(400, 200)
                                                }
                                                API.saveConfig()
                                                if(freejournal8_console && API.CONFIG.freejournal8.length){
                                                    let dt = document.getElementById('sessions_msg')
                                                    dt.innerHTML = API.CONFIG.freejournal8
                                                }
                                            }else{
                                                API.chatLog(`【动态抽奖】转发抽奖动态失败：${dat.message}`, 'warning');
                                            }
                                        })
                                    }else{
                                        API.chatLog(`【动态抽奖】转发抽奖动态失败：${da.message}`, 'warning');
                                    }
                                }, () => {
                                    console.log('await error')
                                    return API.chatLog(`【动态抽奖】转发抽奖动态出错！`, 'warning')
                                })
                            }else{
                                await BAPI.repost(did,content,ctrl).then(async function(data){
                                    if(data.code == 0){//转发成功
                                        let d = {"dynamic_id":did,"lottery_time":lottery_time}
                                        if(API.CONFIG.official_dynamic_data.indexOf(d) == -1){
                                            API.CONFIG.official_dynamic_data.push(d)
                                            API.saveConfig()
                                        }
                                        API.CONFIG.dynamic_id_str_done_list.push(did)
                                        API.CONFIG.COUNT_GOLDBOX++
                                        $('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX)
                                        API.chatLog(`【动态抽奖】成功转发一条抽奖动态！`, 'success')

                                        API.CONFIG.freejournal8.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：用户名：${uname}，<a target="_blank" href="https://t.bilibili.com/${did}">动态页</a>`)
                                        if(API.CONFIG.freejournal8.length > 500){
                                            API.CONFIG.freejournal8.splice(400, 200)
                                        }
                                        API.saveConfig()
                                        if(freejournal8_console && API.CONFIG.freejournal8.length){
                                            let dt = document.getElementById('sessions_msg')
                                            dt.innerHTML = API.CONFIG.freejournal8
                                        }
                                    }else{
                                        API.chatLog(`【动态抽奖】转发抽奖动态失败：${data.data.errmsg || data.msg}`, 'warning');
                                    }
                                }, () => {
                                    console.log('await error')
                                    return API.chatLog(`【动态抽奖】转发抽奖动态出错！`, 'warning')
                                })
                            }
                        }
                    }else{
                        API.chatLog(`【动态抽奖】该动态已转发！`, 'warning')
                        repost_done = true
                        return console.log('【动态抽奖】该动态已转发！')
                    }
                }
            }, () => {
                console.log('await error')
                return API.chatLog(`【动态抽奖】获取动态数据出错！`, 'warning')
            })
        }
        let not_office_dynamic_go = async function () {
            for(let i=0;i<API.CONFIG.space_article_uid.length;i++){
                await BAPI.space_article(API.CONFIG.space_article_uid[i]).then(async function(data){//UID最新专栏投稿
                    console.log('space_article_uid',API.CONFIG.space_article_uid[i],data)
                    if(data.code==0){
                        if(data.data == undefined || data.data.articles == undefined)return
                        for(let t=0;t<data.data.articles.length;t++){
                            let title = data.data.articles[t].title
                            let ctime = data.data.articles[t].publish_time
                            let articles_id = data.data.articles[t].id
                            if(title == undefined || ctime == undefined || articles_id == undefined)continue
                            if(API.CONFIG.space_article_title.some(v => title.toLowerCase().indexOf(v) > -1) && ctime + 48 * 3600 > (ts_s()+s_diff)){
                                let not_office_dynamic_id_list = await get_dynamic_id_list(articles_id)
                                console.log('not_office_dynamic_id_list',not_office_dynamic_id_list)
                                if(not_office_dynamic_id_list.length==0)return API.chatLog(`【动态抽奖】专栏${articles_id}未获取到新动态数据！`, 'warning');
                                for(let n=0;n<not_office_dynamic_id_list.length;n++){
                                    if(API.CONFIG.dynamic_id_str_done_list.indexOf(not_office_dynamic_id_list[n])==-1){
                                        await not_office_dynamic_do(not_office_dynamic_id_list[n])
                                        if(!repost_done){
                                            API.chatLog(`【动态抽奖】${not_office_dynamic_id_list[n]}：暂停${API.CONFIG.detail_by_lid_flash}秒！`, 'success',0,0,false,API.CONFIG.detail_by_lid_flash-30)
                                            await sleep(API.CONFIG.detail_by_lid_flash * 1000)
                                        }else{
                                            await sleep(5000)
                                        }
                                    }else{
                                        API.chatLog(`【动态抽奖】${not_office_dynamic_id_list[n]}：该动态已转发！`, 'success')
                                        console.log('【动态抽奖】该动态已转发！')
                                    }
                                }
                            }
                        }
                    }
                }, () => {
                    return console.log('await error')
                })
            }
        }
        let office_business_do = async function (business_id) {
            await sleep(5000)
            await BAPI.dynamic_lottery_notice_business(business_id).then(async function(data){
                //console.log('dynamic_lottery_notice_business',business_id,data)
                if(data.code==0){
                    let lottery_time = data.data.lottery_time
                    let lottery_id = data.data.lottery_id
                    if(data.data.status == 0 && data.data.lottery_time > (ts_s()+s_diff)){//有效的抽奖
                        if(API.CONFIG.business_id.indexOf(business_id) > -1)console.log("已参加的预约抽奖")
                        if(business_id < 999999999 && business_id !=0 && API.CONFIG.business_id.indexOf(business_id)==-1){//预约直播抽奖
                            let first_prize_cmt = data.data.first_prize_cmt
                            let second_prize_cmt = data.data.second_prize_cmt
                            let third_prize_cmt = data.data.third_prize_cmt
                            if(first_prize_cmt != '')first_prize_cmt = "一等奖：" + first_prize_cmt
                            if(second_prize_cmt != '')second_prize_cmt = "，二等奖：" + second_prize_cmt
                            if(third_prize_cmt != '')third_prize_cmt = "，三等奖：" + third_prize_cmt
                            let sender_uid = Number(data.data.sender_uid)
                            let num = API.CONFIG.room_ruid.indexOf(sender_uid)
                            let room = 99999999999
                            if(num>-1)room = API.CONFIG.room_ruid[num-1]
                            let num2 = API.CONFIG.Anchor_ignore_room.indexOf(room)
                            let num3 = API.CONFIG.Anchor_ignore_keyword.some(v => first_prize_cmt.toLowerCase().indexOf(v) > -1 || second_prize_cmt.toLowerCase().indexOf(v) > -1 || third_prize_cmt.toLowerCase().indexOf(v) > -1)
                            let num4 = !API.CONFIG.Anchor_unignore_keyword.some(v => first_prize_cmt.toLowerCase().indexOf(v) > -1 || second_prize_cmt.toLowerCase().indexOf(v) > -1 || third_prize_cmt.toLowerCase().indexOf(v) > -1)
                            if(num2>-1 || num3 && num4 && API.CONFIG.detail_by_lid_live_ignore){
                                //奖品含有屏蔽词或屏蔽的直播间
                                if(num2>-1){
                                    API.chatLog(`【预约抽奖】跳过${lottery_id}预约直播抽奖，屏蔽的直播间${room}！<br><a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lottery_id}">抽奖页</a>`,'warning')
                                }else{
                                    let now_key
                                    let cmt = first_prize_cmt + second_prize_cmt + third_prize_cmt
                                    for(let i=0;i<API.CONFIG.Anchor_ignore_keyword.length;i++){
                                        if(cmt.toLowerCase().indexOf(API.CONFIG.Anchor_ignore_keyword[i]) > -1){
                                            now_key = API.CONFIG.Anchor_ignore_keyword[i]
                                            break
                                        }
                                    }
                                    API.CONFIG.journal_pb.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：【预约抽奖】${lottery_id}预约直播抽奖，奖品：${first_prize_cmt}${second_prize_cmt}${third_prize_cmt}含有屏蔽词：${now_key}<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lottery_id}">抽奖页</a>`)
                                    if(API.CONFIG.journal_pb.length > 500){
                                        API.CONFIG.journal_pb.splice(400, 200);
                                    }
                                    API.saveConfig();
                                    if(journal_pb_console && API.CONFIG.journal_pb.length){
                                        let dt = document.getElementById('sessions_msg')
                                        dt.innerHTML = API.CONFIG.journal_pb
                                    }
                                    API.chatLog(`【预约抽奖】跳过${lottery_id}预约直播抽奖，奖品：${first_prize_cmt}${second_prize_cmt}${third_prize_cmt}含有屏蔽词：${now_key}<br><a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lottery_id}">抽奖页</a>`,'warning')
                                }
                            }else{
                                await BAPI.reserve_relation_info(business_id).then(async function(data){
                                    if(!API.CONFIG.detail_by_lid_live && !API.CONFIG.detail_by_lid_live_fans)return
                                    if(API.CONFIG.detail_by_lid_live_fans && ALLFollowingList.indexOf(sender_uid) == -1)return
                                    if(data.code==0 && data.data != undefined && data.data.list[business_id] != undefined && data.data.list[business_id].dynamicId != undefined && data.data.list[business_id].total != undefined){
                                        console.log('reserve_relation_info',data)
                                        let list = data.data.list
                                        console.log('reserve_relation_info',list)
                                        let dynamicId = list[business_id].dynamicId
                                        let total = list[business_id].total
                                        await BAPI.reserve_attach_card_button(business_id,total).then(async function(data){
                                            if(data.code==0){
                                                API.CONFIG.business_id.push(business_id)
                                                let d = {"business_id":business_id,"lottery_time":lottery_time}
                                                if(API.CONFIG.official_business_data.indexOf(d) == -1){
                                                    API.CONFIG.official_business_data.push(d)
                                                    API.saveConfig()
                                                }
                                                if(API.CONFIG.business_id.length>2000)API.CONFIG.business_id.splice(0,500)
                                                API.chatLog(`【预约抽奖】${lottery_id}预约直播抽奖参与成功！`,'success')
                                                API.CONFIG.COUNT_GOLDBOX++;
                                                $('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
                                                API.CONFIG.freejournal6.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lottery_id}">抽奖页</a>，<a target="_blank" href="https://t.bilibili.com/${dynamicId}">动态页</a>，开奖时间：${timestampToTime(lottery_time)}，奖品：${first_prize_cmt}${second_prize_cmt}${third_prize_cmt}`)
                                                if(API.CONFIG.freejournal6.length > 500){
                                                    API.CONFIG.freejournal6.splice(400, 200)
                                                }
                                                API.CONFIG.detail_by_lid_ts = (ts_ms()+ms_diff)
                                                //API.saveConfig()
                                                if(freejournal6_console && API.CONFIG.freejournal6.length){
                                                    let dt = document.getElementById('sessions_msg')
                                                    dt.innerHTML = API.CONFIG.freejournal6
                                                }
                                                await sleep(30 * 1000)//间隔
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    }
                }else{
                    API.chatLog(`【预约抽奖】${data.message}`, 'warning')
                    return
                }
            }, () => {
                return API.chatLog(`【预约抽奖】预约抽奖数据失败，请检查网络`, 'warning')
            })
        }


        let office_dynamic_go = async function () {
            await BAPI.space_article(2595733).then(async function(data){//UID最新专栏投稿
                console.log('space_article_uid',data)
                if(data.code==0){
                    if(data.data == undefined || data.data.articles == undefined)return
                    for(let t=0;t<data.data.articles.length;t++){
                        let title = data.data.articles[t].title
                        let ctime = data.data.articles[t].publish_time
                        let articles_id = data.data.articles[t].id
                        if(title == undefined || ctime == undefined || articles_id == undefined)continue
                        if(title.indexOf("互动抽奖") > -1 && ctime + 2 * 24 * 3600 > (ts_s()+s_diff)){
                            if(API.CONFIG.detail_by_lid_dynamic){
                                API.chatLog(`【官方动态】官方动态抽奖开始！`, 'success');
                                let office_dynamic_id_list = await get_dynamic_id_list(articles_id)
                                console.log('office_dynamic_id_list',office_dynamic_id_list)
                                if(office_dynamic_id_list.length==0)return API.chatLog(`【动态抽奖】专栏${articles_id}未获取到新动态数据！`, 'warning')
                                for(let n=0;n<office_dynamic_id_list.length;n++){
                                    if(API.CONFIG.dynamic_id_str_done_list.indexOf(office_dynamic_id_list[n])==-1){
                                        await not_office_dynamic_do(office_dynamic_id_list[n])
                                        if(!repost_done){
                                            API.chatLog(`【动态抽奖】${office_dynamic_id_list[n]}：暂停${API.CONFIG.detail_by_lid_flash}秒中！`, 'success',0,0,false,API.CONFIG.detail_by_lid_flash-30);
                                            await sleep(API.CONFIG.detail_by_lid_flash * 1000)
                                        }else{
                                            await sleep(5000)
                                        }
                                    }else{
                                        API.chatLog(`【动态抽奖】${office_dynamic_id_list[n]}：该动态已转发！`, 'success')
                                        console.log('【动态抽奖】该动态已转发！')
                                    }
                                }
                                API.chatLog(`【官方动态】官方动态抽奖结束！`, 'success');
                            }
                        }
                        if(API.CONFIG.detail_by_lid_live && title.indexOf("预约抽奖") > -1 && ctime + 2* 24 * 3600 > (ts_s()+s_diff)){
                            API.chatLog(`【预约抽奖】预约抽奖抽奖开始！`, 'success');
                            let office_business_id_list = await get_business_id_list(articles_id)
                            console.log('office_business_id_list',office_business_id_list)
                            if(office_business_id_list.length==0)return API.chatLog(`【动态抽奖】专栏${articles_id}未获取到新预约数据！`, 'warning');
                            for(let n=0;n<office_business_id_list.length;n++){
                                office_business_do(office_business_id_list[n])
                                await sleep(API.CONFIG.detail_by_lid_flash * 1000)
                            }
                            API.chatLog(`【预约抽奖】预约抽奖抽奖结束！`, 'success');
                        }
                    }
                }
            }, () => {
                return console.log('await error')
            })
        }

        let check_official_dynamic_data = async function () {
            //let d = {"dynamic_id":did,"lottery_time":lottery_time}
            let pass_data_id = []
            for(let n=0;n<API.CONFIG.official_dynamic_data.length;n++){
                if(API.CONFIG.official_dynamic_data[n].lottery_time == undefined)pass_data_id.push(API.CONFIG.official_dynamic_data[n].dynamic_id)
                if(API.CONFIG.official_dynamic_data[n].lottery_time < ts_s()){
                    await sleep(5000)
                    BAPI.dynamic_lottery_notice(API.CONFIG.official_dynamic_data[n].dynamic_id).then(async function(data){
                        if(data.code == 0){
                            pass_data_id.push(API.CONFIG.official_dynamic_data[n].dynamic_id)
                            if(data.data.lottery_result !=undefined){//取消抽奖后无lottery_result
                                let lottery_id = data.data.lottery_id
                                let business_id = data.data.business_id
                                let lottery_result = data.data.lottery_result
                                let first_prize_cmt = data.data.first_prize_cmt
                                let second_prize_cmt = data.data.second_prize_cmt
                                let third_prize_cmt = data.data.third_prize_cmt
                                if(first_prize_cmt != '')first_prize_cmt = "一等奖：" + first_prize_cmt
                                if(second_prize_cmt != '')second_prize_cmt = "二等奖：" + second_prize_cmt
                                if(third_prize_cmt != '')third_prize_cmt = "三等奖：" + third_prize_cmt
                                let sender_uid = data.data.sender_uid
                                let title
                                //动态类
                                if(business_id>999999999 || business_id ==0){//business_id == 0 大数字损失精度变0
                                    title = '【动态抽奖】'
                                    if(lottery_result.first_prize_result != undefined){
                                        for(let t=0;t<lottery_result.first_prize_result.length;t++){
                                            if(lottery_result.first_prize_result[t].uid == Live_info.uid){
                                                API.CONFIG.freejournal7.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：${title}：${first_prize_cmt}<a target="_blank" href="https://t.bilibili.com/${API.CONFIG.official_dynamic_data[n].dynamic_id}">动态页</a>`)
                                                if(API.CONFIG.freejournal7.length > 500){
                                                    API.CONFIG.freejournal7.splice(400, 200);
                                                }
                                                API.saveConfig()
                                                if(freejournal7_console && API.CONFIG.freejournal7.length){
                                                    let dt = document.getElementById('sessions_msg');
                                                    dt.innerHTML = API.CONFIG.freejournal7
                                                }
                                                congratulations(first_prize_cmt,title)
                                            }
                                        }
                                    }
                                    if(lottery_result.second_prize_result!= undefined){
                                        for(let k=0;k<lottery_result.second_prize_result.length;k++){
                                            if(lottery_result.second_prize_result[k].uid == Live_info.uid){
                                                API.CONFIG.freejournal7.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：${title}：${second_prize_cmt}<a target="_blank" href="https://t.bilibili.com/${API.CONFIG.official_dynamic_data[n].dynamic_id}">动态页</a>`)
                                                if(API.CONFIG.freejournal7.length > 500){
                                                    API.CONFIG.freejournal7.splice(400, 200);
                                                }
                                                API.saveConfig()
                                                if(freejournal7_console && API.CONFIG.freejournal7.length){
                                                    let dt = document.getElementById('sessions_msg');
                                                    dt.innerHTML = API.CONFIG.freejournal7
                                                }
                                                congratulations(second_prize_cmt,title)
                                            }
                                        }
                                    }
                                    if(lottery_result.third_prize_result!= undefined){
                                        for(let l=0;l<lottery_result.third_prize_result.length;l++){
                                            if(lottery_result.third_prize_result[l].uid == Live_info.uid){
                                                API.CONFIG.freejournal7.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：${title}：${third_prize_cmt}<a target="_blank" href="https://t.bilibili.com/${API.CONFIG.official_dynamic_data[n].dynamic_id}">动态页</a>`)
                                                if(API.CONFIG.freejournal7.length > 500){
                                                    API.CONFIG.freejournal7.splice(400, 200);
                                                }
                                                API.saveConfig()
                                                if(freejournal7_console && API.CONFIG.freejournal7.length){
                                                    let dt = document.getElementById('sessions_msg');
                                                    dt.innerHTML = API.CONFIG.freejournal7
                                                }
                                                congratulations(third_prize_cmt,title)
                                            }
                                        }
                                    }
                                }
                                //动态类
                            }
                        }
                    })
                }
            }
            let new_list = []
            let new_data_list = []
            for(let n=0;n<API.CONFIG.official_dynamic_data.length;n++){//去重
                if(new_list.indexOf(API.CONFIG.official_dynamic_data[n].dynamic_id) == -1){
                    new_data_list.push(API.CONFIG.official_dynamic_data[n])
                    new_list.push(API.CONFIG.official_dynamic_data[n].dynamic_id)
                }
            }
            API.CONFIG.official_dynamic_data = new_data_list
            API.saveConfig()
            new_data_list = []
            for(let n=0;n<API.CONFIG.official_dynamic_data.length;n++){//去已开奖
                if(pass_data_id.indexOf(API.CONFIG.official_dynamic_data[n].dynamic_id) == -1)new_data_list.push(API.CONFIG.official_dynamic_data[n])
            }
            API.CONFIG.official_dynamic_data = new_data_list
            API.saveConfig()
        }
        let check_official_business_data = async function () {
            let pass_data_id = []
            //let d = {"business_id":business_id,"lottery_time":lottery_time}
            for(let n=0;n<API.CONFIG.official_business_data.length;n++){
                if(API.CONFIG.official_business_data[n].lottery_time == undefined)pass_data_id.push(business_id)
                if(API.CONFIG.official_business_data[n].lottery_time < ts_s()){
                    await sleep(5000)
                    let business_id = API.CONFIG.official_business_data[n].business_id
                    BAPI.dynamic_lottery_notice_business(business_id).then(async function(data){
                        //预约直播
                        if(data.code == 0){
                            pass_data_id.push(business_id)
                            if(data.data.lottery_result !=undefined){//取消抽奖后无lottery_result
                                let lottery_id = data.data.lottery_id
                                let business_id = data.data.business_id
                                let lottery_result = data.data.lottery_result
                                let first_prize_cmt = data.data.first_prize_cmt
                                let second_prize_cmt = data.data.second_prize_cmt
                                let third_prize_cmt = data.data.third_prize_cmt
                                if(first_prize_cmt != '')first_prize_cmt = "一等奖：" + first_prize_cmt
                                if(second_prize_cmt != '')second_prize_cmt = "二等奖：" + second_prize_cmt
                                if(third_prize_cmt != '')third_prize_cmt = "三等奖：" + third_prize_cmt
                                let sender_uid = data.data.sender_uid
                                let title
                                if(business_id<999999999 && business_id !=0){
                                    title = '【预约抽奖】'
                                    if(lottery_result.first_prize_result != undefined){
                                        for(let t=0;t<lottery_result.first_prize_result.length;t++){
                                            if(lottery_result.first_prize_result[t].uid == Live_info.uid){
                                                API.CONFIG.freejournal7.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：${title}：${first_prize_cmt}<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lottery_id}">抽奖页</a><a target="_blank" href="https://space.bilibili.com/${sender_uid}/dynamic">动态页</a>`)
                                                if(API.CONFIG.freejournal7.length > 500){
                                                    API.CONFIG.freejournal7.splice(400, 200);
                                                }
                                                API.saveConfig()
                                                if(freejournal7_console && API.CONFIG.freejournal7.length){
                                                    let dt = document.getElementById('sessions_msg');
                                                    dt.innerHTML = API.CONFIG.freejournal7
                                                }
                                                congratulations(first_prize_cmt,title)
                                            }
                                        }
                                    }
                                    if(lottery_result.second_prize_result!= undefined){
                                        for(let k=0;k<lottery_result.second_prize_result.length;k++){
                                            if(lottery_result.second_prize_result[k].uid == Live_info.uid){
                                                API.CONFIG.freejournal7.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：${title}：${second_prize_cmt}<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lottery_id}">抽奖页</a><a target="_blank" href="https://space.bilibili.com/${sender_uid}/dynamic">动态页</a>`)
                                                if(API.CONFIG.freejournal7.length > 500){
                                                    API.CONFIG.freejournal7.splice(400, 200);
                                                }
                                                API.saveConfig()
                                                if(freejournal7_console && API.CONFIG.freejournal7.length){
                                                    let dt = document.getElementById('sessions_msg');
                                                    dt.innerHTML = API.CONFIG.freejournal7
                                                }
                                                congratulations(second_prize_cmt,title)
                                            }
                                        }
                                    }
                                    if(lottery_result.third_prize_result!= undefined){
                                        for(let l=0;l<lottery_result.third_prize_result.length;l++){
                                            if(lottery_result.third_prize_result[l].uid == Live_info.uid){
                                                API.CONFIG.freejournal7.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：${title}：${third_prize_cmt}<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lottery_id}">抽奖页</a><a target="_blank" href="https://space.bilibili.com/${sender_uid}/dynamic">动态页</a>`)
                                                if(API.CONFIG.freejournal7.length > 500){
                                                    API.CONFIG.freejournal7.splice(400, 200);
                                                }
                                                API.saveConfig()
                                                if(freejournal7_console && API.CONFIG.freejournal7.length){
                                                    let dt = document.getElementById('sessions_msg');
                                                    dt.innerHTML = API.CONFIG.freejournal7
                                                }
                                                congratulations(third_prize_cmt,title)
                                            }
                                        }
                                    }
                                }
                                //预约直播
                            }
                        }
                    })
                }
            }
            let new_list = []
            let new_data_list = []
            for(let n=0;n<API.CONFIG.official_business_data.length;n++){//去重
                if(new_list.indexOf(API.CONFIG.official_business_data[n].business_id) == -1){
                    new_data_list.push(API.CONFIG.official_business_data[n])
                    new_list.push(API.CONFIG.official_business_data[n].business_id)
                }
            }
            API.CONFIG.official_business_data = new_data_list
            API.saveConfig()
            new_data_list = []
            for(let n=0;n<API.CONFIG.official_business_data.length;n++){//去已开奖
                if(pass_data_id.indexOf(API.CONFIG.official_business_data[n].business_id) == -1)new_data_list.push(API.CONFIG.official_business_data[n])
            }
            API.CONFIG.official_business_data = new_data_list
            API.saveConfig()
        }
        //动态抽奖
        let ddddd = async function () {
            if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){
                API.CONFIG.detail_by_lid_ts = (ts_ms()+ms_diff)
                //API.saveConfig()
                return
            }; //不抽奖时间段
            BAPI.live_info().then(async function(data){
                if(data.code == 0 && data.data.room_id){
                    BAPI.GetAnchorTaskCenterReceiveReward()
                }
            })
            if(!dynamic_lottery_run_mark)return//有正在运行的动态抽奖
            dynamic_lottery_run_mark = false
            if(API.CONFIG.detail_by_lid_live || API.CONFIG.detail_by_lid_dynamic){
                API.chatLog(`【动态抽奖】开始更新已转动态抽奖数据！`, 'success');
                await get_space_history_dynamic_id_list(Live_info.uid,0)//获取已转动态id
            }
            if(API.CONFIG.detail_by_lid_live || API.CONFIG.detail_by_lid_dynamic){
                API.chatLog(`【官方动态或预约抽奖】官方动态或预约抽奖开始！`, 'success');
                await office_dynamic_go()//群主官方动态抽奖专栏
                API.chatLog(`【官方动态或预约抽奖】官方动态或预约抽奖抽奖结束！`, 'success');
            }
            if(API.CONFIG.not_office_dynamic_go){
                API.chatLog(`【非官方动态】非官方动态抽奖开始！`, 'success');
                await not_office_dynamic_go()
                API.chatLog(`【非官方动态】非官方动态抽奖结束！`, 'success');
            }
            if(API.CONFIG.official_dynamic_data.length > 0 || API.CONFIG.official_business_data > 0){
                API.chatLog(`【官方抽奖数据检查】官方抽奖数据检查开始！`, 'success');
                await check_official_dynamic_data()
                await check_official_business_data()
                API.chatLog(`【官方抽奖数据检查】官方抽奖数据检查结束！`, 'success');
            }
            dynamic_lottery_run_mark = true
        }
        setTimeout(async() => {
            ddddd()
        },30 * 1000)
        setInterval(async() => {
            ddddd()
        },1800 * 1000)

        let anchor_join_delay_mark = false
        let unusual_stop = false
        let join_code_stop = false
        let anchor_join = async function(data){
            //if(reload_mark){
            //     API.chatLog(`【天选时刻】即将刷新，暂停参加抽奖！`, 'warning')
            //     return
            //}
            if(API.CONFIG.anchor_join_delay && anchor_join_delay_mark) return
            let room_id = data.room_id
            let time = data.time
            let id = data.id
            let gift_price = data.gift_price
            let gift_id = data.gift_id
            let gift_num = data.gift_num
            let require_type = data.require_type
            let require_text = data.require_text
            let award_name = data.award_name
            let award_num = data.award_num
            let require_value = data.require_value
            let cur_gift_num = data.cur_gift_num
            let danmu = data.danmu
            let current_time = data.current_time
            let award_price_text = data.award_price_text
            let award_value = 0
            let anchor_uid = data.ruid

            if(API.CONFIG.room_ruid.indexOf(anchor_uid) == -1){
                API.CONFIG.room_ruid.push(room_id)
                API.CONFIG.room_ruid.push(anchor_uid)
            }
            if(award_price_text)award_value = award_price_text.match(/\d+/g)[0] * award_num
            if(API.CONFIG.done_id_list.indexOf(id) > -1) return
            if(need_pass) API.CONFIG.done_id_list.push(id);
            if(API.CONFIG.done_id_list.length > 500)API.CONFIG.done_id_list.splice(0,100)
            API.CONFIG.freejournal4.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：房间号：<a target="_blank" href="https://live.bilibili.com/${room_id}">${room_id}</a>，奖品：${award_name}×${award_num}，条件：${require_text}，弹幕：${danmu}，金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`)
            if(API.CONFIG.freejournal4.length > 200){
                API.CONFIG.freejournal4.splice(150, 200);
            }
            if(freejournal4_console && API.CONFIG.freejournal4.length){
                let dt = document.getElementById('sessions_msg');
                dt.innerHTML = API.CONFIG.freejournal4
            }
            if(cur_gift_num > 0 && API.CONFIG.Anchor_cur_gift_num) {
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                return API.chatLog(`【天选时刻】已参与一次抽奖：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time)
            }
            if(API.CONFIG.gift_anchor_only && award_price_text == '')return
            if(API.CONFIG.require_none){
                if(API.CONFIG.ALLFollowingList.indexOf(anchor_uid) == -1){
                    if(require_type != 0 || require_text != "无" || gift_price!= 0)return
                }
            }
            if(API.CONFIG.Anchor_Followings_switch && API.CONFIG.ALLFollowingList.indexOf(anchor_uid) == -1){ //只参与关注的主播抽奖
                if(API.CONFIG.require_none && require_type == 0 && require_text == "无" && gift_price == 0){
                    //不符合仅关注 但是 开了无要求 则参加
                }else{
                    if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                    API.chatLog(`【天选时刻】不参与非关注主播的抽奖!`, 'warning',0,room_id,true,time);
                    return;
                }
            }
            if(award_price_text && API.CONFIG.gift_anchor_min_switch && API.CONFIG.gift_anchor_min > award_value){
                API.chatLog(`总电池价值【${award_value}】低于设置值【${API.CONFIG.gift_anchor_min}】：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time);
                return;
            }
            if(time <= 10){
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                return
            }
            let break_mark = false
            await BAPI.verify_room_pwd(room_id).then(async(data) => {
                if(data.code != 0)break_mark = true;
            },() => {
                return
            })
            if(break_mark){
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                return API.chatLog(`【天选时刻】${room_id}加密的直播间房间号，舍弃！`, 'warning',0,room_id,true,time)
            }
            if(API.CONFIG.anchor_join_delay && anchor_join_delay_mark) return
            if(!API.CONFIG.AUTO_Anchor) return
            if(unusual_stop || join_code_stop) return
            API.chatLog(`【天选时刻】<a href="https://live.bilibili.com/${room_id}"target="_blank">直播间：${room_id}</a>，奖品：${award_name}×${award_num}，要求：${require_text}，弹幕：${danmu}，金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`, 'success',time)

            if(require_type == 3){ //1关注，2粉丝勋章，3大航海:3舰长2提督1总督| console.log('生效大航海房间',guardroom);console.log('生效大航海等级',guard_level);console.log('生效大航海等级',guardroom_activite);
                let guardroom_num = API.CONFIG.guardroom.indexOf(room_id)
                if(guardroom_num == -1){
                    if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                    API.chatLog(`【天选时刻】无大航海：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time)
                    return;
                }
                if(guardroom_num > -1 && API.CONFIG.guardroom_activite[guardroom_num] == 1 && API.CONFIG.guard_level[guardroom_num] <= require_value){
                    //console.log('大航海数据', API.CONFIG.guardroom[guardroom_num], API.CONFIG.guard_level[guardroom_num], API.CONFIG.guardroom_activite[guardroom_num]);
                }else{
                    //console.log('大航海数据', API.CONFIG.guardroom[guardroom_num], API.CONFIG.guard_level[guardroom_num], API.CONFIG.guardroom_activite[guardroom_num]);
                    if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                    API.chatLog(`【天选时刻】大航海身份不符：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time)
                    return;
                }
            }
            if(require_type == 4 && Live_info.user_level < require_value){ //直播等级
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                API.chatLog(`【天选时刻】直播等级不符：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time)
                return;
            }
            if(require_type == 5 && Live_info.Blever < require_value){ //5主站等级Live_info.Blever
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                API.chatLog(`【天选时刻】主站等级不符：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time)
                return;
            }
            if(require_type >= 6){ //未知
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                API.chatLog(`【天选时刻】未知要求：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time)
                return;
            }
            if(gift_price * gift_num > API.CONFIG.gift_price){ //金瓜子判断
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                API.chatLog(`【天选时刻】金瓜子超出设置：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time)
                return;
            }
            if(API.CONFIG.Anchor_ignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1) && !API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)){
                let now_key
                for(let i=0;i<API.CONFIG.Anchor_ignore_keyword.length;i++){
                    if(award_name.toLowerCase().indexOf(API.CONFIG.Anchor_ignore_keyword[i]) > -1){
                        now_key=API.CONFIG.Anchor_ignore_keyword[i]
                        break
                    }
                }
                API.CONFIG.journal_pb.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：【天选时刻】过滤关键词：${now_key}：奖品：${award_name}×${award_num}：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`)
                if(API.CONFIG.journal_pb.length > 200){
                    API.CONFIG.journal_pb.splice(150, 200);
                }
                if(journal_pb_console && API.CONFIG.journal_pb.length){
                    let dt = document.getElementById('sessions_msg');
                    dt.innerHTML = API.CONFIG.journal_pb
                }
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                API.chatLog(`【天选时刻】过滤关键词：${now_key}：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time)
                return;
            }
            let money = []
            if(API.CONFIG.money_switch || API.CONFIG.no_money_checkbox){
                if(award_price_text == ''){
                    money = await moneyCheck(award_name);
                    console.log('识别到的奖品金额/元', money)
                }else{
                    money = award_price_text.match(/\d+/g)[0]/10
                    console.log('天选单礼物价值金额/元', money)
                }
            }
            if(money[0] && money[1] < API.CONFIG.money_min){
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                API.chatLog(`奖品金额低于设置值：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time);
                return;
            }
            if(API.CONFIG.no_money_checkbox && money[0]==false && !API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)){
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                API.chatLog(`未识别到现金及正则：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time);
                return;
            }
            let fansnum = 0
            if(API.CONFIG.Anchor_onlineNum_switch){
                let onlineNum = 0
                await BAPI.getOnlineGoldRank(anchor_uid,room_id).then(async(da) => {
                    if(da.code==0){
                        onlineNum = da.data.onlineNum
                    }
                },() => {
                    return
                })
                if(API.CONFIG.Anchor_onlineNum_switch && onlineNum > API.CONFIG.Anchor_onlineNum){
                    if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                    API.chatLog(`【天选时刻】目前在线人数：${onlineNum}大于设置值${API.CONFIG.Anchor_onlineNum}！<br><a href="https://live.bilibili.com/${room_id}"target="_blank">直播间：${room_id}</a>，跳过不参加抽奖！`, 'warning',0,room_id,true,time);
                    return
                }
            }

            if(API.CONFIG.fans_switch){ //粉丝数量判断
                await BAPI.web_interface_card(anchor_uid).then(async(data) => {
                    fansnum = data.data.follower
                    //console.log('粉丝数量', fansnum)
                }, () => {
                    console.log('await error')
                    return API.chatLog(`【天选时刻】粉丝数量获取失败，可能风控了！<br><a href="https://live.bilibili.com/${room_id}"target="_blank">直播间：${room_id}</a>，跳过不参加抽奖！`, 'warning',0,room_id,true,time);
                })
            }
            if(API.CONFIG.fans_switch && fansnum == 0) return;//粉丝数量风控
            if(API.CONFIG.fans_switch && fansnum < API.CONFIG.fans_min){ //粉丝数量判断
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                API.chatLog(`<a href="https://live.bilibili.com/${room_id}"target="_blank">直播间：${room_id}</a>抽奖主播粉丝数${fansnum}小于设置${API.CONFIG.fans_min}，不参加抽奖！`, 'warning',0,room_id,true,time);
                return;
            }
            let medal_roomid_list_num = API.CONFIG.medal_roomid_list.indexOf(room_id)//是否有勋章

            let fans_medal_check = false
            if(require_type == 2){
                await BAPI.fans_medal_info(anchor_uid,room_id).then(async function(data){
                    if(data.code ==0 && data.data.has_fans_medal && data.data.my_fans_medal.level >= require_value){
                        fans_medal_check = true
                    }
                })
            }
            if(require_type == 2 && !fans_medal_check){
                if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                API.chatLog(`【天选时刻】未拥有粉丝勋章或等级不足：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`, 'warning',0,room_id,true,time)
                return;
            }

            if(API.CONFIG.done_room_list.indexOf(room_id) == -1){
                API.CONFIG.done_room_list.push(room_id); //记录已参加抽奖的房间
                API.CONFIG.done_room_time_list.push(time + (ts_s()+s_diff)); //记录已参加抽奖的时间
            }
            BAPI.room.room_entry_action(room_id)
            let unusual_mark = false
            if(API.CONFIG.ALLFollowingList.indexOf(anchor_uid) == -1 && require_type && API.CONFIG.unusual_check){
                await BAPI.IsUserFollow(anchor_uid).then(async(data) => {
                    if(data.code == 0){
                        if(!data.data.follow){
                            unusual_mark = true//参加抽奖前、是需要关注的抽奖、确认是未关注状态
                        }
                    }
                },() => {
                    return
                })
            }
            if(API.CONFIG.anchor_join_delay && anchor_join_delay_mark)return
            anchor_join_delay_mark = true
            setTimeout(async() => {
                anchor_join_delay_mark = false
            },API.CONFIG.anchor_join_delay_time * 1000)
            await API.bili_ws(room_id,(time + 10) *1000)//天选在线
            await sleep(5000)
            if(API.CONFIG.auto_like)BAPI.likeReportV3(room_id,anchor_uid)
            //let roomHeart = new RoomHeart(room_id,Math.ceil(time/60))
            //await roomHeart.start()
            await BAPI.Lottery.anchor.join(id, room_id, gift_id, gift_num).then(async(data) => {
                if(data.code == 400 & gift_num * gift_price != 0){
                    if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                    API.chatLog(`金瓜子余额不足!`, 'warning',0,room_id,true,time);
                    return
                }
                if(data.code == 0){
                    if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                    API.chatLog(`【天选时刻】${room_id}参与成功！`, 'success',0,room_id,false,time);
                    if(gift_num * gift_price > 0){
                        API.CONFIG.goldjournal.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：房间号：<a target="_blank" href="https://live.bilibili.com/${room_id}">${room_id}</a>，奖品：${award_name}×${award_num}，花费金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`)//https://live.bilibili.com/
                        if(API.CONFIG.goldjournal.length > 200){
                            API.CONFIG.goldjournal.splice(150, 200);
                        }
                        API.saveConfig();
                        if(goldjournal_console && API.CONFIG.goldjournal.length){
                            let dt = document.getElementById('sessions_msg');
                            dt.innerHTML = API.CONFIG.goldjournal
                        }
                    }
                    if(gift_num * gift_price == 0){
                        API.CONFIG.freejournal.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：房间号：<a target="_blank" href="https://live.bilibili.com/${room_id}">${room_id}</a>，奖品：${award_name}×${award_num}`)
                        if(API.CONFIG.freejournal.length > 200){
                            API.CONFIG.freejournal.splice(150, 200);
                        }
                        API.saveConfig();
                        if(freejournal_console && API.CONFIG.freejournal.length){
                            let dt = document.getElementById('sessions_msg');
                            dt.innerHTML = API.CONFIG.freejournal
                        }
                    }
                    API.CONFIG.COUNT_GOLDBOX++;
                    $('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
                    API.saveConfig();


                    await sleep(5000)
                    BAPI.getOnlineGoldRank(anchor_uid,room_id).then(async(da) => {
                        if(da.code==0){
                            let onlineNum = da.data.onlineNum
                            let score = da.data.ownInfo.score
                            let rank = da.data.ownInfo.rank
                            API.chatLog(`【天选时刻】目前在线人数：${onlineNum}<br>贡献值：${score}<br>排名：${rank}`, 'success');
                            if(score == 0){
                                let con = `<br>${timestampToTime((ts_s()+s_diff))}：房间号：<a target="_blank" href="https://live.bilibili.com/${room_id}">${room_id}</a>，参加抽奖后直播间无贡献值，可能已经风控！`
                                API.CONFIG.freejournal.unshift(con)
                                if(API.CONFIG.freejournal.length > 200){
                                    API.CONFIG.freejournal.splice(150, 200);
                                }
                                API.saveConfig();
                                if(freejournal_console && API.CONFIG.freejournal.length){
                                    let dt = document.getElementById('sessions_msg');
                                    dt.innerHTML = API.CONFIG.freejournal
                                }
                            }
                            if(API.CONFIG.Anchor_score_auto_dm){
                                BAPI.likeReportV3(room_id,anchor_uid).then(async(dad) => {
                                    if(dad.code==0){
                                        API.chatLog(`【天选时刻】点赞成功`, 'success');
                                    }
                                })
                            }
                        }
                    })

                    if(unusual_mark){
                        BAPI.IsUserFollow(anchor_uid).then(async(data) => {
                            if(data.code == 0){
                                if(!data.data.follow){//参加抽奖后还是未关注状态判断为异常
                                    unusual_stop = true
                                    API.chatLog(`【天选时刻】检测到${room_id}关注异常，暂停抽奖${API.CONFIG.unusual_stop_delay_time}分钟！`, 'warning',0,room_id,true,API.CONFIG.unusual_stop_delay_time * 60)
                                    API.CONFIG.freejournal.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：房间号：<a target="_blank" href="https://live.bilibili.com/${room_id}">${room_id}</a>检测到关注异常，暂停抽奖${API.CONFIG.unusual_stop_delay_time}分钟！`)
                                    if(API.CONFIG.freejournal.length > 200){
                                        API.CONFIG.freejournal.splice(150, 200);
                                    }
                                    API.saveConfig();
                                    if(freejournal_console && API.CONFIG.freejournal.length){
                                        let dt = document.getElementById('sessions_msg');
                                        dt.innerHTML = API.CONFIG.freejournal
                                    }
                                    setTimeout(async() => {
                                        unusual_stop = false
                                    },API.CONFIG.unusual_stop_delay_time * 60 * 1000)
                                }
                            }
                        })
                    }
                }else{
                    if(API.CONFIG.done_id_list.indexOf(id) == -1)API.CONFIG.done_id_list.push(id);
                    API.chatLog(`【天选时刻】${room_id}参与反馈：${data.message}`, 'warning',0,room_id,true,time)
                    console.log(data)
                    if(data.code == -352 && API.CONFIG.join_code_check){
                        API.chatLog(`【天选时刻】检测到${room_id}验证码异常，暂停抽奖${API.CONFIG.join_code_stop_delay_time}分钟！`, 'warning',0,room_id,true,API.CONFIG.join_code_stop_delay_time * 60)
                        API.CONFIG.freejournal.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：房间号：<a target="_blank" href="https://live.bilibili.com/${room_id}">${room_id}</a>检测到验证码异常，暂停抽奖${API.CONFIG.join_code_stop_delay_time}分钟！`)
                        if(API.CONFIG.freejournal.length > 200){
                            API.CONFIG.freejournal.splice(150, 200);
                        }
                        API.saveConfig();
                        if(freejournal_console && API.CONFIG.freejournal.length){
                            let dt = document.getElementById('sessions_msg');
                            dt.innerHTML = API.CONFIG.freejournal
                        }
                        join_code_stop = true
                        setTimeout(async() => {
                            join_code_stop = false
                        },API.CONFIG.join_code_stop_delay_time * 60 * 1000)
                    }
                    return
                }
            },() => {
                return
            });
        }
        let storm_join = async function(data,roomid){
            if(API.CONFIG.storm_done_id_list.indexOf(data.id) > -1)return
            API.CONFIG.storm_done_id_list.push(data.id)
            if(API.CONFIG.storm_done_id_list.length > 100){
                API.CONFIG.storm_done_id_list.splice(0, 50);
            }
            API.saveConfig();
            if(data.time < 16) return
            if(!API.CONFIG.AUTO_storm) return
            if(Storm_BLACK) return
            if(!Live_info.identification) return
            if(data.endtime - (ts_s()+s_diff) < 0) return
            await API.bili_ws(roomid,(data.endtime - (ts_s()+s_diff)) *1000)
            await sleep(5000)
            return API.join_storm(data.id,roomid)
        }
        let popularity_red_pocket_join = async function(data,roomid){
            if(popularity_red_pocket_do_mark) return
            let anchor_uid = 0
            let room_ruid_num = API.CONFIG.room_ruid.indexOf(roomid)
            if(room_ruid_num > -1){
                anchor_uid = API.CONFIG.room_ruid[room_ruid_num + 1]
            }
            if(room_ruid_num == -1){
                await BAPI.live_user.get_anchor_in_room(roomid).then(async(dat) => {
                    if(dat.code==0 && dat.data.info !== undefined){
                        anchor_uid = dat.data.info.uid;
                        API.CONFIG.room_ruid.push(roomid)
                        API.CONFIG.room_ruid.push(anchor_uid)
                        API.saveConfig();
                    }
                },() => {
                    return
                })
            }
            if(anchor_uid == 0) return
            for(let i=0;i<data.length;i++){
                if(freejournal4_record_id_list.indexOf(data[i].lot_id) == -1){
                    freejournal4_record_id_list.push(data[i].lot_id)
                    if(freejournal4_record_id_list.length > 200)freejournal4_record_id_list.splice(0, 100);
                    API.CONFIG.journal_popularity_red_pocket.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：房间号：<a target="_blank" href="https://live.bilibili.com/${roomid}">${roomid}</a>直播间道具红包${data[i].total_price/1000}元`)
                    if(API.CONFIG.journal_popularity_red_pocket.length > 200){
                        API.CONFIG.journal_popularity_red_pocket.splice(150, 200);
                    }
                    if(journal_popularity_red_pocket_console && API.CONFIG.journal_popularity_red_pocket.length){
                        let dt = document.getElementById('sessions_msg');
                        dt.innerHTML = API.CONFIG.journal_popularity_red_pocket
                    }
                }
                if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) > -1) continue
                if(need_pass) API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                if(API.CONFIG.popularity_red_pocket_done_id_list.length > 200)API.CONFIG.popularity_red_pocket_done_id_list.splice(0,100)
                if(popularity_red_pocket_do_mark) continue
                if(!API.CONFIG.popularity_red_pocket_join_switch){
                    if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                    continue
                }
                if(API.CONFIG.popularity_red_pocket_time_switch2 && getOnlineGoldRank_mark){
                    if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                    continue
                }
                if(API.CONFIG.popularity_red_pocket_time_switch && !time_switch_mark){
                    if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                    continue
                }
                if(popularity_red_pocket_join_num_max){
                    if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                    continue
                }
                //if(reload_mark){
                //    API.chatLog(`【直播间电池道具】即将刷新，暂停参加抽奖！`, 'warning')
                //    continue
                //}
                if(API.CONFIG.popularity_red_pocket_Followings_switch && anchor_uid != 0 && API.CONFIG.ALLFollowingList.indexOf(anchor_uid) == -1){ //只参与关注的主播抽奖
                    API.chatLog(`【直播间电池道具】不参与非关注主播的抽奖!`, 'warning',0,roomid,true);
                    if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                    continue
                }
                if(data[i].total_price != undefined && data[i].total_price < API.CONFIG.total_price * 1000){
                    if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                    //API.chatLog(`【直播间电池道具】${roomid}直播间道具红包总值${data[i].total_price/1000}元小于设定值${API.CONFIG.total_price}元，跳过！`, 'warning')
                    continue
                }
                //popularity_red_pocket_only_official_switch
                if(API.CONFIG.popularity_red_pocket_only_official_switch && data[i].sender_uid !== 1407831746){
                    API.chatLog(`【直播间电池道具】非官方红包抽奖，跳过！`, 'warning')
                    if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                    continue
                }
                if(API.CONFIG.popularity_red_pocket_no_official_switch && data[i].sender_uid == 1407831746){
                    API.chatLog(`【直播间电池道具】是官方红包抽奖，跳过！`, 'warning')
                    if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                    continue
                }
                if(data[i].end_time < (ts_s()+s_diff)){
                    if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                    continue
                }
                if(data[i].end_time - (ts_s()+s_diff) < 10){
                    if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                    continue
                }
                if(API.CONFIG.popularity_red_pocket_onlineNum_switch || API.CONFIG.popularity_red_pocket_onlineNum_switch2){
                    let onlineNum = 0
                    let red_pocket_Num = 0
                    let awards_list = data[i].awards
                    for(let n=0;n<awards_list.length;n++){
                        red_pocket_Num = red_pocket_Num + awards_list[n].num
                    }
                    let getOnlineGoldRank_err = false
                    await BAPI.getOnlineGoldRank(anchor_uid,roomid).then(async(da) => {
                        if(da.code==0){
                            onlineNum = da.data.onlineNum
                        }else{
                            getOnlineGoldRank_err = true
                        }
                    },() => {
                        getOnlineGoldRank_err = true
                    })
                    if(getOnlineGoldRank_err)continue
                    if(API.CONFIG.popularity_red_pocket_onlineNum_switch && onlineNum > API.CONFIG.popularity_red_pocket_onlineNum){
                        if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                        API.chatLog(`【直播间电池道具】目前在线人数：${onlineNum}大于设置值${API.CONFIG.popularity_red_pocket_onlineNum}，跳过此次抽奖！`, 'warning');
                        continue
                    }
                    if(API.CONFIG.popularity_red_pocket_onlineNum_switch2 && onlineNum > red_pocket_Num + API.CONFIG.popularity_red_pocket_Num && red_pocket_Num > 0){
                        if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                        API.chatLog(`【直播间电池道具】目前在线人数：${onlineNum}大于设置值${red_pocket_Num + API.CONFIG.popularity_red_pocket_Num}，跳过此次抽奖！`, 'warning');
                        continue
                    }
                }
                let time = API.CONFIG.popularity_red_pocket_open_left
                if(data[i].end_time - (ts_s()+s_diff) < time)time = data[i].end_time - (ts_s()+s_diff)
                popularity_red_pocket_do_mark = true
                API.chatLog(`【直播间电池道具】房间号：<a target="_blank" href="https://live.bilibili.com/${roomid}">${roomid}</a>直播间道具红包${data[i].total_price/1000}元，将在${data[i].end_time - (ts_s()+s_diff) - time}秒后剩余${time}秒时参加抽奖！`)
                if(API.CONFIG.popularity_red_pocket_join_switch){
                    setTimeout(async() => {
                        //let tab = GM_openInTab('https://live.bilibili.com/' + `${roomid}?fetchcut`)
                        await API.bili_ws(roomid,(time + 20) * 1000, true)
                        await sleep(5000)
                        if(API.CONFIG.auto_like)BAPI.likeReportV3(roomid,anchor_uid)
                        //let roomHeart = new RoomHeart(roomid,Math.ceil(time/60))
                        //await roomHeart.start()
                        var formData = new FormData();
                        formData.set("visit_id", "");
                        formData.set("session_id", "");
                        formData.set("room_id", roomid);
                        formData.set("ruid", anchor_uid);
                        formData.set("spm_id", "444.8.red_envelope.extract");
                        formData.set("jump_from", "26000");
                        formData.set("build", "6790300");
                        formData.set("c_locale", "en_US");
                        formData.set("channel", "360");
                        formData.set("device", "android");
                        formData.set("mobi_app", "android");
                        formData.set("platform", "android");
                        formData.set("version", "6.79.0");
                        formData.set("statistics", "%7B%22appId%22%3A1%2C%22platform%22%3A3%2C%22version%22%3A%226.79.0%22%2C%22abtest%22%3A%22%22%7D");
                        function drawRedPacket() {
                            formData.set("csrf", Live_info.csrf_token);
                            formData.set("csrf_token", Live_info.csrf_token);
                            formData.set("lot_id", data[i].lot_id);
                            GM_xmlhttpRequest({
                                url: `https://api.live.bilibili.com/xlive/lottery-interface/v1/popularityRedPocket/RedPocketDraw`,
                                method: "post",
                                headers: {
                                    "User-Agent": "Mozilla/5.0 BiliDroid/6.79.0 (bbcallen@gmail.com) os/android model/Redmi K30 Pro mobi_app/android build/6790300 channel/360 innerVer/6790310 osVer/11 network/2"
                                },
                                data: formData,
                                onload: async function (res) {
                                    let dat = JSON.parse(res.response);
                                    //console.log('drawRedPacket',dat)
                                    if(dat.code ==0){
                                        if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].lot_id) == -1)API.CONFIG.popularity_red_pocket_done_id_list.push(data[i].lot_id);
                                        API.chatLog(`【直播间电池道具】【数据】房间号：<a target="_blank" href="https://live.bilibili.com/${roomid}">${roomid}</a>，直播间道具红包总值${data[i].total_price/1000}元参与成功！`, 'success');
                                        API.CONFIG.COUNT_GOLDBOX++;
                                        $('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
                                        API.CONFIG.freejournal.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：房间号：<a target="_blank" href="https://live.bilibili.com/${roomid}">${roomid}</a>，直播间道具红包${data[i].total_price/1000}元`)
                                        if(API.CONFIG.freejournal.length > 200){
                                            API.CONFIG.freejournal.splice(150, 200);
                                        }
                                        API.saveConfig();
                                        if(freejournal_console && API.CONFIG.freejournal.length){
                                            let dt = document.getElementById('sessions_msg');
                                            dt.innerHTML = API.CONFIG.freejournal
                                        }
                                        await sleep(5000)
                                        BAPI.getOnlineGoldRank(anchor_uid,roomid).then(async(da) => {
                                            if(da.code==0){
                                                let onlineNum = da.data.onlineNum
                                                let score = da.data.ownInfo.score
                                                let rank = da.data.ownInfo.rank
                                                API.chatLog(`【直播间电池道具】目前在线人数：${onlineNum}<br>贡献值：${score}<br>排名：${rank}`, 'success');
                                                if(score == 0){
                                                    let con = `<br>${timestampToTime((ts_s()+s_diff))}：房间号：<a target="_blank" href="https://live.bilibili.com/${roomid}">${roomid}</a>，参加抽奖后直播间无贡献值，可能已经风控！`
                                                    if(API.CONFIG.popularity_red_pocket_time_switch2){
                                                        con = con + '暂停抽奖' + API.CONFIG.popularity_red_pocket_time2 + '分钟！'
                                                        API.chatLog(`【直播间电池道具】${roomid}直播间无贡献值，暂停抽奖${API.CONFIG.popularity_red_pocket_time2 }分钟！`, 'warning')
                                                    }else{
                                                        API.chatLog(`【直播间电池道具】${roomid}直播间无贡献值，可能已经风控！`, 'warning')
                                                    }
                                                    API.CONFIG.freejournal.unshift(con)
                                                    if(API.CONFIG.freejournal.length > 200){
                                                        API.CONFIG.freejournal.splice(150, 200);
                                                    }
                                                    API.saveConfig();
                                                    if(freejournal_console && API.CONFIG.freejournal.length){
                                                        let dt = document.getElementById('sessions_msg');
                                                        dt.innerHTML = API.CONFIG.freejournal
                                                    }
                                                    getOnlineGoldRank_mark = true
                                                    setTimeout(async() => {
                                                        getOnlineGoldRank_mark = false
                                                    },API.CONFIG.popularity_red_pocket_time2 * 60000)
                                                    return
                                                }
                                                if(API.CONFIG.score_auto_dm){
                                                    BAPI.likeReportV3(roomid,anchor_uid).then(async(dad) => {
                                                        if(dad.code==0){
                                                            API.chatLog(`【直播间电池道具】点赞成功`, 'success');
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }else if(dat.code == 1009109){
                                        popularity_red_pocket_join_num_max = true
                                        API.chatLog(`【直播间电池道具】${roomid}直播间道具红包参与反馈：${dat.message}`, 'warning')
                                    }else if(dat.code == 1009114){
                                        API.chatLog(`【直播间电池道具】${roomid}直播间道具红包参与反馈：${dat.message}`, 'warning')
                                    }else{
                                        API.chatLog(`【直播间电池道具】${roomid}直播间道具红包参与反馈：${dat.message}`, 'warning')
                                    }
                                }
                            })
                        }
                        drawRedPacket()
                        setTimeout(async() => {
                            //tab.close();
                            popularity_red_pocket_do_mark = false
                        },(time + 10 + API.CONFIG.popularity_red_pocket_flash) *1000)
                    }, (data[i].end_time - (ts_s()+s_diff) - time)*1000);
                }
            }
        }
        let null_id_list = [0]
        let getLotteryInfoWeb = async function(roomid,upup=false,id=0){
            if(!upup && !API.CONFIG.popularity_red_pocket_join_switch && !API.CONFIG.AUTO_storm && !API.CONFIG.AUTO_Anchor) return
            if(!upup && !API.CONFIG.popularity_red_pocket_join_switch && !API.CONFIG.AUTO_storm && API.CONFIG.AUTO_Anchor && API.CONFIG.anchor_join_delay && anchor_join_delay_mark) return
            if(!upup && popularity_red_pocket_do_mark && !API.CONFIG.AUTO_storm && !API.CONFIG.AUTO_Anchor) return
            if(!upup && popularity_red_pocket_do_mark && !API.CONFIG.AUTO_storm && API.CONFIG.AUTO_Anchor && API.CONFIG.anchor_join_delay && anchor_join_delay_mark) return
            if(!upup && !API.CONFIG.popularity_red_pocket_join_switch && !API.CONFIG.AUTO_storm && API.CONFIG.AUTO_Anchor && API.CONFIG.unusual_check && unusual_stop) return
            if(!upup && popularity_red_pocket_do_mark && !API.CONFIG.AUTO_storm && API.CONFIG.AUTO_Anchor && API.CONFIG.unusual_check && unusual_stop) return
            if(API.CONFIG.Anchor_ignore_room.indexOf(roomid) > -1) return
            if(id > 0 && null_id_list.indexOf(id) > -1) return
            await BAPI.getLotteryInfoWeb(roomid).then(async(data) => {
                if(data.code==0){
                    API.CONFIG.Anchor_ts = (ts_ms()+ms_diff)
                    let anchor_data = data.data.anchor
                    let red_pocket_data = data.data.red_pocket
                    let popularity_red_pocket_data = data.data.popularity_red_pocket
                    let storm_data = data.data.storm
                    if(anchor_data == null && popularity_red_pocket_data == null && storm_data == null && id > 0 && null_id_list.indexOf(id) == -1){
                        null_id_list.push(id)
                        if(null_id_list.length > 100)null_id_list.splice(0,50)
                        return
                    }
                    if(anchor_data != null){
                        if(upup){
                            if(!API.CONFIG.Anchor_ignore_keyword.some(v => anchor_data.award_name.toLowerCase().indexOf(v) > -1) || API.CONFIG.Anchor_unignore_keyword.some(v => anchor_data.award_name.toLowerCase().indexOf(v) > -1)){//屏蔽的不传服务器
                                Anchor_room_list.push(roomid);
                                Anchor_award_id_list.push(anchor_data.id);
                                Anchor_award_nowdate.push(ts_ten_m());
                                //上传服务器
                                const post_data_stringify = {
                                    "type":"anchor"
                                }
                                const post_data = {id:anchor_data.id,room_id:roomid,data:JSON.stringify(post_data_stringify)}
                                post_data_to_server(post_data,qun_server[0]).then((data) => {
                                    //console.log('【天选】post_data_to_server',post_data)
                                })
                                //上传服务器
                            }else{
                                //console.log('屏蔽的不传服务器');
                            }
                        }else{
                            if(API.CONFIG.anchor_join_delay && anchor_join_delay_mark){

                            }else{
                                if(API.CONFIG.AUTO_Anchor){
                                    console.log('getLotteryInfoWeb：anchor_data',anchor_data)
                                    await sleep(1000)
                                    await anchor_join(anchor_data)
                                }
                            }
                        }
                    }
                    if(popularity_red_pocket_data != null){
                        if(upup){
                            if(popularity_red_pocket_data[0].total_price > 2000){
                                Anchor_room_list.push(roomid);
                                Anchor_award_id_list.push(popularity_red_pocket_data[0].lot_id);
                                Anchor_award_nowdate.push(ts_ten_m());
                                //上传服务器
                                const post_data_stringify = {
                                    "type":"popularity_red_pocket"
                                }
                                const post_data = {id:popularity_red_pocket_data[0].lot_id,room_id:roomid,data:JSON.stringify(post_data_stringify)}
                                post_data_to_server(post_data,qun_server[0]).then((data) => {
                                    //console.log('【道具红包】post_data_to_server',post_data)
                                })
                                //上传服务器
                            }
                        }else{
                            if(popularity_red_pocket_do_mark || !API.CONFIG.popularity_red_pocket_join_switch){

                            }else{
                                console.log('getLotteryInfoWeb：popularity_red_pocket_data',popularity_red_pocket_data)
                                await sleep(1000)
                                await popularity_red_pocket_join(popularity_red_pocket_data,roomid)
                            }
                        }
                    }
                    if(storm_data != null){
                        //console.log('storm_data：storm_data',storm_data)
                        if(upup){
                            Anchor_room_list.push(roomid);
                            Anchor_award_id_list.push(storm_data.id);
                            Anchor_award_nowdate.push(ts_ten_m());
                            //上传服务器
                            const post_data_stringify = {
                                "type":"storm",
                            }
                            const post_data = {id:storm_data.id,room_id:roomid,data:JSON.stringify(post_data_stringify)}
                            post_data_to_server(post_data,qun_server[0]).then((data) => {
                                //console.log('【节奏风暴】post_data_to_server',post_data)
                            })
                            //上传服务器
                        }else{
                            storm_join(storm_data,roomid)
                        }
                    }
                }else{
                    await sleep(5000)
                }
            })
        }
        let get_area_room_list = async function(parent_area_id,max=15){
            let getWebArea_room_List = async function(page){
                await BAPI.getWebArea_room_List(parent_area_id, page).then(async (data) => {
                    if(data.code == 0){
                        let l = data.data.list
                        for(let i=0;i<l.length;i++){
                            if(Lottery_room_list.indexOf(l[i].roomid) == -1)Lottery_room_list.push(l[i].roomid)
                        }
                        if(page < max && data.data.has_more == 1)await getWebArea_room_List(page+1)
                    }
                })
            }
            await getWebArea_room_List(1)
            //console.log('get_area_room_list',Lottery_room_list)
        }
        let area_name
        let get_Lottery_room_list = async function () {
            let index = [];
            for(let i = 0; i < server_area_data.length; i++){
                let percent = server_area_data[i].percent
                for(let j = 0; j < percent; j++){
                    index.push(server_area_data[i]);
                }
            }
            let rand = Math.floor(Math.random() * index.length);
            server_area_id = index[rand].id
            area_name = index[rand].name
            console.log('server_area_id',server_area_data,server_area_id)
            Lottery_room_list = []
            if(server_area_id == 88){
                for(let i=0;i<server_area_data.length-1;i++){
                    //console.log('server_area_data',server_area_data[i].id)
                    await get_area_room_list(server_area_data[i].id,5)
                }
            }else{
                await get_area_room_list(server_area_id)
            }
        }
        if(API.CONFIG.switch_sever){
            await sleep(10000)
            let check = async function () {
                //console.log('check',new Date())
                if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){
                    API.chatLog(`检索休眠中！`, 'warning')
                    await sleep(600 * 1000)
                    return check()
                }
                if(!API.CONFIG.switch_sever)return
                await get_Lottery_room_list()
                API.chatLog(`【分区：${area_name}】检索直播间数量：${Lottery_room_list.length}`)
                //window.toast(`【分区：${area_name}】检索直播间数量：${Lottery_room_list.length}`, "success");
                console.log(`【分区：${area_name}】检索直播间数量：${Lottery_room_list.length}`)
                for(let i=0;i<Lottery_room_list.length;i++){
                    await sleep(1000)
                    if(i < 60) API.bili_ws(Lottery_room_list[i],API.CONFIG.AnchorcheckFLASH *1000 + Lottery_room_list.length * 600)
                    //if((i+1)%20 == 0)window.toast(`【分区：${area_name}】已检索直播间${i+1}个/共${Lottery_room_list.length}个`, "success");
                    getLotteryInfoWeb(Lottery_room_list[i],true)
                    //console.log(`正在检索直播间数据：【分区：${area_name}】${Lottery_room_list[i]}`,i+1,Lottery_room_list.length)
                }
                API.CONFIG.Anchor_ts = (ts_ms()+ms_diff)
                //API.saveConfig();
                //window.toast(`【分区：${area_name}】检索抽奖数据结束！`, "success");
                API.chatLog(`${API.CONFIG.AnchorcheckFLASH}秒后重新开始检索！`)
                //window.toast(`${API.CONFIG.AnchorcheckFLASH}秒后重新开始检索！`, "success");
                await sleep(API.CONFIG.AnchorcheckFLASH * 1000)
                await check()
            }
            check()
        }

        let get_AnchorRecord = async function () {
            AnchorRecord_list = []
            let page_count = 0
            let AnchorRecord = async function (page) {
                await BAPI.Lottery.anchor.AnchorRecord(page).then(async (data) => {
                    if(data.code == 0){
                        AnchorRecord_list = AnchorRecord_list.concat(data.data.list)
                        page_count = data.data.page_count
                    }
                })
            }
            await AnchorRecord(1)
            //if(page_count == 2)await AnchorRecord(2)
            //if(page_count > 2){
            //    await AnchorRecord(page_count)
            //    await AnchorRecord(page_count-1)
            //}
            AnchorRecord_list.sort(function(a,b){
                return turn_time(b.end_time)-turn_time(a.end_time)
            })
            //console.log('获取最新天选中奖信息', AnchorRecord_list)
            if(AnchorRecord_list.length > 0){
                anchor_uid = AnchorRecord_list[0].anchor_uid
                let num = API.CONFIG.room_ruid.indexOf(anchor_uid)
                document.getElementById("anchor_uid").href=`https://message.bilibili.com/#/whisper/mid${anchor_uid}`
                document.getElementById("anchor_room").href=`https://live.bilibili.com/${API.CONFIG.room_ruid[num-1]}`
                anchor_name = AnchorRecord_list[0].anchor_name
                award_name = AnchorRecord_list[0].award_name
                end_time = AnchorRecord_list[0].end_time
                $('#award span:eq(0)').text(anchor_name);
                $('#award span:eq(1)').text(award_name);
                $('#award span:eq(2)').text(end_time);
            }
            if(AnchorRecord_list.length > 1){
                anchor_uid1 = AnchorRecord_list[1].anchor_uid
                let num = API.CONFIG.room_ruid.indexOf(anchor_uid1)
                document.getElementById("anchor_uid1").href=`https://message.bilibili.com/#/whisper/mid${anchor_uid1}`
                document.getElementById("anchor_room1").href=`https://live.bilibili.com/${API.CONFIG.room_ruid[num-1]}`
                anchor_name1 = AnchorRecord_list[1].anchor_name
                award_name1 = AnchorRecord_list[1].award_name
                end_time1 = AnchorRecord_list[1].end_time
                $('#award span:eq(3)').text(anchor_name1);
                $('#award span:eq(4)').text(award_name1);
                $('#award span:eq(5)').text(end_time1);
            }
            if(AnchorRecord_list.length > 2){
                anchor_uid2 = AnchorRecord_list[2].anchor_uid
                let num = API.CONFIG.room_ruid.indexOf(anchor_uid2)
                document.getElementById("anchor_uid2").href=`https://message.bilibili.com/#/whisper/mid${anchor_uid2}`
                document.getElementById("anchor_room2").href=`https://live.bilibili.com/${API.CONFIG.room_ruid[num-1]}`
                anchor_name2 = AnchorRecord_list[2].anchor_name
                award_name2 = AnchorRecord_list[2].award_name
                end_time2 = AnchorRecord_list[2].end_time
                $('#award span:eq(6)').text(anchor_name2);
                $('#award span:eq(7)').text(award_name2);
                $('#award span:eq(8)').text(end_time2);
            }
        };
        let get_awardlist_list = async function(){
            BAPI.Lottery.anchor.awardlist(1).then(async (data) => { //只获取第一页
                if(data.code ==0){
                    //console.log(data)
                    if(data.data.list.length == 0)return//空，不要
                    awardlist_list = data.data.list;
                    awardlist_list.sort(function(a,b){
                        return turn_time(b.create_time)-turn_time(a.create_time)
                    })
                    //console.log('获取最新实物中奖信息', awardlist_list)
                    $('#award span:eq(9)').text(awardlist_list[0].gift_name);
                }
            });
        };
        let qqawardlist_num = 0
        setInterval(function () { //中奖播报
            if(API.CONFIG.qqawardlist.length > 0 && API.CONFIG.qqawardlist_switch){
                //console.log('中奖播报',API.CONFIG.qqawardlist)
                window.toast(API.CONFIG.qqawardlist[qqawardlist_num],'success')
                qqawardlist_num++
                if(API.CONFIG.qqawardlist.length == qqawardlist_num || qqawardlist_num >= 100)qqawardlist_num = 0
            }
        }, 2000)
        setInterval(function () { //中奖播报
            if(read_list.length > 0){
                if(GM_getValue('read'))
                    READ(read_list[0])
                read_list.splice(0, 1);
            }
            if(API.CONFIG.TALK == false && scrollTop_mark){ //自定义提示开关
                scrollTop_mark = false
                if(GM_getValue('go_down')){
                    let ctt = $('#chat-history-list');
                    ctt.animate({
                        scrollTop: 0
                    }, 0); //滚动到底部
                    setTimeout(() => {
                        ctt.animate({
                            scrollTop: ctt.prop("scrollHeight")
                        }, 0); //滚动到底部
                    },200)
                }
            }
        }, 10000)
        let AnchorRecord_list_msg_id = []
        let awardlist_list_msg_id = []
        let check_AnchorRecord = async function () { //中奖检查、最新中奖实时显示
            if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){ //判断时间段
                return
            };
            await get_AnchorRecord() //获取网络数据
            if(AnchorRecord_list.length==0 && awardlist_list.length==0 )return
            let AnchorRecord_list_id = []
            let AnchorRecord_list_end_time = []
            if(AnchorRecord_list.length > 0){
                for(let i = 0; i < AnchorRecord_list.length; i++){ //当前的id
                    AnchorRecord_list_id[i] = AnchorRecord_list[i].id
                }
                for(let i = 0; i < AnchorRecord_list.length; i++){ //当前的time
                    AnchorRecord_list_end_time[i] = AnchorRecord_list[i].end_time
                }
                //console.log('AnchorRecord_list',AnchorRecord_list_id,AnchorRecord_list_end_time)
                for(let i = 0; i < AnchorRecord_list.length; i++){
                    if(AnchorRecord_list_msg_id.indexOf(AnchorRecord_list_id[i]) == -1 && turn_time(AnchorRecord_list_end_time[i]) + 55 * 1000 > (ts_ms()+ms_diff)){ //比对时间两轮内时间
                        AnchorRecord_list_msg_id.push(AnchorRecord_list_id[i])
                        await sleep(1000)
                        let numb = API.CONFIG.room_ruid.indexOf(AnchorRecord_list[i].anchor_uid)
                        if(numb==-1){//无房间号数据
                            if(GM_getValue('read'))read_list.push(`【天选时刻】【${API.CONFIG.push_tag}】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}！`)
                            API.chatLog(`【天选时刻】【${API.CONFIG.push_tag}】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}！`, 'success')
                            if(API.CONFIG.tips_show)tip(`【天选时刻】【${API.CONFIG.push_tag}】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}！`)
                        }
                        if(numb>-1){//有房间号数据
                            if(GM_getValue('read'))read_list.push(`【天选时刻】【${API.CONFIG.push_tag}】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}（房间号：${API.CONFIG.room_ruid[numb-1]}）！`)
                            API.chatLog(`【天选时刻】【${API.CONFIG.push_tag}】${Live_info.uname}：恭喜你在<a href="https://live.bilibili.com/${API.CONFIG.room_ruid[numb-1]}" target="_blank">直播间</a>获得奖品${AnchorRecord_list[i].award_name}！`, 'success')
                            if(API.CONFIG.tips_show)tip(`【天选时刻】【${API.CONFIG.push_tag}】${Live_info.uname}：恭喜你在直播间：${API.CONFIG.room_ruid[numb-1]}获得奖品${AnchorRecord_list[i].award_name}！`)
                        }
                        const post_data = {id:(ts_ms()+ms_diff),room_id:Live_info.uid,data:`【天选时刻】${Xname}：${AnchorRecord_list[i].award_name}`}
                        post_data_to_server(post_data,qun_server[0]).then((data) => {
                            //console.log('post_data_to_server',data)
                        })

                        API.CONFIG.freejournal7.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：【天选时刻】：${AnchorRecord_list[i].award_name}<a target="_blank" href="https://live.bilibili.com/${API.CONFIG.room_ruid[numb-1]}">直播间</a>`)
                        if(API.CONFIG.freejournal7.length > 200){
                            API.CONFIG.freejournal7.splice(150, 200);
                        }
                        API.saveConfig()
                        if(freejournal7_console && API.CONFIG.freejournal7.length){
                            let dt = document.getElementById('sessions_msg');
                            dt.innerHTML = API.CONFIG.freejournal7
                        }

                        let tt = `【天选时刻】【${API.CONFIG.push_tag}】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}（房间号：${API.CONFIG.room_ruid[numb-1]}）！`
                        API.pushpush(tt)
                        if(API.CONFIG.anchor_danmu && numb>-1){//有房间号数据
                            let ii = Math.ceil(Math.random() * (API.CONFIG.anchor_danmu_content.length))
                            BAPI.sendLiveDanmu(API.CONFIG.anchor_danmu_content[ii - 1], API.CONFIG.room_ruid[numb - 1]).then(async(data) => {
                                if(data.code==0){
                                    API.chatLog(`【中奖弹幕】直播间房间号：${API.CONFIG.room_ruid[numb - 1]}发送成功！`, 'success');
                                }else{
                                    API.chatLog(`【中奖弹幕】直播间房间号：${API.CONFIG.room_ruid[numb - 1]}发送：${data.message}`, 'warning');
                                }
                            })
                        }
                        if(API.CONFIG.anchor_msg && AnchorRecord_list[i].need_receive_info){
                            let anchor_uid = AnchorRecord_list[i].anchor_uid
                            let ii = Math.ceil(Math.random() * (API.CONFIG.anchor_msg_content.length))
                            let send = async function () {
                                const msg = {
                                    sender_uid: Live_info.uid,
                                    receiver_id: anchor_uid,
                                    receiver_type: 1,
                                    msg_type: 1,
                                    msg_status: 0,
                                    content: `{"content":"` + API.CONFIG.anchor_msg_content[ii - 1] + `"}`,
                                    dev_id: getMsgDevId()
                                }
                                BAPI.sendMsg(msg).then((data) => {
                                    //console.log('sendMsg', getMsgDevId())
                                    //console.log('sendMsg', data)
                                    if(data.code == -400)
                                        return delayCall(() => send());
                                })
                            }
                            send()
                        }
                    }
                    if(AnchorRecord_list_msg_id.indexOf(AnchorRecord_list_id[i]) == -1 ){
                        AnchorRecord_list_msg_id.push(AnchorRecord_list_id[i])
                    }
                }
            }
        }
        let check_awardlist = async function () { //中奖检查、最新中奖实时显示
            await get_awardlist_list() //获取网络数据
            if(awardlist_list.length > 0 ){
                let awardlist_list_id = []
                let awardlist_list_create_time = []
                for(let i = 0; i < awardlist_list.length; i++){ //当前的id
                    awardlist_list_id[i] = awardlist_list[i].id
                }
                for(let i = 0; i < awardlist_list.length; i++){ //当前的time
                    awardlist_list_create_time[i] = awardlist_list[i].create_time
                }
                //console.log('awardlist_lis',awardlist_list_id,awardlist_list_create_time)
                for(let i = 0; i < awardlist_list.length; i++){
                    if(awardlist_list_msg_id.indexOf(awardlist_list_id[i]) == -1 && turn_time(awardlist_list_create_time[i]) + 55 * 1000 > (ts_ms()+ms_diff)){
                        awardlist_list_msg_id.push(awardlist_list_id[i])
                        let tt = `【实物宝箱】【${API.CONFIG.push_tag}】${Live_info.uname}：恭喜你获得${awardlist_list[0].gift_name}！`
                        if(GM_getValue('read'))read_list.push(tt)
                        API.chatLog(tt, 'success')
                        if(API.CONFIG.tips_show)tip(tt)
                        API.pushpush(tt)
                        const post_data = {id:(ts_ms()+ms_diff),room_id:Live_info.uid,data:`【实物宝箱】${Xname}：${awardlist_list[0].gift_name}`}
                        post_data_to_server(post_data,qun_server[0]).then((data) => {
                            //console.log('post_data_to_server',data)
                        })
                        API.CONFIG.freejournal7.unshift(`<br>${timestampToTime((ts_s()+s_diff))}：【实物宝箱】：${awardlist_list[0].gift_name}<a target="_blank" href="https://link.bilibili.com/p/center/index/user-center/my-info/award#/user-center/my-info/award">页面</a>`)
                        if(API.CONFIG.freejournal7.length > 200){
                            API.CONFIG.freejournal7.splice(150, 200);
                        }
                        API.saveConfig()
                        if(freejournal7_console && API.CONFIG.freejournal7.length){
                            let dt = document.getElementById('sessions_msg');
                            dt.innerHTML = API.CONFIG.freejournal7
                        }
                    }
                    if(awardlist_list_msg_id.indexOf(awardlist_list_id[i]) == -1){
                        awardlist_list_msg_id.push(awardlist_list_id[i])
                    }
                }
            }
        }
        setTimeout(async() => {
            check_awardlist()
            check_AnchorRecord()
        }, 3 * 1000);
        setInterval(async() => {
            check_awardlist()
            check_AnchorRecord()
        }, 20 * 1000);

        let get_config = async function () {
            if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){ //判断时间段
                return
            };
            if(!API.CONFIG.auto_config || !API.CONFIG.auto_config_url) return
            let cloud_Config = await getMyJson(API.CONFIG.auto_config_url);
            //console.log('cloud_Config',cloud_Config);
            if(cloud_Config.auto_config_url == undefined){
                return API.chatLog(`无云数据或获取异常！`,'warning');
            }
            try {
                let p = $.Deferred();
                try {
                    let config = cloud_Config;
                    $.extend(true, API.CONFIG, config);
                    for(let item in API.CONFIG){
                        if(unlist.indexOf(item)>-1){
                            //console.log('云导入配置过滤', item);
                            continue
                        }
                        if(config[item] !== undefined && config[item] !== null){
                            API.CONFIG[item] = config[item];
                            //console.log('云导入配置'+ item,config[item],API.CONFIG[item]);
                        }
                        if(item =="get_Anchor_ignore_keyword_switch1" || item =="get_Anchor_ignore_keyword_switch2" || item =="get_Anchor_unignore_keyword_switch1" || item =="get_Anchor_unignore_keyword_switch2"){
                            API.CONFIG[item] = false
                            //console.log('云导入配置'+ item,config[item],API.CONFIG[item]);
                        }
                    }
                    p.resolve()
                } catch (e){
                    p.reject()
                };
                API.saveConfig()
                API.chatLog(`自动同步云配置参数成功！<br>同步后界面显示的参数可能与实际不符！刷新后恢复正确显示！`);
            } catch (e){
                //console.log('导入配置importConfig error：', e);
            }

            let word = []
            for(let i = 0; i < API.CONFIG.Anchor_ignore_room.length; i++){//本地去重、去空格、去空
                if(word.indexOf(Number(API.CONFIG.Anchor_ignore_room[i])) == -1 && API.CONFIG.Anchor_ignore_room[i] && Number(API.CONFIG.Anchor_ignore_room[i]) != 0){
                    word.push(Number(API.CONFIG.Anchor_ignore_room[i]))
                }
            }
            API.CONFIG.Anchor_ignore_room = word
            for(let i = 0; i < word.length; i++){//屏蔽房间取关
                let num = API.CONFIG.room_ruid.indexOf(word[i])
                if(num == -1){
                    await BAPI.live_user.get_anchor_in_room(word[i]).then(async(da) => {
                        if(da.code==0 && da.data.info !== undefined){
                            let anchor_uid = da.data.info.uid;
                            API.CONFIG.room_ruid.push(word[i])
                            API.CONFIG.room_ruid.push(anchor_uid)
                        }else{
                            API.chatLog(`【屏蔽词/房】直播间房间号：${word[i]}可能不存在！`, 'warning');
                        }
                    }, () => {
                        console.log('await error')
                        return API.chatLog(`【屏蔽词/房】直播间用户UID获取失败！`, 'warning');
                    })
                }
                if(num > -1 && API.CONFIG.ALLFollowingList.indexOf(API.CONFIG.room_ruid[num+1]) > -1){
                    await BAPI.modify(API.CONFIG.room_ruid[num+1], 2).then(async function(data){
                        if(data.code==0){
                            API.chatLog(`【屏蔽房】屏蔽房取关成功：${word[i]}`, 'success');
                        }else{
                            API.chatLog(`【屏蔽房】回传信息：${data.message}`, 'warning');
                        }
                    }, () => {
                        console.log('await error')
                        return API.chatLog(`【屏蔽房】屏蔽房取关失败！`, 'warning');
                    })
                    await sleep(2000)
                }
            }
        }


        setTimeout(async() => {
            if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){ //判断时间段
                return
            };
            if(API.CONFIG.auto_config && API.CONFIG.auto_config_url) get_config()
        }, 20e3);
        setInterval(async() => {
            if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){ //判断时间段
                return
            };
            if(API.CONFIG.auto_config && API.CONFIG.auto_config_url) get_config()
        }, 600e3);


        let get_Anchor_ignore_keyword = async function () {
            if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){ //判断时间段
                return
            };
            let keyword = []
            let unkeyword = []
            let get_gitee_ignore_keyword = async function () {
                if(API.CONFIG.gitee_url == '0' || !API.CONFIG.gitee_url)return API.chatLog(`【屏蔽词/房】无云数据地址！`,'warning');
                let gitee_ignore_keyword = await getMyJson(API.CONFIG.gitee_url);
                if(gitee_ignore_keyword[0]== undefined){
                    API.chatLog(`无云数据或获取异常！`,'warning');
                }else{
                    keyword = gitee_ignore_keyword
                    API.chatLog(`gitee_ignore_keyword：${keyword}`, 'success');
                }
            }
            let get_gitee_unignore_keyword = async function () {
                if(API.CONFIG.gitee_url2 == '0' || !API.CONFIG.gitee_url2)return API.chatLog(`【屏蔽词/房】无云数据地址！`,'warning');
                let gitee_unignore_keyword = await getMyJson(API.CONFIG.gitee_url2);
                if(gitee_unignore_keyword[0]== undefined){
                    API.chatLog(`无云数据或获取异常！`,'warning');
                }else{
                    unkeyword = gitee_unignore_keyword
                    API.chatLog(`get_gitee_unignore_keyword：${unkeyword}`, 'success');
                }
            }

            if(API.CONFIG.get_Anchor_ignore_keyword_switch2 || API.CONFIG.get_Anchor_ignore_keyword_switch1)await get_gitee_ignore_keyword()
            if(API.CONFIG.get_Anchor_unignore_keyword_switch2 || API.CONFIG.get_Anchor_unignore_keyword_switch1)await get_gitee_unignore_keyword()

            if(API.CONFIG.get_Anchor_unignore_keyword_switch2){
                API.CONFIG.Anchor_unignore_keyword = []
            }
            for(let i = 0; i < unkeyword.length; i++){ //去重、分类、去空格、去空、转小写
                if(unkeyword[i] == '')continue
                if(API.CONFIG.Anchor_unignore_keyword.indexOf(unkeyword[i].replaceAll(' ', '').toLowerCase()) == -1 && isNaN(Number(unkeyword[i])) && Number(unkeyword[i])!=0){ //非数字则为屏蔽词
                    API.CONFIG.Anchor_unignore_keyword.push(unkeyword[i].replaceAll(' ', '').toLowerCase())
                }
            }
            let word = []
            for(let i = 0; i < API.CONFIG.Anchor_unignore_keyword.length; i++){//本地去重、去空格、去空、转小写
                if(API.CONFIG.Anchor_unignore_keyword[i] == '')continue
                if(word.indexOf(API.CONFIG.Anchor_unignore_keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && API.CONFIG.Anchor_unignore_keyword[i] && Number(API.CONFIG.Anchor_unignore_keyword[i]) != 0){
                    word.push(API.CONFIG.Anchor_unignore_keyword[i].replaceAll(' ', '').toLowerCase())
                }
            }
            API.CONFIG.Anchor_unignore_keyword = word
            if(API.CONFIG.get_Anchor_unignore_keyword_switch2 || API.CONFIG.get_Anchor_unignore_keyword_switch1)API.chatLog(`从云数据更新正则关键词：${API.CONFIG.Anchor_unignore_keyword}`, 'success');

            if(API.CONFIG.get_Anchor_ignore_keyword_switch2){
                API.CONFIG.Anchor_ignore_keyword = []
                API.CONFIG.Anchor_ignore_room = []
            }
            for(let i = 0; i < keyword.length; i++){ //去重、分类、去空格、去空、转小写
                if(keyword[i] == '')continue
                if(API.CONFIG.Anchor_ignore_keyword.indexOf(keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && isNaN(Number(keyword[i])) && Number(keyword[i])!=0){ //非数字则为屏蔽词
                    API.CONFIG.Anchor_ignore_keyword.push(keyword[i].replaceAll(' ', '').toLowerCase())
                }
                if(!isNaN(Number(keyword[i])) && API.CONFIG.Anchor_ignore_room.indexOf(Number(keyword[i])) == -1 && Number(keyword[i])!=0){ //数字则为屏蔽房
                    API.CONFIG.Anchor_ignore_room.push(Number(keyword[i]))
                }
            }
            if(API.CONFIG.Anchor_ignore_keyword.length > 1 && API.CONFIG.Anchor_ignore_keyword.indexOf('不会吧不会吧居然真有人什么都不过滤') > -1){ //去掉默认值
                API.CONFIG.Anchor_ignore_keyword.splice(API.CONFIG.Anchor_ignore_keyword.indexOf('不会吧不会吧居然真有人什么都不过滤'), 1);
            }
            if(API.CONFIG.Anchor_ignore_room.length > 1 && API.CONFIG.Anchor_ignore_room.indexOf(1234567890) > -1){ //去掉默认值
                API.CONFIG.Anchor_ignore_room.splice(API.CONFIG.Anchor_ignore_room.indexOf(1234567890), 1);
            }
            word = []
            for(let i = 0; i < API.CONFIG.Anchor_ignore_keyword.length; i++){//本地去重、去空格、去空、转小写
                if(word[i] == '')continue
                if(word.indexOf(API.CONFIG.Anchor_ignore_keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && API.CONFIG.Anchor_ignore_keyword[i] && Number(API.CONFIG.Anchor_ignore_keyword[i]) != 0){
                    word.push(API.CONFIG.Anchor_ignore_keyword[i].replaceAll(' ', '').toLowerCase())
                }
            }
            API.CONFIG.Anchor_ignore_keyword = word
            word = []
            for(let i = 0; i < API.CONFIG.Anchor_ignore_room.length; i++){//本地去重、去空格、去空
                if(word.indexOf(Number(API.CONFIG.Anchor_ignore_room[i])) == -1 && API.CONFIG.Anchor_ignore_room[i] && Number(API.CONFIG.Anchor_ignore_room[i]) != 0){
                    word.push(Number(API.CONFIG.Anchor_ignore_room[i]))
                }
            }
            API.CONFIG.Anchor_ignore_room = word
            API.saveConfig();
            if(API.CONFIG.get_Anchor_ignore_keyword_switch2 || API.CONFIG.get_Anchor_ignore_keyword_switch1)API.chatLog(`从云数据更新屏蔽词：${API.CONFIG.Anchor_ignore_keyword}`, 'success');
            if(API.CONFIG.get_Anchor_ignore_keyword_switch2 || API.CONFIG.get_Anchor_ignore_keyword_switch1)API.chatLog(`从云数据更新屏蔽房：${API.CONFIG.Anchor_ignore_room}`, 'success');
            for(let i = 0; i < word.length; i++){//屏蔽房间取关
                let num = API.CONFIG.room_ruid.indexOf(word[i])
                if(num == -1){
                    await BAPI.live_user.get_anchor_in_room(word[i]).then(async(da) => {
                        if(da.code==0 && da.data.info !== undefined){
                            let anchor_uid = da.data.info.uid;
                            API.CONFIG.room_ruid.push(word[i])
                            API.CONFIG.room_ruid.push(anchor_uid)
                        }else{
                            API.chatLog(`【屏蔽词/房】直播间房间号：${word[i]}可能不存在！`, 'warning');
                        }
                    }, () => {
                        console.log('await error')
                        return API.chatLog(`【屏蔽词/房】直播间用户UID获取失败！`, 'warning');
                    })
                }
                if(num > -1 && API.CONFIG.ALLFollowingList.indexOf(API.CONFIG.room_ruid[num+1]) > -1){
                    await BAPI.modify(API.CONFIG.room_ruid[num+1], 2).then(async function(data){
                        if(data.code==0){
                            API.chatLog(`【屏蔽房】屏蔽房取关成功：${word[i]}`, 'success');
                        }else{
                            API.chatLog(`【屏蔽房】回传信息：${data.message}`, 'warning');
                        }
                    }, () => {
                        console.log('await error')
                        return API.chatLog(`【屏蔽房】屏蔽房取关失败！`, 'warning');
                    })
                    await sleep(2000)
                }
            }
        }

        setTimeout(async() => {
            get_Anchor_ignore_keyword()
        }, 20e3);
        setInterval(async() => {
            get_Anchor_ignore_keyword()
        }, 600e3);


        let check_id_list = []//防止同一轮重复检查ID
        let check_roomid_list = []//防止同一轮重复检查roomid
        let do_lottery = async function () {
            if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){ //判断时间段
                API.chatLog(`抽奖休眠中！`, 'warning')
                await sleep(600 * 1000)
                setTimeout(async() => do_lottery(), API.CONFIG.AnchorserverFLASH * 1000);
                return
            };
            if(popularity_red_pocket_join_num_max)API.chatLog(`【直播间电池道具】今日已达到上限！`, 'warning')
            if(popularity_red_pocket_do_mark)API.chatLog(`【道具红包抽奖】当前有红包抽奖正在进行，请勿刷新！`, 'warning');

            check_id_list = []
            check_roomid_list = []
            if(qun_server[0] != undefined)await check_data_from_server(qun_server[0],qun_server[3])
            API.CONFIG.do_lottery_ts = (ts_ms()+ms_diff)
            setTimeout(async() => do_lottery(), API.CONFIG.AnchorserverFLASH * 1000);
        }
        setTimeout(async() => do_lottery(), API.CONFIG.AnchorserverFLASH * 1000);

        let check_data_from_server = async function(url,key){//获取服务器数据
            if(!API.CONFIG.get_data_from_server)return
            //获取服务器数据
            if(url == undefined)return
            await get_data_from_server(url,key).then(async(data) => {
                if(data == undefined ){
                    return API.chatLog(`服务器获取数据失败！`, 'warning');
                }
                //API.chatLog(`成功获取服务器数据！`,'success');
                if(data.length==0 || data[0].id == undefined || data[0].room_id == undefined) return

                let type_num = 0
                for(let i=0;i<data.length;i++){
                    if(data[i].data.indexOf('type') > -1) type_num++
                }
                console.log('服务器数据',type_num)
                if(type_num > 20){//抽奖数据多，过滤加强，对间隔抽奖有效
                    need_pass = true
                }else{
                    need_pass = false
                }
                shuffle(data)
                for(let i=0;i<data.length;i++){
                    if(data[i].id == 1)continue
                    if(data[i].id == 999999999999){
                        let list = JSON.parse(data[i].data)
                        for(let i=0;i<list.length;i++){
                            if(API.CONFIG.qqawardlist.indexOf(list[i])==-1){
                                API.CONFIG.qqawardlist.unshift(list[i])
                            }
                        }
                        if(API.CONFIG.qqawardlist.length > 200){
                            API.CONFIG.qqawardlist.splice(100, 200);
                        }
                        API.saveConfig();
                    }
                    if(API.CONFIG.storm_done_id_list.indexOf(data[i].id) > -1)continue
                    if(API.CONFIG.done_id_list.indexOf(data[i].id) > -1)continue
                    if(API.CONFIG.popularity_red_pocket_done_id_list.indexOf(data[i].id) > -1)continue
                    if(API.CONFIG.Anchor_ignore_room.indexOf(data[i].room_id) > -1)continue
                    if(data[i].data.length>300)continue
                    if(data[i].data.indexOf('type') == -1)continue
                    if(check_id_list.indexOf(data[i].id) > -1)continue
                    if(check_roomid_list.indexOf(data[i].room_id) > -1)continue
                    if(data[i].data.indexOf('storm') > -1 || data[i].data.indexOf('popularity_red_pocket') > -1 || data[i].data.indexOf('anchor') > -1){
                        let roomlist_data = JSON.parse(data[i].data)
                        if(roomlist_data.type == undefined)continue
                        if(roomlist_data.type != undefined){
                            check_id_list.push(data[i].id)
                            check_roomid_list.push(data[i].room_id)
                            await getLotteryInfoWeb(data[i].room_id, false, data[i].id)
                            //console.log('服务器数据go getLotteryInfoWeb',data[i].room_id)
                            await sleep(1000)
                        }
                    }
                }
                //获取服务器数据
            }, () => {
                return console.log('await error')
            })
        }
    }

    var turn_time = function(nowTime){
        let thisTime = nowTime;
        thisTime = thisTime.replace(/-/g, '/');
        let time = new Date(thisTime);
        time = time.getTime();
        return time;
    }
    var moneyCheck = async function(award_name){
        const name = award_name.replaceAll(' ', '').toLowerCase(); // 去空格+转小写
        const ignorenameList = ['铁三角'];//特殊名称的物品
        for(const i of ignorenameList){
            if(name.indexOf(i) > -1)
                return [false]
        }
        let numberArray = name.match(/\d+(\.\d+)?/g); // 提取阿拉伯数字
        let chineseNumberArray = name.match(/([一壹二贰两三叁四肆五伍六陆七柒八捌九玖][千仟]零?[一壹二贰两三叁四肆五伍六陆七柒八捌九玖]?[百佰]?[一壹二贰三叁四肆五伍六陆七柒八捌九玖]?[十拾]?[一壹二贰三叁四肆五伍六陆七柒八捌九玖]?)|([一壹二贰两三叁四肆五伍六陆七柒八捌九玖][百佰][一壹二贰三叁四肆五伍六陆七柒八捌九玖]?[十拾]?[一壹二贰三叁四肆五伍六陆七柒八捌九玖]?)|([一壹二贰三叁四肆五伍六陆七柒八捌九玖]?[十拾][一壹二贰三叁四肆五伍六陆七柒八捌九玖]?)|[一壹二贰两三叁四肆五伍六陆七柒八捌九玖十拾]/g); // 提取汉字数字
        const chnNumChar = {"零": 0,"一": 1,"壹": 1,"二": 2,"贰": 2,"两": 2,"三": 3,"叁": 3,"四": 4,"肆": 4,"五": 5,"伍": 5,"六": 6,"陆": 6,"七": 7,"柒": 7,"八": 8,"捌": 8,"九": 9,"玖": 9},
            chnNameValue = {"十": {value: 10,secUnit: false},"拾": {value: 10,secUnit: false},"百": {value: 100,secUnit: false},"佰": {value: 100,secUnit: false},"千": {value: 1e3,secUnit: false},"仟": {value: 1e3,secUnit: false},"万": {value: 1e4,secUnit: true},"亿": {value: 1e8,secUnit: true}};
        if(chineseNumberArray !== null && numberArray === null){ // 只提取出汉字数字
            return chineseFunc();
        }else if(chineseNumberArray === null && numberArray !== null){ // 只提取出阿拉伯数字
            return arabicNumberFunc();
        }else if(chineseNumberArray !== null && numberArray !== null){ // 都提取出来了
            let arr = arabicNumberFunc();
            if(arr[0])
                return arr; // 数组第一项为true则识别成功
            else
                return chineseFunc()
        }else{ // 都没提取出来
            return [false]
        }
        function chineseFunc(){
            // 把匹配到的数字由长到段重新排列
            let chineseNumIndexList = [];
            chineseNumberArray.sort(function(a, b){
                return b.length - a.length;
            });
            for(const n of chineseNumberArray){
                chineseNumIndexList.push(getIndex(name, n, chineseNumIndexList));
            }
            for(let n = 0; n < chineseNumberArray.length; n++){
                const chineseNum = chineseNumberArray[n]; // 中文数字
                if(chineseNum !== undefined){
                    const num = ChineseToNumber(chineseNum); // 阿拉伯数字
                    const ChineseNumberIndex = chineseNumIndexList[n], // 中文数字下表
                        ChineseNumLength = chineseNum.length, // 中文数字长度
                        nextChineseNumIndex = chineseNumIndexList[n + 1]; // 下一个数字下标
                    const unitIndex = ChineseNumberIndex + ChineseNumLength; // 数字后一个中文数字的下标 可能为undefined
                    let strAfterNum = ''; // 数字后面的字符串
                    if(unitIndex < nextChineseNumIndex){
                        // 如果下一个数字的起始位置不在当前数字所占范围内
                        for(let i = unitIndex; i < name.length; i++){
                            if(nextChineseNumIndex !== undefined){
                                if(i < nextChineseNumIndex) // 不能把下一个数字取进去
                                    strAfterNum = strAfterNum + name[i];
                                else
                                    break;
                            }else{
                                strAfterNum = strAfterNum + name[i];
                            }
                        }
                    }else{
                        strAfterNum = name.slice(unitIndex, name.length);
                    }
                    let finalMoney = getPrice(num, strAfterNum);
                    if(finalMoney === undefined){
                        if(n === chineseNumberArray.length - 1)
                            return [false];
                        else
                            continue;
                    }else
                        return [true, finalMoney];
                }
            }
        }
        function arabicNumberFunc(){
            // 把匹配到的数字由长到段重新排列
            let numIndexList = [];
            numberArray.sort(function(a, b){
                return b.length - a.length;
            });
            for(const n of numberArray){ //每个数字在name中的下标
                numIndexList.push(getIndex(name, n, numIndexList));
            }
            for(let n = 0; n < numberArray.length; n++){
                const num = numberArray[n]; // 数字
                const numberIndex = name.indexOf(num), // 数字下表
                    numLength = num.length, // 数字长度
                    nextNumIndex = numIndexList[n + 1]; // 下一个数字下标
                const unitIndex = numberIndex + numLength; // 数字后一个字符的下标 可能为undefined
                let strAfterNum = ''; // 数字后面的字符串
                if(unitIndex < nextNumIndex){
                    // 如果下一个数字的起始位置不在当前数字所占范围内
                    for(let i = unitIndex; i < name.length; i++){
                        if(nextNumIndex !== undefined){
                            if(i < nextNumIndex) // 不能把下一个数字取进去
                                strAfterNum = strAfterNum + name[i];
                            else
                                break;
                        }else{
                            strAfterNum = strAfterNum + name[i];
                        }
                    }
                }else{
                    strAfterNum = name.slice(unitIndex, name.length);
                }
                console.log(num, strAfterNum)
                let finalMoney = getPrice(num, strAfterNum);
                if(finalMoney === undefined){ // 识别失败
                    if(n === numberArray.length - 1)
                        return [false];
                    else
                        continue;
                }else
                    return [true, finalMoney]
            }
        }
        function getPrice(num, strAfterNum){
            const yuan = ['元', 'r', '块','￥'], // 1
                yuanWords = ['rmb', 'cny', '人民币', '软妹币', '微信红包', '红包', 'qq红包', '现金', 'qb','圆','园','y','q币'], // 1
                dime = ['毛', '角'], // 0.1
                dimeWords = ['电池'], // 0.1
                penny = ['分'], // 0.01
                milliWords = ['金瓜子']; // 0.001
            let finalMoney = undefined; // 单位：元
            const number = Number(num);
            for(const w of yuanWords){
                if(strAfterNum.indexOf(w) > -1){
                    finalMoney = number;
                    break;
                }
            }
            for(const w of dimeWords){
                if(strAfterNum.indexOf(w) > -1){
                    finalMoney = number * 0.1;
                    break;
                }
            }
            for(const w of milliWords){
                if(strAfterNum.indexOf(w) > -1){
                    finalMoney = number * 0.001;
                    break;
                }
            }
            for(let kk =0;kk<3;kk++){
                if(finalMoney === undefined){
                    if(yuan.indexOf(strAfterNum[kk]) > -1){
                        finalMoney = number
                    }else if(dime.indexOf(strAfterNum[kk]) > -1){
                        finalMoney = number * 0.1;
                    }else if(penny.indexOf(strAfterNum[kk]) > -1){
                        // 排除特殊奖品名
                        const ignoreList = ['分钟'];
                        for(const i of ignoreList){
                            if(strAfterNum.indexOf(i) > -1)
                                return undefined
                        }
                        finalMoney = number * 0.01;
                    }
                }else{
                    break
                }
            }
            return finalMoney;
        }
        function ChineseToNumber(chnStr){
            let chineseStr = chnStr[0] === '十' ? "一" + chnStr : chnStr;
            let rtn = 0,
                section = 0,
                number = 0,
                secUnit = false,
                str = chineseStr.split('');
            for(let i = 0; i < str.length; i++){
                let num = chnNumChar[str[i]];
                if(typeof num !== 'undefined'){
                    number = num;
                    if(i === str.length - 1){
                        section += number;
                    }
                }else{
                    if(!chnNameValue.hasOwnProperty(str[i]))
                        return undefined;
                    let unit = chnNameValue[str[i]].value;
                    secUnit = chnNameValue[str[i]].secUnit;
                    if(secUnit){
                        section = (section + number) * unit;
                        rtn += section;
                        section = 0;
                    }else{
                        section += (number * unit);
                    }
                    number = 0;
                }
            }
            return rtn + section;
        };
        /**
         * 获取下标，可处理部分特殊情况，如
         * 100金瓜子1个
         * 1份100金瓜子1个
         * @param str 字符串
         * @param num 被搜索的数字
         * @param array 储存已搜索到的数字的下标的数组
         * @param start 搜索数字的开始下标，初始为0，为了防止重复搜索字符串中的一个子串
         * @param arrStart 搜索数组的开始下标，初始为0，为了防止重复搜索数组中的某一项
         * @returns {number} index
         */
        function getIndex(str, num, array, start = 0, arrStart = 0){
            let index = str.indexOf(num, start),
                arrayIndex = array.indexOf(index, arrStart);
            if(arrayIndex > -1)
                return getIndex(str, num, array, index + 1, arrayIndex + 1);
            else
                return index
        }
    }
    function getUrlParam(name){
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if(r != null)
            return unescape(r[2]);
        return null;
    }

    /**
     * （2,10） 当前是否在两点到十点之间
     * @param a 整数 起始时间
     * @param b 整数 终止时间
     * @returns {boolean}
     */
    function inTimeArea(a, b){
        if(a > 23 || b > 24 || a < 0 || b < 0){
            //console.log('错误时间段');
            return false
        }
        let myDate = new Date();
        let h = myDate.getHours();
        if(a==b)return true
        if(a>b){
            return h >= a && h < 23 || h >= 0 && h < b
        }
        return h >= a && h < b
    }

    /**
     * 概率
     * @param val
     * @returns {boolean}
     */
    function probability(val){
        if(val <= 0)
            return false;
        let rad = Math.ceil(Math.random() * 100);
        return val >= rad
    }

    const dateNow = () => Date.now();

    /**
     * 检查是否为新一天
     * @param ts
     * @returns {boolean}
     */
    const checkNewDay = (ts) => {
        if(ts === 0)
            return true;
        let t = new Date(ts);
        let d = new Date();
        let td = t.getDate();
        let dd = d.getDate();
        return (dd !== td);
    }
    const get_BKL_num_bagid = async() => {//返回免费灯牌、bagid
        let BKL_num = 0
        let bagid = 0
        await BAPI.gift.bag_list().then(function(bagResult){
            for(let i=0;i<bagResult.data.list.length;i++){
                if(bagResult.data.list[i].gift_id === 31738){
                    BKL_num=bagResult.data.list[i].gift_num
                    bagid=bagResult.data.list[i].bag_id
                }
            }
        }, () => {
            return console.log('await error')
        })
        return [BKL_num,bagid]
    }

    function pushplus(id, text){
        return new Promise((resolve) => {
            let msg = encodeURI(text)
            let head = encodeURI('PUSHPLUS推送通知！')
            GM_xmlhttpRequest({
                method: 'POST',
                url: `http://www.pushplus.plus/send?token=${id}&title=${head}&content=${msg}&template=html`,
                onload: function(response){
                    const res = JSON.parse(response.response);
                    resolve(res);
                }
            })
        })
    }

    function pushmsg(id, text){
        return new Promise((resolve) => {
            let msg = encodeURI(text)
            let head = encodeURI('PUSH即时达推送通知！')
            GM_xmlhttpRequest({
                method: 'POST',
                url: `http://push.ijingniu.cn/send?key=${id}&head=${head}&body=${msg}`,
                onload: function(response){
                    const res = JSON.parse(response.response);
                    resolve(res);
                }
            })
        })
    }

    function ServerChan2(id, text){
        return new Promise((resolve) => {
            let msg = encodeURI(text)
            let head = encodeURI('ServerChan推送通知！')
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://sctapi.ftqq.com/${id}.send?text=${head}&desp=${msg}`,
                onload: function(response){
                    const res = JSON.parse(response.response);
                    resolve(res);
                }
            })
        })
    }
    /**
     * 获取msg[dev_id]
     * @param name
     * @returns {String} dev_id
     */
    function getMsgDevId(name = NAME){
        let deviceid = window.localStorage.getItem("im_deviceid_".concat(name));
        if(!name || !deviceid){
            let str = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(name){
                let randomInt = 16 * Math.random() | 0;
                return ("x" === name ? randomInt : 3 & randomInt | 8).toString(16).toUpperCase()
            }));
            return function(name, randomInt){
                Object.keys(localStorage).forEach((function(name){
                    name.match(/^im_deviceid_/) && window.localStorage.removeItem(name)
                })),
                    window.localStorage.setItem("im_deviceid_".concat(randomInt), name)
            }
            (str, name),
                str
        }
        return deviceid
    };

    function READ(text){
        var sound = window.speechSynthesis;
        var read_text = new SpeechSynthesisUtterance(text);
        sound.speak(read_text);
    };
    /**
     * 保存文件到本地
     * @param fileName 文件名
     * @param fileContent 文件内容
     */
    function downFile(fileName, fileContent){
        let elementA = document.createElement("a");
        elementA.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + JSON.stringify(fileContent));
        elementA.setAttribute("download", fileName);
        elementA.style.display = "none";
        document.body.appendChild(elementA);
        elementA.click();
        document.body.removeChild(elementA);
    }
    /**
     * 导出配置文件
     * @param MY_API MY_API
     * @param nosleepConfig noSleep
     * @param INVISIBLE_ENTER_config invisibleEnter
     */
    function exportConfig(MY_API){
        return downFile('ZDBGJ_CONFIG.json', MY_API);
    }
    /**
     * 导入配置文件
     */
    function qq(qq, text,ip='127.0.0.1',ac=''){
        return new Promise((resolve) => {
            let url
            if(ip.indexOf(':')>-1 || ip.indexOf('：')>-1){
                url = ip.replaceAll(' ', '').replaceAll('：', ':')
            }else{
                url = ip + ':80'
            }
            let msg =  encodeURIComponent(text)
            GM_xmlhttpRequest({
                method: 'get',
                url: `http://${url}/send_private_msg?user_id=${qq}&message=${msg}&access_token=${ac}`,
                onload: function(response){
                    const res = JSON.parse(response.response);
                    resolve(res);
                }
            })
        })
    }
    function qqqun(qqqun, text,ip='127.0.0.1',ac=''){
        return new Promise((resolve) => {
            let url
            if(ip.indexOf(':')>-1 || ip.indexOf('：')>-1){
                url = ip.replaceAll(' ', '').replaceAll('：', ':')
            }else{
                url = ip + ':80'
            }
            let msg = encodeURIComponent(text)
            GM_xmlhttpRequest({
                method: 'get',
                url: `http://${url}/send_group_msg?group_id=${qqqun}&message=${msg}&access_token=${ac}`,
                onload: function(response){
                    const res = JSON.parse(response.response);
                    resolve(res);
                }
            })
        })
    }
    function post_data_to_server(da,url){
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                headers:{"Content-Type": "application/json","Connection":"close"},
                url: `http://${url}:${port}/sync/input/`,
                data:JSON.stringify(da),
                onload: function(response){
                    const res = JSON.parse(response.response);
                    resolve(res);
                }
            })
        })
    }
    function get_data_from_server(url,key=''){
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'get',
                headers:{"Content-Type": "application/json","Connection":"close"},
                url: `http://${url}:${port}/sync/get_users/${key}`,
                onload: function(response){
                    const res = JSON.parse(response.response);
                    resolve(res);
                },
                onerror: function(err){
                    resolve(undefined);
                }
            })
        })
    }
    function tip(message){
        GM_notification({
            title:'中奖通知',
            text: message,
            image:'https://i0.hdslb.com/bfs/article/927cc195124c47474b4a150d8b09e00536d15a0a.gif',
            timeout: 10000,
        })
    }
    /**
     * SeaLoong BilibiliAPI https://github.com/SeaLoong/BLRHH
     */
    function getvisit_id(name = NAME) {
        let str = "xxxxxxxxxxxx".replace(/[x]/g, (function (name) {
            let randomInt = 16 * Math.random() | 0;
            return ("x" === name ? randomInt : 3 & randomInt | 8).toString(16).toLowerCase()
        }))
        return str
    }
    function getPictureHashKey(i) {
        const V = [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52]
            , N = [];
        return V.forEach(U=>{
                i.charAt(U) && N.push(i.charAt(U))
            }
        ),
            N.join("").slice(0, 32)
    }
    async function get_h5_w_rid(w_aid,ftime,stime,wts) {
        const N = Live_info.img_key
        const U = Live_info.sub_key
        const R = getPictureHashKey(N + U)
        const Q = `w_aid=${w_aid}&w_ftime=${ftime}&w_part=1&w_stime=${stime}&w_type=3&web_location=1315873&wts=${wts}${R}`
        var w_rid = CryptoJS.MD5(Q).toString()
        return w_rid
    }
    async function get_w_rid(w_aid,w_dt,w_last_play_progress_time,w_mid,w_played_time,w_real_played_time,w_realtime,w_start_ts,w_video_duration,web_location,wts) {
        const N = Live_info.img_key
        const U = Live_info.sub_key
        const R = getPictureHashKey(N + U)
        const Q = `w_aid=${w_aid}&w_dt=${w_dt}&w_last_play_progress_time=${w_last_play_progress_time}&w_mid=${w_mid}&w_played_time=${w_played_time}&w_real_played_time=${w_real_played_time}&w_realtime=${w_realtime}&w_start_ts=${w_start_ts}&w_video_duration=${w_video_duration}&web_location=${web_location}&wts=${wts}${R}`
        var w_rid = CryptoJS.MD5(Q).toString()
        return w_rid
    }
    let get_bv_session = async function(bvid){//提取视频session
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.bilibili.com/video/${bvid}`,
                dataType: "html",
                onload: function(response){
                    let hh = response.response
                    let num = hh.indexOf(`,"session":"`)
                    let session = hh.substr(num+12,32)
                    //console.log('get_bv_session',session)
                    resolve(session)
                }
            })
        })
    }
    let get_img_key_sub_key = async function(){//提取视频session
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.bilibili.com/x/web-interface/nav",
                onload: function(response){
                    let res = JSON.parse(response.response);
                    if(res.code == 0){
                        let img_url = res.data.wbi_img.img_url
                        let sub_url = res.data.wbi_img.sub_url
                        let img_key = img_url.slice(img_url.lastIndexOf('/') + 1,img_url.lastIndexOf('.'))
                        let sub_key = sub_url.slice(sub_url.lastIndexOf('/') + 1,sub_url.lastIndexOf('.'))
                        Live_info.img_key = img_key
                        Live_info.sub_key = sub_key
                        resolve([img_key,sub_key])
                    }else{
                        resolve([])
                    }
                }
            });
        });
    }
    let view_bvid = function(bvid){
        let formData = new FormData();
        formData.set("bvid", bvid)
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
                headers: {
                    "User-Agent": "Mozilla/5.0 BiliDroid/6.79.0 (bbcallen@gmail.com) os/android model/Redmi K30 Pro mobi_app/android build/6790300 channel/360 innerVer/6790310 osVer/11 network/2",
                    "origin": "https://www.bilibili.com",
                    "referer": `https://www.bilibili.com/video/${bvid}/`
                },
                onload: function(response){
                    let res = JSON.parse(response.response);
                    resolve(res)
                }
            });
        });
    }
    let h5_new = async function(aid, cid, bvid){
        let session = await get_bv_session(bvid)
        let stime = ts_s() + s_diff
        let ftime = ts_s()
        let wts = ftime
        let w_rid = await get_h5_w_rid(aid,ftime,stime,wts)
        let param = `w_aid=${aid}&w_part=1&w_ftime=${ftime}&w_stime=${stime}&w_type=3&web_location=1315873&w_rid=${w_rid}&wts=${wts}`
        let formData = new FormData();
        formData.set("mid", Live_info.uid)
        formData.set("aid", aid)
        formData.set("cid", cid)
        formData.set("part", 1)
        formData.set("lv", Live_info.Blever)
        formData.set("ftime", ftime)
        formData.set("stime", stime)
        formData.set("type", 3)
        formData.set("sub_type",0)
        formData.set("refer_url", "https://t.bilibili.com/?tab=video")
        formData.set("spmid", "333.788.0.0")
        formData.set("from_spmid", "")
        formData.set("csrf", Live_info.csrf_token)
        formData.set("outer", 0)
        formData.set("session", session)
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.bilibili.com/x/click-interface/click/web/h5?" + param,
            data: formData,
            headers: {
                "User-Agent": "Mozilla/5.0 BiliDroid/6.79.0 (bbcallen@gmail.com) os/android model/Redmi K30 Pro mobi_app/android build/6790300 channel/360 innerVer/6790310 osVer/11 network/2",
                "origin": "https://www.bilibili.com",
                "referer": `https://www.bilibili.com/video/${bvid}/`
            },
            onload: function(response){
                let res = JSON.parse(response.response);
                //console.log(res)
            }
        });
    }
    let h5_old = function(aid, cid, bvid){
        let stime = ts_s() + s_diff
        let ftime = ts_s()
        let formData = new FormData();
        formData.set("mid", Live_info.uid)
        formData.set("aid", aid)
        formData.set("cid", cid)
        formData.set("part", 1)
        formData.set("lv", Live_info.Blever)
        formData.set("ftime", ftime)
        formData.set("stime", stime)
        formData.set("type", 3)
        formData.set("sub_type",0)
        formData.set("refer_url", "https://t.bilibili.com/?tab=video")
        formData.set("spmid", "333.788.0.0")
        formData.set("from_spmid", "")
        formData.set("csrf", Live_info.csrf_token)
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.bilibili.com/x/click-interface/click/web/h5",
            data: formData,
            headers: {
                "User-Agent": "Mozilla/5.0 BiliDroid/6.79.0 (bbcallen@gmail.com) os/android model/Redmi K30 Pro mobi_app/android build/6790300 channel/360 innerVer/6790310 osVer/11 network/2",
                "origin": "https://www.bilibili.com",
                "referer": `https://www.bilibili.com/video/${bvid}/`
            },
            onload: function(response){
                let res = JSON.parse(response.response);
                //console.log(res)
            }
        });
    }
    var getMedalList = async function (page = 1) { //粉丝勋章数据
        if (page == 1)medal_list_now = [];
        await sleep(2000)
        return BilibiliAPI.fansMedal_panel(page).then((data) => {
            console.log('勋章数据', data);
            medal_list_now = medal_list_now.concat(data.data.list);
            if(data.data.special_list.length)medal_list_now = medal_list_now.concat(data.data.special_list);
            window.toast(`正在获取勋章数据：已获取${medal_list_now.length}个`,'success');
            if (data.data.page_info.current_page < data.data.page_info.total_page)return getMedalList(page + 1);
        }, () => {
            return delayCall(() => getMedalList());
        });
    };
    let csrf_token
    let mm = year() + month();
    if(month() < 10) mm = year()+'0'+month();
    var BilibiliAPI = {
        setCommonArgs: (csrfToken = '', visitId = '') => {
            csrf_token = csrfToken;
        },
        runUntilSucceed: (callback, delay = 0, period = 50) => {
            setTimeout(() => {
                if(!callback())
                    BilibiliAPI.runUntilSucceed(callback, period, period);
            }, delay);
        },
        processing: 0,
        ajax: (settings) => {
            if(settings.xhrFields === undefined)
                settings.xhrFields = {};
            settings.xhrFields.withCredentials = true;
            jQuery.extend(settings, {
                url: (settings.url.substr(0, 2) === '//' ? '' : '//api.live.bilibili.com/') + settings.url,
                method: settings.method || 'GET',
                crossDomain: true,
                dataType: settings.dataType || 'json'
            });
            const p = jQuery.Deferred();
            BilibiliAPI.runUntilSucceed(() => {
                if(BilibiliAPI.processing > 8)
                    return false;
                ++BilibiliAPI.processing;
                return jQuery.ajax(settings).then((arg1, arg2, arg3) => {
                    --BilibiliAPI.processing;
                    p.resolve(arg1, arg2, arg3);
                    return true;
                }, (arg1, arg2, arg3) => {
                    --BilibiliAPI.processing;
                    p.reject(arg1, arg2, arg3);
                    return true;
                });
            });
            return p;
        },
        ajaxWithCommonArgs: (settings) => {
            if(!settings.data)
                settings.data = {};
            settings.data.csrf = csrf_token;
            settings.data.csrf_token = csrf_token;
            settings.data.visit_id = '';
            return BilibiliAPI.ajax(settings);
        },
        // 整合常用API
        calendar: () => {
            return BilibiliAPI.ajax({
                url: "//member.bilibili.com/x2/creative/h5/calendar/card?ts=0",
                method: "GET",
            })
        },
        fansMedal_panel: (page,pageSize=50) => {//获取全部勋章数据
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/panel",
                method: "GET",
                data:{
                    page:page,
                    page_size:pageSize
                }
            })
        },
        fans_medal_info: (ruid) => {
            return BilibiliAPI.ajax({
                url: `//api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/fans_medal_info?target_id=${ruid}`,
                method: "GET",
            })
        },
        experience_add: () => {//大会员经验包
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/vip/experience/add",
                method: "POST",
                data:{
                    csrf: csrf_token
                }
            })
        },
        history_aid_delete: (aid) => {//视频观看信息删除
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/v2/history/delete",
                method: "POST",
                data:{
                    kid: "archive_"+ aid,
                    jsonp: "jsonp",
                    csrf: csrf_token
                }
            })
        },
        history_room_delete: (roomid) => {//直播观看信息删除
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/v2/history/delete",
                method: "POST",
                data:{
                    kid: "live_"+ roomid,
                    jsonp: "jsonp",
                    csrf: csrf_token
                }
            })
        },
        live_info:() => {//是否有直播间 无则是0
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/web-ucenter/user/live_info",
                method: "GET",
            })
        },
        shareConf:(room_id) => {//分享前置？
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/web-room/v1/index/shareConf",
                method: "GET",
                data:{
                    room_id: room_id,
                    platform: 'web'
                }
            })
        },
        GetAnchorTaskCenterReceiveReward:() => {//直播任务奖励
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/anchor-task-interface/api/v1/GetAnchorTaskCenterReceiveReward",
                method: "GET",
            })
        },
        GetUserTaskProgress:() => {//直播1电池
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/app-ucenter/v1/userTask/GetUserTaskProgress",
                method: "GET",
            })
        },
        score_task_sign:() => {//大会员积分签到
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/pgc/activity/score/task/sign",
                method: "POST",
                data:{
                    csrf: csrf_token,
                }
            })
        },
        vip_point_task_combine:() => {//大会员积分签到
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/vip_point/task/combine",
                method: "GET",
                data:{
                    csrf: csrf_token,
                }
            })
        },
        Storm: {
            check: (roomid) => {
                // 检查是否有节奏风暴
                return BilibiliAPI.ajax({
                    url: 'lottery/v1/Storm/check?roomid=' + roomid
                });
            },
            join: (id,roomid) => {
                // 参加节奏风暴
                return BilibiliAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'lottery/v1/Storm/join',
                    data: {
                        id: id,
                        color: 16777215,
                        captcha_token: '',
                        captcha_phrase: '',
                        roomid: roomid
                    }
                });
            }
        },
        likeReportV3: (roomid,ruid,click_time=300) => BAPI.ajaxWithCommonArgs({
            method: "POST",
            url: "//api.live.bilibili.com/xlive/app-ucenter/v1/like_info_v3/like/likeReportV3",
            data: {
                room_id: roomid,
                anchor_id: ruid,
                uid:Live_info.uid,
                click_time:click_time,
                ts: ts_s()
            }
        }),
        new_video_dynamic: () => {
            return BilibiliAPI.ajax({
                url: `//api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=video&page=1`,
                method: "GET",
            })
        },
        dyn:(dyn_id_str, contents=[{"raw_text": "转发动态","type": 1,"biz_id": ""}]) => {
            let data = {
                "dyn_req": {
                    "content": {
                        "contents":contents
                    },
                    "scene": 4,
                    "upload_id": Live_info.uid + "_" + ts_s() + "_" + Math.round(Math.random()*1000),
                    "meta": {
                        "app_meta": {
                            "from": "create.dynamic.web",
                            "mobi_app": "web"
                        }
                    }
                },
                "web_repost_src": {
                    "dyn_id_str": dyn_id_str
                }
            }
            let p = JSON.stringify(data)
            return BilibiliAPI.ajax({
                url: `//api.bilibili.com/x/dynamic/feed/create/dyn?csrf=${csrf_token}`,
                method: "POST",
                contentType: "application/json;charset-UTF-8",
                dataType: "json",
                data:p
            })
        },
        submit_check:(contents=[{"raw_text": "转发动态","type": 1,"biz_id": ""}]) => {
            let data = {
                "content": {
                    "contents": contents
                }
            }
            let p = JSON.stringify(data)
            return BilibiliAPI.ajax({
                url: `//api.bilibili.com/x/dynamic/feed/create/submit_check?csrf=${csrf_token}`,
                contentType: "application/json;charset-UTF-8",
                dataType: "json",
                method: "POST",
                data:p
            })
        },
        TrigerInteract:(roomid) => {//分享直播间
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/web-room/v1/index/TrigerInteract",
                method: "POST",
                data:{
                    roomid: roomid,
                    interact_type: 3,
                    csrf_token: csrf_token,
                    csrf: csrf_token,
                    visit_id:''
                }
            })
        },
        elec: (ruid,bp_num=5) => {//B币券充电
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/ugcpay/web/v2/trade/elec/pay/quick",
                method: "POST",
                data:{
                    bp_num:bp_num,
                    is_bp_remains_prior:true,
                    up_mid:ruid,
                    otype:'up',
                    oid:ruid,
                    csrf: csrf_token,
                }
            })
        },
        getWebArea_room_List: (parent_area_id,page) => {
            return BilibiliAPI.ajax({
                url: `//api.live.bilibili.com/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=${parent_area_id}&area_id=0&page=${page}`,
                method: "GET",
            })
        },
        now: () => {
            return BilibiliAPI.ajax({
                url: `//api.bilibili.com/x/report/click/now`,
                method: "GET",
            })
        },
        getWebAreaList: () => {
            return BilibiliAPI.ajax({
                url: `//api.live.bilibili.com/xlive/web-interface/v1/index/getWebAreaList?source_id=2`,
                method: "GET",
            })
        },
        getOnlineGoldRank: (ruid,room_id) => {
            return BilibiliAPI.ajax({
                url: `//api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=${ruid}&roomId=${room_id}&page=1&pageSize=50`,
                method: "GET",
            })
        },
        getConf: (room_id) => {
            return BilibiliAPI.ajax({
                url: `//api.live.bilibili.com/room/v1/Danmu/getConf?room_id=${room_id}&platform=pc&player=web`,
                method: "GET",
            })
        },
        cost: () => {//花费适用于10w以下
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/web-ucenter/v1/achievement/list?type=normal&status=0&category=all&keywords=&page=1&pageSize=100",
                method: "GET",
            })
        },
        ConfigPlugs: () => {//勋章显示设置获取
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/web-ucenter/v1/labs/ConfigPlugs",
                method: "GET",
            })
        },
        EditPlugs: () => {//个人空间关闭显示勋章墙
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/web-ucenter/v1/labs/EditPlugs",
                method: "POST",
                data:{
                    key: 'close_space_medal',
                    status: 1,//关闭
                    csrf_token: csrf_token,
                    csrf: csrf_token,
                    visit_id: '',
                }
            })
        },
        verify_room_pwd: (roomid) => {//加密
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/room/v1/Room/verify_room_pwd",
                method: "GET",
                data:{
                    room_id:roomid,
                }
            })
        },
        getLotteryInfoWeb: (roomid) => {//抽奖信息
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/lottery-interface/v1/lottery/getLotteryInfoWeb",
                method: "GET",
                data:{
                    roomid:roomid,
                }
            })
        },
        red_pocket_join: (id,roomid) => {//参加直播间红包
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/revenue/v1/red_pocket/join",
                method: "POST",
                data:{
                    roomId: roomid,
                    id: id,
                    uid: Live_info.uid,
                    spm_id:'444.8.red_envelope.extract',
                    jump_from: '',
                    session_id: '',
                    room_id: roomid,
                    csrf_token: csrf_token,
                    csrf: csrf_token,
                    visit_id: '',
                }
            })
        },
        myWallet: () => {//获取B币信息
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/revenue/v1/wallet/myWallet",
                method: "GET",
                data:{
                    need_bp:1,
                    need_metal:1,
                    platform:'pc',
                    bp_with_decimal:0,
                    ios_bp_afford_party:0,
                }
            })
        },
        createOrder: (pay_bp) => {//B币充值为金瓜子
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/revenue/v1/order/createOrder",
                method: "POST",
                data:{
                    platform: 'pc',
                    pay_bp: pay_bp,
                    context_id: 5440,
                    context_type: 1,
                    goods_id: 1,
                    goods_num: 5,
                    goods_type: 2,
                    ios_bp: 0,
                    common_bp: pay_bp,
                    csrf_token: csrf_token,
                    csrf: csrf_token,
                    visit_id: '',
                }
            })
        },
        gethistory_dm: (roomid) => {
            return BilibiliAPI.ajax({
                url: `//api.live.bilibili.com/xlive/web-room/v1/dM/gethistory?roomid=${roomid}`,
                method: "GET",
            })
        },
        vip_privilege: () => {//获取大会员福利信息
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/vip/privilege/my",
                method: "GET",
            })
        },
        get_vip_privilege: (type) => {//领取大会员福利//1B币 2会员购优惠券 3大会员专享漫画礼包
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/vip/privilege/receive",
                method: "POST",
                data:{
                    type: type,
                    csrf:csrf_token
                }
            })
        },
        history_cursor: () => {//获取历史信息
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/web-interface/history/cursor",
                method: "GET",
            })
        },
        view_bvid: (bvid) => {//获取bv信息
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/web-interface/view",
                method: "GET",
                data:{
                    bvid:bvid,
                }
            })
        },
        getWebAreaList: () => {
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/web-interface/v1/index/getWebAreaList",
                method: "GET",
                data:{
                    source_id:2,
                }
            })
        },
        fans_medal_info: async (ruid,rroom_id) => {
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/fans_medal_info",
                method: "GET",
                data:{
                    target_id:ruid,
                    room_id:rroom_id,
                    room_area_id:Live_info.room_area_id,
                    area_parent_id:Live_info.area_parent_id,
                    platform:'pc'
                }
            })
        },
        relation: (ruid) => {//关注类型0非关注
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/x/relation",
                method: "GET",
                data:{
                    fid:ruid,
                    jsonp:'jsonp',
                    callback:''
                }
            })
        },
        IsUserFollow: e => BAPI.ajax({//是否关注1关注0非关注
            url: "relation/v1/Feed/IsUserFollow?follow=" + e
        }),
        live_fans_medal: (page,pageSize) => {//获取全部勋章数据
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/app-ucenter/v1/user/GetMyMedals",
                method: "GET",
                data:{
                    page:page,
                    page_size:pageSize
                }
            })
        },
        rm_dynamic: (dynamic_id) => {//删除动态
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/rm_dynamic",
                method: "POST",
                data:{
                    dynamic_id:dynamic_id,
                    csrf_token: csrf_token,
                    csrf: csrf_token
                }
            })
        },
        msgfeed_reply: () => {//获取回复信息
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/msgfeed/reply",
                method: "GET",
                data:{
                    build: 0,
                    mobi_app: 'web',
                    platform: 'web',
                }
            })
        },
        msgfeed_at: () => {//获取@信息
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/msgfeed/at",
                method: "GET",
                data:{
                    build: 0,
                    mobi_app: 'web'
                }
            })
        },
        dynamic_postdiscuss: (discuss,oid,type) => { //动态发送评论
            if(oid == 0)return;
            return BilibiliAPI.ajax({
                method: 'POST',
                url: '//api.bilibili.com/x/v2/reply/add',
                data: {
                    oid: oid,
                    type: type,
                    message: discuss,
                    plat: 1,
                    ordering: 'time',
                    jsonp: 'jsonp',
                    csrf: csrf_token,
                }
            });
        },
        get_dynamic_detail: (dynamic_id) => {//获取动态详细
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail",
                method: "GET",
                data:{
                    dynamic_id:dynamic_id
                }
            })
        },
        space_article: (mid) => {//获取最新专栏投稿信息
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/space/article",
                method: "GET",
                data:{
                    mid:mid,
                    pn:1,
                    ps:12,
                    sort:'publish_time',
                    jsonp:'jsonp',
                }
            })
        },
        article_list: (id) => {//获取文集信息
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/article/list/web/articles",
                method: "GET",
                data:{
                    id:id,
                    jsonp:'jsonp',
                }
            })
        },
        article_recommends: () => {//获取最新专栏信息
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/article/recommends",
                method: "GET",
                data:{
                    aid:'',
                    cid:3,
                    pn:1,
                    ps:20,
                    jsonp:'jsonp',
                    sort:1
                }
            })
        },
        article_favorites_add: (oid,upid) => {//专栏收藏
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/article/favorites/add",
                method: "POST",
                data:{
                    id:oid,
                    csrf: csrf_token
                }
            })
        },
        article_coin_add: (oid,upid) => {//专栏投币
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/web-interface/coin/add",
                method: "POST",
                data:{
                    aid:oid,
                    upid: upid,
                    multiply: 1,
                    avtype: 2,
                    csrf: csrf_token
                }
            })
        },
        article_like: (oid) => {//专栏点赞
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/article/like",
                method: "POST",
                data:{
                    id:oid,
                    type: 1,
                    csrf: csrf_token
                }
            })
        },
        GetEmoticons: () => {//表情包信息
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/web-ucenter/v2/emoticon/GetEmoticons?platform=pc&room_id=25746928",
                method: "GET",
            })
        },
        get_user_info: () => {//用户信息
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/web-ucenter/user/get_user_info",
                method: "GET",
            })
        },
        nav: () => {//用户登陆信息等
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/web-interface/nav",
                method: "GET",
            })
        },
        DoSign: () => {//直播区签到 功能下线
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/xlive/web-ucenter/v1/sign/DoSign",
                method: "GET",
            })
        },
        dynamic_create:(content) => {//文字动态
            const extension = '{"emoji_type":1,"from":{"emoji_type":1},"flag_cfg":{}}'
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/create",
                method: "POST",
                data: {
                    dynamic_id: 0,
                    type: 4,
                    rid: 0,
                    content:content,
                    up_choose_comment: 0,
                    up_close_comment: 0,
                    extension: extension,
                    at_uids:'',
                    ctrl: [],
                    csrf_token: csrf_token,
                    csrf: csrf_token,
                }
            })
        },
        dynamic_like: (dynamic_id) => {
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/dynamic_like/v1/dynamic_like/thumb",
                method: "POST",
                data: {
                    uid:Live_info.uid,
                    dynamic_id:dynamic_id,
                    up: 1,
                    csrf_token: csrf_token,
                    csrf: csrf_token,
                }
            })
        },
        space_history: (host_uid,offset_dynamic_id=0) => {//进入个人主页的动态页
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history",
                method: "GET",
                data: {
                    visitor_uid: Live_info.uid,
                    offset_dynamic_id:offset_dynamic_id,//动态抽奖一般会置顶，嫌麻烦只取近期最近的一组数据
                    host_uid:host_uid,
                    need_top:1,
                    platform:'web'
                }
            })
        },
        dyn_like: (dyn_id_str) => {
            return BilibiliAPI.ajax({
                url: `//api.bilibili.com/x/dynamic/feed/dyn/thumb?csrf=${csrf_token}`,
                method: "POST",
                headers:{"content-type": "application/json"},
                data: JSON.stringify({"dyn_id_str": dyn_id_str,"up": 1})
            })
        },
        reserve_relation_info: (business_id) => {//business_id
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/activity/up/reserve/relation/info",
                method: "GET",
                data: {
                    ids:business_id,
                    csrf: csrf_token,
                }
            })
        },
        reserve_attach_card_button: (reserve_id,reserve_total) => {//business_id
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/dynamic_mix/v1/dynamic_mix/reserve_attach_card_button",
                method: "POST",
                data: {
                    reserve_id:reserve_id,
                    cur_btn_status:1,
                    reserve_total:reserve_total,
                    csrf: csrf_token,
                }
            })
        },
        detail_by_lid: (lottery_id) => {
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/lottery_svr/v1/lottery_svr/detail_by_lid",
                method: "GET",
                data: {
                    lottery_id:lottery_id,
                    csrf: csrf_token,
                }
            })
        },
        dynamic_lottery_notice:  (business_id, business_type=4) => {//business_type 4 互动抽奖
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice",
                method: "GET",
                data: {
                    business_id:business_id,
                    business_type:business_type
                }
            })
        },
        dynamic_lottery_notice_business: (business_id, business_type=10) => {//business_type 10 预约 12充电
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice",
                method: "GET",
                data: {
                    business_id:business_id,
                    business_type:business_type
                }
            })
        },
        getdiscusss_dynamic: (oid) => {
            if(!oid)return
            return BilibiliAPI.ajax({ //获取热门转发评论
                url: "//api.bilibili.com/x/v2/reply/main",
                data: {
                    jsonp: 'jsonp',
                    next: 0,
                    type: 17,
                    oid: oid,
                    mode: 3,
                    _: (ts_ms()+ms_diff),
                    callback: ""
                }
            })
        },
        dynamic_history: (offset_dynamic_id) => {//自己动态首页刷新的关注的UP的动态
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_history",
                method: "GET",
                data: {
                    uid: Live_info.uid,
                    offset_dynamic_id:offset_dynamic_id,
                    type_list:'268435455',
                    from:'weball',
                    platform:'web'
                }
            })
        },
        dynamic_new: () => {
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new",
                method: "GET",
                data: {
                    uid: Live_info.uid,
                    type_list:'268435455',
                    from:'weball',
                    platform:'web'
                }
            })
        },
        top_rcmd: () => {//首页视频推荐
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/web-interface/index/top/rcmd",
                method: "GET",
            })
        },
        repost: (dynamic_id,content,ctrl) => {
            const len = content.length;
            if(len > 233){
                content = content.slice(0, 233 - len)
            }
            return BilibiliAPI.ajax({
                method: "POST",
                url: "//api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/repost",
                data: {
                    uid: Live_info.uid,
                    dynamic_id: dynamic_id,
                    content:content,
                    at_uids:'',
                    ctrl:ctrl,
                    csrf_token: csrf_token,
                    csrf: csrf_token,
                }
            })
        },
        get_attention_list: () => {
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/feed/v1/feed/get_attention_list",
                method: "GET",
                data: {
                    uid: Live_info.uid
                }
            })
        },
        get_weared_medal: () => {
            return BilibiliAPI.ajax({
                url: "//api.live.bilibili.com/live_user/v1/UserInfo/get_weared_medal",
                method: "POST",
                data: {
                    source: 1,
                    uid: Live_info.uid,
                    target_id: Live_info.room_id,
                    csrf_token: csrf_token,
                    csrf: csrf_token,
                    visit_id:''
                }
            })
        },
        exp: () => {//投币经验
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/web-interface/coin/today/exp",
            })
        },
        exp_reward: () => {//经验获取情况,投币经验显示不稳定
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/member/web/exp/reward",
            })
        },
        coin_add: (aid) => {
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/web-interface/coin/add",
                method: "POST",
                data: {
                    aid: aid,
                    multiply: 1,//投币数量
                    select_like: 1,//点赞
                    cross_domain: true,
                    csrf: csrf_token
                }
            })
        },
        web_interface_card: (ruid) => {
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/web-interface/card",
                data: {
                    mid: ruid,
                    photo:true
                }
            })
        },
        getdiscusss: (oid) => {
            if(!oid)return
            return BilibiliAPI.ajax({ //获取屏蔽词
                url: "//api.bilibili.com/x/v2/reply/main",
                data: {
                    jsonp: 'jsonp',
                    next: 0,
                    type: 12,
                    oid: oid,
                    mode: 2,
                    _: (ts_ms()+ms_diff),
                    callback: ""
                }
            })
        },
        activity_lottery: {
            addtimes: (sid) => {
                return BilibiliAPI.ajax({
                    url: "//api.bilibili.com/x/activity/lottery/addtimes",
                    method: "POST",
                    data: {
                        sid: sid,
                        action_type: 3,
                        csrf: csrf_token
                    }
                })
            },
            mytimes: (sid) => {
                return BilibiliAPI.ajax({
                    url: "//api.bilibili.com/x/activity/lottery/mytimes",
                    data: {
                        sid: sid,
                    }
                })
            },
            do : (sid) => {
                return BilibiliAPI.ajax({
                    url: "//api.bilibili.com/x/activity/lottery/do",
                    method: "POST",
                    data: {
                        sid: sid,
                        type: 1,
                        csrf: csrf_token
                    }
                })
            },
        },
        new_activity_lottery: {
            send_points: (taskId,business) => {
                return BilibiliAPI.ajax({
                    url: "//api.bilibili.com/x/activity/task/send_points",
                    method: "POST",
                    data: {
                        activity: taskId,
                        csrf: csrf_token,
                        business: business,
                        timestamp: ts_ms(),
                    }
                })
            },
            addtimes: (sid,action_type=3) => {
                return BilibiliAPI.ajax({
                    url: "//api.bilibili.com/x/lottery/addtimes",
                    method: "POST",
                    data: {
                        sid: sid,
                        action_type: action_type,
                        csrf: csrf_token
                    }
                })
            },
            mytimes: (sid) => {
                return BilibiliAPI.ajax({
                    url: "//api.bilibili.com/x/lottery/mytimes",
                    data: {
                        sid: sid,
                    }
                })
            },
            do : (sid) => {
                return BilibiliAPI.ajax({
                    url: "//api.bilibili.com/x/lottery/do",
                    method: "POST",
                    data: {
                        sid: sid,
                        type: 1,
                        csrf: csrf_token
                    }
                })
            },
        },
        activity_lottery: {
            addtimes: (sid) => {
                return BilibiliAPI.ajax({
                    url: "//api.bilibili.com/x/activity/lottery/addtimes",
                    method: "POST",
                    data: {
                        sid: sid,
                        action_type: 3,
                        csrf: csrf_token
                    }
                })
            },
            mytimes: (sid) => {
                return BilibiliAPI.ajax({
                    url: "//api.bilibili.com/x/activity/lottery/mytimes",
                    data: {
                        sid: sid,
                    }
                })
            },
            do : (sid) => {
                return BilibiliAPI.ajax({
                    url: "//api.bilibili.com/x/activity/lottery/do",
                    method: "POST",
                    data: {
                        sid: sid,
                        type: 1,
                        csrf: csrf_token
                    }
                })
            },
        },
        remove_session : (talker_id) => {//删除私信
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/session_svr/v1/session_svr/remove_session",
                method: "POST",
                data: {
                    talker_id: talker_id,
                    session_type: 1,
                    build: 0,
                    mobi_app: 'web',
                    csrf_token:  csrf_token,
                    csrf: csrf_token
                }
            })
        },
        update_ack : (talker_id,ack_seqno) => {//私信已读1 普通私信，34预约抽奖通知
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/session_svr/v1/session_svr/update_ack",
                method: "POST",
                data: {
                    talker_id: talker_id,
                    session_type: 1,
                    ack_seqno:ack_seqno,
                    build: 0,
                    mobi_app: 'web',
                    csrf_token:  csrf_token,
                    csrf: csrf_token
                }
            })
        },
        get_sessions: (end_ts) => {//获取私信列表（显示最后一条私信）
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/session_svr/v1/session_svr/get_sessions",
                data: {
                    session_type: 1,
                    group_fold: 1,
                    unfollow_fold: 0,
                    sort_rule: 2,
                    end_ts: end_ts,
                    build: 0,
                    mobi_app: 'web'
                }
            })
        },
        getMsg: (uid) => {//获取私信内容
            return BilibiliAPI.ajax({
                url: "//api.vc.bilibili.com/svr_sync/v1/svr_sync/fetch_session_msgs",
                data: {
                    sender_device_id: 1,
                    talker_id: uid,
                    session_type: 1,
                    size: 20,
                    build: 0,
                    mobi_app: 'web'
                }
            })
        },
        modify: (i, e) => BilibiliAPI.ajax({
            method: "POST",
            url: "//api.bilibili.com/x/relation/modify",
            data: {
                fid: i,
                act: e,
                re_src: 0,
                spmid: '333.999',
                csrf: csrf_token
            }
        }),
        batch_modify: (i, e, a = 151) => BilibiliAPI.ajaxWithCommonArgs({//i:123,564,445 //答题 151
            method: "POST",
            url: "//api.bilibili.com/x/relation/batch/modify",
            data: {
                fids: i,
                act: e,
                re_src: a,
            }
        }),
        getInfoByUser: i => BilibiliAPI.ajax({
            url: "xlive/web-room/v1/index/getInfoByUser",
            data: {
                room_id: i
            }
        }),
        getInfoByRoom: e => BAPI.ajax({
            url: "xlive/web-room/v1/index/getInfoByRoom",
            data: {
                room_id: e
            }
        }),
        get_tags_mid: (i, e, f) => BilibiliAPI.ajax({
            url: "//api.bilibili.com/x/relation/tag",
            data: {
                mid: i,
                tagid: e,
                pn: f,
                ps: '20',
                jsonp: 'jsonp'
            }
        }),
        get_tags: () => BilibiliAPI.ajax({
            url: "//api.bilibili.com/x/relation/tags",
            data: {
                jsonp: 'jsonp',
            }
        }),
        tag_create: (i) => BilibiliAPI.ajaxWithCommonArgs({
            method: "POST",
            url: "//api.bilibili.com/x/relation/tag/create",
            type: "post",
            data: {
                tag: i,
                jsonp: 'jsonp',
                csrf: csrf_token,
            }
        }),
        tags_addUsers: (i, e) => BilibiliAPI.ajaxWithCommonArgs({
            method: "POST",
            url: "//api.bilibili.com/x/relation/tags/addUsers?cross_domain=true",
            type: "post",
            data: {
                fids: i,
                tagids: e,
                csrf: csrf_token,
            }
        }),
        wear_medal: (i) => BilibiliAPI.ajaxWithCommonArgs({
            method: "POST",
            url: "xlive/web-room/v1/fansMedal/wear",
            data: {
                medal_id: i,
            }
        }),
        link_group: {
            my_groups: () => BilibiliAPI.ajax({
                url: "link_group/v1/member/my_groups"
            }),
            sign_in: (i, e) => BilibiliAPI.ajax({
                url: "link_setting/v1/link_setting/sign_in",
                data: {
                    group_id: i,
                    owner_id: e
                }
            }),
            buy_medal: (i, e = "metal", a = "android") => BilibiliAPI.ajaxWithCommonArgs({
                method: "POST",
                url: "//api.vc.bilibili.com/link_group/v1/member/buy_medal",
                data: {
                    master_uid: i,
                    coin_type: e,
                    platform: a
                }
            })
        },
        DailyReward: {
            login: () => BilibiliAPI.x.now(),
            share: i => BilibiliAPI.x.share_add(i),
            watch: (i, e, a, t, l, r, o, n, s) => BilibiliAPI.x.heartbeat(i, e, a, t, l, r, o, n, s),

        },
        x: {
            getUserSpace: (i, e, a, t, l, r, o) => BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/space/arc/search",
                data: {
                    mid: i,
                    ps: e,
                    tid: a,
                    pn: t,
                    keyword: l,
                    order: r,
                    jsonp: o
                }
            }),
            heartbeat: (i, e, a, t, l = 0, r = 0, o = 3, n = 1, s = 2) => BilibiliAPI.ajaxWithCommonArgs({
                method: "POST",
                url: "//api.bilibili.com/x/report/web/heartbeat",
                data: {
                    aid: i,
                    cid: e,
                    mid: a,
                    start_ts: t || Date.now() / 1e3,
                    played_time: l,
                    realtime: r,
                    type: o,
                    play_type: n,
                    dt: s
                }
            }),
            share_add: i => BilibiliAPI.ajaxWithCommonArgs({
                method: "POST",
                url: "//api.bilibili.com/x/web-interface/share/add",
                data: {
                    aid: i,
                    jsonp: "jsonp"
                }
            }),
            now: () => BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/report/click/now",
            })
        },
        dynamic_svr: {
            dynamic_new: (i, e = 8) => BilibiliAPI.ajax({//废弃？
                url: "dynamic_svr/v1/dynamic_svr/dynamic_new",
                data: {
                    uid: i,
                    type: e
                }
            }),
            space_history: (i, e, a, t) => BilibiliAPI.ajax({
                url: "dynamic_svr/v1/dynamic_svr/space_history",
                data: {
                    visitor_uid: i,
                    host_uid: e,
                    offset_dynamic_id: a,
                    need_top: t
                }
            })
        },
        Exchange: {
            silver2coin: (platform) => BilibiliAPI.pay.silver2coin(platform),
            silver2coin_old: (platform) => BilibiliAPI.pay.silver2coin_old(platform),
        },
        sendLiveDanmu: (msg, roomid) => {
            return BilibiliAPI.ajax({
                method: 'POST',
                url: 'msg/send',
                data: {
                    color: '4546550',
                    fontsize: '25',
                    mode: '1',
                    msg: msg,
                    rnd: (ts_s()+s_diff),
                    roomid: roomid,
                    bubble: '0',
                    csrf: csrf_token,
                    csrf_token: csrf_token,
                }
            });
        },
        h5_old:(aid,cid, bvid) => {
            let stime = ts_s() + s_diff
            let ftime = ts_s()
            BilibiliAPI.ajax({
                method: 'POST',
                url: '//api.bilibili.com/x/click-interface/click/web/h5',
                data: {
                    "mid": Live_info.uid,
                    "aid": aid,
                    "cid": cid,
                    "part": 1,
                    "lv": Live_info.Blever,
                    "ftime": ftime,
                    "stime": stime,
                    "type": 3,
                    "sub_type": 0,
                    "refer_url": "https://t.bilibili.com/?tab=video",
                    "spmid": "333.788.0.0",
                    "from_spmid": "",
                    "csrf": csrf_token,
                }
            })
        },
        h5_new:async (aid, cid, bvid) => {
            let session = await get_bv_session(bvid)
            let stime = ts_s() + s_diff
            let ftime = ts_s()
            let wts = ftime
            let w_rid = await get_h5_w_rid(aid,ftime,stime,wts)
            let param = `w_aid=${aid}&w_part=1&w_ftime=${ftime}&w_stime=${stime}&w_type=3&web_location=1315873&w_rid=${w_rid}&wts=${wts}`
            BilibiliAPI.ajax({
                method: 'POST',
                url: '//api.bilibili.com/x/click-interface/click/web/h5?'+ param,
                data: {
                    "mid": Live_info.uid,
                    "aid": aid,
                    "cid": cid,
                    "part": 1,
                    "lv": Live_info.Blever,
                    "ftime": ftime,
                    "stime": stime,
                    "type": 3,
                    "sub_type": 0,
                    "refer_url": "https://t.bilibili.com/?tab=video",
                    "spmid": "333.788.0.0",
                    "from_spmid": "333.999.0.0",
                    "csrf": csrf_token,
                    "outer": 0,
                    "session":session
                }
            })
        },
        sendLiveDanmu_dm_type: (msg, roomid) => {
            return BilibiliAPI.ajax({
                method: 'POST',
                url: 'msg/send',
                data: {
                    color: '16777215',
                    fontsize: '25',
                    mode: '1',
                    dm_type:'1',
                    msg: msg,
                    rnd: (ts_s()+s_diff),
                    roomid: roomid,
                    bubble: '0',
                    csrf: csrf_token,
                    csrf_token: csrf_token,
                }
            });
        },
        anchor_postdiscuss: (discuss, oid) => { //发送评论
            if(oid == 0)return;
            return BilibiliAPI.ajax({
                method: 'POST',
                url: '//api.bilibili.com/x/v2/reply/add',
                data: {
                    oid: oid,
                    type: '12',
                    message: discuss,
                    plat: '1',
                    ordering: 'time',
                    jsonp: 'jsonp',
                    csrf: csrf_token,
                }
            });
        },
        getCookie: (name) => {
            let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if(arr != null)
                return unescape(arr[2]);
            return false;
        },
        sendMsg: (msg) => {
            return BilibiliAPI.ajax({
                method: "POST",
                url: "//api.vc.bilibili.com/web_im/v1/web_im/send_msg ",
                data: {
                    "msg[sender_uid]": msg.sender_uid,
                    "msg[receiver_id]": msg.receiver_id,
                    "msg[receiver_type]": msg.receiver_type,
                    "msg[msg_type]": msg.msg_type,
                    "msg[msg_status]": msg.msg_status,
                    "msg[content]": msg.content,
                    "msg[timestamp]": (ts_s()+s_diff),
                    "msg[dev_id]": msg.dev_id,
                    build: 0,
                    mobi_app: "web",
                    csrf_token: csrf_token,
                    csrf: csrf_token,
                }
            })
        },
        lottery: {
            box: {
                getRoomActivityByRoomid: (roomid) => {
                    // 获取房间特有的活动 （实物抽奖）
                    return BilibiliAPI.ajax({
                        url: 'lottery/v1/box/getRoomActivityByRoomid?roomid=' + roomid
                    });
                },
                getStatus: (aid) => {
                    // 获取活动信息/状态
                    return BilibiliAPI.ajax({
                        url: 'xlive/lottery-interface/v2/Box/getStatus',
                        data: {
                            aid: aid,
                        }
                    });
                },
                draw: (aid, number = 1) => {
                    // 参加实物抽奖
                    return BilibiliAPI.ajax({
                        url: 'xlive/lottery-interface/v2/Box/draw',
                        data: {
                            aid: aid,
                            number: number
                        }
                    });
                },
                getWinnerGroupInfo: (aid, number = 1) => {
                    // 获取中奖名单
                    return BilibiliAPI.ajax({
                        url: 'xlive/lottery-interface/v2/Box/getWinnerGroupInfo',
                        data: {
                            aid: aid,
                            number: number
                        }
                    });
                }
            },
        },
        room: {
            get_info: (room_id, from = 'room') => {
                return BilibiliAPI.ajax({
                    url: 'room/v1/Room/get_info',
                    data: {
                        room_id: room_id,
                        from: from
                    }
                });
            },
            room_entry_action: (room_id, platform = 'pc') => {
                return BilibiliAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'room/v1/Room/room_entry_action',
                    data: {
                        room_id: room_id,
                        platform: platform
                    }
                });
            },
        },
        gift: {
            bag_list: () => {
                return BilibiliAPI.ajax({
                    url: '//api.live.bilibili.com/xlive/web-room/v1/gift/bag_list',
                    data: {
                        t:(ts_ms()+ms_diff),
                        room_id:Live_info.room_id
                    }
                });
            },
            bag_send: (uid, gift_id, ruid, gift_num, bag_id, biz_id, rnd, platform = 'pc', biz_code = 'Live', storm_beat_id = 0, price = 0,send_ruid = 0) => {
                return BilibiliAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'xlive/revenue/v2/gift/sendBag',
                    data: {
                        uid: uid,
                        gift_id: gift_id,
                        ruid: ruid,
                        gift_num: gift_num,
                        bag_id: bag_id,
                        platform: platform,
                        biz_code: biz_code,
                        biz_id: biz_id, // roomid
                        rnd: rnd,
                        storm_beat_id: storm_beat_id,
                        metadata: '',
                        price: price,
                        send_ruid:send_ruid
                    }
                });
            },
            sendGold: (uid, gift_id, ruid, gift_num, biz_id, rnd, price) => {
                return BilibiliAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'xlive/revenue/v1/gift/sendGold',
                    data: {
                        uid: uid,
                        gift_id: gift_id,
                        ruid: ruid,
                        gift_num: gift_num,
                        coin_type: 'gold',
                        bag_id: 0,
                        platform: 'pc',
                        biz_code: 'Live',
                        biz_id: biz_id, // roomid
                        rnd: rnd,
                        storm_beat_id: 0,
                        metadata: '',
                        price: price,
                        send_ruid:0
                    }
                });
            },
        },
        likes_video: (value=1) => {
            return BilibiliAPI.ajax({
                url: "//api.bilibili.com/x/space/privacy/modify",
                method: "POST",
                data:{
                    field: 'likes_video',
                    value: value,
                    csrf:csrf_token
                }
            })
        },
        live_user: {
            get_anchor_in_room: (roomid) => {
                return BilibiliAPI.ajax({
                    url: 'live_user/v1/UserInfo/get_anchor_in_room?roomid=' + roomid
                });
            },
            get_info_in_room: i => BilibiliAPI.ajax({
                url: "live_user/v1/UserInfo/get_info_in_room?roomid=" + i
            }),
        },
        pay: {
            silver2coin: (platform = 'pc') => {
                // 银瓜子兑换硬币，700银瓜子=1硬币
                return BilibiliAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'xlive/revenue/v1/wallet/silver2coin',
                });
            },
            silver2coin_old: (platform = 'pc') => {
                // 银瓜子兑换硬币，700银瓜子=1硬币
                return BilibiliAPI.ajaxWithCommonArgs({
                    method: 'POST',
                    url: 'pay/v1/Exchange/silver2coin',
                    data: {
                        platform: platform
                    }
                });
            }
        },
        Lottery: {
            MaterialObject: {
                getRoomActivityByRoomid: (roomid) => BilibiliAPI.lottery.box.getRoomActivityByRoomid(roomid),
                getStatus: (aid, times) => BilibiliAPI.lottery.box.getStatus(aid, times),
                draw: (aid, number) => BilibiliAPI.lottery.box.draw(aid, number),
                getWinnerGroupInfo: (aid, number) => BilibiliAPI.lottery.box.getWinnerGroupInfo(aid, number)
            },
            anchor: {
                following_live: (i = 1) => BilibiliAPI.ajax({
                    url: "xlive/web-ucenter/user/following",
                    data: {
                        page: i,
                        page_size: 9
                    },
                }),
                awardlist: (i = 1) => BilibiliAPI.ajax({
                    url: "lottery/v1/Award/award_list",
                    data: {
                        page: i,
                        month: mm,
                    },

                }),
                getUserInfo: i => BilibiliAPI.ajax({
                    url: "User/getUserInfo?ts=" + i
                }),
                deldiscusss5: (rpid,oid) => {//5348728
                    let data = {
                        oid: oid,
                        type: 12,
                        jsonp: 'jsonp',
                        rpid: rpid,
                        csrf:csrf_token,
                    };
                    return BilibiliAPI.ajaxWithCommonArgs({
                        method: "POST",
                        url: "//api.bilibili.com/x/v2/reply/del",
                        data: data
                    })
                },
                join: (id, room_id, gift_id, gift_num) => {
                    let data = {
                        id: id,
                        platform: "pc",
                        room_id:room_id,
                        jump_from_str:'',
                        session_id:'',
                        spm_id: '444.8.interaction.anchor_draw_auto'
                    };
                    if(gift_id !== undefined && gift_num !== undefined && gift_id !== 0){
                        data.gift_id = gift_id;
                        data.gift_num = gift_num;
                    };
                    return BilibiliAPI.ajaxWithCommonArgs({
                        method: "POST",
                        url: "xlive/lottery-interface/v1/Anchor/Join",
                        data: data
                    })
                },
                title_update: (anchor_list, room_id) => {
                    let data = {
                        room_id: room_id,
                        title: anchor_list,
                        platform: "pc",
                        csrf_token: csrf_token,
                        csrf: csrf_token,
                        visit_id: '',
                    };
                    return BilibiliAPI.ajax({
                        method: "POST",
                        url: "room/v1/Room/update",
                        data: data
                    })
                },
                description_update: (anchor_list, room_id) => {
                    let data = {
                        room_id: room_id,
                        description: anchor_list,
                        csrf_token: csrf_token,
                        csrf: csrf_token,
                    };
                    return BilibiliAPI.ajax({
                        method: "POST",
                        url: "room/v1/Room/update",
                        data: data
                    })
                },
                uid_info: (uid) => {//通过uid获取真实roomid，直播状态等
                    let data = {
                        mid: uid,
                    };
                    return BilibiliAPI.ajax({
                        method: "get",
                        url: "//api.bilibili.com/x/space/acc/info",
                        data: data
                    })
                },
                medal: (i = 1, e = 10) => BilibiliAPI.ajax({
                    url: "i/api/medal",
                    data: {
                        page: i,
                        pageSize: e
                    }
                }),
                get_home_medals: (page) => BilibiliAPI.ajax({
                    url: "fans_medal/v1/fans_medal/get_home_medals",
                    data: {
                        uid:Live_info.uid,
                        source:2,
                        need_rank:false,
                        master_status:0,
                        page: page
                    }
                }),
                guards: (i = 1, e = 10) => BilibiliAPI.ajax({
                    url: "xlive/web-ucenter/user/guards",
                    data: {
                        page: i,
                        page_size: e
                    }
                }),
                getFollowings: (i) => BilibiliAPI.ajax({
                    url: "xlive/web-ucenter/user/following",
                    data: {
                        page: i,
                        page_size: 9,
                    }
                }),
                getRoomBaseInfo: (i, e = "link-center") => BilibiliAPI.ajax({
                    url: "xlive/web-room/v1/index/getRoomBaseInfo",
                    data: {
                        room_ids: i,
                        req_biz: e
                    }
                }),
                AnchorRecord: (i = 1) => BilibiliAPI.ajax({
                    url: "xlive/lottery-interface/v1/Anchor/AwardRecord",
                    data: {
                        page: i,
                    }
                }),
            }
        },
    }
})();
/**
 https://github.com/turuslan/HackTimer 删减 浏览器后台时计时不延迟
 */
(function(workerScript){
    let space = window.location.href.indexOf('space.bilibili.com') > -1;
    if(space) return console.log('space.bilibili.com',new Date())
    try {
        var blob = new Blob(["\
var fakeIdToId = {};\
onmessage = function(event){\
var data = event.data,\
name = data.name,\
fakeId = data.fakeId,\
time;\
if(data.hasOwnProperty('time')){\
time = data.time;\
}\
switch (name){\
case 'setTimeout':\
fakeIdToId[fakeId] = setTimeout(function () {\
postMessage({fakeId: fakeId});\
if(fakeIdToId.hasOwnProperty (fakeId)){\
delete fakeIdToId[fakeId];\
}\
}, time);\
break;\
case 'clearTimeout':\
if(fakeIdToId.hasOwnProperty (fakeId)){\
clearTimeout(fakeIdToId[fakeId]);\
delete fakeIdToId[fakeId];\
}\
break;\
}\
}\
"]);
        // Obtain a blob URL reference to our worker 'file'.
        workerScript = window.URL.createObjectURL(blob);
    } catch (error){
        /* Blob is not supported, use external script instead */
    }
    var worker,
        fakeIdToCallback = {},
        lastFakeId = 0,
        maxFakeId = 0x7FFFFFFF, // 2 ^ 31 - 1, 31 bit, positive values of signed 32 bit integer
        logPrefix = 'HackTimer.js by turuslan: ';
    if(typeof(Worker) !== 'undefined'){
        function getFakeId(){
            do {
                if(lastFakeId == maxFakeId){
                    lastFakeId = 0;
                }else{
                    lastFakeId++;
                }
            } while (fakeIdToCallback.hasOwnProperty(lastFakeId));
            return lastFakeId;
        }
        try {
            worker = new Worker(workerScript);
            window.setTimeout = function(callback, time /* , parameters */){
                var fakeId = getFakeId();
                fakeIdToCallback[fakeId] = {
                    callback: callback,
                    parameters: Array.prototype.slice.call(arguments, 2),
                    isTimeout: true
                };
                worker.postMessage({
                    name: 'setTimeout',
                    fakeId: fakeId,
                    time: time
                });
                return fakeId;
            };
            window.clearTimeout = function(fakeId){
                if(fakeIdToCallback.hasOwnProperty(fakeId)){
                    delete fakeIdToCallback[fakeId];
                    worker.postMessage({
                        name: 'clearTimeout',
                        fakeId: fakeId
                    });
                }
            };
            worker.onmessage = function(event){
                var data = event.data,
                    fakeId = data.fakeId,
                    request,
                    parameters,
                    callback;
                if(fakeIdToCallback.hasOwnProperty(fakeId)){
                    request = fakeIdToCallback[fakeId];
                    callback = request.callback;
                    parameters = request.parameters;
                    if(request.hasOwnProperty('isTimeout') && request.isTimeout){
                        delete fakeIdToCallback[fakeId];
                    }
                }
                if(typeof(callback) === 'string'){
                    try {
                        callback = new Function(callback);
                    } catch (error){
                        console.log(logPrefix + 'Error parsing callback code string: ', error);
                    }
                }
                if(typeof(callback) === 'function'){
                    callback.apply(window, parameters);
                }
            };
            worker.onerror = function(event){
                console.log(event);
            };
            console.log(logPrefix + 'Initialisation succeeded');
        } catch (error){
            console.log(logPrefix + 'Initialisation failed');
            console.error(error);
        }
    }else{
        console.log(logPrefix + 'Initialisation failed - HTML5 Web Worker is not supported');
    }
})('HackTimerWorker.js');
