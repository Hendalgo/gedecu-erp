import { useState } from "react";
import BanksSelect from "../../../BanksSelect";
import Select from "react-select";
import { getBankAccounts } from "../../../../helpers/banksAccounts";

export default function BolivarsForm() {
    const [bank, setBank] = useState(null);
    const [account, setAccount] = useState(null);
    const [accounts, setAccounts] = useState([]);

    const handleBankChange = async (option) => {
        setBank(option);
        const accountsResponse = await getBankAccounts(`paginated=no&bank=${option.value}`);
        setAccounts(accountsResponse.map(({id, name}) => ({label: name, value: id})));
    }

    return (
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="bank_id" className="form-label">Banco</label>
                    <BanksSelect id="bank" name="bank" query="&country=2" value={bank} onChange={handleBankChange} />
                </div>
                <div className="col">
                    <label htmlFor="account_id" className="form-label">Cuenta <span className="Required">*</span></label>
                    <Select isDisabled={accounts.length === 0} inputId="account_id" name="account_id" options={accounts} value={account} onChange={setAccount} placeholder="Seleccione la cuenta" noOptionsMessage={() => "No hay coincidencias"} />
                    <input type="hidden" name="account" value={account?.label || ""} />
                </div>
            </div>
        </>
    )
}

