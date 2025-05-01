import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { getList } from '@/store/modules/billStore';
import { useEffect } from 'react'
import { TabBar } from 'antd-mobile'
import {
  BillOutline,
  AddCircleOutline,
  TextOutline
} from 'antd-mobile-icons'
import './index.css'

const tabs = [
  {
    key: '/monthly',
    title: 'MONTHLY',
    icon: <BillOutline />
  },
  {
    key: '/new',
    title: 'NEW',
    icon: <AddCircleOutline />
  },
  {
    key: '/annual',
    title: 'ANNUAL',
    icon: <TextOutline />,
  },
]

export default function Layout() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getList())
  }, []);
  
  const navigate = useNavigate()

  return (
    <section className='layout'>
      <div className='container'>
          <Outlet/>
      </div>


        <div className='footer'>
          <TabBar onChange={(path)=>navigate(path)}>
            {tabs.map(item => (
              <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
            ))}
          </TabBar>
        </div>
    </section>
  )
}

 
