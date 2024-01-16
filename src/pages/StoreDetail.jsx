import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";
import { getStore } from "../helpers/stores";

export default function StoreDetail() {
    const [store, setStore] = useState(null);
    const { session } = useContext(SessionContext);
    const params = useParams();

    useEffect(() => {
        const { id } = params;
        const fetchData = async () => {
            const storeResponse = await getStore(id);
            if (!storeResponse) {
                // 404
            }

            if (storeResponse.user_id !== session.id) {
                // forbidden
            }

            console.log(storeResponse);
        }

        if (![1,3].includes(session.role_id)) {
            //redirect
        }

        fetchData();
    }, [session.role_id]);

    console.log(params)

    return (
        <>
            StoreDetail
        </>
    );
}