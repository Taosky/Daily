//替换文章图片
function replaceBody(story) {
  return story.body.replace(/<img class="content-image" src="(https|http):\/\/(.*?)"/g, '<img class="content-image" src="https://images.weserv.nl/?url=$2"')
    .replace(/<img src="(https|http):\/\/(pic.*?)"/g, '<img class="content-image" src="https://images.weserv.nl/?url=$2"')
    .replace(/<img class="avatar" src="(https|http):\/\/(.*?)"/g, '<img class="avatar" src="https://images.weserv.nl/?url=$2"')
    .replace('<div class="img-place-holder"></div>', `<div class="img-place-holder" style="height: auto;"><div class="img-wrap">\n<h1 class="headline-title">${story.title}</h1>\n<span class="img-source">${story['image_source']}</span>\n<img src="${story.image ? story.image.replace(/(https|http):\/\/(.*?)/, 'https://images.weserv.nl/?url=$2') : ''}" alt="">\n<div class="img-mask"></div>\n</div></div>`);
}

//时间
function getFromTime(time) {
  const current_time = Date.parse(new Date());
  const day = Math.round((current_time - time) / (24 * 3600 * 1000));
  if (day === 0) {
    return `${Math.round((current_time - time) / (3600 * 1000))} 小时前`;
  } else if (day > 365) {
    return `${Math.round(day / 365)} 年前`;
  }
  return `${day} 天前`;
}

//等一等
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


export {getFromTime, replaceBody, sleep};

