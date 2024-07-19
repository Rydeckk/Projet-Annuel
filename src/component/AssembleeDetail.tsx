import React from "react";
import traduction from "../../traductions/traduction.json"
import { AssembleeType } from "../request/requestAssemble";
import { formatDateToLocalString } from "../utils/utils-function";

type AssembleDetailProps = {
    assemblee: AssembleeType,
    onClickRerturn: () => void
}

export function AssembleeDetail({assemblee, onClickRerturn}: AssembleDetailProps) {
    return (
        <div>
            <div className="div_info">
                <h1 className="title_section">{traduction.assemblee_info}</h1>
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
            <div className="div_section_vote">
                <h1 className="title_section">{traduction.vote_title}</h1>
                
            </div>
            <div className="div_return" onClick={onClickRerturn}>
                <img className="clickable-image taille_icone30" src="/icone/return.png"></img>
                <label className="clickable-image">{traduction.return}</label>
            </div>
            
        </div>
    )
}