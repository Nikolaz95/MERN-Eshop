import React, { useEffect } from 'react'
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";


//import react icon
import { MdDeleteForever } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { AiFillPicture } from "react-icons/ai";
import { useDeleteOrderMutation, useGetAdminOrdersQuery } from '../redux/api/orderApi';

const ListOrders = () => {
    const { data, isLoading, error } = useGetAdminOrdersQuery();

    const [
        deleteOrder,
        { error: deleteError, isLoading: isDeleteLoading, isSuccess },
    ] = useDeleteOrderMutation();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message);
        }

        if (deleteError) {
            toast.error(deleteError?.data?.message);
        }

        if (isSuccess) {
            toast.success("Product Deleted");
        }
    }, [error, deleteError, isSuccess]);

    const deleteOrderHandler = (id) => {
        deleteOrder(id);
    };

    const setOrders = () => {
        const orders = {
            columns: [
                {
                    label: "ID",
                    field: "id",
                    sort: "asc",
                },
                {
                    label: "Payment Status",
                    field: "Payment Status",
                    sort: "asc",
                },
                {
                    label: "Order Status",
                    field: "Order Status",
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
                paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
                orderStatus: order?.orderStatus,
                actions: (
                    <>
                        <Link
                            to={`/admin/orders/${order?._id}`}
                            className="btn btn-outline-primary"
                        >
                            <FaPencil />
                        </Link>
                        <button
                            className="btn btn-outline-danger ms-2"
                            onClick={() => deleteOrderHandler(order?._id)}
                            disabled={isDeleteLoading}
                        >
                            <MdDeleteForever />
                        </button>
                    </>
                ),
            });
        });

        return orders;
    };


    if (isLoading) return <Loader />;

    return (
        <AdminLayout>
            <MetaData title={"All Orders"} />

            <h1 className="my-5">{data?.orders?.length} Orders</h1>

            <MDBDataTable
                data={setOrders()}
                className="px-3"
                bordered
                striped
                hover
            />
        </AdminLayout>
    );
};

export default ListOrders