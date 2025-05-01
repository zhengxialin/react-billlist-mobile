import {DatePicker, NavBar, ConfigProvider, Button} from 'antd-mobile';
import enUS from "antd-mobile/es/locales/en-US";
import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames'
import _ from 'lodash';
import dayjs from 'dayjs'

import {PictureOutline, DeleteOutline} from 'antd-mobile-icons';
import DailyList from './components/Daily';
import {clearPendingList, deleteFromList, deleteFromBillList} from '@/store/modules/billStore';
import './index.css'


export default function Monthly() {

  const [dateVisible, setDateVisible] =useState(false)
  const [currentDate, setCurrentDate] = useState(()=> dayjs().format('YYYY | MMMM'))
  const [binVisible, setBinVisible] = useState(false)

  const [deleteSwitch, setDeleteSwitch] = useState(false)

  const dispatch = useDispatch()

  const {billList} = useSelector(s=>s.bill)
  const {pendingList} = useSelector(s=>s.bill)

  const groupedByMonth = useMemo(
    () => _.groupBy(billList, (i)=>dayjs(i.date).format('YYYY | MMMM')),
    [billList])

  // if groupedByMonth[currentDate] is undefined, make it an empty array then monthlySummary works properly
  // adding dependency of groupedByMonth makes monthList update when initialize
  const monthList = useMemo(() => groupedByMonth[currentDate] ?? [], [currentDate, groupedByMonth])

  /*
  // Another way of rendering monthlySummary correctly while initializing

  // const [monthList, setMonthList] = useState([])

  // useEffect(() => {
  //   const newDate = dayjs().format('YYYY | MMMM')
  //   if(groupedByMonth[newDate]){
  //     setMonthList(groupedByMonth[newDate] ?? [])
  //   }
  // }, [groupedByMonth]);

  // const onConfirm = (date)=>{
  //   const formatDate = dayjs(date).format('YYYY | MMMM')
  //   setCurrentDate(formatDate)
  //   setMonthList(groupedByMonth[formatDate] ?? [])
  // }*/

  const monthlySummary = useMemo(() => {
    const payment = monthList.filter(i => i.type === 'pay').reduce((a,c)=>a-c.money,0)
      const income = monthList.filter(i => i.type === 'income').reduce((a,c)=>a+c.money,0)
      return { payment, income, total: income - payment }
  }, [monthList])

  const groupedByDate = useMemo(() => {
    const list = _.groupBy(_.sortBy(monthList,['date']), (i)=>dayjs(i.date).format('MMM D'))
    const keys = Object.keys(list)
    return{
      list,
      keys
    }
  }, [monthList])

  return (
    <div className={classNames('monthlyBill', deleteSwitch && 'deleting' )}>
      <NavBar className='nav' backIcon={false}>Monthly Bill</NavBar>
      
      <div className='content'>
        <div className='monthlyHeader'>
          {/* date picker section */}
          <div className='headerTopRow'>
            <div className='date' onClick={()=>setDateVisible(true)}>
              <span className='text'>
                {currentDate}
              </span>
              <span className={classNames('arrow', dateVisible && 'expand')}/>
            </div>
            <span className='dotDotDot' style={{height: binVisible?'85px':'25px'}}>
              <span onClick={()=>{
                  setBinVisible(!binVisible); 
                  setDeleteSwitch(false); 
                  dispatch(clearPendingList())}}
              >⋮</span>
                <span className={classNames('etcIcons', binVisible && 'showIcon')}>
                  <DeleteOutline 
                    onClick={()=>{setDeleteSwitch(!deleteSwitch); if(deleteSwitch){dispatch(clearPendingList())}}}
                    className={classNames(deleteSwitch && 'shake-rotate')}
                    />
                </span>
                <span className={classNames('etcIcons', binVisible && 'showIcon')}>
                  <PictureOutline />
                </span>
              </span>

          </div>
          {/* statistics section */}
          <div className='twoRowOverview'>
            <div className='item'>
              <span className='money'>
                {monthlySummary.payment.toFixed(2)}
              </span>
              <span className='category'>Payment</span>
            </div>
            <div className='item'>
              <span className='money'>
                {monthlySummary.income.toFixed(2)}
              </span>
              <span className='category'>Income</span>
            </div>
            <div className='item'>
              <span className='money'>
              {monthlySummary.total.toFixed(2)}
              </span>
              <span className='category'>Total</span>
            </div>
          </div>
          {/* Hidden date picker */}
          <ConfigProvider locale={enUS}>
            <DatePicker
              style={{touchAction:'none'}}
              title='Select Date'
              precision='month'
              visible={dateVisible}
              max={new Date()}
              onClose={()=>setDateVisible(false)}
              onConfirm={(date)=> setCurrentDate(dayjs(date).format('YYYY | MMMM'))}            
            />
          </ConfigProvider>
        </div>
      {/* render daily bill list */}
        <div className='dailyLists'>
          {
            groupedByDate.keys.map(key => 
              <DailyList 
                key={key} 
                date={key} 
                billList={groupedByDate.list[key]}
                pendingDelete={deleteSwitch}
              />
            )
          }
          <div style={{
            height: pendingList.length > 0 ? '40px' : 0, 
            transform: pendingList.length > 0 ? 'translateY(-40px)' : 'translateY(0)',
            transition: '0.2s ease-out'}}></div>
        </div>
        <div className='bottomButtons'>
          <Button 
            color='danger' 
            className={classNames('confirmDelete', pendingList.length > 0 && 'active')}
            onClick={()=>{
              pendingList.map(i=>dispatch(deleteFromList(i)))
              dispatch(deleteFromBillList())
              dispatch(clearPendingList())
              setDeleteSwitch(false)
            }}           
          >Confirm Delete</Button>

          <Button 
            color='default' 
            className={classNames('resumeDelete', pendingList.length > 0 && 'active')}
            onClick={()=>{
              setDeleteSwitch(false)
              dispatch(clearPendingList())
              setBinVisible(false)}}
          >Restore Changes</Button>
        </div>
      </div>
    </div>
  )
}
