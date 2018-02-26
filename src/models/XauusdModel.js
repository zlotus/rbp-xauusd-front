import * as xauusdService from '../services/xauusdService'
import * as moment from 'moment';
import {isEmpty} from 'lodash'

export default {
  namespace: 'xauusd',
  state: {
    duration: '1d',
    fromDate: moment(),
    data: []
  },
  subscriptions: {
    setup({dispatch, history}) {  // eslint-disable-line
      return history.listen(({pathname}) => {
        if (pathname === '/charts') {
          dispatch({type: 'getXauusdData', payload: {duration: '1d'}});
        }
      });
    },
  },

  effects: {
    * getXauusdData({payload: {duration, fromDate}}, {call, select, put}) {  // eslint-disable-line
      if (isEmpty(fromDate)) {
        fromDate = yield select(state => state.xauusd.fromDate);
      }
      if (isEmpty(duration)) {
        duration = yield select(state => state.xauusd.duration);
      }
      let result = yield call(xauusdService.getXauusdDataService, duration, fromDate);
      yield put({
        type: 'updateData',
        payload: result.data.xauusd_history
      });
    },
  },
  reducers: {
    updateDuration(state, {payload: duration}) {
      return {...state, duration};
    },
    updateData(state, {payload: data}) {
      return {...state, data};
    },
    updateFromDate(state, {payload: fromDate}) {
      return {...state, fromDate};
    },
  },
};
