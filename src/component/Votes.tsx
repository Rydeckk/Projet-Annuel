import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { VoteType } from "../request/requestVote";
import { useUserContext } from "../main";
import { formatDateToLocalString, getState } from "../utils/utils-function";
import { PopupVote } from "./popupVote";

type VotesProps = {
    vote: VoteType,
    onDelete: () => void,
    onSave: (vote: VoteType) => void,
    onClickVote: (vote: VoteType) => void
}

export function Votes({vote, onDelete, onSave, onClickVote}: VotesProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, setState] = useState<"not_begin" | "pending" | "finish">("not_begin")
    const [time, setTime] = useState<Date>(new Date());
    const user = useUserContext()

    useEffect(() => {
        const actualStateVote = getState(vote.beginDate, vote.endDate)
        setState(actualStateVote)
    }, [])

    

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date())
            setState(getState(vote.beginDate, vote.endDate))
        }, 60000) //s'éxécute toutes les minutes

        return () => clearInterval(intervalId);
    }, [])

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handleSave = (voteUpdated: VoteType) => {
        onSave(voteUpdated)
    }
    
    const handleClick = () => {
        onClickVote(vote)
    }

    return (
        <div className="item_card" onClick={handleClick}>
            <div className="div_flex_end">
                {user.user?.role.isAdmin && state === "not_begin" && (<img src="/icone/crayon.png" className="taille_icone" onClick={togglePopup}></img>)}
            </div>
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
                    <label className="item_list_2_column">{state === "finish" ? traduction.finish : (state === "pending" ? traduction.pending : traduction.not_begin)}</label>
                </div>
                {user.user?.role.isAdmin && state === "not_begin" && (<div className="div_align_center div_padding5_vertical">
                    <div>
                        <button className="button_class" onClick={onDelete}>{traduction.delete}</button>
                    </div>
                </div>)}
            </div>
            <PopupVote isOpen={isOpen} 
                handleClose={togglePopup} 
                onSave={handleSave} 
                onDelete={onDelete} 
                assemblee={vote.assemblee}
                vote={vote}/>
        </div>
    )
}