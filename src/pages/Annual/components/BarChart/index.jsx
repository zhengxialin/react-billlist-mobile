import * as echarts from 'echarts';
import {useEffect, useRef} from 'react';
import './index.css'

export default function BarChart({data1, data2, data3}) {

  const chartRef = useRef()
  // console.log('data1: ',data1)
  // console.log('data2: ',data2)
  // console.log('data3: ',data3)

  useEffect(() => {

    // ChatGPT's suggestion to avoid eChart initialization stack
    if (!chartRef.current) return;
    let existingInstance = echarts.getInstanceByDom(chartRef.current);
    if (existingInstance) {
        echarts.dispose(existingInstance);
    }

    let myChart = echarts.init(chartRef.current);

    const colors = ['Gold', 'MediumAquaMarine', 'LightSalmon']

    let minVal = Math.min(...data3); 
    let maxVal = Math.max(...data3);
    let avg = data3.reduce((sum, val) => sum + val, 0) / data3.length; 

    let maxDeviation = Math.max(Math.abs(minVal - avg), Math.abs(maxVal - avg));

    let padding = maxDeviation;

    let dynamicMin = avg - (maxDeviation + padding);
    let dynamicMax = avg + (maxDeviation + padding);

    const option = {

      xAxis: [{
        type: 'value',
        position:'top',
        axisLabel:{
          formatter: (value, index) => {
            if (index === 0 || index === 7) {return ''}
            return Math.abs(value) >= 1000000 ? value / 1000000 + 'M' :
            Math.abs(value) >= 1000  ? value / 1000 + 'k'  : value
          }
        }
      },
      {
        type: 'value',
        min: dynamicMin,
        max: dynamicMax,
        position: 'bottom',
        splitLine: { show: false },
        axisLabel:{
          color:'goldenrod',
          fontWeight:'bold',
          formatter: (value, index) => {
            if (index === 0 || index === 7) {return ''}
            return Math.abs(value) >= 1000000 ? value / 1000000 + 'M' :
            Math.abs(value) >= 1000  ? value / 1000 + 'k'  : value
          }
        }
      }],
    
      yAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        inverse:true
      },

      legend: {
        // show:true,
        // orient:'horizontal',
        top:'top'
      },
    
      series: [
        {
          data: data1,
          name: 'income',
          type: 'bar',
          color:colors[1],
          barGap: 0,
          xAxisIndex: 0
        },
        {
          data: data2,
          name: 'payment',
          type: 'bar',
          color:colors[2],
          xAxisIndex: 0
        },
        {
          data: data3,
          name: 'balance',
          type: 'line',
          color:colors[0],
          xAxisIndex: 1
        }
      ]
    };
    
    option && myChart.setOption(option);

  }, [data1,data2,data3]);

  return (
    <>
      <div ref={chartRef} className='chart'>

      </div>
    </>
  )
}
