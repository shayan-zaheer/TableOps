import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddRider from '../components/AddRider';
import DeleteRider from '../components/DeleteRider';

const RidersPage = () => {
    const [riders, setRiders] = useState([]);

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



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Rider Management</h2>
            <AddRider riders={riders} setRiders={setRiders}/>
            <DeleteRider riders={riders} setRiders={setRiders} />
            <div className="mt-6 w-96">
                <h3 className="text-xl font-semibold mb-2">Registered Riders</h3>
                <ul className="list-disc list-inside">
                    {riders.map(rider => (
                        <li key={rider._id}>{rider.name} - {rider.phone}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RidersPage;
