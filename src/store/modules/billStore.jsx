import {createSlice} from '@reduxjs/toolkit'
import axios from 'axios';

const billStore = createSlice({
    name:'bill',
    initialState:{
        billList:[],
        pendingList:[]
    },
    reducers:{
        setBillList(state, action){
            state.billList = action.payload
        },
        addToBillList(state, action){
            state.billList.push(action.payload)
        },
        addToPendingList(state, action){
            state.pendingList.push(action.payload)
        },
        clearPendingList(state){
            state.pendingList=[]
        },
        deleteFromBillList(state){
            state.billList=state.billList.filter(i=>!state.pendingList.includes(i.id))
        }
    }
})

const {setBillList, addToBillList, addToPendingList, clearPendingList, deleteFromBillList} = billStore.actions
const getList = () => {
    return async (dispatch) => {
        const res = await axios.get('http://localhost:8888/billList')
        dispatch(setBillList(res.data))
    }
}
const addToList = (data)=>{
    return async (dispatch)=>{
        const res = await axios.post('http://localhost:8888/billList', data)
        dispatch(addToBillList(res.data))
    }
}
const deleteFromList = (id)=>{
    return async (dispatch)=> {
        await axios.delete(`http://localhost:8888/billList/${id}`)
    }
}


export {getList, addToList, addToPendingList, clearPendingList, deleteFromList, deleteFromBillList}
export default billStore.reducer