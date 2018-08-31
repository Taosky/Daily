import axios from 'axios'

const baseUrl = '';

function get(url) {
  return new Promise((resolve, reject) => {
    axios.get(baseUrl + url).then(response => {
      if (response.data) {
        resolve(response.data)
      } else {
        reject(response)
      }
    }).catch(error => {
      reject(error);
    });
  })
}

function post(url,data) {
  return new Promise((resolve, reject) => {
    axios.post(baseUrl + url,data).then(response => {
      if (response.data) {
        resolve(response.data)
      } else {
        reject(response)
      }
    }).catch(error => {
      reject(error);
    });
  })
}


export default {
  getDay(dateStr) {
    return get(`/day/${dateStr}`)
  },
  getArticle(id) {
    return get(`/article/${id}`)
  },
  getComment(id) {
    return get(`/comment/${id}`)
  },
  getAuthor(name) {
    return get(`/author/${name}`)
  },
  searchArticle(data){
    return post(`/article/search`,data)
  },
  searchComment(data){
    return post(`/comment/search`,data)
  }
}

