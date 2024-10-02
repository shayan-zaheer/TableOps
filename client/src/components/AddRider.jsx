import { useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AddRider = ({setRiders}) => {
    const nameRef = useRef();
    const phoneRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const name = nameRef.current.value;
            const phone = phoneRef.current.value;

            const response = await axios.post('http://localhost:8000/api/riders', { name, phone });
            if (response.status === 201) {
                toast.success(`${name} added as a rider!`);

                setRiders(prevRiders => [...prevRiders, response.data]); 
                
                nameRef.current.value = '';
                phoneRef.current.value = '';
            }
        } catch (error) {
            console.error(error);
            toast.error('Error adding rider.');
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-4 w-96">
            <h2 className="text-xl font-bold mb-4">Add Driver</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Rider Name"
                    ref={nameRef}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
                <input
                    type="text"
                    placeholder="Rider Phone"
                    ref={phoneRef}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200">
                    Add Rider
                </button>
            </form>
        </div>
    );
};

export default AddRider;
