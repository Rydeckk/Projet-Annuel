import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { Association } from "../request/request";
import { useAssoContext, useUserContext } from "../main";
import { Sondage } from "../component/Sondage";
import { createSondage, deleteSondage, getListSondage, SondageType, updateSondage } from "../request/requestSondage";
import { PopupSondage } from "../component/PopupSondage";

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

export function Sondages() {
    const [listSondage, setListSondage] = useState<Array<SondageType>>([])
    const [isOpen, setIsOpen] = useState(false);
    const asso = useAssoContext()
    const user = useUserContext()

    useEffect(() => {
        const getVotesAssemblee = async () => {
            if(asso.asso !== null) {
                setListSondage((await getListSondage(asso.asso.domainName)).sondages)
            }
        }

        getVotesAssemblee()
    }, [])

    const togglePopup = () => {
        setIsOpen(!isOpen)
    }

    const onSave = async (sondageCreate: SondageType) => {
        if(asso.asso) {
            const sondageCreated = await createSondage({
                name: sondageCreate.name,
                beginDate: sondageCreate.beginDate,
                endDate: sondageCreate.endDate
            },asso.asso.domainName)
            setListSondage([...listSondage,sondageCreated])
        }
        
        setIsOpen(false)
    }

    const onDelete = async (sondageDeleted: SondageType) => {
        setListSondage(listSondage.filter((e) => e.id !== sondageDeleted.id))
        if(asso.asso) {
            deleteSondage(sondageDeleted.id,asso.asso.domainName)
        }
        
    }

    const onUpdate = async (sondageUpdated: SondageType) => {
        setListSondage(listSondage.map((sondage) => (sondage.id === sondageUpdated.id ? sondageUpdated : sondage)))
        if(asso.asso) {
            updateSondage({
                id: sondageUpdated.id,
                name: sondageUpdated.name,
                beginDate: sondageUpdated.beginDate,
                endDate: sondageUpdated.endDate
            },asso.asso.domainName)
        }
    }

    return (
        <div>
            <h1 className="title_section">{traduction.sondage}</h1>
            <div style={{display: "flex"}}>
                {listSondage.map((sondage) => (
                    <Sondage key={sondage.id} sondage={sondage} onDelete={() => onDelete(sondage)} onSave={(sondage) => onUpdate(sondage)}></Sondage>
                ))}
                {user.user?.role.isAdmin && (<div style={{paddingTop: "35px", marginLeft: "10px"}}>
                    <img src="/icone/add.png" onClick={togglePopup} style={{height:"30px", width: "30px"}} className="clickable-image"></img>
                </div>)}
            </div>
            <PopupSondage isOpen={isOpen} 
                handleClose={togglePopup} 
                onSave={onSave}/>
        </div>
        
    )
}