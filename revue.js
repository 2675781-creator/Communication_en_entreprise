// VARIABLES GLOBALES

let bibliotheque = [];
let compteurID = 0;
const CLE_STORAGE = "biblio_db_final";

// INITIALISATION DE L'APPLICATION

/**
 * Fonction lancée au chargement de la page
 */
function LancerApplication() {
    chargerDonnees();
    afficherLivres();
}

// GESTION DES DONNÉES

/**
 * Charge les données depuis le localStorage
 */
function chargerDonnees() {
    try {
        const donnees = localStorage.getItem(CLE_STORAGE);
        
        if (donnees) {
            bibliotheque = JSON.parse(donnees);
            
            // Récupère le dernier ID utilisé
            if (bibliotheque.length > 0) {
                compteurID = bibliotheque[bibliotheque.length - 1].id;
            }
        }
    } catch (erreur) {
        console.error("Erreur lors du chargement des données:", erreur);
        afficherMessage("Erreur de chargement des données");
    }
}

/**
 * Sauvegarde les données dans le localStorage
 */
function sauvegarderDonnees() {
    try {
        localStorage.setItem(CLE_STORAGE, JSON.stringify(bibliotheque));
    } catch (erreur) {
        console.error("Erreur lors de la sauvegarde:", erreur);
        afficherMessage("Erreur de sauvegarde");
    }
}

// AFFICHAGE

/**
 * Affiche tous les livres dans le tableau
 */
function afficherLivres() {
    const corpsTableau = document.getElementById("corps_du_tableau");
    const compteur = document.getElementById("cpt");
    
    let html = "";
    let nombreLivres = 0;
    
    // Parcourt tous les livres
    for (let i = 0; i < bibliotheque.length; i++) {
        const livre = bibliotheque[i];
        
        // Affiche uniquement les livres actifs (non supprimés)
        if (!livre.supprime) {
            nombreLivres++;
            
            html += `
                <tr>
                    <td>#${livre.id}</td>
                    <td>
                        <b>${livre.titre.toUpperCase()}</b><br>
                        <i>${livre.auteur}</i>
                    </td>
                    <td>
                        <span>${livre.categorie}</span>
                    </td>
                    <td>${livre.isbn} | ${livre.dateAjout}</td>
                    <td>
                        <button class="btn-del" onclick="supprimerLivre(${livre.id})">
                            Supprimer
                        </button>
                    </td>
                </tr>
            `;
        }
    }
    
    corpsTableau.innerHTML = html;
    compteur.textContent = nombreLivres;
}

/**
 * Affiche un message temporaire à l'utilisateur
 */
function afficherMessage(message) {
    const zoneMessage = document.getElementById("zone_m");
    zoneMessage.textContent = message;
    
    // Efface le message après 3 secondes
    setTimeout(function() {
        zoneMessage.textContent = "";
    }, 3000);
}

// GESTION DES LIVRES

/**
 * Nettoie et sécurise une chaîne de caractères
 */
function nettoyerTexte(texte) {
    return texte
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim();
}

/**
 * Enregistre un nouveau livre
 */
function Executer_la_sauvegarde_a_la_memoire() {
    // Récupère les valeurs des champs
    const titre = nettoyerTexte(document.getElementById("inp_A").value);
    const auteur = nettoyerTexte(document.getElementById("inp_B").value);
    const categorieID = document.getElementById("sel_X").value;
    const isbn = nettoyerTexte(document.getElementById("inp_C").value);
    
    // Validation des données
    if (!titre) {
        afficherMessage("❌ Le titre est obligatoire");
        return;
    }
    
    if (!auteur) {
        afficherMessage("❌ L'auteur est obligatoire");
        return;
    }
    
    if (isbn.length < 10) {
        afficherMessage("❌ L'ISBN doit contenir au moins 10 caractères");
        return;
    }
    
    // Détermine la catégorie
    let nomCategorie;
    switch(categorieID) {
        case "1":
            nomCategorie = "Science-Fiction";
            break;
        case "2":
            nomCategorie = "Documentaire";
            break;
        case "3":
            nomCategorie = "Roman";
            break;
        default:
            nomCategorie = "Non défini";
    }
    
    // Génère la date actuelle
    const maintenant = new Date();
    const dateAjout = `${maintenant.getDate()}/${maintenant.getMonth() + 1}/${maintenant.getFullYear()}`;
    
    // Incrémente le compteur d'ID
    compteurID++;
    
    // Crée l'objet livre
    const nouveauLivre = {
        id: compteurID,
        titre: titre,
        auteur: auteur,
        categorie: nomCategorie,
        isbn: isbn,
        dateAjout: dateAjout,
        supprime: false
    };
    
    // Ajoute le livre à la bibliothèque
    bibliotheque.push(nouveauLivre);
    
    // Sauvegarde et affiche
    sauvegarderDonnees();
    afficherLivres();
    
    // Vide les champs du formulaire
    document.getElementById("inp_A").value = "";
    document.getElementById("inp_B").value = "";
    document.getElementById("inp_C").value = "";
    document.getElementById("sel_X").value = "1";
    
    // Message de confirmation
    afficherMessage("Livre enregistré avec succès");
}

/**
 * Supprime un livre (soft delete)
 */
function supprimerLivre(id) {
    if (confirm("Voulez-vous vraiment supprimer ce livre ?")) {
        // Parcourt la bibliothèque pour trouver le livre
        for (let i = 0; i < bibliotheque.length; i++) {
            if (bibliotheque[i].id === id) {
                // Marque le livre comme supprimé
                bibliotheque[i].supprime = true;
                break;
            }
        }
        
        // Sauvegarde et actualise l'affichage
        sauvegarderDonnees();
        afficherLivres();
        afficherMessage("Livre supprimé");
    }
}

// FONCTIONNALITÉS SUPPLÉMENTAIRES

/**
 * Recherche et filtre les livres dans le tableau
 */
function regarder(valeur) {
    const tableau = document.getElementById("tab");
    const lignes = tableau.getElementsByTagName("tr");
    const recherche = valeur.toUpperCase();
    
    // Parcourt toutes les lignes (sauf l'en-tête)
    for (let i = 1; i < lignes.length; i++) {
        const colonneInfo = lignes[i].getElementsByTagName("td")[1];
        
        if (colonneInfo) {
            const texte = colonneInfo.textContent || colonneInfo.innerText;
            
            // Affiche ou cache la ligne selon la recherche
            if (texte.toUpperCase().indexOf(recherche) > -1) {
                lignes[i].style.display = "";
            } else {
                lignes[i].style.display = "none";
            }
        }
    }
}

/**
 * Réinitialise complètement l'application
 */
function kill() {
    if (confirm("⚠️ ATTENTION : Cette action supprimera TOUS les livres. Continuer ?")) {
        localStorage.clear();
        location.reload();
    }
}