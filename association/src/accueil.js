import React, { useState } from 'react';
import './accueil.css'; 

function Accueil() {
  const [showForm, setShowForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [dateDeNaissance, setDateDeNaissance] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginMotDePasse, setLoginMotDePasse] = useState('');

  const handleLoginFormSubmit = (e) => {
    e.preventDefault();
    
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Prénom:', prenom);
    console.log('Nom:', nom);
    console.log('Email:', email);
    console.log('Mot de passe:', motDePasse);
    console.log('Date de naissance:', dateDeNaissance);
    setPrenom('');
    setNom('');
    setEmail('');
    setMotDePasse('');
    setDateDeNaissance('');
  };

  return (
    <div className="accueil">
      <header>
        <h1>Association</h1>
        <nav>
          <ul>
            <li><a href="#qui-sommes-nous">Qui sommes nous</a></li>
            <li><a href="#calendrier">Calendrier</a></li>
          </ul>
        </nav>
        <button className="don">Faire un don</button>
        <button className="connexion" onClick={() => setShowLoginForm(true)}>Connexion</button>
        <button className="inscription" onClick={() => setShowForm(true)}>S'inscrire</button>
      </header>

      <main>
        {showForm && (
          <section id="inscription">
            <h2>Devenir membre</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="prenom">Prénom:</label>
                <input
                  type="text"
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="nom">Nom:</label>
                <input
                  type="text"
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="motDePasse">Mot de passe:</label>
                <input
                  type="password"
                  id="motDePasse"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="dateDeNaissance">Date de naissance:</label>
                <input
                  type="date"
                  id="dateDeNaissance"
                  value={dateDeNaissance}
                  onChange={(e) => setDateDeNaissance(e.target.value)}
                  required
                />
              </div>
              <button type="submit">S'inscrire</button>
            </form>
          </section>
        )}
        {showLoginForm && (
          <section id="connexion">
            <h2>Connexion</h2>
            <form onSubmit={handleLoginFormSubmit}>
            <div>
                <label htmlFor="loginEmail">Email:</label>
                <input
                  type="email"
                  id="loginEmail"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="loginMotDePasse">Mot de passe:</label>
                <input
                  type="password"
                  id="loginMotDePasse"
                  value={loginMotDePasse}
                  onChange={(e) => setLoginMotDePasse(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Se connecter</button>
            </form>
          </section>
        )}
        <section id="articles">
          <h2>Articles</h2>
        </section>

        <section id="autres-actions">
          <h2>Actions menées</h2>
        </section>
      </main>

      <footer>
        <p>Droit d'auteur © {new Date().getFullYear()} Association. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default Accueil;
