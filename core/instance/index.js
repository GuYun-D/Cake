import { initMixin } from "./init.js";

function Cake(options) {
  this._init(options);
}

initMixin(Cake);

export default Cake;
