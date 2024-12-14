<script setup>
import { ref} from "vue";
import axios from 'axios';

const currentDate = new Date();

const currentMonth = currentDate.getMonth();
const month = "December"
const dataList = ref([])
const page = ref(1)
const idx = 0
console.log(month)
async function ag (){await axios({
  method: "GET",
  url:"/api/charge/",
  // params: {
  //   month:"December",
  //   page:1
}).then(response => {
  dataList.value = response.data; // 假设服务器返回的数据在 response.data 中
}).catch(error => {
  console.error("请求出错：", error);
});}
ag()
console.log("?",dataList)

async function next (){
  page.value++
  await axios({
  method: "GET",
  url:"/api/charge/",
  params: {
    // month:"December",
    page:page.value,}
}).then(response => {
  dataList.value = response.data; // 假设服务器返回的数据在 response.data 中
}).catch(error => {
  console.error("请求出错：", error);
});}

async function previous (){
  if (page.value <= 1){
    return
  }
  page.value--
  await axios({
    method: "GET",
    url:"/api/charge/",
    params: {
      // month:"December",
      page:page.value,}
  }).then(response => {
    dataList.value = response.data; // 假设服务器返回的数据在 response.data 中
  }).catch(error => {
    console.error("请求出错：", error);
  });}
// const data = [{
//   name:"wuka",
//   ufans:"35",
//   endtime:"2024.11.1",
//   uposmessage:"表格边框。指定CSS表格边框，使用border属性。下面的例子指定了一个表格的Th和TD元素 …" +
//       "折叠边框。border-collapse 属性设置表格的边框是否被折叠成一个单一的边框或隔开：实 …" +
//       "表格宽度和高度。Width和height属性定义表格的宽度和高度。下面的例子是设置100％的宽 …" +
//       "表格文字对齐。表格中的文本对齐和垂直对齐属性。text-align属性设置水平对齐方式，向 …",
//   prize:"3",
//   numpart:15,
//   numprize:3,
//   cost:6,
//   ispart:"未参与",
//   part:"http://www.bilibili.com",
//   winpage:"www.bilibili.com",
// }]
</script>

<template  style="overflow-x:auto;">

  <!-- <a ><button>刷新</button> </a>-->
  <!--  <p >总价:</p>-->


  <table class="tables" >
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
      <th id="middle">开奖页面</th>
      <th >充电过期 </th>

    </tr>

    </thead>
    <tbody>
    <tr v-for="(value,index) in dataList" >
      <td id="mini"><input type="checkbox" v-bind:value="value" ></td>
      <td >{{(page-1)*20+ index}}</td>
      <td>{{value.name}}</td>
      <td>{{value.ufans}}</td>

      <td>{{value.end_time}}</td>
      <td colspan="2" align="left" v-bind:title="value.dynamic_message">{{value.dynamic_message}}</td>
      <td colspan="2" align="left" v-bind:title="value.Prizes">{{value.Prizes}}</td>

      <td>{{value.num_participants}}</td>
      <td>{{value.num_prizes}}</td>
      <td>{{value.cost}}</td>

      <td>
        <a v-bind:href="value.PrizesUrl">{{value.is_participants}}</a>
      </td>
      <td>
        <a v-bind:href="value.wins">开奖连接</a>
      </td>
      <!--        <td>{{data.chargeEndTime}}</td>-->

    </tr>
    </tbody>
    <tfoot>
    <tr>
      <td colspan="4" class="prev"><a href="#" @click="previous">Previous</a></td>
      <!-- 数字序列，这里只显示第1、2、3、4页和省略号、27页作为示例 -->
      <td><a href="#" onclick="return false;">1</a></td>
      <td><a href="#" onclick="return false;">2</a></td>
      <td><a href="#" onclick="return false;">3</a></td>
      <td><a href="#" onclick="return false;">4</a></td>
      <td class="dots">...</td>
      <td class="next" colspan="4"><a href="#" @click="next">Next</a></td>
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

 .tables th,.tables td {
  border-bottom: 1px solid #ddd;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
}
.tables th {
  background-color: #e9afaa;
  color: white;
  padding-top: 12px;
  padding-bottom: 12px;
}
.tables tr, .tables td {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.tables  tr:nth-child(even) {
  background-color: #f2f2f2;
}

 table  tr:hover {background-color: #f5f5f5;}
 table  th#mini {
  width: 4%;
}
 table  th#middle {
  width: 6%;
}

</style>
