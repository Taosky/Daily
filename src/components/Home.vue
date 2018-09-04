<template id="home">
  <el-container>
    <!--header-->
    <el-header style="padding: 0;height: 38px;width: 100%;position: fixed;top:0;z-index: 1000;">
      <el-row type="flex" justify="center">
        <el-col :md="15">
          <div class="head">
            <el-col :span="19">
              <el-col :span="13">
                <h5 style="text-align: center;margin-top: 0; line-height: 37px;font-weight: inherit;">知乎日报</h5>
              </el-col>
              <el-col :span="11">
                <el-date-picker
                  size="small"
                  style="width:100%;"
                  v-model="dateText"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyyMMdd"
                  @change="handleDateChange"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                  :editable=false
                  :clearable=false>
                </el-date-picker>
              </el-col>
            </el-col>
            <!--search-->
            <el-col :span="1" :offset="1">
              <el-popover
                placement="bottom"
                width="290"
                trigger="click">
                <div style="margin-top: 15px;">
                  <el-input style="margin-bottom: 5px;" placeholder="请输入内容" v-model="searchOptions.query"
                            class="input-with-select">
                    <template slot="prepend">标题</template>
                  </el-input>
                  <el-input style="width: 63%;margin-bottom: 5px;" placeholder="请输入内容" v-model="searchOptions.author"
                            class="input-with-select">
                    <template slot="prepend">作者</template>
                  </el-input>
                  <el-select style="width:35%" v-model="searchOptions.type" slot="prepend" placeholder="请选择类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="小事" value="xiaoshi"></el-option>
                    <el-option label="瞎扯" value="xiache"></el-option>
                    <el-option label="大误" value="dawu"></el-option>
                  </el-select>
                  <el-button @click="searchArticle" type="primary" slot="append" size="small">开始搜索</el-button>
                </div>
                <el-button style="background: none;border: none;height: 36px;" size="small" slot="reference"><i
                  style="font-size: 18px;" class="el-icon-search"></i></el-button>
              </el-popover>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <!--main-->
    <el-main style="padding-left: 15px;padding-right: 15px;padding-top: 48px;">
      <!--articles-->
      <el-row type="flex" justify="center">
        <el-col :md="{span:14}">
          <el-row :gutter="30">
            <el-col :span="12" :md="6" :sm="8" v-for="story in stories" :key="story.id">
              <el-card :body-style="{ padding: '0px' }">
                <img
                  :src="story.content.image ? story.content.image.replace(/(https|http):\/\/(.*?)/g, 'https://images.weserv.nl/?url=$2'): ''"
                  class="image"
                  @click="readsStory(story.info.id)">
                <div style="padding: 14px;" @click="readsStory(story.info.id)">
                  <span class="article-title">{{ story.info.title }}</span>
                  <div class="bottom clearfix">
                    <time class="time">id: {{ story.info.id }}</time>
                  </div>
                </div>
              </el-card>
              <br>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
    <el-row element-loading-text="加载中......"
            v-loading.fullscreen.lock="fullscreenLoading"></el-row>
    <el-footer style="text-align: center;padding: 15px 0 15px;font-size: 13px;color: #666;">
      <span>©<a href="https://mou.science" style="color: #666;">某不科学的博客</a> 2018</span>
    </el-footer>
  </el-container>

