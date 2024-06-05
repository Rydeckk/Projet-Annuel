import React from "react";

export function SignUp() {
    return (
        <div>
            <label>Prénom</label>
            <input inputMode="text" placeholder="Rentrez votre prénom"></input>
            <label>Nom</label>
            <input inputMode="text" placeholder="Rentrez votre nom"></input>
            <label>Email</label>
            <input inputMode="email" placeholder="Rentrez votre email"></input>
            <label>Password</label>
            <input inputMode="text" placeholder="Rentrez votre mot de passe"></input>
        </div>
    )
}