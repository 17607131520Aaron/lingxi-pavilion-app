import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Mine from '~/pages/Mine';
import Register from '~/pages/Register';

const routers = [
  {
    name: 'home',
    component: Home,
    showHeader: true,
    options: { title: '首页' },
  },
  {
    name: 'login',
    component: Login,
    showHeader: true,
    options: { title: '登录' },
  },
  {
    name: 'mine',
    component: Mine,
    showHeader: true,
    options: { title: '我的' },
  },
  {
    name: 'register',
    component: Register,
    showHeader: true,
    options: { title: '注册' },
  },
];

export default routers;
