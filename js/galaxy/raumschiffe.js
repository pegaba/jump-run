var schiffe = [
    {
        Bildquelle: 'themes/galaxy/simple/images/player_sprites.png',
        Bild: {
            spriteMap: new Image(),
            sprite: { x: 0, y: 0 },
            source_size: { x: 64, y: 64 },
            target_size: { x: 64, y: 64 }
        },
        Geschwindigkeit: { x: 10, y: 10 },
        Schussabstand: 10,
        Leben: 5000,
        schiessen: function (ort) {
            var r1 =[3,21]
            var r2 =[6,21]
            var r3 =[57,21]
            var r4 =[60,21]

            var s=[]
            s.push(erstelleschuss(ort, r1));
            s.push(erstelleschuss(ort, r2));
            s.push(erstelleschuss(ort, r3));
            s.push(erstelleschuss(ort, r4));
            
            return s;
        },
        Rohr: 1
    }
]

class Laserschuss {
    Typ = "Munition"
    Bildquelle = 'themes/galaxy/simple/images/game_tiles.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 0, y: 0 },
        source_size: { x: 3, y: 11 },
        target_size: { x: 3, y: 11 }
    }
    Ort = { x: 0, y: 0 }
    Geschwindigkeit = { x: 0, y: -12 }
    Schaden = 1000
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
}

erstelleschuss = function (ort, korr) {
    var ls = new Laserschuss();
    ls.Typ = "PlayerMunition";
    ls.Bild.spriteMap.src = ls.Bildquelle;
    ls.Ort.y = ort.y + korr[1];
    ls.Ort.x = ort.x + korr[0];

    return ls;
}