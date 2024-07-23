import React, { useEffect, useState } from 'react';
import traduction from "../../traductions/traduction.json"
import { useAssoContext } from '../main';

export function Transactions () {
    const [listTransaction, setListTransactions] = useState<Array<number>>([])
    const asso = useAssoContext()
    
    return (
        <div className="div_ged">
            {/* <div className="div_ged_content">
                <div className="div_ged_header_list">
                    <label className="width_column">{traduction.user_firstname}</label>
                    <label className="width_column">{traduction.user_lastname}</label>
                    <label className="width_column">{traduction.user_role}</label>
                </div>
                {listUsers.map((user) => (
                    <UserRow key={user.id} user={user} onChange={(userUpdated) => handleChange(userUpdated)}></UserRow>
                ))}
                
            </div>
            {!isListUser && (<div className="div_ged_content">
                <div className="div_ged_header_list">
                    <label className="width_column">{traduction.role_name}</label>
                    <label className="width_column">{traduction.role_isMember}</label>
                    <label className="width_column">{traduction.role_isAdmin}</label>
                    <label className="width_column">{traduction.role_option}</label>
                </div>
                {listRole.map((role) => (
                    <RoleRow key={role.id} role={role} onUpdate={(roleUpdated) => handleUpdate(roleUpdated)} onDelete={(roleDelete) => handleDelete(roleDelete)}/>
                ))}
            </div>)}
            <PopupRole isOpen={isOpen}
                handleClose={togglePopup}
                onSave={handleSave}/> */}
        </div>
    )
}