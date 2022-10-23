let uid = 0;

export function initMixin(Cake) {
  Cake.prototype._init = function (options) {
    const vm = this;
    vm.uid = uid++;
    vm._isCake = true;

    // 初始化数据
    // 初始化created方法
    // 初始化methods
    // 初始化computed
    // 初始化el并挂载
  };
}
