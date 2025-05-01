import {useSelector} from 'react-redux'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

import _ from 'lodash'
import {NavBar} from 'antd-mobile'

import YearPicker from './components/HorizontalYearPicker'
import BarChart from './components/BarChart'
import './index.css'

export default function Annual() {

  const {billList} = useSelector(s=>s.bill)

  const groupedByYear = useMemo(() => _.groupBy(billList, i=> dayjs(i.date).format('YYYY')), [billList])
  const years = Object.keys(groupedByYear).map(Number)

  const [chartData1, setChartData1] = useState([])
  const [chartData2, setChartData2] = useState([])
  const [chartData3, setChartData3] = useState([])
  
  let prevYear = 0
  const handleYear = (msg)=>{
    if(prevYear === msg){return}
    prevYear = msg
    
    let annualBillList = groupedByYear[msg]
    let paymentByMonth = _.groupBy(annualBillList.filter(i=>i.type==='pay'), i=> +dayjs(i.date).format('MM'))
    let incomeByMonth = _.groupBy(annualBillList.filter(i=>i.type==='income'), i=> +dayjs(i.date).format('MM'))
    
    let paySumList = [0,0,0,0,0,0,0,0,0,0,0,0]
    let incSumList = [0,0,0,0,0,0,0,0,0,0,0,0]
    Object.keys(paymentByMonth).map(k=>paySumList[k-1]=paymentByMonth[k].reduce((a,c)=>a-c.money,0))
    Object.keys(incomeByMonth).map(k=>incSumList[k-1]=incomeByMonth[k].reduce((a,c)=>a+c.money,0))
    
    let balanceList = []
    let balance = 0
    for(let i=0; i<12; i++){
      balance += incSumList[i]
      balance -= paySumList[i]
      balanceList.push(balance)
    }

    setChartData1(incSumList)
    setChartData2(paySumList)
    setChartData3(balanceList)
  }


  return (
    <div className='annualBill'>
      <NavBar backIcon={false}> Annual Bill </NavBar>
      <YearPicker startYear={Math.min(...years) ? Math.min(...years) : 1990} 
                  endYear={Math.max(...years) ? Math.max(...years) : 2030} 
                  uploadYear={handleYear}/>
      <BarChart  data1={chartData1} data2={chartData2} data3={chartData3}/>
    </div>
  )
}
