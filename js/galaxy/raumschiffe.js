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
        Leben: 1,
        schiessen: function (ort) {
            var korr1 = 7;
            var korr2 = 24
            var ls = new Laserschuss();
            ls.Bild.spriteMap.src = ls.Bildquelle;
            ls.Ort.y = ort.y;
            ls.Ort.x = ort.x - 1 + (this.Rohr == 1 ? korr1 : korr2);
            this.Rohr *= -1;
            return ls;
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
    bewegen = function(){
        this.Ort.x += this.Geschwindigkeit.x;
        this.Ort.y += this.Geschwindigkeit.y;
    }
    pruefeStatus = function(){
        if(this.Ort.y < -100)
            this.Status = -1;
    }

}