import MenuAdmin from '../components/MenuAdmin';
import PanelAdmin from '../components/PanelAdmin';

const InicioAdmin = () => {
    return (
        <div className="min-h-screen flex bg-gray-100">
            <MenuAdmin />
            <PanelAdmin />
        </div>
    );
};

export default InicioAdmin;