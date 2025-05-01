import {useNavigate} from 'react-router-dom';
import {useRef, useState} from 'react';
import {nanoid} from 'nanoid';
import {useDispatch} from 'react-redux';
import classNames from "classnames";
import dayjs from 'dayjs';

import {addToList} from '@/store/modules/billStore';
import { billListData } from "@/constants";

import Icon from "@/components/Icon";
import { Button, DatePicker, NavBar, ConfigProvider, Toast } from "antd-mobile";
import enUS from "antd-mobile/es/locales/en-US";
import './index.css';


export default function NewBill () {
  const navigate = useNavigate()
  const [billType, setBillType] = useState('pay')
  const [money, setMoney] = useState(0)
  const [useFor, setUseFor] = useState('')
  const [dateVisible, setDateVisible] = useState(false)
  const [currentDate, setCurrentDate] = useState(()=>new Date())
  const inputRef = useRef()
  const dispatch = useDispatch()

  const AddNewBill = () =>{
    if(money <= 0 || money >= 9999999){
      Toast.show({
        icon:'fail',
        content:'Invalid amount',
        duration:1500
      })
    }
    else if(useFor === ''){
      Toast.show({
        icon:'fail',
        content:'Unknown usage',
        duration:1500
      })
      setMoney(0)
    }
    else{
      Toast.show({
        icon:'success',
        content:'Bill list updated',
        duration:1500
      })
      const data={
        type: billType,
        money: billType === 'pay' ? -money : +money,
        date: currentDate,
        useFor: useFor,
        id: nanoid()
      }
      dispatch(addToList(data))
    }
    setUseFor('')
    inputRef.current.value=''
    inputRef.current.focus()
  }

  return(
    <div className="keepAccounts">
      <NavBar className="newBillNav" onBack={()=> navigate('/monthly')}>New Bill</NavBar>

      <div className='billTypeWrapper'>
        <div className="newBillType">
          <Button 
            shape="rounded" 
            className={classNames(billType === 'pay' && 'selected')}
            onClick={()=>{
              setBillType('pay')
              inputRef.current.value=''
              inputRef.current.focus()
              setUseFor('')}}>PAYMENT</Button>
          <Button 
            shape="rounded" 
            className={classNames(billType === 'income' && 'selected')}
            onClick={()=>{
              setBillType('income')
              inputRef.current.value=''
              inputRef.current.focus()
              setUseFor('')}}>INCOME</Button>
        </div>
      </div>


      <div className="inputFormWrapper">
        <div className="inputFormRegion">
          <div className="newBillDate" onClick={()=>setDateVisible(true)}>
            <Icon type='calendar' className='newBillIcon'/>
            <span className="newBillText">
              {dayjs(currentDate).format('DD MMM YYYY') === dayjs().format('DD MMM YYYY') ? 'Today' : dayjs(currentDate).format('DD MMM YYYY') }
              </span>
            <ConfigProvider locale={enUS}>
              <DatePicker 
                style={{touchAction:'none'}} 
                title='New Bill Date'
                visible={dateVisible}
                onClose={()=>setDateVisible(false)}
                onConfirm={(date)=>setCurrentDate(date)}
                max={new Date()}
              />
            </ConfigProvider>
          </div>
          <div className='newBillInputFrame'>
            <input
              className='newBillInput'
              placeholder='0.00'
              type='number'
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
              }}
              onPaste={(e) => {
                const paste = e.clipboardData.getData('text')
                if (/[eE+-]/.test(paste)) e.preventDefault()
              }}
              ref={inputRef}
              onFocus={()=>inputRef.current.value=''}
              onChange={(e)=>setMoney((+e.target.value).toFixed(2))}
            />
            <span className="iconDollar">AUD</span>
          </div>
        </div>
      </div>

      <div className="billTypeList">
        {billListData[billType].map(item=>{
          return(
            <div className="allBillType" key={item.type}>
              <div className="newBillTitle">{item.name.toUpperCase()}</div>
              <div className="newBillList">
                {item.list.map(item => {
                  return (
                    <div 
                      key={item.type} 
                      onClick={()=>setUseFor(item.type)}
                      className={classNames('newBillItem', useFor === item.type && 'selected')} >
                      <div className="newBillIcon">
                        <Icon type={item.type}/>
                      </div>
                      <div className="newBillText">{item.name}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className='btns' 
        onClick={()=>AddNewBill()}
      >
        <Button className="btn save">Submit</Button>
      </div>
    </div>
  )
}

