import { createContext, ReactNode, useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import { Association, getAssoByDomainName } from "./request/request";
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
        name: ""
    }
})

export function AssoProvider({children}: Props) {
    const [asso, setAsso] = useState<Association | null>(null);
    const location = useLocation();
    const listUrl = location.pathname.split("/")
  
    useEffect(() => {
      const verifDomain = async () => {
        const resultAsso = await getAssoByDomainName(listUrl[1])
        if(resultAsso !== null) {
          setAsso(resultAsso)
        }
      }
      
      verifDomain()
    }, [])

    return (
        <AssoContext.Provider
            value={{asso: asso}}
        >
            {children}
        </AssoContext.Provider>
    )
}
