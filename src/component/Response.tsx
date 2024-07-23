import React, { useEffect, useState } from "react"
import traduction from '../../traductions/traduction.json'
import { ReponseType } from "../request/requestReponse"
import { useUserContext } from "../main"
import { PopupResponse } from "./PopupResponse"

type ResponseProps = {
    response: ReponseType,
    stateVote: "not_begin" | "pending" | "finish",
    onCheck: (response: ReponseType) => void,
    onDelete: (response: ReponseType) => void,
    onUpdate: (response: ReponseType) => void,
    isEnabled: boolean
}

export function Response({response, stateVote, onCheck, isEnabled, onDelete, onUpdate}: ResponseProps) {
    const [isChecked, setIsCheck] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState(false);
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

    const handleDelete = () => {
        onDelete(response)
    }

    const handleUpdate = () => {
        onUpdate(response)
    }

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }
    
    return (
        <div className="div_list_row" style={{backgroundColor: isChecked ? "rgba(9, 212, 100, 0.726)" : ""}}>
            <label className="item_list">{response.name}</label>
            {response.applicants.length > 0 && (<div className="div_column item_list">
            {response.applicants.map((applicant) => (
                <label className="label_list_user" key={applicant.id}>{applicant.firstName} {applicant.lastName}</label>
            ))}
            </div>)}
            {stateVote === "pending" && (<input className="item_list input_radio" checked={isChecked} name="response" type="radio" disabled={!isEnabled} onChange={handleCheck} required></input>)}
            {stateVote === "not_begin" && (<div className="item_list" style={{display: "flex", justifyContent: "center"}}>
                <img src="/icone/crayon.png" className="taille_icone clickable-image" style={{marginRight: "10px"}} onClick={ response.vote ? handleUpdate : togglePopup}></img>
                <button className="button_close" onClick={handleDelete}>X</button>
                
            </div>)}
            {!isEnabled && stateVote !== "not_begin" && response.sondage && (<label>{response.nbVote}</label>)}
            {response.sondage && (<PopupResponse isOpen={isOpen}
                handleClose={togglePopup}
                onSave={handleUpdate}
                sondage={response.sondage}
                response={response}/>)}
        </div>
    )
}