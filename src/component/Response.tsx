import React, { useEffect, useState } from "react"
import traduction from '../../traductions/traduction.json'
import { ReponseType } from "../request/requestReponse"
import { useUserContext } from "../main"

type ResponseProps = {
    response: ReponseType,
    stateVote: "not_begin" | "pending" | "finish",
    onCheck: (response: ReponseType) => void,
    isEnabled: boolean
}

export function Response({response, stateVote, onCheck, isEnabled}: ResponseProps) {
    const [isChecked, setIsCheck] = useState<boolean>(false)
    const user = useUserContext()

    useEffect(() => {
        if(response.voters.find((voter) => (voter.firstName.concat(voter.lastName)) === user.user?.firstname.concat(user.user.lastname))) {
            setIsCheck(true)
        }
    }, [user.user])

    const handleCheck = () => {
        setIsCheck(true)
        onCheck(response)
    }
    
    return (
        <div className="div_list_row">
            <label className="item_list">{response.name}</label>
            {response.applicants.length > 0 && (<div className="div_column item_list">
            {response.applicants.map((applicant) => (
                <label className="label_list_user" key={applicant.id}>{applicant.firstName} {applicant.lastName}</label>
            ))}
            </div>)}
            <input className="item_list input_radio" checked={isChecked} name="response" type="radio" disabled={stateVote !== "pending" || !isEnabled} onChange={handleCheck} required></input>
        </div>
    )
}