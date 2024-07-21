import React, { FormEvent, useEffect, useState } from "react"
import traduction from '../../traductions/traduction.json'
import { VoteType } from "../request/requestVote"
import { useAssoContext, useUserContext } from "../main"
import { createResponseVote, getListResponseVote, ReponseType, submitVote } from "../request/requestReponse"
import { formatDateToLocalString } from "../utils/utils-function"
import { Response } from "./Response"
import { ResponseForm } from "./ResponseForm"
import { Resultat } from "./Resultat"

type ResponsesProps = {
    vote: VoteType,
    stateVote: "not_begin" | "pending" | "finish",
    onClickReturn: () => void
}

export function Responses({vote, stateVote, onClickReturn}: ResponsesProps) {
    const [listResponse, setListResponse] = useState<Array<ReponseType>>([])
    const [isResponseForm, setIsResponseForm] = useState<boolean>(false)
    const [responseSelected, setReponseSelected] = useState<ReponseType>()
    const [isEnabledVote, setIsEnabledVote] = useState<boolean>(true)
    const asso = useAssoContext()
    const user = useUserContext()

    useEffect(() => {
        const getListResponse = async () => {
            if(asso.asso !== null) {
                setListResponse((await getListResponseVote(vote.id, asso.asso.domainName)).responses)
            }
        }

        getListResponse()
    }, [asso.asso])

    useEffect(() => {
        if(listResponse.map((response) => response.voters.find((voter) => voter.firstName.concat(voter.lastName) === user.user?.firstname.concat(user.user.lastname)))) {
            setIsEnabledVote(false)
        }
    }, [user.user])

    const handleSave = async (response: ReponseType) => {
        if(asso.asso !== null) {
            const responseCreated = await createResponseVote({
                name: response.name, 
                voteId: response.vote?.id, 
                sondageId: response.sondage?.id, 
                applicantId: response.applicants.map((user) => user.id)
            }, asso.asso.domainName)
            setListResponse([...listResponse, responseCreated])
            toggleResponseForm()
        }
    }

    const toggleResponseForm = () => {
        setIsResponseForm(!isResponseForm)
    }

    const handleCheck = (response: ReponseType) => {
        setReponseSelected(response)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(responseSelected && asso.asso) {
            const submitResponse = await submitVote(vote.id, responseSelected.id, asso.asso.domainName)
            setListResponse(listResponse.map((response) => (response.id === submitResponse.id ? submitResponse : response)))
        }
    }
    
    return (
        <div>
             <div className="div_info">
                <h1 className="title_section">{traduction.vote_info}</h1>
                <div className="div_column">
                    <div className="div_list_2_column">
                        <label className="item_list_2_column">{traduction.vote_name} : </label>
                        <label className="item_list_2_column">{vote.name}</label>
                    </div>
                    <div className="div_list_2_column" >
                        <label className="item_list_2_column">{traduction.vote_begin} : </label>
                        <label className="item_list_2_column">{formatDateToLocalString(vote.beginDate)}</label>
                    </div>
                    <div className="div_list_2_column" >
                        <label className="item_list_2_column">{traduction.vote_end} : </label>
                        <label className="item_list_2_column">{formatDateToLocalString(vote.endDate)}</label>
                    </div>
                    <div className="div_list_2_column" >
                        <label className="item_list_2_column">{traduction.state} : </label>
                        <label className="item_list_2_column">{stateVote === "finish" ? traduction.finish : (stateVote === "pending" ? traduction.pending : traduction.not_begin)}</label>
                    </div>
                </div>
            </div>
            <div className="div_section_response">
                <h1 className="title_section">{traduction.response_title}</h1>
                {!isResponseForm && stateVote !== "finish" && (<form className="div_column" onSubmit={(e) => handleSubmit(e)}>
                    {user.user?.role.isAdmin && stateVote === "not_begin" && (<div style={{paddingTop: "35px"}}>
                        <img src="/icone/add.png" style={{height:"30px", width: "30px"}} className="clickable-image" onClick={toggleResponseForm}></img>
                    </div>)}
                    {listResponse.map((response) => (
                        <Response key={response.id} response={response} stateVote={stateVote} onCheck={(response) => handleCheck(response)} isEnabled={isEnabledVote}></Response>
                    ))}
                    {isEnabledVote && (<div className="div_button_submit">
                        <button className="button_class" type="submit">{traduction.vote}</button>
                    </div>)}
                </form>)}
                { listResponse.length > 0 && stateVote === "finish" && (
                    <Resultat responses={listResponse}></Resultat>
                )}
                {isResponseForm && (<div>
                    <ResponseForm vote={vote} onSave={(response) => handleSave(response)}></ResponseForm>
                </div>)}
            </div>
            <div className="div_return" onClick={onClickReturn}>
                <img className="clickable-image taille_icone30" src="/icone/return.png"></img>
                <label className="clickable-image">{traduction.return}</label>
            </div>
        </div>
    )
}