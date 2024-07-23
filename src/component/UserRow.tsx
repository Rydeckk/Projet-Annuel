import React, { ChangeEvent, useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { Role, UserInfoWithId } from "../request/requestUser";
import { useAssoContext } from "../main";
import { getListRole } from "../request/requestRole";

type UserRowProps = {
    user: UserInfoWithId,
    onChange: (userUpdated: UserInfoWithId) => void
}

export function UserRow({user, onChange}: UserRowProps) {
    const [listRole, setListRole] = useState<Array<Role>>([])
    const [selectedRole, setSelectedRole] = useState<number>()
    const asso = useAssoContext()

    useEffect(() => {
        const getRoles = async () => {
            if(asso.asso) {
                setListRole((await getListRole(asso.asso.domainName)).roles)
                setSelectedRole(user.role.id)
            }
            
        }

        getRoles()
    }, [asso.asso])

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(+e.target.value)
        const roleFound = listRole.find((role) => role.id === +e.target.value)
        if(roleFound) {
            user.role = roleFound
            onChange(user)
        }
    }

    return (
        <div className="div_file_ged">
            <div className="div_row_content">
                <label className="width_column">{user.firstName}</label>
                <label className="width_column">{user.lastName}</label>
                <div className="width_column">
                    <select className="select_class" value={selectedRole} onChange={handleChange}>
                        {listRole.map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}