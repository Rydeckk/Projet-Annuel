import React from 'react';
import './accueil.css'; 

function Accueil() {
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
        <button className="connexion">Connexion</button>
      </header>

      <main>
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
