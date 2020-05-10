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
        Rakettenabstand: 300,
        Leben: 55000,
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
        Rohr: 1,
        Rakette1Tick: 0,
        Rakette2Tick: 0,
        raketteBereit: function(tick){
            return this.Rakette1Tick < tick ||this.Rakette2Tick < tick;
        },
        schiesseRakette: function(ort, tick){
            var r1 = [23,46];
            var r2 = [40, 46];
            if(this.Rakette1Tick < tick){
                this.Rakette1Tick = (tick + this.Rakettenabstand);
                return erstelleRakette(ort, r1);
            }
            else if(this.Rakette2Tick < tick){
                this.Rakette2Tick = (tick + this.Rakettenabstand);
                return erstelleRakette(ort, r2);
            }
            return null;
        }

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

class Rakette{
    Typ = 'Munition'
    Bildquelle = 'themes/galaxy/simple/images/rllk.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 8, y: 0 },
        source_size: { x: 8, y: 16 },
        target_size: { x: 16, y: 32 }
    }
    Ort = {x:0, y:0}    
    Geschwindigkeit = {x: 0, y: -5}
    Schaden= 5000
    Starttick = 0
    Status = 0
    bewegen = function(){
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

erstelleRakette = function(ort, korr){
    var r = new Rakette();
    r.Typ = 'PlayerMunition';
    r.Bild.spriteMap.src = r.Bildquelle;
    r.Ort.y  = ort.y + korr[1];
    r.Ort.x = ort.x + korr[0];
    return r;
}