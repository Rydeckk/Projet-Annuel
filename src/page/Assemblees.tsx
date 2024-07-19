import React, { useEffect, useState } from "react";
import { AssembleeType, getListAssemblee } from "../request/requestAssemble";
import { useAssoContext } from "../main";
import { Assemblee } from "../component/Assemblee";
import traduction from "../../traductions/traduction.json"
import { AssembleeDetail } from "../component/AssembleeDetail";

export function Assemblees() {
    const [listAssemblee, setListAssemblee] = useState<Array<AssembleeType>>([])
    const [isAssembleDetail, setIsAssembleDetail] = useState<boolean>(false)
    const [assembleDetail, setAssembleDetail] = useState<AssembleeType>()
    const asso = useAssoContext()

    useEffect(() => {
        const getAssemblees = async () => {
            if(asso.asso) {
                setListAssemblee((await getListAssemblee(asso.asso.domainName)).assemblees)
            }
        }

        getAssemblees()
    }, [asso.asso])

    const toggleIsDetail = () => {
        setIsAssembleDetail(!isAssembleDetail)
    }

    const handleClick = (assemblee: AssembleeType) => {
        setAssembleDetail(assemblee)
        toggleIsDetail()
    }

    const handleClickReturn = () => {
        setAssembleDetail(undefined)
        toggleIsDetail()
    }

    return (
        <div>
            <h1 className="title_section">{traduction.assemblee}</h1>
            {!isAssembleDetail && (<div className="div_content_card">
            {listAssemblee.map((assemblee) => (
                <Assemblee key={assemblee.id} assemblee={assemblee} onClick={() => handleClick(assemblee)} ></Assemblee>
            ))}
            </div>)}

            {isAssembleDetail && assembleDetail !== undefined && (
                <AssembleeDetail assemblee={assembleDetail} onClickRerturn={() => handleClickReturn()}></AssembleeDetail>
            )}
        </div>
        
    )
}