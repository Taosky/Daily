<template id="search">
  <el-container>
    <!--search tag-->
    <el-header>
      <el-row type="flex" justify="center" style="margin-top:10px;">
        <el-col :md="{span:14}">
          <el-button @click="backHome" icon="el-icon-back" type="warning" circle></el-button>
          <div class="search-tags">
            <el-tag class="search-option" v-show="searchOptions.query" type="" closable
                    :disable-transitions="false"
                    @close="handleOptionClose('query')">{{searchOptions.query}}
            </el-tag>
            <el-tag class="search-option" v-show="searchOptions.author" type="success" closable
                    :disable-transitions="false"
                    @close="handleOptionClose('author')">{{searchOptions.author}}
            </el-tag>
            <el-tag class="search-option" v-show="searchOptions.type" type="info" closable
                    :disable-transitions="false"
                    @close="handleOptionClose('type')">{{articleType}}
            </el-tag>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <!--main-->
    <el-row v-loading="loading"></el-row>
    <el-main style="padding-left: 15px;padding-right: 15px;padding-top: 0;">
      <!--prev page-->
      <el-row v-show="searchOptions.page>1 && !loading" type="flex" justify="center">
        <el-button @click="goToPage(searchOptions.page + 1)" style="background: none;border:none;"
                   icon="el-icon-arrow-up"></el-button>
      </el-row>
      <!--articles-->
      <el-row type="flex" justify="center">
        <el-col :md="{span:14}">
          <el-row :gutter="30">
            <el-col :span="24" :md="12" :sm="12" v-for="story in stories" :key="story.id">
              <el-card style="width:100%;height: 5.5em;"
                       :body-style="{ padding: '0px',height: '5.5em',width:'100%',display:'table' }">
                <div style="display:table-cell;vertical-align: top; width:5.5em;">
                  <img
                    :src="story.content.image"
                    class="image"
                    @click="readsStory(story.info.id)">
                </div>
                <div style="display:table-cell;padding: 0.6em;" @click="readsStory(story.info.id)">
                  <span class="article-title">{{ story.info.title }}</span>
                  <div class="clearfix">
                    <time class="time">{{ story.info.authors.slice(0,2).join(' • ')}}</time>
                    <time style="float: right;" class="time">{{ story.info.date }}</time>
                  </div>
                </div>
              </el-card>
              <br>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!--next page-->
      <el-row v-show="searchOptions.page *limit < total && !loading" type="flex" justify="center">
        <el-button @click="goToPage(searchOptions.page +1)" style="background: none;border:none;"
                   icon="el-icon-arrow-down"></el-button>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
  import api from "../api";
  import {replaceContentImg} from "../uutils"

  export default ({
    data: function () {
      return {
        stories: [],
        searchOptions: {
          query: '',
          author: '',
          type: '',
          page: 1,
        },
        limit: 15,
        total: 0,
        loading: false,
        scrollPosition: 0,
      }
    },
    computed: {
      articleType: function () {
        const type = this.searchOptions.type;
        if (type === 'xiaoshi') {
          return '小事';
        }
        if (type === 'dawu') {
          return '大误';
        }
        if (type === 'xiache') {
          return '瞎扯';
        }
      },
    },
    methods: {
      //出错提示
      messageError(error) {
        this.loading = false;
        console.log(error);
        this.$message({
          showClose: true,
          message: '加载失败，请重试。',
          duration: 0,
          type: 'error'
        });
      },
      getArticleFromApi(fullData, stories) {
        let vm = this;
        fullData.stories = [];
        let promises = [];
        stories.forEach(function (story) {
          promises.push(api.getArticle(String(story.id)));
        });

        Promise.all(promises).then((values) => {
          values.forEach((content, index) => {
            content.image = replaceContentImg(content);
            fullData.stories.push({content:content, info:stories[index]});
          });
          vm.stories = fullData.stories;
          localStorage.setItem('search_cache', JSON.stringify(fullData));
          vm.loading = false;
        }).catch((error) => {
          this.messageError(error);
        });
      },
      searchArticle() {
        this.stories = [];
        let vm = this;
        vm.loading = true;
        let fullData = {searchOptions: this.searchOptions, stories: {}};
        api.searchArticle(this.searchOptions).then((data) => {
          this.total = data.total;
          fullData.total = data.total;
          const stories = data.articles;
          this.getArticleFromApi(fullData, stories)
        }).catch(function (error) {
          vm.messageError(error);
        });
      },
      goToPage(page) {
        this.searchOptions.page = page;
        this.searchArticle();
      },
      readsStory(storyId) {
        this.changeRouter(`/articleSearch/${storyId}`)
      },
      changeRouter(path) {
        sessionStorage.setItem('search_pos', $(window).scrollTop());
        this.$router.push(path);
      },
      backHome() {
        this.$router.push({name: 'Home'});
      },
      handleOptionClose(tag) {
        this.searchOptions[tag] = '';
        this.searchOptions.page = 1;
        this.searchArticle();
      },

      init() {
        //获取参数
        this.searchOptions = this.$route.params;
        //获取缓存，否则请求数据
        let search_cache = localStorage.getItem('search_cache');
        const cache = JSON.parse(search_cache);
        if (search_cache && JSON.stringify(cache.searchOptions) === JSON.stringify(this.searchOptions)) {
          this.stories = cache.stories;
          this.total = cache.total;
        } else {
          this.searchArticle();
        }
        //滚动条定位
        setTimeout(function () {
          $(window).scrollTop(parseInt(sessionStorage.getItem('search_pos')));
        }, 100);
      }
    },
    mounted: function () {
      this.init();
    },
  })
</script>
<style>
  .el-loading-mask {
    background-color: rgb(245, 248, 250) !important;
    margin-top: 50px;
  }

  .time {
    font-size: 14px;
    color: #999;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: inline-block;
    vertical-align: top;
  }

  .clearfix {
    line-height: 1.6em;
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

  .search-tags {
    display: inline-block;
    padding-left: 10px;
  }

  .search-option {
    margin-left: 5px;
    font-size: 18px;
  }
</style>
