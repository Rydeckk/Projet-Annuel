import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { UserRow } from "./UserRow";
import { getListUser, Role, updateUser, UserInfoWithId } from "../request/requestUser";
import { useAssoContext } from "../main";
import { createRole, deleteRole, getListRole, updateRole } from "../request/requestRole";
import { RoleRow } from "./RoleRow";
import { PopupRole } from "./popupRole";

export function Users() {
    const [listUsers, setListUsers] = useState<Array<UserInfoWithId>>([])
    const [isListUser, setIsListUser] = useState<boolean>(true)
    const [listRole, setListRole] = useState<Array<Role>>([])
    const [error, setError] = useState<string>("")
    const [isError, setIsError] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const asso = useAssoContext()

    useEffect(() => {
        const getUsers = async () => {
            if(asso.asso) {
                setListUsers((await getListUser(asso.asso.domainName)).users)
            }
        }

        getUsers()
    }, [asso.asso])

    useEffect(() => {
        const getRole = async () => {
            if(asso.asso) {
                setListRole((await getListRole(asso.asso.domainName)).roles)
            }
        }

        getRole()
    }, [asso.asso, isListUser])

    const toggleIsListUser = () => {
        setIsListUser(!isListUser)
    }

    const togglePopup = () => {
        setIsOpen(!isOpen)
    }

    const handleChange = async (userUpdated: UserInfoWithId) => {
        if(asso.asso) {
            await updateUser(userUpdated, asso.asso.domainName)
            setListUsers(listUsers.map((user) => user.id === userUpdated.id ? userUpdated : user))
        }
        
    }

    const handleUpdate = async (roleUpdate: Role) => {
        if(asso.asso) {
            await updateRole({id: roleUpdate.id, name: roleUpdate.name, isMember: roleUpdate.isMember, isAdmin: roleUpdate.isAdmin}, asso.asso.domainName)
            setListRole(listRole.map((role) => role.id === roleUpdate.id ? roleUpdate : role))
        }
    }

    const handleDelete = async (roleDelete: Role) => {
        setError("")
        setIsError(false)
        if(asso.asso) {
            const roleIsUse = listUsers.find((user) => user.role.id === roleDelete.id)
            if(roleIsUse) {
                setError(traduction.error_delete_role)
                setIsError(true)
            } else {
                await deleteRole(roleDelete.id, asso.asso.domainName)
                setListRole(listRole.filter((role) => role.id !== roleDelete.id))
            }
        }
        
    }

    const handleSave = async (roleCreate: Role) => {
        if(asso.asso) {
            const roleCreated = await createRole({ name: roleCreate.name, isMember: roleCreate.isMember, isAdmin: roleCreate.isAdmin}, asso.asso.domainName)
            setListRole([...listRole, roleCreated])
        }
    }

    return (
        <div className="div_ged">
            {isError && (<label style={{color: "red", margin: "10px"}}>{error}</label>)}
            <div className="div_ged_header" style={{justifyContent: isListUser ? "flex-end" : "space-between"}}>
                {!isListUser && (<img src="/icone/return.png" className="clickable-image taille_icone50" onClick={() => toggleIsListUser()}></img>)}
                {isListUser && (<div style={{display: "flex", flexDirection: "column", marginRight:"15px", justifyContent: "center", alignItems: "center"}}>
                    <img src="/icone/gearBlack.png" className="clickable-image taille_icone50" onClick={() => toggleIsListUser()}></img>
                    <label>{traduction.settings_role}</label>
                </div>)}
                {!isListUser && (<div style={{display: "flex", flexDirection: "column", marginRight:"15px", justifyContent: "center", alignItems: "center"}}>
                    <img src="/icone/add.png" className="clickable-image taille_icone50" onClick={() => togglePopup()}></img>
                    <label>{traduction.add}</label>
                </div>)}
            </div>
            {isListUser && (<div className="div_ged_content">
                <div className="div_ged_header_list">
                    <label className="width_column">{traduction.user_firstname}</label>
                    <label className="width_column">{traduction.user_lastname}</label>
                    <label className="width_column">{traduction.user_role}</label>
                </div>
                {listUsers.map((user) => (
                    <UserRow key={user.id} user={user} onChange={(userUpdated) => handleChange(userUpdated)}></UserRow>
                ))}
                
            </div>)}
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
                onSave={handleSave}/>
        </div>
    )
}