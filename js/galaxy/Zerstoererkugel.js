class Zerstorerkugel {
    Typ = "Munition"
    Bildquelle = 'themes/galaxy/simple/images/Zerstoererkugel.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 0, y: 0 },
        source_size: { x: 6, y: 6 },
        target_size: { x: 7, y: 7 }
    }
    Ort = { x: 0, y: 0 }
    Geschwindigkeit = { x: 0, y: -8 }
    Schaden = 3000
    Starttick = 0
    Status = 0
    bewegen = function () {
        this.Ort.x += this.Geschwindigkeit.x;
        this.Ort.y += this.Geschwindigkeit.y;
    }
    pruefeStatus = function () {
        if (this.Ort.y < -100)
            this.Status = -1;
        if (this.Ort.y > 1000)
            this.Status = -1;
    }
    schiessen = function () {
        return null;
    }
    schiesseEnergiewaffe = function () {
        return null;
    }
}

function erstelleZerstoererkugel(quelle, ort, korrektur) {
    console.log('Erstelle Zerstoererkugel ' + quelle + ' ' + ort + ' k:' + korrektur);
    if (quelle == 'Spieler') {
        var k = new Zerstorerkugel();
        k.Typ = 'PlayerMunition';
        k.Bild.spriteMap.src = k.Bildquelle;
        k.Bild.sprite = {x:0, y: 0}
        k.Ort.x = ort.x + korrektur[0];
        k.Ort.y = ort.y + korrektur[1];
    }
    else {
        var k = new Zerstorerkugel();
        k.Typ = 'AlienMunition';
        k.Bild.spriteMap.src = k.Bildquelle;
        k.Bild.sprite = {x: 8, y: 0}
        k.Ort.x = ort.x + korrektur[0];
        k.Ort.y = ort.y + korrektur[1];
        k.Geschwindigkeit.y *= -1;
    }
    return k;
}