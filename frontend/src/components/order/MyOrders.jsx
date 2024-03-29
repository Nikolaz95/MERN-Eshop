import React, { useEffect } from 'react'
import { useMyOrdersQuery } from '../redux/api/orderApi';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

//import icon

import { IoEyeSharp } from "react-icons/io5";
import { IoPrintSharp } from "react-icons/io5";
import { clearCart } from '../redux/features/CartSlice';




const MyOrders = () => {

    const { data, isLoading, error } = useMyOrdersQuery();

    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const orderSuccess = searchParams.get("order_success");


    useEffect(() => {

        if (error) {
            toast.error(error?.data?.message)
        }

        if (orderSuccess) {
            dispatch(clearCart());
            Navigate("/me/orders")
        }
    }, [error, orderSuccess]);

    if (isLoading) return <Loader />

    const setOrders = () => {
        const orders = {
            columns: [
                {
                    label: "ID",
                    field: "id",
                    sort: "asc",
                },
                {
                    label: "Amount",
                    field: "amount",
                    sort: "asc",
                },
                {
                    label: "Payment Status",
                    field: "status",
                    sort: "asc",
                },
                {
                    label: "Order Status",
                    field: "orderStatus",
                    sort: "asc",
                },
                {
                    label: "Actions",
                    field: "actions",
                    sort: "asc",
                },
            ],
            rows: [],
        };

        data?.orders?.forEach((order) => {
            orders.rows.push({
                id: order?._id,
                amount: `$${order?.totalAmount}`,
                status: order?.paymentInfo?.status?.toUpperCase(),
                orderStatus: order?.orderStatus,
                actions: (
                    <>
                        <Link to={`/me/order/${order?._id}`} className="btn btn-primary">
                            <IoEyeSharp />

                        </Link>
                        <Link
                            to={`/invoice/order/${order?._id}`}
                            className="btn btn-success ms-2"
                        >
                            <IoPrintSharp />
                        </Link>
                    </>
                ),
            });
        });

        return orders;
    };

    return (

        <>
            <MetaData title={"My  details"} />


            <h1 className="my-5">{data?.orders?.length} Orders</h1>

            <MDBDataTable
                data={setOrders()}
                className="px-3"
                bordered
                striped
                hover
            />
        </>
    )
}

export default MyOrders