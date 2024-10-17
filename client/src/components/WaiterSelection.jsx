import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { orderActions } from '../store/orderSlice';
import toast from 'react-hot-toast';

function WaiterSelection({ orderDetails, onWaiterAssigned }) {
    const [waiters, setWaiters] = useState([]);
    const dispatch = useDispatch();
    const [selectedWaiter, setSelectedWaiter] = useState("");

    useEffect(() => {
        const fetchWaiters = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/waiters'); // Update with your API endpoint for fetching waiters
                setWaiters(response.data);
            } catch (error) {
                console.error('Error fetching waiters:', error);
                toast.error('Error fetching waiters.');
            }
        };

        fetchWaiters();
    }, []);

    const handleAssignWaiter = async () => {
        if (!selectedWaiter) {
            toast.error('Please select a waiter');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/orders/${orderDetails._id}/assign-waiter`, {
                waiterId: selectedWaiter
            });
            toast.success('Waiter assigned successfully!');
            onWaiterAssigned(selectedWaiter);
            dispatch(orderActions.removeOrder()); // Remove order from the Redux store after assigning
        } catch (error) {
            console.error('Error assigning waiter:', error);
            toast.error('Error assigning waiter.');
        }
    };

    return (
        <div>
            <h3>Select a Waiter</h3>
            <select value={selectedWaiter} onChange={(e) => setSelectedWaiter(e.target.value)}>
                <option value="" disabled>Select a Waiter</option>
                {waiters.map((waiter) => (
                    <option key={waiter._id} value={waiter._id}>{waiter.name}</option>
                ))}
            </select>
            <button 
                className='ml-2 p-2 bg-[rgb(145,106,24)] hover:bg-[rgb(211,175,97)] rounded-sm mb-2' 
                onClick={handleAssignWaiter}
            >
                Assign Waiter
            </button>
        </div>
    );
}

export default WaiterSelection;
