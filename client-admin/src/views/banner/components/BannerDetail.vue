<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item label="banner图:" style="margin-bottom: 40px;">
              <!-- 测试 -->
              <!-- <el-upload
                action="http://localhost:9527/api/banner/upload"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handImg"
                :file-list="fileList"
                :limit="1"
                :on-exceed="handleExceed"
                > -->
                <!-- 线上 -->
              <el-upload
                action="http://139.196.149.240/api/banner/upload"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handImg"
                :file-list="fileList"
                :limit="1"
                :on-exceed="handleExceed"
                >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="发布时间:" class="postInfo-container-item" prop="publish_time">
              <el-date-picker v-model="postForm.publish_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="审核状态:" class="postInfo-container-item" prop="status">
              <el-select v-model="postForm.status" placeholder="请选择审核状态">
                  <el-option label="未审核" value="0"></el-option>
                  <el-option label="已审核" value="1"></el-option>
                  <el-option label="未通过" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="图片分类:" class="postInfo-container-item" prop="type">
              <el-select v-model="postForm.type" placeholder="请选择图片分类">
                  <el-option label="首页" value="index"></el-option>
                  <el-option label="关于我们" value="about"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label-width="80px" label="是否置顶:" class="postInfo-container-item" prop="is_top">
              <el-select v-model="postForm.is_top" placeholder="是否置顶">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="70px" label="描述:">
          <el-input v-model="postForm.describe" :rows="1" type="textarea" class="article-textarea" autosize placeholder="描述" />
          <!-- <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span> -->
        </el-form-item>
      </div>
      <el-form-item style="margin-left:50px;">
        <el-button v-if="isEdit" type="primary" @click="editBanner('postForm')">立即提交</el-button>
        <el-button v-else type="primary" @click="addBanner('postForm')">立即提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/SingleImage3'
import { validURL } from '@/utils/validate'
import { addBannerApi, editBannerApi, detailBannerApi, uploadImgApi } from '@/api/banner'
import { searchUser } from '@/api/remote-search'
import Warning from './Warning'

const defaultForm = {
  file: '', // 图片路径
  describe: '', // 文章摘要
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  comment_disabled: false,
  publish_time: '',
  type: '', // 文章分类
  status: '', // 审核状态
  is_top: '0' // 是否置顶
}

export default {
  name: 'BannerDetail',
  components: { Upload, Warning },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          // message: rule.field + '为必传项',
           message: '必传项不能为空！',
          type: 'error'
        })
        // callback(new Error(rule.field + '为必传项'))
        callback(new Error('必传项不能为空！'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        publish_time: [{ validator: validateRequire }],
        type: [{ validator: validateRequire }],
        status: [{ validator: validateRequire }]
      },
      tempRoute: {},
      dialogImageUrl: '',
      dialogVisible: false,
      base_url:'http://139.196.149.240:5000/', // 图片url前缀
      fileList: []
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      // console.log(id)
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/pan920/node-vue/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      // console.log(file)
      this.dialogVisible = true;
    },
    handImg(response, file, fileList) {
      // console.log(response.pic_url)
      this.postForm.file = response.pic_url
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择1个文件，本次选择了 ${files.length} 个文件,请先删除原来图片！`);
    },
    fetchData(id) {
      detailBannerApi(id).then(response => {
        // console.log(response)
        this.postForm = response
        this.postForm.is_top = true ? "0":"1"
        var item = ''
        item = {
          name: response.type,
          url: this.base_url+response.file
        } 
        this.fileList.push(item)
        // console.log(this.postForm.is_top)
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑banner'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.type}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑banner'
      document.title = `${title} - ${this.postForm.type}`
    },
    // 添加Banner
    addBanner() {
      if(this.postForm.file == ''){
        this.$message({
          message: '请上传图片',
          type: 'error'
        })
        return
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          addBannerApi(this.postForm).then((res) => {
               this.$notify({
                title: '成功',
                message: '发布banner成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push({ // 核心语句
                path:'/banner/list' // 跳转的路径
              })
          })
         
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editBanner() {
      if(this.postForm.file == ''){
        this.$message({
          message: '请上传图片',
          type: 'error'
        })
        return
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          editBannerApi(this.postForm).then((res) => {
               this.$notify({
                title: '成功',
                message: '更新Banner成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push({ // 核心语句
                path:'/banner/list' // 跳转的路径
              })
          })
         
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
