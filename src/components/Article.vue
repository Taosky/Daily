<template id="article">
  <el-container>
    <el-header style="padding: 0;height: 38px;width: 100%;position: fixed;top:0;z-index: 1000;">
      <el-row type="flex" justify="center">
        <el-col :md="15">
          <div class="head" :style="{background:scrollBg}">
            <el-col :span="4">
              <el-button @click="backHome"
                         style="color:#409EFF;width: 100%;background-color: transparent;border: none;">
                <span class="el-icon-back"></span>
              </el-button>
            </el-col>
            <el-col :span="16" style="line-height: 35px;text-align: center">
              <span class="article_title" v-show="titleShow">{{ this.currentStory.title }}</span>
            </el-col>
            <el-col :span="4">
              <el-button v-show="titleShow" @click="randomArticle"
                         style="width: 100%;background-color: transparent;border: none;">
                <span class="el-icon-arrow-right"></span>
              </el-button>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <div style="margin-top: -18px; padding: 15px;">
      <div class="row">
        <transition name="fade">
          <div class="col-12" @click="articleClick" v-if="currentStoryId">
            <div v-html="currentStory.body">
            </div>
            <!--<el-button class="back-to-top" size="small" @click="backToTop">To top</el-button>-->
            <el-button v-if="commentButton" class="back-to-top" size="small" @click="goToComments">查看评论</el-button>
          </div>
        </transition>
      </div>
    </div>
    <el-footer style="height: auto;">
      <div style="margin-top: -18px;">
        <div class="col-12">
          <div class="comments-container main-wrap">
            <div class="top-bar">
              <div class="top-bar-title">
                {{ commentCount }}条评论
              </div>
              <div class="top-bar-option">
                <el-checkbox style="margin-right:10px;font-size: 14px;" v-model="commentLong"
                             @change="getComment(commentSort)">长评论
                </el-checkbox>
                <button v-if="commentSort==='likes'" @click="getComment('time')" class="option-button">
                  <i class="el-icon-sort"></i>切换为时间排序
                </button>
                <button v-else @click="getComment('likes')" class="option-button">
                  <i class="el-icon-sort"></i>切换为默认排序
                </button>
              </div>
            </div>
            <div style="text-align: center;" v-if="commentLoading">
              <i style="font-size:24px;" class="el-icon-loading"></i>
            </div>
            <div style="text-align: center;" v-if="commentCount===0 && !commentLoading">
              <p style="color: darkgray;">暂无评论</p>
            </div>
            <div class="comment-l">
              <div class="comment-i" v-for="comment in comments">
                <div>
                  <div class="comment-i-meta">
                    <span class="user-avatar"><img width="24" height="24" :src="comment.avatar"/></span>
                    <span class="user-name">{{comment.author}}</span>
                    <span class="time" :timestamp="comment.time*1000">{{ fromTime(comment.time*1000)}} </span>
                  </div>
                  <div class="comment-i-content">
                    {{ comment.content }}
                  </div>
                  <div class="comment-i-footer">
                    <span style="color: #8590a6;font-size: 15px;" class="far fa-thumbs-up"> {{comment.likes}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-footer>
    <el-row element-loading-text="加载中......"
            v-loading.fullscreen.lock="fullscreenLoading"></el-row>
  </el-container>
</template>

<script>
  import api from '../api'
  import {getFromTime, replaceBody, sleep} from '../uutils'

  export default {
    data: function () {
      return {
        cacheName: '',
        currentStory: {
          body: '',
          img_source: '',
          image: '',
          title: ''
        },
        comments: [],
        commentCount: 0,
        commentSort: 'likes',
        commentLoading: 'false',
        commentButton: true,
        commentLong: false,
        currentStoryId: '',
        clickCount: 0,
        clickTimer: null,
        errorMessage: '',
        fullscreenLoading: false,
        scrollBg: 'rgba(211,220,230,0)',
        titleShow: false,
        commentOn: false
      }
    },
    methods: {
      //出错提示
      messageError(error) {
        this.fullscreenLoading = false;
        console.log(error);
        this.$message({
          showClose: true,
          message: '加载失败，请重试。',
          duration: 0,
          type: 'error'
        });
      },
      fromTime(timestamp) {
        return getFromTime(timestamp)
      },
      showStory(story) {
        //替换图片链接
        this.currentStory.body = replaceBody(story);
        this.currentStory.img_source = story['image_source'];
        this.currentStory.title = story.title;
        this.currentStory.image = story.image;
      },
      getIndexOfCache(storyId, cache) {
        let result = null;
        cache.stories.forEach((story, index) => {
          if (story.info.id === Number(storyId)) {
            result = index;
          }
        });
        return result;
      },
      //缓存或网络获取内容
      getContent() {
        let vm = this;
        const storyId = this.currentStoryId;
        setTimeout(function () {
          $(window).scrollTop(0);
        }, 100);
        let daily_cache = localStorage.getItem(this.cacheName);
        let storyIndex = null;
        if (daily_cache) {
          storyIndex = this.getIndexOfCache(storyId, cache);
        }
        if (daily_cache && storyIndex !== null) {
          let cache = JSON.parse(daily_cache);
          vm.showStory(cache.stories[storyIndex].content);
          if (localStorage.getItem('daily_vue_first_use') !== 'false') {
            this.$notify({
              title: '操作提示：',
              message: '1.双击随机一篇文章， ' +
                '2.点击左上角“知乎日报”可返回列表， ' +
                '3.浏览器后退有效， ' +
                '4.数据已存储到本地，日期变化时重新加载。',
              duration: 0,
            });
            localStorage.setItem('daily_vue_first_use', 'false');
          }
        } else {
          vm.fullscreenLoading = true;
          api.getArticle(storyId).then((data) => {
            vm.showStory(data);
            sleep(300).then(() => {
              vm.fullscreenLoading = false;
            });
          }).catch((error) => {
            vm.messageError(error);
          });
        }
      },
      getComment(sort = 'likes') {
        this.commentOn = true;
        let vm = this;
        vm.comments = [];
        vm.commentSort = sort;
        vm.commentLoading = true;
        let post_data = {article_id: this.currentStoryId, order_by: vm.commentSort};
        //长评
        if (this.commentLong) {
          post_data.type = 'long';
        }
        api.searchComment(post_data).then((data) => {
          vm.commentCount = data.comments.length;
          data.comments.forEach((one_comment,) => {
            one_comment.avatar = `https://images.weserv.nl/?url=${one_comment.avatar}`;
          });
          vm.comments = data.comments;
          vm.commentLoading = false;
        }).catch(error => {
          vm.commentLoading = false;
          vm.messageError(error);
        });
      },
      backToTop() {
        $('html,body').animate({scrollTop: 0}, 400);
      },
      goToComments() {
        $('html,body').animate({scrollTop: $('.comments-container')[0].offsetTop - 50}, 400);
      },
      articleClick() {
        this.clickCount++;
        if (this.clickCount === 1) {
          let vm = this;
          this.clickTimer = setTimeout(function () {
            vm.clickCount = 0;
          }, 700)
        } else {
          this.randomArticle();
          clearTimeout(this.clickTimer);
          this.clickCount = 0;
        }
      },
      backHome() {
        if (this.cacheName === 'daily_cache') {
          this.$router.push({name: 'Home'})
        } else if (this.cacheName === 'search_cache') {
          const cache = JSON.parse(localStorage.getItem(this.cacheName));
          this.$router.push({name: 'Search', params: cache.searchOptions})
        }
      },
      randomArticle() {
        let daily_cache = localStorage.getItem(this.cacheName);
        let cache = JSON.parse(daily_cache);
        if (daily_cache) {
          let aids = [];
          for (let index in cache.stories) {
            aids.push(index);
          }
          let randomIndex = aids[Math.floor(Math.random() * aids.length)];
          if (this.cacheName === 'daily_cache') {
            this.$router.push({path: `/article/${cache.stories[randomIndex].info.id}`})
          } else if (this.cacheName === 'search_cache') {
            this.$router.push({path: `/articleSearch/${cache.stories[randomIndex].info.id}`})
          }
        }
        else {
          console.log('no more article');
        }
      },
      handleScroll() {
        //标题显隐
        this.titleShow = window.scrollY > 276;
        //评论延迟加载
        if (window.scrollY > 300 && !this.commentOn) {
          this.getComment();
        }
        //头部头透明度
        this.scrollBg = `rgba(211,220,230,${window.scrollY * 0.004})`;
        //评论按钮显隐
        const commentNode = $('.comments-container')[0];
        if (commentNode) {
          this.commentButton = window.scrollY < commentNode.offsetTop - 600;
        }
      }
      ,
      init() {
        this.commentOn = false;
        if (this.$route.name === 'Article') {
          this.cacheName = 'daily_cache';
        } else if (this.$route.name === 'ArticleSearch') {
          this.cacheName = 'search_cache';
        }
        this.currentStoryId = this.$route.params.aid;
        this.getContent();
      }
    },

    watch: {
      $route: function () {
        this.init();
      }
    },
    mounted: function () {
      this.init();
      window.addEventListener('scroll', this.handleScroll);
    }
  }
</script>
<style>
  .head {
    border-radius: 4px;
    background: #d3dce6;
    margin-bottom: 10px;
    height: 36px;
  }

  .back-to-top {
    position: fixed;
    right: 5%;
    bottom: 8%;
    opacity: 0.8;
  }

  .comments-container {
    margin-bottom: 40px;
  }

  .top-bar {
    margin-bottom: 20px;
  }

  .top-bar-title {
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
    font-synthesis: style;
    color: #1a1a1a;
  }

  .top-bar-option {
    display: inline-block;
    float: right;
  }

  .comment-i {
    margin-bottom: 20px;
  }

  .comment-i-meta {
    position: relative;
    height: 27px;
    padding-right: 3px;
    padding-left: 1px;
    margin-bottom: 6px;
    line-height: 24px;
  }

  .comment-i-meta .user-name, .comment-i-meta .user-avatar {
    color: inherit;
    text-decoration: none;
    line-height: 24px;
    font-size: 15px;
    padding: 2px;
  }

  .comment-i-meta .time {
    float: right;
    font-size: 14px;
    color: #8590a6;
  }

  .comment-i-content {
    margin-bottom: 6px;
    line-height: 25px;
  }

  .comment-i:before {
    position: relative;
    top: -10px;
    left: 0;
    right: 0;
    display: block;
    border-bottom: 1px solid #e0d6d65c;
    content: "";
  }

  .option-button {
    display: inline-block;
    border: none;
    font-size: 14px;
    color: #8590a6;
    text-align: center;
    cursor: pointer;
    background: transparent none;
    outline: none;
  }

  .article_title {
    display: inline-block;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #3f3f3f;
    text-align: center;
    white-space: nowrap;
    width: 100%;
  }

</style>
