function alert_user(msg) {
        var z = document.getElementById("zone_m");
        z.innerText = msg;
        // attend 3 secondes
        setTimeout(function(){ z.innerText = ""; }, 3000);
}