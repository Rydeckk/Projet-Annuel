import React from "react";
import { TransactionType } from "../request/requestTransaction";
import { formatDateToLocalString } from "../utils/utils-function";

type TransactionProps = {
    transaction: TransactionType
}

export function MyTransaction({transaction}: TransactionProps) {
    return (
        <div className="div_file_ged">
            <div className="div_row_content">
                <label className="width_column">{transaction.montant}€</label>
                <label className="width_column">{transaction.type}</label>
                <label className="width_column">{formatDateToLocalString(transaction.didAt)}</label>
            </div>
        </div>
    )
}