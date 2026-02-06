function regarder(val) {
        var t = document.getElementById("tab");
        var rows = t.getElementsByTagName("tr");
        var f = val.toUpperCase();
        // boucle sur les tr
        for (var i = 1; i < rows.length; i++) {
            
            var col = rows[i].getElementsByTagName("td")[1];
            if (col) {
                var txt = col.textContent || col.innerText;
                if (txt.toUpperCase().indexOf(f) > -1) {
                    rows[i].style.display = ""; // montre
                }
            
                 else {
                    rows[i].style.display = "none"; // cache
                }
                       
            }       
        }
    }
    