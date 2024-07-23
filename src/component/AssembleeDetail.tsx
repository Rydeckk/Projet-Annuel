import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { AssembleeType } from "../request/requestAssemble";
import { formatDateToLocalString } from "../utils/utils-function";
import { createVote, deleteVote, getListVote, updateVote, VoteType } from "../request/requestVote";
import { useAssoContext, useUserContext } from "../main";
import { Votes } from "./Votes";
import { PopupVote } from "./popupVote";
import { updateEvent } from "../request/requestEvent";

type AssembleDetailProps = {
    assemblee: AssembleeType,
    onClickReturn: () => void,
    onClickVote: (vote: VoteType) => void
}

export function AssembleeDetail({assemblee, onClickReturn, onClickVote}: AssembleDetailProps) {
    const [listVote, setListVote] = useState<Array<VoteType>>([])
    const [isOpen, setIsOpen] = useState(false);
    const asso = useAssoContext()
    const user = useUserContext()

    useEffect(() => {
        const getVotesAssemblee = async () => {
            if(asso.asso !== null) {
                setListVote((await getListVote(asso.asso.domainName, assemblee.id)).votes)
            }
        }

        getVotesAssemblee()
    }, [assemblee])

    const togglePopup = () => {
        setIsOpen(!isOpen)
    }

    const onSave = async (voteCreate: VoteType) => {
        if(asso.asso) {
            const voteCreated = await createVote({
                name: voteCreate.name,
                beginDate: voteCreate.beginDate,
                endDate: voteCreate.endDate,
                assembleeId: assemblee.id,
                voteIdParent: voteCreate.parentVote?.id
            },asso.asso.domainName)
            setListVote([...listVote,voteCreated])
        }
        
        setIsOpen(false)
    }

    const onDelete = async (voteDeleted: VoteType) => {
        setListVote(listVote.filter((e) => e.id !== voteDeleted.id))
        if(asso.asso) {
            deleteVote(voteDeleted.id,asso.asso.domainName)
        }
        
    }

    const onUpdate = async (voteUpdated: VoteType) => {
        setListVote(listVote.map((vote) => (vote.id === voteUpdated.id ? voteUpdated : vote)))
        if(asso.asso) {
            updateVote({
                id: voteUpdated.id,
                name: voteUpdated.name,
                beginDate: voteUpdated.beginDate,
                endDate: voteUpdated.endDate,
                voteIdParent: voteUpdated.parentVote?.id,
                assembleeId: voteUpdated.assemblee?.id
            },asso.asso.domainName)
        }
    }

    const handleClickVote = (vote: VoteType) => {
        onClickVote(vote)
    }

    return (
        <div>
            <div className="div_info">
                <h1 className="title_section">{traduction.assemblee_info}</h1>
                <div className="div_column">
                    <div className="div_list_2_column">
                        <label className="item_list_2_column">{traduction.assemblee_desc} : </label>
                        <label className="item_list_2_column">{assemblee.description}</label>
                    </div>
                    <div className="div_list_2_column">
                        <label className="item_list_2_column">{traduction.assemblee_location} : </label>
                        <label className="item_list_2_column">{assemblee.location}</label>
                    </div>
                    <div className="div_list_2_column" >
                        <label className="item_list_2_column">{traduction.assemblee_begin} : </label>
                        <label className="item_list_2_column">{formatDateToLocalString(assemblee.beginDate)}</label>
                    </div>
                    <div className="div_list_2_column" >
                        <label className="item_list_2_column">{traduction.assemblee_end} : </label>
                        <label className="item_list_2_column">{formatDateToLocalString(assemblee.endDate)}</label>
                    </div>
                </div>
            </div>
            <div className="div_section_vote">
                <h1 className="title_section">{traduction.vote_title}</h1>
                <div className="div_content_card">
                    {listVote.map((vote) => (
                        <Votes key={vote.id} vote={vote} onDelete={() => onDelete(vote)} onSave={(vote) => onUpdate(vote)} onClickVote={(vote) => handleClickVote(vote)}></Votes>
                    ))}
                    {user.user?.role.isAdmin && (<div style={{paddingTop: "35px"}}>
                        <img src="/icone/add.png" onClick={togglePopup} style={{height:"30px", width: "30px"}} className="clickable-image"></img>
                    </div>)}
                </div>
            </div>
            <div className="div_return" onClick={onClickReturn}>
                <img className="clickable-image taille_icone30" src="/icone/return.png"></img>
                <label className="clickable-image">{traduction.return}</label>
            </div>
            <PopupVote isOpen={isOpen} 
                handleClose={togglePopup} 
                onSave={onSave}
                assemblee={assemblee}/>
        </div>
    )
}