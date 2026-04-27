import AiChat from '~/pages/aiChat';
import Debug from '~/pages/Debug';
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
  {
    name: 'debug',
    component: Debug,
    showHeader: true,
    options: { title: '调试' },
  },
  {
    name: 'aiChat',
    component: AiChat,
    showHeader: true,
    options: { title: 'AI对话' },
  },
];

export default routers;
