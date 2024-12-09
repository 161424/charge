<script setup>
  import {provide} from "vue";
  const props = defineProps({})
  const data = [{
    name:"wuka",
    ufans:"35",
    endtime:"2024.11.1",
    uposmessage:"表格边框。指定CSS表格边框，使用border属性。下面的例子指定了一个表格的Th和TD元素 …" +
        "折叠边框。border-collapse 属性设置表格的边框是否被折叠成一个单一的边框或隔开：实 …" +
        "表格宽度和高度。Width和height属性定义表格的宽度和高度。下面的例子是设置100％的宽 …" +
        "表格文字对齐。表格中的文本对齐和垂直对齐属性。text-align属性设置水平对齐方式，向 …",
    prize:"3",
    numpart:15,
    numprize:3,
    cost:6,
    ispart:"未参与",
    part:"http://www.bilibili.com",
    winpage:"www.bilibili.com",
  },{name:"wuka",
    ufans:"35",
    endtime:"2024.11.1",
    uposmessage:"快来",
    prize:"3",
    numpart:15,
    numprize:3,
    cost:6,
    ispart:"未参与",
    part:"www.bilibili.com",
    winpage:"www.bilibili.com",},{name:"wuka",
    ufans:"35",
    endtime:"2024.11.1",
    uposmessage:"快来",
    prize:"3",
    numpart:15,
    numprize:3,
    cost:6,
    ispart:"未参与",
    part:"www.bilibili.com",
    winpage:"www.bilibili.com",},{name:"wuka",
    ufans:"35",
    endtime:"2024.11.1",
    uposmessage:"快来",
    prize:"3",
    numpart:15,
    numprize:3,
    cost:6,
    ispart:"未参与",
    part:"www.bilibili.com",
    winpage:"www.bilibili.com",},{name:"wuka",
    ufans:"35",
    endtime:"2024.11.1",
    uposmessage:"快来",
    prize:"3",
    numpart:15,
    numprize:3,
    cost:6,
    ispart:"未参与",
    part:"www.bilibili.com",
    winpage:"www.bilibili.com",}]
</script>

<template  style="overflow-x:auto;">
  <h3>home</h3>
  <a href="http://www.baidu.com">#</a>
  <table  >
  <thead>
    <tr >
      <!-- @click与@change输出相反，click应该属beforclick，change应该是afterclick-->
      <th id="mini"><input type="checkbox" ></th>
      <th id="mini">Id</th>
      <th id="middle">用户名</th>
      <th id="middle">粉丝数</th>

      <th>结束时间</th>
      <th colspan="2">动态信息</th>
      <th colspan="2">奖品内容</th>

      <th id="middle">参与人数</th>
      <th id="middle">抽奖个数</th>
      <th id="mini">花费</th>
      <th id="middle">是否参与</th>
      <th id="middle"> 开奖页面</th>

    </tr>

  </thead>
  <tbody>
    <tr v-for="(value,index) in data" >
      <td id="mini"><input type="checkbox" v-bind:value="value" ></td>
      <td >{{index}}</td>
      <td>{{value.name}}</td>
      <td>{{value.ufans}}</td>

      <td>{{value.endtime}}</td>
      <td colspan="2" align="left" v-bind:title="value.uposmessage">{{value.uposmessage}}</td>
      <td colspan="2" align="left" v-bind:title="value.prize"> {{value.prize}}</td>

      <td>{{value.numpart}}</td>
      <td>{{value.numprize}}</td>
      <td>{{value.cost}}</td>

      <td>
        <a v-bind:href="value.part">{{value.ispart}}</a>
      </td>
      <td>
        <a v-bind:href="value.winpage">开奖连接</a>
      </td>

    </tr>
  </tbody>
  <tfoot>
    <tr >
      <td  >
        <button>刷新</button>
      </td>
      <td colspan="13">总价:</td>
    </tr>
  </tfoot>

  </table>

</template>

<style >

  table {
    /*border: 1px solid black;*/
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
    table-layout:fixed;
  }

  th,td {
    border-bottom: 1px solid #ddd;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  th {
    background-color: #e9afaa;
    color: white;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  tr,td {

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

  }
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {background-color: #f5f5f5;}
  th#mini {
    width: 4%;
  }
  th#middle {
    width: 6%;
  }

</style>
