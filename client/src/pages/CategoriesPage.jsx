import { useLocation } from 'react-router-dom';
import CreateCategory from '../components/CreateCategory';
import UpdateCategory from '../components/UpdateCategory';

const CategoriesPage = () => {
    const location = useLocation();
    const action = new URLSearchParams(location.search).get("action");
    
    console.log(action); // Check if the action is being correctly parsed

    return (
        <>
            {action === "create" && <CreateCategory />}
            {action === "update" && <UpdateCategory />}
        </>
    );
};

export default CategoriesPage;
