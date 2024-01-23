import { useState } from "react";
import BanksSelect from "../../../BanksSelect";
import BankAccountsSelect from "../../../BankAccountsSelect";

export default function BolivarsForm() {
    const [bank, setBank] = useState(null);
    const [account, setAccount] = useState(null);

    return (
        <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="bank_id" className="form-label">Banco</label>
                    <BanksSelect id="bank" name="bank" query="&country=2" value={bank} onChange={setBank} />
                </div>
                <div className="col">
                    <label htmlFor="account_id" className="form-label">Cuenta <span className="Required">*</span></label>
                    <BankAccountsSelect id="account" name="account" value={account} onChange={setAccount} query={`&bank=${bank?.value || 0}`} disabled={!bank} />
                </div>
            </div>
        </>
    )
}

