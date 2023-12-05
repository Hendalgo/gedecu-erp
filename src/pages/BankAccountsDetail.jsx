import { useEffect } from "react";
import { redirect, useParams } from "react-router-dom";
import { BANKS_ROUTE, BANK_ACCOUNTS_ROUTE, DASHBOARD_ROUTE } from "../consts/Routes";
import { useState } from "react";

const BankAccountsDetail = () => {
  const params = useParams();
  // const [bankAccount, setBankAccount] = useState(null);

  useEffect(() => {
    const { id } = params;

    console.log(id)

    if (!id) redirect(`/${DASHBOARD_ROUTE}/${BANKS_ROUTE}/${BANK_ACCOUNTS_ROUTE}`);
    // Validar que el id sea un número
    
  }, [params]);

  return (
    <section>
      Here goes reading data
    </section>
  )
}

export default BankAccountsDetail;