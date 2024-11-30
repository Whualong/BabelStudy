var _intl2 = _interopRequireDefault(require(_intl2.t(_intl2.t('intl9')))).default;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const name1 = _intl2.t('intl2');
const name2 = '杰克';
const name1Tep = undefined.t('intl3', name1);
const name2Tep = undefined.t('intl4', name2);
function App() {
  const desc = undefined.t('intl5');
  const desc3 = undefined.t('intl6', title + desc, desc2);
  return <div className={_intl2.t('intl7')} title={_intl2.t('intl8')}>
      <img src={Logo} />
      <h1>${title}</h1>
      <p>${desc}</p>  
      <div>
        {'中文'}
      </div>
    </div>;
}