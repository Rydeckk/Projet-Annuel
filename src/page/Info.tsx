import React, { useEffect, useState } from 'react';
import traduction from "../../traductions/traduction.json"
import { UserInfoWithId } from '../request/requestUser';
import { useAssoContext, useUserContext } from '../main';

export function Info() {
  const asso = useAssoContext()
  const userContext = useUserContext()
  const [user, setUser] = useState<UserInfoWithId>()

  useEffect(() => {
    if(userContext.user !== null) {
      setUser(userContext.user)
    }

  }, [userContext])
  
  return (
    <div className="user-profile">
      <h1>{traduction.user_profile}</h1>
        <div className="user-info">
          <p><strong>{traduction.mail} : </strong>{user?.email}</p>
          <p><strong>{traduction.firstName} : </strong>{user?.firstName}</p>
          <p><strong>{traduction.lastName} : </strong>{user?.lastName}</p>
          <p><strong>{traduction.address} : </strong>{user?.address}</p>
        </div>
    </div>
  )
}