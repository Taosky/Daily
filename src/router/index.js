import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Article from '@/components/Article'
import Search from '@/components/Search'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },{
      path: '/search',
      name: 'Search',
      params:{
        query:'',
        author: '',
        type: ''
      },
      component: Search
    },
    {
      path: '/article/:aid',
      name: 'Article',
      component: Article
    },
    {
      path: '/articleSearch/:aid',
      name: 'ArticleSearch',
      component: Article
    }
  ]
})
