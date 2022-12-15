import React from "react";
import "./transferHistory.css";
import { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Cookies from "js-cookie";
import swal from "sweetalert";


function TransferHistory() {
    const milliseconds = new Date();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [error, setError] = useState("");
    const [errorAcct, setErrorAcct] = useState("");
    const [tranHis, setTranHis] = useState();
    
    const url = "http://localhost:3000/tranhis";

    const config = {
        "headers": {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newFromDate = moment(fromDate).format("DD-MM-YYYY");
        const newToDate = moment(toDate).format("DD-MM-YYYY");
        console.log(newFromDate, newToDate);
        const values = {
            data: {
                fromDate: newFromDate,
                toDate: newToDate,
                inSystem: true,
                token: Cookies.get("token"),
            },
            request: {
                requestId: uuidv4(),
                requestTime: milliseconds.getTime(),
            }
        }
        await axios.post(url, JSON.stringify(values), config)
        .then(res => {
            if(res.data.responseCode === "00"){
                setTranHis(res.data.data.transHis);
            }else{
                setError("Hệ thống đang xảy ra lỗi vui lòng quay lại sau!");
            }
        })
        .catch(error => {
            setError("Hệ thống đang xảy ra lỗi vui lòng quay lại sau!");
            console.log(error);
        })
    }
    return (
        <div style={{display:'flex'}} className='transferPage'>   
            <div className='transferContainer'>
                <div style={{height: '50vh'}} className='transferWraper'>
                    <h2>Liệt kê các giao dịch ngân hàng điện tử</h2>
                    <span className='textErrorMsg'>{error}</span>
                    <form onSubmit={handleSubmit} className="transferForm">
                    <div className='transferStyleInput'>
                            <label>Từ ngày</label>
                            <input type="date" name="fromdate" id="fromdate" required
                                onChange={(e) => setFromDate(e.target.value)} />
                        </div>

                        <div className='transferStyleInput'>
                            <label>Lời nhắn</label>
                            <input type="date" name="todate" id="todate" required
                                onChange={(e) => setToDate(e.target.value)} />
                        </div>
                        <div className='transferStyleInput'>
                            <button type="submit" className='btnButton btnTransfer'>Truy vấn</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='transferContainer'>
                <div style={{height: '50vh'}} className='transferWraper'>
                    <h2>Liệt kê các giao dịch ngân hàng điện tử</h2>
                    {tranHis&&tranHis.map((item, index) => {
                        return <div key={index}>
                            {item.accountNo}
                            {item.amount}
                            {item.toAccNo}
                            {item.description}
                            {item.date}
                            {item.reason}
                            {item.type}
                        </div>
                    })} 
                    
                </div>
            </div>
        </div>
    )
}

export default TransferHistory;