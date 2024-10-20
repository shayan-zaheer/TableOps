import { useLocation } from 'react-router-dom';
import CreateCategory from '../components/CreateCategory';
import UpdateCategory from '../components/UpdateCategory';

const CategoriesPage = () => {
    const location = useLocation();
    const action = new URLSearchParams(location.search).get("action");

    return (
        <>
            {action === "create" && <CreateCategory />}
            {action === "update" && <UpdateCategory />}
        </>
    );
};

export default CategoriesPage;
