import { useRef } from 'react';
import toast from 'react-hot-toast';

import axios from 'axios';

function CreateCategory() {
    const titleRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            var title = titleRef.current.value;
            console.log("REAL:", title);
            const response = await axios.post('http://localhost:8000/api/categories', { title });
            if(response.status == 201){
                toast.success(`${title} added as category!`)
            }
        } catch (error) {
            console.log(error);
            if(error?.response?.data?.error?.code == 11000){
                toast.error(`${title} is already in categories!`)
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[rgb(255,206,146)]">
            <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Create Category</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Category Name"
                        ref={titleRef}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200">
                        Create Category
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateCategory;