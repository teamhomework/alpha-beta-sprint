const login = document.getElementById('login');
const loginForm = document.getElementById('loginForm');
const enroll = document.getElementById('enroll');
const enrollForm = document.getElementById('enrollForm');
const back = document.getElementById('back');
const eback = document.getElementById('eback');
const enrollwin = document.getElementById('enrollwin');

login.addEventListener('click', function() {
  loginForm.style.display = 'block';
});

back.addEventListener('click', function() {
  loginForm.style.display = 'none';
});

enroll.addEventListener('click', function() {
  enrollForm.style.display = 'block';
});

eback.addEventListener('click', function() {
  enrollForm.style.display = 'none';
});

document.getElementById('firstenroll').addEventListener('click', function() {
  enrollForm.style.display = 'none';

  // 显示文字
  enrollwin.style.display = 'block';

  // 设置定时器，在3秒后隐藏文字
  setTimeout(function() {
    enrollwin.style.display = 'none';
  }, 3000); // 3000毫秒即3秒
});
