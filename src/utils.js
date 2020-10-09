import * as R from 'ramda';

/* 
   Updates the state on the passed in React Component if and only if
   it differs from the old state in *value*.
   
   Aptly named because it uses true, immutable equality.
*/
function immutableSetState(obj, state) {
  const newState = R.mergeRight(obj.state, state);
  if (!R.equals(newState, obj.state)) {
    obj.setState(newState);
  }
}

export {immutableSetState};
