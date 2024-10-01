import { useLocation } from 'react-router-dom';
import CreateProduct from '../components/CreateProduct';
import UpdateProduct from '../components/UpdateProduct';

const ProductsPage = () => {
    const location = useLocation();
    const action = new URLSearchParams(location.search).get("action");
    
    console.log(action); // Check if the action is being correctly parsed

    return (
        <>
            {action === "create" && <CreateProduct />}
            {action === "update" && <UpdateProduct />}
        </>
    );
};

export default ProductsPage;
