import React, { FormEvent, useEffect, useState } from "react";
import traduction from '../../traductions/traduction.json'
import { getListUser, UserInfoWithId } from "../request/requestUser";
import { useAssoContext } from "../main";
import { VoteType } from "../request/requestVote";
import { SondageType } from "../request/requestSondage";
import { ReponseType } from "../request/requestReponse";
import { Applicant } from "./Applicant";

type ResponseProps = {
    vote?: VoteType,
    sondage?: SondageType,
    onSave: (response: ReponseType) => void
}

function sortAlphabetically(users: UserInfoWithId[]): UserInfoWithId[] {
    return users.sort((a, b) => a.firstName.localeCompare(b.firstName))
}

export function ResponseForm({vote, sondage, onSave}: ResponseProps) {
    const [listUser, setListUser] = useState<Array<UserInfoWithId>>([])
    const [listUserSelect, setListUserSelect] = useState<Array<UserInfoWithId>>([])
    const [selectedUsers, setSelectedUsers] = useState<Array<UserInfoWithId>>([])
    const [name, setName] = useState<string>("")
    const [searchName, setSearchName] = useState<string>("")
    const [showList, setShowList] = useState<boolean>(false)
    const asso = useAssoContext()

    useEffect(() => {
        const userList = async () => {
            if(asso.asso !== null) {
                setListUser((await getListUser(asso.asso.domainName)).users.filter((user) => user.role.isMember))
            }
        }
        userList()
    }, [])

    useEffect(() => {
        setListUserSelect(sortAlphabetically(listUser))
    }, [listUser])

    useEffect(() => {
        setListUserSelect(sortAlphabetically(listUser.filter((user) =>
            !selectedUsers.includes(user) 
            && (user.firstName.toLowerCase().includes(searchName.toLowerCase()) 
            || user.lastName.toLowerCase().includes(searchName.toLowerCase())))))
    }, [searchName])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSave({nbVote: 0, id: 0, name: name, vote: vote, sondage: sondage, applicants: selectedUsers, voters: []})
    }

    const handleSelect = (user: UserInfoWithId) => {
        setListUserSelect(listUserSelect.filter((userList) => user !== userList))
        setSelectedUsers([...selectedUsers, user])
        setSearchName("")
        setShowList(false)
    }

    const handleDeleteUserSelected = (user: UserInfoWithId) => {
        setSelectedUsers(selectedUsers.filter((userSelected) => userSelected !== user))
        setListUserSelect(sortAlphabetically([...listUserSelect, user]))
    }

    const handleFocus = () => {
        setShowList(true)
    }
    
    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setShowList(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="div_form_response">
            <div className="div_form_response_title">
                <label>{traduction.response_name} : </label>
                <input onChange={(e) => (setName(e.target.value))} className="input_form_response" required placeholder={traduction.response_name}></input>
            </div>
            <div className="div_form_response_applicant">
                <label>{traduction.response_applicant} : </label>
                <div className="div_selected_item">
                    {selectedUsers.map((user) => (
                        <Applicant key={user.id} user={user} onDelete={(user) => handleDeleteUserSelected(user)}></Applicant>
                    ))}
                    <div onFocus={handleFocus} onBlur={handleBlur} tabIndex={-1}>
                        <input onChange={(e) => (setSearchName(e.target.value))} className="input_form_response" placeholder={traduction.applicant_search}></input>
                        {showList && (<div className="div_drop_down_list">
                            {listUserSelect.map((user) => (
                                <div className="item_drop_down_list" key={user.id} onClick={() => handleSelect(user)}>{user.firstName} {user.lastName}</div>
                            ))}
                        </div>)}
                    </div>
                </div>
            </div>
            <div className="div_button_submit">
                <button className="button_class" type="submit">{traduction.response_create}</button>
            </div>
        </form>
    )
}