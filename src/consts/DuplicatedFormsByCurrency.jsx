import BolivarsForm from "../components/reports/duplicated/BolivarsForm";
import OthersForm from "../components/reports/duplicated/OthersForm";

const formsByCurrencyMap = new Map();
formsByCurrencyMap.set(1, <BolivarsForm />);
formsByCurrencyMap.set(2, <OthersForm />);

export default formsByCurrencyMap;