import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const DeleteWaiter = ({ waiters, setWaiters }) => {
    const waiterIdRef = useRef();

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

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const waiterId = waiterIdRef.current.value;

            const response = await axios.delete(`http://localhost:8000/api/waiters/${waiterId}`);
            if (response.status === 200) {
                toast.success('Waiter deleted successfully!');

                setWaiters(prevWaiters => prevWaiters.filter(waiter => waiter._id !== waiterId));

                waiterIdRef.current.value = '';
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting waiter.');
        }
    };

    return (
        <div className="bg-[rgb(207,156,90)] shadow-lg rounded-lg p-6 mb-4 w-96">
            <h2 className="text-xl font-bold mb-4">Delete Waiter</h2>
            <form onSubmit={handleDelete}>
                <select 
                    ref={waiterIdRef}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    required
                >
                    <option value="" disabled selected>Select a Waiter to Delete</option>
                    {waiters.map(waiter => (
                        <option key={waiter._id} value={waiter._id}>{waiter.name}</option>
                    ))}
                </select>
                <button type="submit" className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200">
                    Delete Waiter
                </button>
            </form>
        </div>
    );
};

export default DeleteWaiter;
