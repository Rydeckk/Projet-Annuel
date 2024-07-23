import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getUser, UserInfo, UserInfoWithId } from '../request/requestUser';
import { useAssoContext } from '../main';

interface UserContextType {
    user: UserInfoWithId | null;
    setUser: (user: UserInfoWithId | null) => void;
}

interface Props {
    children: ReactNode
}

const defaultContext: UserContextType = {
    user: null,
    setUser: () => {},
}

export const UserContext = createContext<UserContextType>(defaultContext);

export function UserProvider({children}: Props) {
    const [user, setUser] = useState<UserInfoWithId | null>(null)
    const asso = useAssoContext()

    useEffect(() => {
        const getUserRequest = async () => {
            if(asso.asso !== null) {
                const user = await getUser(asso.asso.domainName)
                setUser(user)
            }
        }

        getUserRequest()
    }, [asso.asso])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
