var _tracker2 = _interopRequireDefault(require("tracker")).default;
function _interopRequireDefault(e) { _tracker2(); _tracker2(); return e && e.__esModule ? e : { default: e }; }
var test = function () {
  _tracker2();
  console.log('a');
};
function test1() {
  _tracker2();
  console.log('test');
}
class Tes {
  constructor(name) {
    this.name = name;
  }
  getName() {
    _tracker2();
    return this.name;
  }
}
() => {
  _tracker2();
  return '12345';
};