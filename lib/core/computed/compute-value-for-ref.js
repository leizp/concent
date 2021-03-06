"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _pickDepFns = _interopRequireDefault(require("../base/pick-dep-fns"));

var _findDepFnsToExecute = _interopRequireDefault(require("../base/find-dep-fns-to-execute"));

var _constant = require("../../support/constant");

//CcFragment实例调用会提供callerCtx
// stateModule表示状态所属的模块
function _default(ref, stateModule, oldState, committedState, callInfo, isBeforeMount, mergeDeltaToCommitted) {
  if (isBeforeMount === void 0) {
    isBeforeMount = false;
  }

  if (mergeDeltaToCommitted === void 0) {
    mergeDeltaToCommitted = false;
  }

  var refCtx = ref.ctx;
  var deltaCommittedState = Object.assign({}, committedState);
  if (!refCtx.hasComputedFn) return deltaCommittedState;
  var computedDep = refCtx.computedDep,
      refModule = refCtx.module,
      ccUniqueKey = refCtx.ccUniqueKey;
  var computedContainer = refCtx.refComputed;

  if (stateModule !== refModule) {
    // 由changeRefState/broadcastState触发的connectedRefs 触发的计算
    computedContainer = refCtx.connectedComputed[stateModule];
  } // const moduleState = ccContext.store.getState(stateModule);


  var newState = Object.assign({}, oldState, committedState);

  var curDepComputedFns = function curDepComputedFns(committedState, isBeforeMount) {
    return (0, _pickDepFns["default"])(isBeforeMount, _constant.CATE_REF, 'computed', computedDep, stateModule, oldState, committedState, ccUniqueKey);
  }; // 触发依赖stateKeys相关的computed函数


  (0, _findDepFnsToExecute["default"])(ref, stateModule, refModule, oldState, curDepComputedFns, committedState, newState, deltaCommittedState, callInfo, isBeforeMount, 'computed', _constant.CATE_REF, computedContainer);

  if (mergeDeltaToCommitted) {
    Object.assign(committedState, deltaCommittedState);
  }

  return deltaCommittedState;
}