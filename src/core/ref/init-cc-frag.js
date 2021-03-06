import { CC_FRAGMENT } from '../../support/constant';
import mapRegistrationInfo from '../base/map-registration-info';
import beforeMount from '../base/before-mount';
import buildRefCtx from '../ref/build-ref-ctx';
import * as hf from '../state/handler-factory';
import * as util from '../../support/util';

const { getRegisterOptions, evalState } = util;

export default function (ref) {
  const props = ref.props;
  const registerOptions = getRegisterOptions(props.register);
  const {
    module, renderKeyClasses, tag, lite, compareProps = true, setup, bindCtxToMethod,
    watchedKeys = '-', connect = {}, isSingle, storedKeys = []
  } = registerOptions;

  const state = evalState(registerOptions.state);
  const { ccClassKey, ccKey, ccOption = {} } = props;

  let target_watchedKeys = watchedKeys;
  let target_ccClassKey = ccClassKey;
  let target_connect = connect;

  //直接使用<CcFragment />构造的cc实例, 尝试提取storedKeys, 然后映射注册信息，（注：registerDumb创建的组件已在外部调用过mapRegistrationInfo）
  if (props.__$$regDumb !== true) {
    const { _ccClassKey, _connect } = mapRegistrationInfo(
      module, ccClassKey, renderKeyClasses, CC_FRAGMENT, util.getPassToMapWaKeys(watchedKeys), storedKeys, connect, true
    );
    target_watchedKeys = watchedKeys;
    target_ccClassKey = _ccClassKey;
    target_connect = _connect;
  }
  //直接使用<CcFragment />构造的cc实例，把ccOption.storedKeys当作registerStoredKeys

  buildRefCtx(ref, {
    isSingle, ccKey, connect: target_connect, state, module,
    storedKeys, watchedKeys: target_watchedKeys, tag, ccClassKey: target_ccClassKey, ccOption, type: CC_FRAGMENT
  }, lite);
  ref.ctx.reactSetState = hf.makeRefSetState(ref);
  ref.ctx.reactForceUpdate = hf.makeRefForceUpdate(ref);

  ref.__$$compareProps = compareProps;

  //对于concent来说，ctx在constructor里构造完成，此时就可以直接把ctx传递给beforeMount了，
  //无需在将要给废弃的componentWillMount里调用beforeMount
  beforeMount(ref, setup, bindCtxToMethod);
}