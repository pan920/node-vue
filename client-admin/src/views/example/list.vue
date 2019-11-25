<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" size="mini" placeholder="请输入标题" style="width: 130px;" class="filter-item" />
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="searchList()">
        查询
      </el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addArticle()">
        新增文章
      </el-button>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-view" @click="showWord()">
        显示字段
      </el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download">
        {{ $t('table.export') }}
      </el-button> -->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
          type="index"
          label="序号"
          align="center"
          width="70"
        />

      <el-table-column min-width="80px" align="center" label="文章标题">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row._id" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.publish_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否置顶">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.is_top === true?'是':'否'"></span> -->
          <span v-if="scope.row.is_top == 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="文章分类">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="发布人">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="100px" label="描述">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->

      <el-table-column class-name="status-col" label="审核状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            <span v-if="row.status == 0">
              未审核
            </span>
            <span v-else-if="row.status == 1">
              已审核
            </span>
            <span v-else>
              未通过
            </span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row._id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { articleListApi } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page_index: 1,
        page_size: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      articleListApi(this.listQuery).then(res => {
        this.list = res.result.docs
        this.total = res.total_num
        this.listLoading = false
      })
    },
    addArticle() {
      this.$router.push({  // 核心语句
        path:'/example/create',   // 跳转的路径
      })
    },
    searchList() {},
    showWord() {}
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
