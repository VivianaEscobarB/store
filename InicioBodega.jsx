import MenuBodega from '../components/MenuBodega';
import PanelBodega from '../components/PanelBodega';

const InicioBodega = () => {
    return (
        <div className="min-h-screen flex bg-gray-100">
            <MenuBodega />
            <PanelBodega />
        </div>
    );
};

export default InicioBodega;