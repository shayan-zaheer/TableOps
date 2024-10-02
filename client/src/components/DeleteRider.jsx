import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const DeleteRider = ({riders, setRiders}) => {
    const riderIdRef = useRef();

    useEffect(() => {
        const fetchRiders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/riders');
                console.log(response);
                setRiders(response.data);
            } catch (error) {
                console.error('Error fetching drivers:', error);
                toast.error('Error fetching drivers.');
            }
        };

        fetchRiders();
    }, []);

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const riderId = riderIdRef.current.value;

            const response = await axios.delete(`http://localhost:8000/api/riders/${riderId}`);
            if (response.status === 200) {
                toast.success('Rider deleted successfully!');

                setRiders(prevRiders => prevRiders.filter(rider => rider._id !== riderId));


                riderIdRef.current.value = '';
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting driver.');
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-4 w-96">
            <h2 className="text-xl font-bold mb-4">Delete Driver</h2>
            <form onSubmit={handleDelete}>
                <select 
                    ref={riderIdRef}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    required
                >
                    <option value="" disabled selected>Select a Rider to Delete</option>
                    {riders.map(rider => (
                        <option key={rider._id} value={rider._id}>{rider.name}</option>
                    ))}
                </select>
                <button type="submit" className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200">
                    Delete Rider
                </button>
            </form>
        </div>
    );
};

export default DeleteRider;