</template>
<script>
  import api from "../api";

  export default ({
    data: function () {
      return {
        stories: null,
        searchOptions: {
          query: '',
          author: '',
          type: '',
          page: 1
        },
        fullscreenLoading: false,
        yesterdayText: '',
        dateText: '',
        scrollPosition: 0,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < 1372608000000 || time.getTime() > Date.now() - 86400000;
          }
        },
      }
    },
    methods: {
      //出错提示
      messageError(error) {
        console.log(error);
        this.$message({
          showClose: true,
          message: '加载失败，请重试。',
          duration: 0,
          type: 'error'
        });
      },
      getNumberOfCacheBefore(str) {
        let date = new Date(str.slice(0, 4), str.slice(4, -2) - 1, str.slice(6));
        date.setDate(date.getDate() + 1);
        return this.getNumberOfDate(date)
      },
      getNumberOfDate(dat) {
        let month = dat.getMonth() + 1;
        let date = dat.getDate();
        return dat.getFullYear() + '' + (month < 10 ? ('0' + month) : month) + '' + (date < 10 ? ('0' + date) : date);
      },
      getArticleFromApi(fullData, stories) {
        let vm = this;
        let story_count = 0;
        stories.forEach(function (story) {
          let articleId = story.id;
          fullData.stories[articleId] = {};
          fullData.stories[articleId].info = story;
          api.getArticle(String(story.id)).then(data => {
            fullData.stories[articleId].content = data;
            story_count += 1;
          }).catch(error => {
            console.log(error);
            vm.fullscreenLoading = false;
            vm.messageError(error);
          });
        });
        let interval = setInterval(() => {
          if (story_count === stories.length) {
            vm.stories = fullData.stories;
            localStorage.setItem('daily_cache', JSON.stringify(fullData));
            vm.fullscreenLoading = false;
            clearInterval(interval);
          }
        }, 500);
      },
      getFullFromApi() {
        let daily_cache = localStorage.getItem('daily_cache');
        let cache = JSON.parse(daily_cache);
        if (daily_cache && cache.date === this.dateText) {
          this.stories = cache.stories
        } else {
          let vm = this;
          vm.fullscreenLoading = true;
          let fullData = {};
          fullData.stories = {};
          api.getDay(this.dateText).then((data) => {
            fullData.date = data.date;
            let stories = data.stories;
            this.getArticleFromApi(fullData, stories)
          }).catch(function (error) {
            console.log(error);
            vm.fullscreenLoading = false;
            vm.messageError(error);
          });
        }
      },
      searchArticle() {
        this.$router.push({name: 'Search', params: this.searchOptions});
      },
      readsStory(storyId) {
        this.changeRouter(`/article/${storyId}`)
      },
      getTodayData() {
        this.dateText = this.yesterdayText;
        this.getFullFromApi();
      },
      handleDateChange(date) {
        this.getFullFromApi();
      },
      changeRouter(path) {
        sessionStorage.setItem('home_pos', $(window).scrollTop());
        this.$router.push(path);
      },
      init() {
        let now = new Date();
        let yes = new Date();
        yes.setDate(yes.getDate() - 1);
        this.yesterdayText = this.getNumberOfDate(yes);
        let beforeYes = new Date();
        beforeYes.setDate(yes.getDate() - 2);
        let beforeyesterdayText = this.getNumberOfDate(beforeYes);
        let daily_cache = localStorage.getItem('daily_cache');
        if (!daily_cache) {
          this.dateText = this.yesterdayText;
          this.getFullFromApi();
        } else if (daily_cache) {
          let cache = JSON.parse(daily_cache);
          let cache_date = cache.date;
          this.dateText = cache_date;
          //解决凌晨日期还为前一天的问题
          if (this.yesterdayText === cache_date || (beforeyesterdayText === cache_date && now.getHours() < 6)) {
            this.stories = cache.stories;
          } else {
            this.stories = cache.stories;
            this.$notify({
              title: '注意：',
              message: `${cache_date}缓存，戳此通知更新。`,
              onClick: this.getTodayData,
              duration: 2888,
            });
          }
        }
        //滚动条定位
        setTimeout(function () {
          $(window).scrollTop(parseInt(sessionStorage.getItem('home_pos')));
        }, 100);
      }
    },
    mounted: function () {
      this.init();

    },
  })
</script>
<style>
  .head {
    border-radius: 4px;
    background: #d3dce6;
    margin-bottom: 10px;
    height: 36px;
  }

  .time {
    font-size: 14px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .el-input__inner {
    height: 36px !important;
  }

  .article-title {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.6em;
    height: 3.2em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
