import React, { useEffect, useState } from "react";
import { AssembleeType, getListAssemblee } from "../request/requestAssemble";
import { useAssoContext } from "../main";
import { Assemblee } from "../component/Assemblee";
import traduction from "../../traductions/traduction.json"
import { AssembleeDetail } from "../component/AssembleeDetail";
import { VoteType } from "../request/requestVote";
import { Responses } from "../component/Responses";
import { getStateVote } from "../component/Votes";

export function Assemblees() {
    const [listAssemblee, setListAssemblee] = useState<Array<AssembleeType>>([])
    const [isAssembleDetail, setIsAssembleDetail] = useState<boolean>(false)
    const [assembleDetail, setAssembleDetail] = useState<AssembleeType>()
    const [isVoteDetail, setIsVoteDetail] = useState<boolean>(false)
    const [voteDetail, setVoteDetail] = useState<VoteType>()
    const [stateVote, setStateVote] = useState<"not_begin" | "pending" | "finish">("not_begin")
    const asso = useAssoContext()

    useEffect(() => {
        const getAssemblees = async () => {
            if(asso.asso) {
                setListAssemblee((await getListAssemblee(asso.asso.domainName)).assemblees)
            }
        }

        getAssemblees()
    }, [asso.asso])

    const toggleIsDetailAssemblee = () => {
        setIsAssembleDetail(!isAssembleDetail)
    }

    const toggleIsDetailVote = () => {
        setIsVoteDetail(!isVoteDetail)
    }

    const handleClick = (assemblee: AssembleeType) => {
        setAssembleDetail(assemblee)
        toggleIsDetailAssemblee()
    }

    const handleClickReturn = () => {
        toggleIsDetailAssemblee()
    }

    const handleClickReturnVote = () => {
        toggleIsDetailVote()
        toggleIsDetailAssemblee()
    } 

    const handleClickVote = (vote: VoteType) => {
        setVoteDetail(vote)
        setStateVote(getStateVote(vote.beginDate, vote.endDate))
        toggleIsDetailAssemblee()
        toggleIsDetailVote()
    }

    return (
        <div>
            <h1 className="title_section">{traduction.assemblee}</h1>
            {!isAssembleDetail && !isVoteDetail && (<div className="div_content_card">
            {listAssemblee.map((assemblee) => (
                <Assemblee key={assemblee.id} assemblee={assemblee} onClick={() => handleClick(assemblee)} ></Assemblee>
            ))}
            </div>)}

            {isAssembleDetail && assembleDetail !== undefined && (
                <AssembleeDetail assemblee={assembleDetail} onClickReturn={() => handleClickReturn()} onClickVote={(vote) => handleClickVote(vote)}></AssembleeDetail>
            )}

            {isVoteDetail && voteDetail !== undefined && (
                <Responses vote={voteDetail} stateVote={stateVote} onClickReturn={() => handleClickReturnVote()}></Responses>
            )}
        </div>
        
    )
}