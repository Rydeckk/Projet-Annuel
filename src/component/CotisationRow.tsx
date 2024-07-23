import React, { ChangeEvent, useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { Role, UserInfoWithId } from "../request/requestUser";
import { useAssoContext } from "../main";
import { getListRole } from "../request/requestRole";
import { Cotisation } from "../request/requestCotisation";
import { PopupCotisation } from "./PopupCotisation";

type CotisationRowProps = {
    cotisation: Cotisation,
    onUpdate: (cotisationUpdated: Cotisation) => void
    onDelete: (cotisationDelete: Cotisation) => void
}

export function CotisationRow({cotisation, onUpdate, onDelete}: CotisationRowProps) {
    const [isOpen, setIsOpen] = useState(false);
    const asso = useAssoContext()

    const togglePopup = () => {
        setIsOpen(!isOpen)
    }

    const handleUpdate = (cotisationUpdate: Cotisation) => {
        onUpdate(cotisationUpdate)
        }

    const handleDelete = () => {
        onDelete(cotisation)
    }

    return (
        <div className="div_file_ged">
            <div className="div_row_content">
                <label className="width_column">{cotisation.montant}</label>
                <label className="width_column">{cotisation.type}</label>
                <div className="item_list" style={{display: "flex", justifyContent: "center"}}>
                    <img src="/icone/crayon.png" className="taille_icone clickable-image" style={{marginRight: "10px"}} onClick={togglePopup}></img>
                    <button className="button_close" onClick={handleDelete}>X</button>
                </div>
            </div>
            <PopupCotisation isOpen={isOpen}
                handleClose={togglePopup}
                onSave={handleUpdate}
                cotisation={cotisation}/>
        </div>
    )
}