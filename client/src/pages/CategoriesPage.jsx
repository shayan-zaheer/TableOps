import React, { useState } from 'react';
import axios from 'axios';

const CategoriesPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/categories', { name, description });
            setMessage(response.data.message);
            setName('');
            setDescription('');
        } catch (error) {
            console.log(error);
            setMessage(error.error);
        }
    };

    return (
        <div>
            <h2>Create Category</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Category Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Create Category</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CategoriesPage;
