import request from '../utils/request';
import config from '../utils/config'

export function getXauusdDataService(duration, fromDate) {
  return request(config.wormholeURLPrefix + `/zlmxauusd/${duration}/from/${fromDate.format('YYYY-MM-DD')}`);
}
