import React, { useEffect, useState } from 'react';
import traduction from "../../traductions/traduction.json"
import { useAssoContext } from '../main';
import { getListTransaction, TransactionType } from '../request/requestTransaction';
import { Transaction } from '../component/Transaction';

export function Transactions () {
    const [listTransaction, setListTransactions] = useState<Array<TransactionType>>([])
    const asso = useAssoContext()
    
    useEffect(() => {
        const getTransactions = async () => {
            if(asso.asso) {
                setListTransactions((await getListTransaction(asso.asso.domainName)).transactions)
            }
        }

        getTransactions()
    }, [asso.asso])

    return (
        <div className="div_ged">
            <div className="div_ged_content" style={{height: "100%"}}>
                <div className="div_ged_header_list">
                    <label className="width_column">{traduction.transaction_amount}</label>
                    <label className="width_column">{traduction.transaction_type}</label>
                    <label className="width_column">{traduction.transaction_ditAt}</label>
                    <label className="width_column">{traduction.transaction_user}</label>
                </div>
                {listTransaction.map((transaction) => (
                    <Transaction key={transaction.id} transaction={transaction}></Transaction>
                ))}
                
            </div>
        </div>
    )
}