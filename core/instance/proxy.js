/**
 * 代理对象
 * @param {*} vm 同下
 * @param {*} obj 同下
 * @param {*} namespace 同下
 */
function constructObjectProxy(vm, obj, namespace) {
  let proxyObj = {};

  for (const prop in obj) {
    Object.defineProperty(proxyObj, prop, {
      configurable: true,
      get() {
        return obj[prop];
      },

      set(value){
        // TODO
        obj[prop] = value
      }
    });


    Object.defineProperty(vm, prop, {
      configurable: true,
      get() {
        return obj[prop];
      },

      set(value){
        // TODO
        obj[prop] = value
      }
    });
  }

  return proxyObj;
}

/**
 * 代理方法
 * @description 代理的目标应该是对象或者数组
 *              因为我们要知道哪个属性被修改了，才能对页面上的内容进行更新
 *              所以我们必须先能够捕获修改这个事件，使用代理的方式来实现监听属性的修改
 *
 * @param {Object} vm Cake 对象
 * @param {*} obj 要代理的对象
 * @param {*} namespace
 */
export function constructProxy(vm, obj, namespace) {
  let proxyObj = null;

  if (obj instanceof Array) {
  } else if (obj instanceof Object) {
    // 对象代理
    proxyObj = constructObjectProxy(vm, obj, namespace);
  } else {
    throw new Error("error");
  }

  return proxyObj
}
