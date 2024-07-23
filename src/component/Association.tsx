import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { useAssoContext } from "../main";
import { Association } from "../request/request";

export function Association() {
    const [association, setAssociation] = useState<Association>()
    const asso = useAssoContext()

    useEffect(() => {
        if(asso.asso !== null) {
            setAssociation(asso.asso)
        }
    
    }, [asso])

    return (
        <div className="user-profile">
        <h1>{traduction.association}</h1>
            <div className="user-info">
                <p><strong>{traduction.asso_name} : </strong>{association?.name}</p>
                <p><strong>{traduction.asso_desc} : </strong>{association?.description}</p>
            </div>
        </div>
    )
}