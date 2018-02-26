import React from 'react';
import {connect} from 'dva';
import {Chart, Geom, Axis, Tooltip, Legend, View} from 'bizcharts';
import {Row, Col, Radio, Spin, DatePicker} from 'antd';
import {DataSet} from '@antv/data-set';
import {isEmpty} from 'lodash'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const XauusdPage = ({dispatch, xauusd, loading}) => {
  let xauusdChart = <div/>;
  if (!isEmpty(xauusd.data)) {
    const scale1 = {
      time: {
        alias: '时间',
      },
      value: {
        alias: '指数'
      }
    };
    const scale2 = {
      time: {
        alias: '时间',
      },
      value: {
        alias: '比例',
      }
    };

    const ds = new DataSet();
    const dv = ds.createView().source(xauusd.data).transform({
      type: 'map',
      callback(row) {
        return {
          time: row[0],
          price: row[1],
          fxpro: row[2],
          average: row[3],
          dukscopy: row[4],
          ftroanda: row[5],
          fxcm: row[6],
          myfxbook: row[7],
          saxobank: row[8],
        };
      }
    }).transform({
      type: 'fold',
      fields: ['price', 'fxpro', 'average', 'dukscopy', 'ftroanda', 'fxcm', 'myfxbook', 'saxobank'],
      key: 'indexName',
      value: 'value',
    });
    const dv1 = ds.createView().source(dv.rows.filter((row) => row.indexName === 'price'));
    const dv2 = ds.createView().source(dv.rows.filter((row) => row.indexName !== 'price'));
    xauusdChart = (
      <Chart height={400} forceFit padding={[20, 50, 80, 50]}>
        <Legend name="indexName" position="bottom" title={null}/>
        <Tooltip crosshairs={{type: "y"}}/>
        <View data={dv1} scale={scale1}>
          <Axis name="time"/>
          <Axis name="value"/>
          <Geom type="line" position="time*value" color={'indexName'} size={3}
                tooltip={['time*value*indexName', (time, value, indexName) => {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: 'XAUUSD',
                    value: value
                  };
                }]}/>
        </View>
        <View data={dv2} scale={scale2}>
          <Axis name="time" visible={false}/>
          <Axis name="value" position={'right'} grid={null}/>
          <Geom type="line" position="time*value" color={'indexName'} size={1}/>
        </View>
      </Chart>
    );
  }
  const handleDurationRadioChange = (e) => {
    dispatch({
      type: 'xauusd/updateDuration',
      payload: e.target.value,
    });
    dispatch({
      type: 'xauusd/getXauusdData',
      payload: {duration: e.target.value},
    });
  };
  const handleDatePickerChange = (date, dateString) => {
    dispatch({
      type: 'xauusd/updateFromDate',
      payload: date,
    });
    dispatch({
      type: 'xauusd/getXauusdData',
      payload: {fromDate: date},
    });
  };
  return (
    <Spin spinning={loading.global}>
      <Row>
        {xauusdChart}
      </Row>
      <Row type="flex" justify="center" gutter={16}>
        <Col>
          <RadioGroup onChange={handleDurationRadioChange}
                      defaultValue={xauusd.duration}>
            <RadioButton value={'4h'}>四小时</RadioButton>
            <RadioButton value={'1d'}>一天</RadioButton>
            <RadioButton value={'1w'}>一周</RadioButton>
          </RadioGroup>
        </Col>
        <Col>
          <DatePicker placeholder="选择一周" defaultValue={xauusd.fromDate} onChange={handleDatePickerChange}/>
        </Col>
      </Row>
    </Spin>
  );

};

XauusdPage.propTypes = {};

export default connect(({xauusd, loading}) => ({xauusd, loading}))(XauusdPage);
