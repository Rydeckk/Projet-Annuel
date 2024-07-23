import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { useAssoContext } from "../main";
import { Cotisation, createCotisation, deleteCotisation, getListCotisation, updateCotisation } from "../request/requestCotisation";
import { PopupCotisation } from "../component/PopupCotisation";
import { CotisationRow } from "../component/CotisationRow";
import { Adhesion, getListAdhesion } from "../request/requestAdhesion";

export function Cotisations() {
    const [listCotisation, setListCotisation] = useState<Array<Cotisation>>([])
    const [listAdhesion, setListAdhesion] = useState<Array<Adhesion>>([])
    const [error, setError] = useState<string>("")
    const [isError, setIsError] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const asso = useAssoContext()

    useEffect(() => {
        const getCotisations = async () => {
            if(asso.asso) {
                setListCotisation((await getListCotisation(asso.asso.domainName)).cotisations)
            }
        }

        getCotisations()
    }, [asso.asso])

    useEffect(() => {
        const getAdhesions = async () => {
            if(asso.asso) {
                setListAdhesion((await getListAdhesion(asso.asso.domainName)).adhesions)
            }
        }

        getAdhesions()
    }, [])

    const togglePopup = () => {
        setIsOpen(!isOpen)
    }

    const handleUpdate = async (cotisationUpdated: Cotisation) => {
        if(asso.asso) {
            await updateCotisation(cotisationUpdated, asso.asso.domainName)
            setListCotisation(listCotisation.map((cotisation) => cotisation.id === cotisationUpdated.id ? cotisationUpdated : cotisation))
        }
        
    }

    const handleDelete = async (cotisationDelete: Cotisation) => {
        setError("")
        setIsError(false)
        if(asso.asso) {
            const cotisationIsUse = listAdhesion.find((adhesion) => adhesion.typeAdhesion.id === cotisationDelete.id && adhesion.isActive === true)
            if(cotisationIsUse) {
                setError(traduction.cotisation_user_use)
                setIsError(true)
            } else {
                await deleteCotisation(cotisationDelete.id, asso.asso.domainName)
                setListCotisation(listCotisation.filter((cotisation) => cotisation.id !== cotisationDelete.id))
            }
        }
        
    }

    const handleSave = async (cotisationCreate: Cotisation) => {
        if(asso.asso) {
            const cotisationCreated = await createCotisation({ montant: cotisationCreate.montant, type: cotisationCreate.type}, asso.asso.domainName)
            setListCotisation([...listCotisation, cotisationCreated])
        }
    }

    return (
        <div className="div_ged">
            {isError && (<label style={{color: "red", margin: "10px"}}>{error}</label>)}
            <div className="div_ged_header">
                <div style={{display: "flex", flexDirection: "column", marginRight:"15px", justifyContent: "center", alignItems: "center"}}>
                    <img src="/icone/add.png" className="clickable-image taille_icone50" onClick={() => togglePopup()}></img>
                    <label>{traduction.add}</label>
                </div>
            </div>
            <div className="div_ged_content">
                <div className="div_ged_header_list">
                    <label className="width_column">{traduction.cotisation_amount}</label>
                    <label className="width_column">{traduction.cotisation_type}</label>
                    <label className="width_column">{traduction.role_option}</label>
                </div>
                {listCotisation.map((cotisation) => (
                    <CotisationRow key={cotisation.id} cotisation={cotisation} onUpdate={(cotisationUpdated) => handleUpdate(cotisationUpdated)} onDelete={(cotisationDelete) => handleDelete(cotisationDelete)}></CotisationRow>
                ))}
                
            </div>
            <PopupCotisation isOpen={isOpen}
                handleClose={togglePopup}
                onSave={handleSave}/>
        </div>
    )
}