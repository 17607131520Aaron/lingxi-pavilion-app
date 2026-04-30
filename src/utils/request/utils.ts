// 取消、超时、HTTP 状态和普通异常状态吗
export const errorCodes = [401, 403, 404, 500];
// 取消、超时、HTTP 状态和普通异常统一映射成可读错误文案
export const extractErrorMessage = Object.freeze({
  401: '登录状态已失效，请重新登录',
  403: '无权限访问',
  404: '请求的资源不存在',
  500: '服务器异常，请稍后再试',
});
