import React, { ChangeEvent, useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { Role, UserInfoWithId } from "../request/requestUser";
import { useAssoContext } from "../main";
import { getListRole } from "../request/requestRole";
import { PopupRole } from "./popupRole";

type RoleRowProps = {
    role: Role,
    onUpdate: (roleUpdated: Role) => void,
    onDelete: (roleDelete: Role) => void
}

export function RoleRow({role, onUpdate, onDelete}: RoleRowProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    const togglePopup = () => {
        setIsOpen(!isOpen)
    }

    const handleDelete = () => {
        onDelete(role)
    }

    const handleSave = (roleUpdated: Role) => {
        onUpdate(roleUpdated)
    }

    return (
        <div className="div_file_ged">
            <div className="div_row_content">
                <label className="width_column">{role.name}</label>
                <input className="width_column input_radio" checked={role.isMember} type="radio" disabled></input>
                <input className="width_column input_radio" checked={role.isAdmin} type="radio" disabled></input>
                <div className="item_list" style={{display: "flex", justifyContent: "center"}}>
                    <img src="/icone/crayon.png" className="taille_icone clickable-image" style={{marginRight: "10px"}} onClick={togglePopup}></img>
                    <button className="button_close" onClick={handleDelete}>X</button>
                </div>
            </div>
            <PopupRole isOpen={isOpen}
                handleClose={togglePopup}
                onSave={handleSave}
                role={role}/>
        </div>
    )
}