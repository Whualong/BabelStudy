var _intl2 = _interopRequireDefault(require("intl")).default;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const name1 = 'jacker';
const name2 = '杰克';
const name1Tep = `hello${name1}`;
const name2Tep = /*i18n-disabled*/`你好${name2}`;
function App() {
  const desc = `desc`;
  const desc3 = `aaa ${title + desc} bbb ${desc2} ccc`;
  return <div className="app" title={"测试"}>
      <img src={Logo} />
      <h1>${title}</h1>
      <p>${desc}</p>  
      <div>
        {'中文'}
      </div>
    </div>;
}