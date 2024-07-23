import React from "react";
import { AssembleeType } from "../request/requestAssemble";
import traduction from "../../traductions/traduction.json"
import { useUserContext } from "../main";
import { formatDateToLocalString } from "../utils/utils-function";

type AssembleeProps = {
    assemblee: AssembleeType
    onClick: (assemblee: AssembleeType) => void
}



export function Assemblee({assemblee, onClick}: AssembleeProps) {
    const user = useUserContext()

    const handleClick = () => {
        onClick(assemblee)
    }

    return (
        <div className="item_card" onClick={handleClick}>
            <div className="div_column">
                <div className="div_list_2_column">
                    <label className="item_list_2_column">{traduction.assemblee_desc} : </label>
                    <label className="item_list_2_column">{assemblee.description}</label>
                </div>
                <div className="div_list_2_column">
                    <label className="item_list_2_column">{traduction.assemblee_location} : </label>
                    <label className="item_list_2_column">{assemblee.location}</label>
                </div>
                <div className="div_list_2_column" >
                    <label className="item_list_2_column">{traduction.assemblee_begin} : </label>
                    <label className="item_list_2_column">{formatDateToLocalString(assemblee.beginDate)}</label>
                </div>
                <div className="div_list_2_column" >
                    <label className="item_list_2_column">{traduction.assemblee_end} : </label>
                    <label className="item_list_2_column">{formatDateToLocalString(assemblee.endDate)}</label>
                </div>
            </div>
        </div>
    )
}