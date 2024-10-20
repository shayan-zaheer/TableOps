import { useLocation } from 'react-router-dom';
import CreateProduct from '../components/CreateProduct';
import UpdateProduct from '../components/UpdateProduct';

const ProductsPage = () => {
    const location = useLocation();
    const action = new URLSearchParams(location.search).get("action");

    return (
        <>
            {action === "create" && <CreateProduct />}
            {action === "update" && <UpdateProduct />}
        </>
    );
};

export default ProductsPage;
