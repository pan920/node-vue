
<template>
  <div class="fillContainer">
    <div>
      <el-form ref="add_data" :inline="true" :model="search_data">
        <el-form-item label="按照时间筛选:">
          <el-date-picker
            v-model="search_data.startTime"
            type="datetime"
            placeholder="选择开始时间"
          />
          --
          <el-date-picker
            v-model="search_data.endTime"
            type="datetime"
            placeholder="选择结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="search" @click="handleSearch()">筛选</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button type="primary" size="small" @click="handleAdd()">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        max-height="450"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="70"
        />
        <el-table-column
          prop="date"
          label="创建时间"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="收支类型"
          align="center"
          width="150"
        />
        <el-table-column
          prop="describe"
          label="收支描述"
          align="center"
          width="180"
        />
        <el-table-column
          prop="income"
          label="收入"
          align="center"
          width="170"
        >
          <template slot-scope="scope">
            <span style="color:#00d053">{{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="expend"
          label="支出"
          align="center"
          width="170"
        >
          <template slot-scope="scope">
            <span style="color:#f56767">{{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cash"
          label="账户现金"
          align="center"
          width="170"
        >
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
          width="220"
        />
        <el-table-column label="操作" prop="operation" fixed="right" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="edit"
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              icon="delete"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              :current-page.sync="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <Dialog :dialog="dialog" :form-data="formData" @update="getProfile" />
  </div>
</template>

<script>
import Dialog from './components/Dialog'
import { getListApi, delFoundApi } from '@/api/found'
export default {
  components: {
    Dialog
  },
  data() {
    return {
      search_data: {
        startTime: '',
        endTime: ''
      },
      paginations: {
        page_index: 1, // 当前位于多少页
        total: 0, // 总数
        page_size: 5, // 一页显示多少条
        page_sizes: [5, 10, 15], // 每页显示多少条
        layout: 'total,sizes,prev,pager,next,jumper' // 翻页属性
      },
      tableData: [],
      allTableData: [],
      fileterTableData: [],
      formData: {
        type: '',
        describe: '',
        income: '',
        expend: '',
        cash: '',
        remark: '',
        id: ''
      },
      dialog: {
        show: false,
        title: '',
        option: 'edit'
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  created() {
    this.getProfile()
  },
  methods: {
    getProfile() {
      const qurey = {
        page: this.paginations.page_index,
        limit: this.paginations.page_size
      }
      getListApi(qurey).then(res => {
        //    console.log(res)
        this.allTableData = res.result.docs
        this.fileterTableData = res.result.docs
        // 设置分页数据
        this.setPaginations(res.total_num)
      })
    },
    handleAdd() {
      this.dialog = {
        show: true,
        title: '添加资金管理信息',
        option: 'add'
      }
      this.formData = {
        type: '',
        describe: '',
        income: '',
        expend: '',
        cash: '',
        remark: '',
        id: ''
      }
    },
    handleEdit(index, row) {
      this.dialog = {
        show: true,
        title: '编辑资金管理信息',
        option: 'exit'
      }
      this.formData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      }
    },
    handleDelete(index, row) {
      delFoundApi(row._id).then(res => {
        this.$message('删除成功')
        this.getProfile()
      })
    },
    setPaginations(total_num) {
      this.paginations.total = total_num
      this.paginations.page_index = this.paginations.page_index === 1 ? 1 : this.paginations.page_index
      this.paginations.page_size = this.paginations.page_size === 5 ? 5 : this.paginations.page_size
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size
      })
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1
      this.paginations.page_size = page_size
      this.getProfile()
      // console.log("handleSizeChange")
      // this.tableData = this.allTableData.filter((item,index)=>{
      //     return index < page_size
      // })
    },
    handleCurrentChange(page) {
      // 获取当前页
      this.paginations.page_index = page
      const index = this.paginations.page_size * (page - 1)
      // console.log(this.paginations)
      // 数据总数
      // let nums = this.paginations.page_size * page
      // let tables = []
      // 前端分页 略显无用
      // for(let i=index; i<nums; i++){
      //     if(this.allTableData[i]){
      //         tables.push(this.allTableData[i])
      //     }
      //     this.tableData = tables
      // }

      //

      this.getProfile()
    },
    handleSearch() {
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: 'warning',
          message: '请选择时间区间'
        })
        this.getProfile()
        return
      }
      const sTime = this.search_data.startTime.getTime()
      const eTime = this.search_data.endTime.getTime()
      this.allTableData = this.fileterTableData.filter(item => {
        const date = new Date(item.date)
        const time = date.getTime()
        return time >= sTime && time <= eTime
      })
      this.setPaginations()
    }
  }
}
</script>

<style scoped>
.fillContainer{
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box
}
.btnRight{
    float: right;
}
.pagination{
    text-align: right;
    margin-top: 10px;
}
</style>
