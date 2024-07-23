import React, { FormEvent, useEffect, useState } from 'react';
import traduction from '../../traductions/traduction.json'
import { formatDateToLocalISOString } from '../utils/utils-function';
import { getListVote, VoteType } from '../request/requestVote';
import { ReponseType } from '../request/requestReponse';
import { AssembleeType } from '../request/requestAssemble';
import { useAssoContext } from '../main';

export type PropsPopUp = {
    isOpen: boolean
    handleClose: () => void,
    onSave: (e: VoteType) => void,
    onDelete?: () => void,
    vote?: VoteType,
    assemblee: AssembleeType | null
}

export function PopupVote ({ isOpen, handleClose, onSave, onDelete, vote, assemblee }: PropsPopUp) {
    const [beginDate, setBeginDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [responses, setResponses] = useState<Array<ReponseType>>([])
    const [id, setId] = useState<number>(0)
    const [parentVoteList, setParentVoteList] = useState<Array<VoteType>>([])
    const [selectedVote, setSelectedVote] = useState<number>()
    const asso = useAssoContext()

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const parentVoteSelected = parentVoteList.find((vote) => vote.id === selectedVote)
        const parentVoteFinal = parentVoteSelected !== undefined ? parentVoteSelected : null
        console.log(vote ? vote.assemblee : assemblee)
        onSave({name: name, beginDate: new Date(beginDate), endDate: new Date(endDate), id: id, reponses: responses, parentVote: vote ? vote.parentVote : parentVoteFinal, assemblee: vote ? vote.assemblee : assemblee })
        handleClose()
    }

    useEffect(() => {
        if(vote !== undefined) {
            setBeginDate(formatDateToLocalISOString(vote.beginDate));
            setEndDate(formatDateToLocalISOString(vote.endDate));
            setName(vote.name)
            setResponses(vote.reponses)
            setId(vote.id)
        }
      }, []);

    useEffect(() => {
        const getListParentVote = async () => {
            if(asso.asso !== null) {
                setParentVoteList((await getListVote(asso.asso.domainName, assemblee?.id)).votes)
            }
        }

        getListParentVote()
    }, [])

    return (
        <>
            { isOpen && (
                <div className="popup">
                    <form onSubmit={handleSave} className="popup-inner">
                        <img src='/icone/return.png' onClick={handleClose} className='taille_icone clickable-image'></img>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.title}</label>
                            <input className='item_list_2_column input_popup' value={name} onChange={(e) => setName(e.target.value)} placeholder={traduction.title} required></input>
                        </div>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.begin}</label>
                            <input className='item_list_2_column input_popup' type="datetime-local" value={beginDate} onChange={(e) => setBeginDate(e.target.value)} required></input>
                        </div>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.end}</label>
                            <input className='item_list_2_column input_popup' type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required></input>
                        </div>
                        {!vote && (<div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.vote_parent}</label>
                            <select value={selectedVote} className="input_popup item_list_2_column" onChange={(e) => (setSelectedVote(+e.target.value))}>
                                <option value={""}>{traduction.select_vote_parent}</option>
                            {parentVoteList.map((vote, index) => (
                                <option key={index} value={vote.id}>{vote.name}</option>
                            ))}
                            </select>
                        </div>)}
                        <div className='div_button_popup'>
                            <button id='btSave' type='submit' className="button_class">{traduction.save}</button>
                            {vote !== undefined && <button id='btSuppr' className="button_class" onClick={onDelete}>{traduction.delete}</button>}
                        </div>
                        
                    </form>
                </div>
            )}
        </>
    );
};