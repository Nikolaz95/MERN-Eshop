import React, { useEffect, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import SalesChart from '../charts/SalesChart';
import toast from 'react-hot-toast';
import Loader from '../layout/Loader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLazyGetDashBoardSalesQuery } from '../redux/api/orderApi';

const Dashboard = () => {
    const [startData, setStartData] = useState(new Date().setDate(1));
    const [endData, setEndData] = useState(new Date());


    const [getDashBoardSales, { error, isLoading, data }] = useLazyGetDashBoardSalesQuery();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message)
        }

        if (startData && endData && !data) {
            /* getDashBoardSales({
                startDate: new Date(startDate).toISOString(),
                endDate: endDate.toISOString(),
            }); */
        }
    }, [error, startData, endData, data]);

    const submitHandler = () => {
        getDashBoardSales({
            startData: new Date(startData).toISOString(),
            endData: endData.toISOString(),
        });
    };


    console.log("=================");
    console.log(data);
    console.log("=================");

    if (isLoading) return <Loader />


    return (
        <AdminLayout>
            <div className="d-flex justify-content-start align-items-center">
                <div className="mb-3 me-4">
                    <label className="form-label d-block">Start Date</label>
                    <DatePicker
                        selected={startData}
                        onChange={(date) => setStartData(date)}
                        selectsStart
                        startDate={startData}
                        endDate={endData}
                        className='form-control'
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label d-block">End Date</label>
                    <DatePicker
                        selected={endData}
                        onChange={(date) => setEndData(date)}
                        selectsEnd
                        startDate={startData}
                        endDate={endData}
                        minDate={startData}
                        className='form-control'
                    />
                </div>
                <button className="btn fetch-btn ms-4 mt-3 px-5" onClick={submitHandler}>Fetch</button>
            </div>

            <div className="row pr-4 my-5">
                <div className="col-xl-6 col-sm-12 mb-3">
                    <div className="card text-white bg-success o-hidden h-100">
                        <div className="card-body">
                            <div className="text-center card-font-size">
                                Sales
                                <br />
                                <b>${data?.totalSales?.toFixed(2)}</b>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-6 col-sm-12 mb-3">
                    <div className="card text-white bg-danger o-hidden h-100">
                        <div className="card-body">
                            <div className="text-center card-font-size">
                                Orders
                                <br />
                                <b>{data?.totalnumOrders}</b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SalesChart salesData={data?.sales} />

            <div className="mb-5"></div>
        </AdminLayout>
    )
}

export default Dashboard