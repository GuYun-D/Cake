const arrayPrototype = Array.prototype;
function defArrayFunction(obj, func, namespace, vm) {
  Object.defineProperty(obj, func, {
    enumerable: true,
    configurable: true,
    value: function (...args) {
      let original = arrayPrototype[func];
      const result = original.apply(this, args);
      // constructObjectProxy();
      console.log("函数劫持命名空间", getNameSpace(namespace, ""));
      return result;
    },
  });
}

/**
 * 代理数组的方法
 * @param {*} vm
 * @param {*} arr
 * @param {*} namespace
 */
function proxyArr(vm, arr, namespace) {
  let obj = {
    eleType: "Array",
    toString: function () {
      let result = "";
      for (let i = 0; i < arr.length; i++) {
        result += arr[i] + ", ";
      }
      return result.substring(0, result.length - 2);
    },
    push() {},
    pop() {},
    shift() {},
    unshift() {},
  };

  defArrayFunction.call(vm, obj, "push", namespace, vm);
  defArrayFunction.call(vm, obj, "pop", namespace, vm);
  defArrayFunction.call(vm, obj, "shift", namespace, vm);
  defArrayFunction.call(vm, obj, "unshift", namespace, vm);

  arr.__proto__ = obj;

  return arr;
}

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

      set(value) {
        console.log(getNameSpace(namespace, prop));
        obj[prop] = value;
      },
    });

    Object.defineProperty(vm, prop, {
      configurable: true,
      get() {
        return obj[prop];
      },

      set(value) {
        console.log(getNameSpace(namespace, prop));
        obj[prop] = value;
      },
    });

    if (obj[prop] instanceof Object) {
      proxyObj[prop] = constructProxy(
        vm,
        obj[prop],
        getNameSpace(namespace, prop)
      );
    }
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
    // 通过下标对数据进行捕获的方法是无法监听到的，但是可以监听push，shift登方法的调用
    proxyObj = new Array(obj.length);

    // 对数组元素的修改的监听
    for (let i = 0; i < obj.length; i++) {
      proxyObj[i] = constructProxy(vm, obj[i], namespace);
    }

    // 对数组的修改进行监听
    // proxyObj = proxyArr(vm, obj, namespace);
  } else if (obj instanceof Object) {
    // 对象代理
    proxyObj = constructObjectProxy(vm, obj, namespace);
  } else {
    throw new Error("error");
  }

  return proxyObj;
}

/**
 * 获命令空间名称
 * @param {*} nowNameSpace
 * @param {*} nowProp
 * @returns
 */
function getNameSpace(nowNameSpace, nowProp) {
  if (nowNameSpace == null || nowNameSpace == "") {
    return nowProp;
  } else if (nowProp == null || nowProp == "") {
    return nowNameSpace;
  } else {
    return nowNameSpace + "." + nowProp;
  }
}
