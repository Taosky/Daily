<template id="article">
  <el-container>
    <el-header style="padding: 0;height: 38px;width: 100%;position: fixed;top:0;z-index: 1000;">
      <el-row type="flex" justify="center">
        <el-col :md="15">
          <div class="head" :style="{opacity:scrollOpacity}">
            <el-col :span="4">
              <el-button @click="backHome" style="width: 100%;background-color: transparent;border: none;">
                <span class="el-icon-back"></span>
              </el-button>
            </el-col>
            <el-col :span="16">
              <table style="height: 100%;margin-top: 5px; width: 100%;">
                <tr>
                  <td>
                    <span
                      style="display: -webkit-box;-webkit-box-orient: vertical; -webkit-line-clamp:1;overflow: hidden;text-overflow: ellipsis;color: #3f3f3f;text-align: center;word-break: break-all;"
                      v-show="titleShow">{{ this.currentStory.title }}</span>
                  </td>
                </tr>
              </table>
            </el-col>
            <el-col :span="4">
              <el-button @click="randomArticle" style="width: 100%;background-color: transparent;border: none;">
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
          </div>
        </transition>
      </div>
    </div>
  </el-container>
</template>

<script>
  export default {
    data: function () {
      return {
        currentStory: {
          body: '',
          img_source: '',
          image: '',
          viewMore: '',
          title: ''
        },
        currentStoryId: '',
        clickCount: 0,
        clickTimer: null,
        errorMessage: '',
        fullscreenLoading: false,
        scrollOpacity: 0,
        titleShow: false,
      }
    },
    methods: {
      getContent(storyId) {
        setTimeout(function () {
          $(window).scrollTop(0);
        }, 100);
        let daily_cache = localStorage.getItem('daily_cache');
        let cache = JSON.parse(daily_cache);
        if (daily_cache) {
          let story = null;
          story = cache.stories[storyId].content;
          this.currentStory.body = story.body.replace(/<img class="content-image" src="(https|http):\/\/(.*?)"/g,
            '<img class="content-image" src="https://images.weserv.nl/?url=$2"').replace(/<img class="avatar" src="(https|http):\/\/(.*?)"/g,
            '<img class="avatar" src="https://images.weserv.nl/?url=$2"').replace('<div class="img-place-holder"></div>', `<div class="img-place-holder" style="height: auto;"><div class="img-wrap">\n<h1 class="headline-title">${story.title}</h1>\n<span class="img-source">${story['image_source']}</span>\n<img src="${story.image ? story.image.replace(/(https|http):\/\/(.*?)/, 'https://images.weserv.nl/?url=$2'): ''}" alt="">\n<div class="img-mask"></div>\n</div></div>`);
          this.currentStory.img_source = story['image_source'];
          this.currentStory.title = story.title;
          this.currentStory.image = story.image;
          let viewMores = story.body.match(/class="view-more"><a href="(.+?)">/);
          if (viewMores) {
            this.currentStory.viewMore = viewMores[1];
          } else {
            this.currentStory.viewMore = '#';
          }
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
        }

      },
      backToTop() {
        $('html,body').animate({scrollTop: 0}, 400);
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
        this.$router.push({path: '/'})
      },
      randomArticle() {
        let daily_cache = localStorage.getItem('daily_cache');
        let cache = JSON.parse(daily_cache);
        if (daily_cache) {
          let aids = [];
          for (let aid in cache.stories) {
            aids.push(aid);
          }
          let randomAid = aids[Math.floor(Math.random() * aids.length)];
          this.$router.push(
            {path: `/article/${randomAid}`}
          )
        }
      },
      handleScroll() {
        this.titleShow = window.scrollY > 276;
        this.scrollOpacity = window.scrollY * 0.004;
      }
    },
    watch: {
      $route: function () {
        let vm = this;
        this.currentStoryId = '';
        setTimeout(function () {
          vm.currentStoryId = vm.$route.params.aid;
        }, 300);

        this.getContent(this.$route.params.aid);
      }
    },
    mounted: function () {
      window.addEventListener('scroll', this.handleScroll);
      this.currentStoryId = this.$route.params.aid;
      this.getContent(this.$route.params.aid);
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
    right: 15px;
    bottom: 20px;
    opacity: 0.8;
  }


</style>
