import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddWaiter from '../components/AddWaiter';
import DeleteWaiter from '../components/DeleteWaiter';

const WaitersPage = () => {
    const [waiters, setWaiters] = useState([]);

    useEffect(() => {
        const fetchWaiters = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/waiters');
                setWaiters(response.data);
            } catch (error) {
                console.error('Error fetching waiters:', error);
                toast.error('Error fetching waiters.');
            }
        };

        fetchWaiters();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[rgb(255,206,146)]">
            <h2 className="text-2xl font-bold mb-4">Waiter Management</h2>
            <AddWaiter waiters={waiters} setWaiters={setWaiters}/>
            <DeleteWaiter waiters={waiters} setWaiters={setWaiters} />
            <div className="mt-6 w-96">
                <h3 className="text-xl font-semibold mb-2">Registered Waiters</h3>
                <ul className="list-disc list-inside">
                    {waiters.map(waiter => (
                        <li key={waiter._id}>{waiter.name} - {waiter.phone}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WaitersPage;
