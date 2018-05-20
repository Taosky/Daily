<template id="home">
  <el-container>
    <el-header style="padding: 0;height: 38px;width: 100%;position: fixed;top:0;z-index: 1000;">
      <el-row type="flex" justify="center">
        <el-col :md="15">
          <div class="head">
            <el-col :span="12">
              <h5 style="text-align: center;margin-top: 6px;font-weight: inherit;">知乎日报</h5>
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
                :editable=false
                :clearable=false>
              </el-date-picker>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="padding-left: 15px;padding-right: 15px;padding-top: 48px;">
      <el-row type="flex" justify="center">
        <el-col :md="{span:14}">
          <el-row :gutter="30">
            <el-col :span="12" :md="6" :sm="8" v-for="story in stories" :key="story.id">
                <el-card :body-style="{ padding: '0px' }">
                  <img :src="story.content.image.replace(/(https|http):\/\/(.*?)/g, 'https://images.weserv.nl/?url=$2')"
                       class="image"
                       @click="readsStory(story.info.id);">
                  <div style="padding: 14px;" @click="readsStory(story.info.id);">
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
  </el-container>
</template>
<script>
  import axios from 'axios'

  export default ({
    data: function () {
      return {
        stories: null,
        fullscreenLoading: false,
        todayText: '',
        dateText: '',
        scrollPosition: 0,
      }
    },
    methods: {
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
          axios.get(`https://api.mou.science/daily/api/4/news/before/${this.dateText}`).then((response) => {
            fullData.date = response.data.date;
            let stories = response.data.stories;
            let promises = [];
            stories.forEach(function (story) {
              let articleId = story.id;
              fullData.stories[articleId] = {};
              fullData.stories[articleId].info = story;
              let story_api = `https://api.mou.science/daily/api/4/news/${articleId}`;
              promises.push(axios.get(story_api));
            });
            axios.all(promises).then(function (results) {
              results.forEach(function (response) {
                fullData.stories[response.data.id].content = response.data;
              });
              if (vm.todayText === vm.dateText) {
                axios.get('https://api.mou.science/daily/api/4/news/latest').then((response) => {
                  fullData.date = response.data.date;
                  let stories_top = response.data.stories;
                  let promises = [];
                  stories_top.forEach(function (story_top) {
                    let articleId_top = story_top.id;
                    if (!fullData.stories[articleId_top]) {
                      fullData.stories[articleId_top] = {};
                      fullData.stories[articleId_top].info = story_top;
                      let story_api = `https://api.mou.science/daily/api/4/news/${articleId_top}`;
                      promises.push(axios.get(story_api));
                    }

                  });
                  axios.all(promises).then(function (results_top) {
                    results_top.forEach(function (response_top) {
                      fullData.stories[response_top.data.id].content = response_top.data;
                    });
                    vm.stories = fullData.stories;
                    localStorage.setItem('daily_cache', JSON.stringify(fullData));
                    vm.fullscreenLoading = false;
                  });
                });
              }
              else {
                vm.stories = fullData.stories;
                localStorage.setItem('daily_cache', JSON.stringify(fullData));
                vm.fullscreenLoading = false;
              }
            });
          }).catch(function (error) {
            vm.fullscreenLoading = false;
            vm.$message({
              showClose: true,
              message: '加载失败，请重试。',
              duration: 0,
              type: 'error'
            });
            console.log(error);
          });
        }
      },

      readsStory(storyId) {
        this.changeRouter(`/article/${storyId}`)
      },
      getTodayData() {
        this.dateText = this.todayText
        this.getFullFromApi();
      },
      handleDateChange(date) {
        this.getFullFromApi();
      },
      changeRouter(path) {
        sessionStorage.setItem('home_pos', $(window).scrollTop());
        this.$router.push(path);
      },
    },
    mounted: function () {
      let now = new Date();
      this.todayText = this.getNumberOfDate(now);
      let yes = new Date();
      yes.setDate(yes.getDate() - 1);
      let yesterdayText = this.getNumberOfDate(yes);
      let daily_cache = localStorage.getItem('daily_cache');
      let cache = JSON.parse(daily_cache);
      if (!daily_cache) {
        this.getFullFromApi();
      } else if (daily_cache) {
        let cache_before = cache.date;
        this.dateText = cache_before;
        if (this.todayText === cache_before || (yesterdayText === cache_before && now.getHours() < 6)) {
          this.stories = cache.stories;
        } else {
          this.stories = cache.stories;
          this.$notify({
            title: '注意：',
            message: '此缓存非今天的日报，戳此通知可更新。',
            onClick: this.getTodayData,
            duration: 2888,
          });
        }
      }
      setTimeout(function () {
        $(window).scrollTop(parseInt(sessionStorage.getItem('home_pos')));
      }, 100);
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
    height:3.2em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
