import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RiderSelection from '../components/RiderSelection';
import OrderFooter from '../components/OrderFooter';
import OrderHeader from '../components/OrderHeader';
import Order from '../components/Order';
import { orderActions } from '../store/orderSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import WaiterSelection from '../components/WaiterSelection';

function OrderPage() {
    const dispatch = useDispatch();
    const orderList = useSelector((store) => store.order.orders);
    const deliveryOrders = useSelector((store) => store.order.deliveryOrders);
    const [createdOrder, setCreatedOrder] = useState(null); // Store the created order

    console.log(orderList);

    if (!orderList || orderList.length === 0) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-[rgb(255,206,146)]">
                <h1 className="font-bold text-2xl drop-shadow-xl text-white">No items added yet!</h1>
            </div>
        );
    }

    const handleCreateOrder = async (type) => {
        try {
            const response = await axios.post('http://localhost:8000/api/orders', {
                products: orderList,
                totalAmount: 1000,
                type: type    
            });
            setCreatedOrder(response.data); // Store the created order with _id
            toast.success('Order created successfully!');
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Error creating order.');
        }
    };

    const handleRiderAssignment = (riderId) => {
        // Update the order with the assigned rider
        const updatedOrder = { ...createdOrder, rider: riderId, status: 'In Progress' };
        dispatch(orderActions.updateDeliveryOrders(updatedOrder)); // Dispatch the updated order
    };

    const handleWaiterAssignment = (waiterId) => {
        const updatedOrder = {...createdOrder, waiter: waiterId, status: 'Pending'};
        dispatch(orderActions.updateDineInOrders(updatedOrder));
    }

    return (
        <div className="h-screen bg-[rgb(218,174,120)]">
            <div className="bg-[rgb(109,80,44)]">
                <OrderHeader />
                {orderList.map((order, index) => (
                    <div key={index}>
                        <Order
                            name={order.name}
                            price={order.price}
                            quantity={order.quantity}
                        />
                    </div>
                ))}
                
                {!createdOrder && (
                    <button className="block w-full p-2 bg-[rgb(167,132,36)] text-white rounded hover:bg-[rgb(233,195,90)]" onClick={() => handleCreateOrder("delivery")}>Create Delivery Order</button>
                )}

                {!createdOrder && (
                    <button className="block w-full p-2 bg-[rgb(167,132,36)] text-white rounded hover:bg-[rgb(233,195,90)]" onClick={() => handleCreateOrder("dinein")}>Create Dinein Order</button>
                )}

                {/* Show Rider Selection only after the order is created */}
                {createdOrder && createdOrder.type === "delivery" && createdOrder.status === 'Pending' && (
                    <RiderSelection 
                        orderDetails={createdOrder}
                        onRiderAssigned={handleRiderAssignment}
                    />
                )}

                {createdOrder && createdOrder.type === "dinein" && createdOrder.status === 'Pending' && (
                    <WaiterSelection
                        orderDetails={createdOrder}
                        onWaiterAssigned ={handleWaiterAssignment}
                    />
                )}
            </div>
            <OrderFooter />
        </div>
    );
}

export default OrderPage;
