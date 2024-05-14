const { Router } = require("express");
const router = Router();



router.get("/crearcookie", async (req, res) => {
    let datos = {nombre:"Paulina", deporte:"Crossfit"};
    res.cookie("cookie1","Valor Cookie 1", {});
    res.cookie("cookie2", datos,{});
    res.cookie("cookie3", "Vive 5 segúndos",{maxAge:5000});
    res.cookie("cookie4", "Con fecha de expiración",{expires:new Date(2024,4,15)});

    res.setHeader("Content-Type","text/html");
    res.status(200).send("<h1>Estamos en Session</h1> <br><h2>Creando Cookies</h2>");

    let MisCookies = req.cookies;
    console.log(MisCookies);
});

router.get("/leercookie", async (req, res) => {
    let MisCookies = req.cookies;
    
    res.setHeader("Content-Type","text/html");
    res.status(200).send(`<h1>Estamos en Session</h1><br><h2>leyendo Cookies</h2>`);
    console.log(MisCookies);
});

router.get("/borrarcookie", (req, res)=>{
    res.clearCookie("cookie1");
    res.setHeader("Content-Type","text/html");
    res.status(200).send(`<h1>Estamos en Session</h1><br><h2>Cookie1 Borrada</h2>`);
});

module.exports = router;
