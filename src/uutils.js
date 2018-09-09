//替换文章图片
function replaceBody(story) {
  return story.body.replace(/<img class="content-image" src="(https|http):\/\/(.*?)"/g, '<img class="content-image" src="https://images.weserv.nl/?url=$2"')
    .replace(/<img src="(https|http):\/\/(pic.*?)"/g, '<img class="content-image" src="https://images.weserv.nl/?url=$2"')
    .replace(/<img class="avatar" src="(https|http):\/\/(.*?)"/g, '<img class="avatar" src="https://images.weserv.nl/?url=$2"')
    .replace('<div class="img-place-holder"></div>', `<div class="img-place-holder" style="height: auto;"><div class="img-wrap">\n<h1 class="headline-title">${story.title}</h1>\n<span class="img-source">${story['image_source']}</span>\n<img src="${story.image ? story.image.replace(/(https|http):\/\/(.*?)/, 'https://images.weserv.nl/?url=$2') : ''}" alt="">\n<div class="img-mask"></div>\n</div></div>`);
}

//替换头图
function replaceContentImg(content) {
  return content.image ? content.image.replace(/(https|http):\/\/(.*?)/g, 'https://images.weserv.nl/?url=$2') : 'https://img01.mou.science/no_image.png';
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

//日期
function getDay(num) {
  let today = new Date();
  let nowTime = today.getTime();
  let ms = 24 * 3600 * 1000 * num;
  today.setTime(parseInt(nowTime + ms));
  let oYear = today.getFullYear();
  let oMoth = (today.getMonth() + 1).toString();
  if (oMoth.length <= 1) oMoth = '0' + oMoth;
  let oDay = today.getDate().toString();
  if (oDay.length <= 1) oDay = '0' + oDay;
  return oYear + oMoth + oDay;
}

//等一等
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


export {getFromTime,replaceContentImg, getDay, replaceBody, sleep};

