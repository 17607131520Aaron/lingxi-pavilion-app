import AiChat from '~/pages/aiChat';
import Debug from '~/pages/Debug';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Mine from '~/pages/Mine';
import Register from '~/pages/Register';
import Sparepart from '~/pages/sparepart';

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
    showHeader: false,
    options: { title: '我的' },
  },
  {
    name: 'register',
    component: Register,
    showHeader: false,
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
  {
    // 备件管理
    name: 'spareparts',
    component: Sparepart,
    showHeader: false,
    options: { title: '备件管理' },
  },
];

export default routers;
