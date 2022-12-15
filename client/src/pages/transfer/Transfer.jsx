import React from 'react'
import "./transfer.css"
import { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../../components/navbar/Navbar';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Transfer() {
    const milliseconds = new Date();
    const [fromAcc, setFromAcc] = useState("");
    const [toAcc, setToAcc] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [modaltitle, setModalTitle] = useState("");
    const navigate = useNavigate();
    const url = "http://localhost:3000/transfer";

    const config = {
        "headers": {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const values = {
            data: {
                fromAcc: fromAcc,
                toAcc: toAcc,
                amount: amount,
                description: description,
                token: Cookies.get('token'),
            },
            request: {
                requestId: uuidv4(),
                requestTime: milliseconds.getTime(),
            }
        }

        axios.post(url, JSON.stringify(values), config)
            .then(res => {
                console.log(res)
                if( res.data.responseCode === '00'){
                    //thanh cong
                    setModalTitle("Thành công");
                    sessionStorage.setItem("toAcc", toAcc);
                    sessionStorage.setItem("amount", amount);
                    sessionStorage.setItem("description", description);
                    navigate("/verify_transfer");
                } else {
                    //that bai
                    setModalTitle("Hệ thống đang xảy ra lỗi vui lòng quay lại sau!");
                }
            })
            .catch(error => {
                setModalTitle("Hệ thống đang xảy ra lỗi vui lòng quay lại sau!");
                console.log(error);
            })
    }
    return (
        <>
            <div className='transferPage'>
                <div className='transferContainer'>
                    <div className='transferWraper'>
                        <h2>Chưc năng chuyển khoản</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='transferStyleInput'>
                                <label>Số tài khoản người nhận</label>
                                <input type="number" name="accountid" id="accountid" required
                                    onChange={(e) => setToAcc(e.target.value)} />
                            </div>
                            <div className='transferStyleInput'>
                                <label>Số tiền chuyển khoản</label>
                                <input type="number" name="amount" id="amount" required
                                    onChange={(e) => setAmount(e.target.value)} />
                            </div>

                            <div className='transferStyleInput'>
                                <label>Lời nhắn</label>
                                <textarea type="text" name="description" id="description" required
                                    onChange={(e) => setDescription(e.target.value)}
                                    onBlur={e => {
                                        if (e.target.value.length >= 151)
                                            setErrorDescription("Lời nhắn không dài quá 150 ký tự!!!")
                                        else
                                            setErrorDescription("")
                                    }} />
                                <span className='textErrorMsg'>{errorDescription}</span>
                            </div>

                            <div className='transferSubmit'>
                                <span className='textErrorMsg'>{modaltitle}</span>
                                <button type="submit" className='btnButton btnTransfer'>Xác nhận</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Transfer