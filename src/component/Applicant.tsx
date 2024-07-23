import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import traduction from '../../traductions/traduction.json'
import { UserInfoWithId } from "../request/requestUser";

type ApplicantProps = {
    user: UserInfoWithId,
    onDelete: (user: UserInfoWithId) => void
}

export function Applicant({user, onDelete}: ApplicantProps) {
    const handleDelete = () => {
        onDelete(user)
    }

    return (
        <div className="div_item_applicant">
            <label>{user.firstName} {user.lastName}</label>
            <button type="button" onClick={handleDelete}>X</button>
        </div>
    )
}