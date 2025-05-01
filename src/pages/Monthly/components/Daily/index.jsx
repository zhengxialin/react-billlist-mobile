import classNames from 'classnames';
import { useMemo, useState } from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {addToPendingList} from '@/store/modules/billStore';

import './index.css'
import {billTypeToName} from '@/constants';
import Icon from '@/components/Icon';


const LINE_HEIGHT = 33
const MARGIN_BOTTOM = 15
const LAST_CHILD_MARGIN_BOTTOM = 0

export default function DailyBill({date, billList, pendingDelete}){

    const dispatch = useDispatch()
    const {pendingList} = useSelector(s => s.bill)

    const renderList = useMemo(() => {
        return billList.filter(i=>!pendingList.includes(i.id))
    }, [billList, pendingList])

    const dailySum = useMemo(() => {
        const payment = renderList.filter(i => i.type==='pay').reduce((a,c)=>a-c.money, 0)
        const income = renderList.filter(i => i.type==='income').reduce((a,c)=>a+c.money,0)
        return{ payment, income, total:income - payment}
    }, [renderList])

    const [listVisible, setListVisible] = useState(false)

    const addToDeleteList = (id)=>{
        if(!pendingDelete || pendingList.includes(id)){
            return
        }
        else{
            dispatch(addToPendingList(id))
        }
    }

    return(
        <>
        {renderList.length > 0 ? (
            <div className={classNames('dailyBill', pendingDelete && 'inner-glow')}>
                <div className='dailyHeader' onClick={()=>{pendingDelete? renderList.map(i=>addToDeleteList(i.id)) : setListVisible(!listVisible)}}>
                    <div className='dateElements'>
                        <span className='dailyDate'>{date}</span>
                        <span className={classNames('dailyArrow', pendingDelete ? 'expand hidden' : (listVisible && 'expand'))}/>
                    </div>
                    <div className='oneRowOverview'>
                        <div className='dailyPay'>
                            <span className='dailyPayCategory'>PAY</span>
                            <span className='dailyPayMoney'>{dailySum.payment.toFixed(2)}</span>
                        </div>
                        <div className='dailyIncome'>
                            <span className='dailyIncomeCategory'>INC</span>
                            <span className='dailyIncomeMoney'>{dailySum.income.toFixed(2)}</span>
                        </div>
                        <div className='dailyTotal'>
                            <span className='dailyTotalMoney'>{dailySum.total.toFixed(2)}</span>
                            <span className='dailyTotalCategory'>TTL</span>
                        </div>
                    </div>
                </div>
                <div className='billList' style={{
                    height: (pendingDelete || listVisible) ? (renderList.length * (LINE_HEIGHT+MARGIN_BOTTOM) - (MARGIN_BOTTOM-LAST_CHILD_MARGIN_BOTTOM)) + 'px':'0px',
                    padding: (pendingDelete || listVisible) ? '10px 10px 15px 15px' : '10px 10px 0 15px',
                    borderTop: (pendingDelete || listVisible) ? '1px solid #ccc' : 'none',
                    transition: 'height '+ Math.max(renderList.length * 0.12, 0.25) + 's ease-out'
                }}>
                    {
                        renderList.map(item => {
                            return (
                            <div 
                                key={item.id}
                                className={classNames('bill')}  
                                onClick={()=>addToDeleteList(item.id)}
                                >
                                <Icon type={item.useFor}/>&nbsp;
                                <div className='detail'>
                                    <div className='billType'>{billTypeToName[item.useFor]}</div>
                                </div>
                                <div className={classNames('money', item.type)}>
                                    {item.money.toFixed(2)}
                                </div>
                            </div>
                    )})}
                </div>
            </div>)
            : <div className='emptySlot'></div>
            }
        </>
    )
}