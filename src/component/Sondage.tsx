import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { useAssoContext, useUserContext } from "../main";
import { formatDateToLocalString } from "../utils/utils-function";
import { SondageType } from "../request/requestSondage";
import { PopupSondage } from "./PopupSondage";
import { PopupResponse } from "./PopupResponse";
import { createResponseSondage, deleteResponseSondage, getListResponseSondage, ReponseType, submitResponse, updateResponseSondage } from "../request/requestReponse";
import { Response } from "./Response";

type SondageProps = {
    sondage: SondageType,
    onDelete: () => void,
    onSave: (sondage: SondageType) => void
}

export function getStateSondage(beginDate: Date, endDate: Date): "not_begin" | "pending" | "finish" {
    const today = new Date()
    const dateBegin = new Date(beginDate)
    const dateEnd = new Date(endDate)

    if(dateBegin > today) {
        return "not_begin"
    } else if(dateBegin <= today && dateEnd > today) {
        return "pending"
    } else {
        return "finish"
    }
}

export function Sondage({sondage, onDelete, onSave}: SondageProps) {
    const [isOpenSondage, setIsOpenSondage] = useState(false)
    const [isOpenResponse, setIsOpenResponse] = useState(false)
    const [listResponse, setListResponse] = useState<Array<ReponseType>>([])
    const [responseSelected, setReponseSelected] = useState<ReponseType>()
    const [isEnabledSubmit, setIsEnabledSubmit] = useState<boolean>(true)
    const [state, setState] = useState<"not_begin" | "pending" | "finish">("not_begin")
    const [time, setTime] = useState<Date>(new Date());
    const user = useUserContext()
    const asso = useAssoContext()

    useEffect(() => {
        const actualStateVote = getStateSondage(sondage.beginDate, sondage.endDate)
        setState(actualStateVote)
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date())
            setState(getStateSondage(sondage.beginDate, sondage.endDate))
        }, 60000) //s'éxécute toutes les minutes

        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        const getReponses = async () => {
            if(asso.asso) {
                setListResponse((await getListResponseSondage(sondage.id, asso.asso.domainName)).responses)
            }
        }
        
        getReponses()
    }, [sondage])

    useEffect(() => {
        // Faire test avec ID 
        if(listResponse.map((response) => {response.voters.find((voter) => voter.id === user.user?.id)})) {
            setIsEnabledSubmit(false)
        }
    }, [user.user])

    const togglePopupSondage = () => {
        setIsOpenSondage(!isOpenSondage);
    }

    const togglePopupReponse = () => {
        setIsOpenResponse(!isOpenResponse);
    }

    const handleSaveSondage = (sondageUpdated: SondageType) => {
        onSave(sondageUpdated)
    }
    const handleSaveResponse = async (response: ReponseType) => {
        if(asso.asso !== null) {
            const responseCreated = await createResponseSondage({
                name: response.name, 
                voteId: response.vote?.id, 
                sondageId: response.sondage?.id, 
                applicantId: response.applicants.map((user) => user.id)
            }, asso.asso.domainName)
            setListResponse([...listResponse, responseCreated])
        }
    }

    const handleCheck = async (response: ReponseType) => {
        setReponseSelected(response)
        if(asso.asso) {
            setIsEnabledSubmit(false)
            await submitResponse(sondage.id, response.id, asso.asso.domainName)
        }
        
    }
    
    const handleDelete = async (response: ReponseType) => {
        if(asso.asso !== null) {
            await deleteResponseSondage(sondage.id, response.id, asso.asso.domainName)
            setListResponse(listResponse.filter((reponse) => reponse.id !== response.id))
        }
    }

    const handleUpdateResponse = async (updatedResponse: ReponseType) => {
        if(asso.asso !== null) {
            await updateResponseSondage(sondage.id, updatedResponse, asso.asso.domainName)
            setListResponse(listResponse.map((response) => (response.id === updatedResponse.id ? updatedResponse : response)))
        }
    }

    return (
        <div className="item_card">
            <div className="div_flex_end">
                {user.user?.role.isAdmin && state === "not_begin" && (<img src="/icone/crayon.png" className="taille_icone" onClick={togglePopupSondage}></img>)}
            </div>
            <div className="div_column">
                <div className="div_list_2_column">
                    <label className="item_list_2_column">{traduction.sondage_name} : </label>
                    <label className="item_list_2_column">{sondage.name}</label>
                </div>
                <div className="div_list_2_column">
                    <label className="item_list_2_column">{traduction.sondage_begin} : </label>
                    <label className="item_list_2_column">{formatDateToLocalString(sondage.beginDate)}</label>
                </div>
                <div className="div_list_2_column">
                    <label className="item_list_2_column">{traduction.sondage_end} : </label>
                    <label className="item_list_2_column">{formatDateToLocalString(sondage.endDate)}</label>
                </div>
                <div className="div_list_2_column">
                    <label className="item_list_2_column">{traduction.state} : </label>
                    <label className="item_list_2_column">{state === "finish" ? traduction.finish : (state === "pending" ? traduction.pending : traduction.not_begin)}</label>
                </div>
                {user.user?.role.isAdmin && state === "not_begin" && (<div className="div_align_center div_padding5_vertical">
                    <div>
                        <button className="button_class" onClick={onDelete}>{traduction.delete}</button>
                    </div>
                </div>)}
                <div className="div_column_response">
                    <div className="div_title_response">
                        <h2>{traduction.response_title}</h2>
                    </div>
                    {listResponse.map((response) => (
                        <Response key={response.id} response={response} stateVote={state} onUpdate={handleUpdateResponse} onDelete={(response) => handleDelete(response)} onCheck={(response) => handleCheck(response)} isEnabled={isEnabledSubmit}></Response>
                    ))}
                    {user.user?.role.isAdmin && state === "not_begin" && (<div style={{paddingTop: "15px", marginLeft: "10px"}}>
                        <img src="/icone/add.png" onClick={togglePopupReponse} style={{height:"30px", width: "30px"}} className="clickable-image"></img>
                    </div>)}
                </div>
            </div>
            <PopupSondage isOpen={isOpenSondage} 
                handleClose={togglePopupSondage} 
                onSave={handleSaveSondage} 
                onDelete={onDelete} 
                sondage={sondage}/>
            <PopupResponse isOpen={isOpenResponse}
                handleClose={togglePopupReponse}
                onSave={handleSaveResponse}
                sondage={sondage}/>
        </div>
    )
}