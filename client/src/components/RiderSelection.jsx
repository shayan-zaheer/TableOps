import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { orderActions } from '../store/orderSlice';
import toast from 'react-hot-toast';

function RiderSelection({ orderDetails, onRiderAssigned }) {
    const [riders, setRiders] = useState([]);
    const dispatch = useDispatch();
    const [selectedRider, setSelectedRider] = useState("");

    useEffect(() => {
        const fetchRiders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/riders');
                setRiders(response.data);
            } catch (error) {
                console.error('Error fetching riders:', error);
                toast.error('Error fetching riders.');
            }
        };

        fetchRiders();
    }, []);

    const handleAssignRider = async () => {
        if (!selectedRider) {
            toast.error('Please select a rider');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/orders/${orderDetails._id}/assign-rider`, {
                riderId: selectedRider
            });
            toast.success('Rider assigned successfully!');
            onRiderAssigned(selectedRider);
            dispatch(orderActions.removeOrder());
        } catch (error) {
            console.error('Error assigning rider:', error);
            toast.error('Error assigning rider.');
        }
    };

    return (
        <div>
            <h3>Select a Rider</h3>
            <select value={selectedRider} onChange={(e) => setSelectedRider(e.target.value)}>
                <option value="" disabled>Select a Rider</option>
                {riders.map((rider) => (
                    <option key={rider._id} value={rider._id}>{rider.name}</option>
                ))}
            </select>
            <button className='ml-2 p-2 bg-[rgb(145,106,24)] hover:bg-[rgb(211,175,97)] rounded-sm mb-2' onClick={handleAssignRider}>Assign Rider</button>
        </div>
    );
}

export default RiderSelection;
