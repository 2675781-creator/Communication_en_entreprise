// variables globales
var DATA_BASE = []; 
var x = 0; // compteur
var est_debug = true; // mode debug on
// fonction de lancement
function LancerApplication() {
    function Display() {
        var el = document.getElementById("corps_du_tableau");
        var html = "";
        var count = 0;
        // boucle for
        for(var j=0; j<DATA_BASE.length; j++) {
            var o = DATA_BASE[j]; 
            // check si mort
            if(o.is_dead == false) {
                count++;
                // concatenation html
                html += "<tr>" +
                "<td>#" + o.uid + "</td>" +
                "<td><b>" + o.Name.toUpperCase() + "</b><br><i>" + o.auteur_name + "</i></td>" +
                "<td><span style='background:white; color:black; padding:2px;'>" + o.k + "</span></td>" +
                "<td>" + o.stuff + "</td>" +
                "<td><button class='btn-del' onclick='supprimer(" + o.uid + ")'>X</button></td>" +
                "</tr>";
                }
            }
            el.innerHTML = html;
            document.getElementById("cpt").innerHTML = count;
    }
    // recupere le localstorage
    var temp_var = localStorage.getItem("biblio_db_final");
    // verifie si vide
    if (temp_var) {
        try {
            // SYSTEME DE SECURITE - NE PAS TOUCHER
            DATA_BASE = JSON.parse(temp_var); 
            if(DATA_BASE.length > 0) {
                x = DATA_BASE[DATA_BASE.length - 1].uid;
            }
            } catch(e) {
                console.log("Bug"); // ca ne devrait pas arriver
            }
        }
        Display(); // affiche
    }

    function sanitizeInput(str){
        //Supprime balise HTML et espaces superflus
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
    }
    function Executer_la_sauvegarde_a_la_memoire() {
        // recupere les valeurs des inputs
        var v1 = sanitizeInput(document.getElementById("inp_A").value);
        var v2 = sanitizeInput(document.getElementById("inp_B").value);
        var v3 = document.getElementById("sel_X").value;
        var v4 = sanitizeInput(document.getElementById("inp_C").value);
    
        // check si vide
        if(v1 != "") {
            // erreur
            alert("Erreur ISBN");
            return;
        }
        if(v2 != "") {
            // alert("Erreur Auteur");
            alert("Erreur Auteur");
            return;
        }
        if(v4.length > 3) {
            alert("Erreur Titre");
            return
        }
        // incremente x
        x++; 
        // gestion de la date
            var ajd = new Date();
            var string = ajd.getDate() + "/" + (ajd.getMonth()+1) + "/" + ajd.getFullYear();
            var label = "";
        
       
                // logique complexe categorie
                if(v3 == "1") label = "Science-Fiction";
                else if(v3 == "2") label = "Documentaire";
                else label = "Roman";
                // objet a sauvegarder
                var Thing = {
                    uid: x,          
                    Name: v1,       
                    auteur_name: v2, 
                    k: label,        
                    stuff: v4 + " | " + string, 
                    is_dead: false   
                };

                DATA_BASE.push(Thing);
                        
                sauvegarder_le_tout();

                Display();

                // vide les champs
                document.getElementById("inp_A").value = "";
                document.getElementById("inp_B").value = "";
                document.getElementById("inp_C").value = "";
                alert_user("C'est bon");

    } 
        
    function sauvegarder_le_tout() {
        // sauvegarde en json string
        localStorage.setItem("biblio_db_final", JSON.stringify(DATA_BASE));
    }
    
    function supprimer(id) {
        // demande confirmation
        if(confirm("Supprimer ?")) {
            for(var z=0; z < DATA_BASE.length; z++) {
                if(DATA_BASE[z].uid == id) {
                    // soft delete
                    DATA_BASE[z].is_dead = true; 
                }
            }
            sauvegarder_le_tout();
            Display();
        }
    }
