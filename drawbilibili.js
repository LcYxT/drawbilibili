// Drawing repost and comment script by TL_YenaDuck in bilibili for 沒丸沒了
// Go to the post page (e.g. https://t.bilibili.com/XXXXXXXXXXXXX) and choose the repost page or comment before continue the followings

max_people = 500;  // first amount of max_people repost in the drawing pool
scroll_interval = 1500; // miliseconds; adjust it if scrolling doesn't work properly

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function scrolltobottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

function getcommentuserlist() {
  comment_object = $(".name").not(".reply-con .user .name").not("span"); // get comments and filter comments in comments
  lower_limit = 0;
  total_len = comment_object.length;
  var user_list = [];
  var mid_list = {};
  for (let i = total_len - 1; i >= 0 ; i--) {
    user = {'user_name': comment_object[i].innerHTML, 'uid': comment_object[i].getAttribute('data-usercard-mid')};
    mid = comment_object[i].getAttribute('data-usercard-mid');
    if (!(mid in mid_list) && user['user_name'] != '没丸没了字幕组'){
      user_list.push(user);
      mid_list[mid] = 1;
      console.log(user['user_name'] + ' 已加入名单');
    }
    else if (user['user_name'] != '没丸没了字幕组'){
      console.log(user['user_name'] + ' 重复评论，已略过');
      total_len--;
    }
    else {
      total_len--;
    }
  }
  return [user_list, user_list.length];
}

function getrepostuserlist() {
  repost_object = document.getElementsByClassName('user-name c-pointer');
  time_object = document.getElementsByClassName('forw-area')[0].getElementsByClassName('time');
  lower_limit = (repost_object.length > max_people) ? (repost_object.length - max_people) : 0;
  total_len = (repost_object.length > max_people) ? (max_people + lower_limit) : repost_object.length;
  var user_list = [];
  var mid_list = {};

  for (let i = repost_object.length - 1; i >= 0 ; i--) {
    dt_splitted = time_object[i].innerText.split(/[\s,-/:]+/)
    var d = new Date(parseInt(dt_splitted[0], 10), parseInt(dt_splitted[1], 10)-1, parseInt(dt_splitted[2], 10), parseInt(dt_splitted[3], 10), parseInt(dt_splitted[4], 10))
    user = {'user_name': repost_object[i].innerHTML, 'uid': repost_object[i].getAttribute('href').split('/')[3], 'datetime': d}
    mid = repost_object[i].getAttribute('href').split('/')[3];
    if (!(mid in mid_list) && user['user_name'] != '没丸没了字幕组'){
      if (user['datetime'] != 'Invalid Date'){
        user_list.push(user);
        mid_list[mid] = 1;
      }
    }
    else if (user['user_name'] != '没丸没了字幕组') {
      console.log(user['user_name'] + ' 重复转发，已略过');
      total_len--;
    }
    else {
      total_len--;
    }
  }
  user_list.sort(function(a, b) {
    return a.datetime - b.datetime;
  });
  user_list = user_list.slice(0, max_people)
  for (let i = 0; i < user_list.length; i++) {
    console.log(user_list[i]['datetime'].getFullYear() + "-"
                + (user_list[i]['datetime'].getMonth()+1)  + "-" 
                + ((user_list[i]['datetime'].getDate() < 10) ? ('0' + user_list[i]['datetime'].getDate()) : user_list[i]['datetime'].getDate()) + " "  
                + ((user_list[i]['datetime'].getHours() < 10) ? ('0' + user_list[i]['datetime'].getHours()) : user_list[i]['datetime'].getHours()) + ":"  
                + ((user_list[i]['datetime'].getMinutes() < 10) ? ('0' + user_list[i]['datetime'].getMinutes()) : user_list[i]['datetime'].getMinutes()) + ' '
                + user_list[i]['user_name'] + ' 已加入名单');
  }
  return [user_list, user_list.length];
}

async function drawcomment() {
  console.log('滚动页面中...')
  prev_scrollheight = 0
  while(document.body.scrollHeight > prev_scrollheight){
    prev_scrollheight = document.body.scrollHeight;
    await scrolltobottom();
    await sleep(scroll_interval);
  }
  comment_user_list_package = await getcommentuserlist();
  comment_user_list = comment_user_list_package[0];
  len = comment_user_list_package[1]
  lucky_commentguy = comment_user_list[getRandomInt(len)];
  console.log('\n\n\n不重复评论人数(不含楼中楼): ' + len)
  console.log('恭喜评论得奖者: ' + lucky_commentguy['user_name'] + ' uid: ' + lucky_commentguy['uid'])
}

async function drawrepost() {
  console.log('滚动页面中...')
  while(document.getElementsByClassName('forw-more')[0].getElementsByClassName('more').length){
    await scrolltobottom();
    await sleep(scroll_interval);
  }
  repost_user_list_package = await getrepostuserlist();
  repost_user_list = repost_user_list_package[0];
  len = repost_user_list_package[1]
  lucky_repostguy = repost_user_list[getRandomInt(len)];
  console.log('\n\n\n已收集前 ' + len + ' 位不重复转发用户')
  console.log('恭喜转发得奖者: ' + lucky_repostguy['user_name'] + ' uid: ' + lucky_repostguy['uid'])
}

// drawcomment();
// drawrepost();
// Drawing repost and comment script by TL_YenaDuck in bilibili for 没丸没了字幕组