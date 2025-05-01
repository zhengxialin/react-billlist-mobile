import {createBrowserRouter} from 'react-router-dom';
import Layout from '../pages/Layout';
import NewBill from '../pages/NewBill';
import Annual from '../pages/Annual';
import Monthly from '../pages/Monthly';

export default createBrowserRouter([
    {
        path:'/',
        element:<Layout/>,
        children:[
            {
                path:'annual',
                element:<Annual/>
            },
            {
                index:true,
                element:<Monthly/>
            },
            {
                path:'monthly',
                element:<Monthly/>
            }
        ]
    },
    {
        path:'/new',
        element:<NewBill/>
    }
])