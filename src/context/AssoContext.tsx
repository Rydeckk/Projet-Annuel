import { createContext, ReactNode, useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import { Association, getAssoByDomainName } from "../request/request";
import * as React from "react"

export interface AssoContextType {
    asso: Association | null
}

interface Props {
    children: ReactNode
}

export const AssoContext = createContext<AssoContextType>({
    asso: {
        id: 0,
        description: "",
        domainName: "",
        name: "",
        theme: {id: 0, name: "", firstColor: "", colorText: "", backgroundColor: ""},
        ged: {id: 0}
    }
})

export function AssoProvider({children}: Props) {
    const [asso, setAsso] = useState<Association | null>(null);
    const [domain, setDomaine] = useState<string>("")
    const location = useLocation();
    const listUrl = location.pathname.split("/")

    useEffect(() => {
        setDomaine(listUrl[1])
    })
  
    useEffect(() => {
        const verifDomain = async () => {
            const resultAsso = await getAssoByDomainName(domain)
            if(resultAsso !== null) {
                setAsso(resultAsso)
            }
        }

        if(domain !== "") {
            verifDomain()
        }
    }, [domain])

    return (
        <AssoContext.Provider
            value={{asso: asso}}
        >
            {children}
        </AssoContext.Provider>
    )
}
