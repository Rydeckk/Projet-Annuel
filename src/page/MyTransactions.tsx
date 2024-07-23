import React, { useEffect, useState } from 'react';
import traduction from "../../traductions/traduction.json"
import { useAssoContext, useUserContext } from '../main';
import { getListTransaction, TransactionType } from '../request/requestTransaction';
import { MyTransaction } from '../component/MyTransaction';


export function MyTransactions () {
    const [listTransaction, setListTransactions] = useState<Array<TransactionType>>([])
    const asso = useAssoContext()
    const user = useUserContext()
    
    useEffect(() => {
        const getTransactions = async () => {
            if(asso.asso && user.user) {
                setListTransactions((await getListTransaction(asso.asso.domainName, user.user.id)).transactions)
            }
        }

        getTransactions()
    }, [asso.asso, user.user])

    return (
        <div className="div_ged">
            <div className="div_ged_content" style={{height: "100%"}}>
                <div className="div_ged_header_list">
                    <label className="width_column">{traduction.transaction_amount}</label>
                    <label className="width_column">{traduction.transaction_type}</label>
                    <label className="width_column">{traduction.transaction_ditAt}</label>
                </div>
                {listTransaction.map((transaction) => (
                    <MyTransaction key={transaction.id} transaction={transaction}></MyTransaction>
                ))}
                
            </div>
        </div>
    )
}