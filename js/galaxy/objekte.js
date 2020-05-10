class Ufo01 {
    Typ = "Gegner"
    Bildquelle = 'themes/galaxy/simple/images/ufo_01.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 5, y: 0 },
        source_size: { x: 55, y: 60 },
        target_size: { x: 32, y: 32 }
    }
    Ort = { x: 0, y: 0 }
    Geschwindigkeit = { x: 10, y: 10 }
    Leben = 5000
    Starttick = 0
    WellePos = 0
    Status = 0
    LetzterSchussTick = 0;
    Schussabstand = 40;

    bewegen = function () {
        var x_soll = 84 + (this.WellePos % 5) * 100;
        var y_soll = 50 + (this.WellePos % 2) * 100;

        if (this.Ort.x < x_soll)
            this.Ort.x += this.Geschwindigkeit.x;
        if (this.Ort.y < y_soll)
            this.Ort.y += this.Geschwindigkeit.y;
    }

    schiessen = function () {
        if(_Game.Status != 'running'){
            return;
        }
        if (this.LetzterSchussTick + this.Schussabstand < ticks) {
            this.LetzterSchussTick = ticks;
            
            var r1 =[14,30]
            var r2 =[16,30]

            var s = [];
            s.push(this.erstelleUfoschuss(this.Ort, r1));
            s.push(this.erstelleUfoschuss(this.Ort, r2));

            return s;
        }
        else{
            return null;
        }
    }

    pruefeStatus = function () {
        if (this.Leben <= 0) {
            this.Status = -1;
        }
    }
    getroffen = function (m) {
        this.Leben -= m.Schaden;
        if (this.Leben <= 0) {
            var b = new Boom();
            b.Bild.spriteMap.src = b.Bildquelle;
            b.Ort.x = this.Ort.x
            b.Ort.y = this.Ort.y
            return b;
        }
    }
    
    erstelleUfoschuss = function (ort, korr) {
        var ls = new Laserschuss();
        ls.Typ = "AlienMunition";
        ls.Bild.spriteMap.src = ls.Bildquelle;
        ls.Ort.y = ort.y + korr[1];
        ls.Ort.x = ort.x + korr[0];
        ls.Geschwindigkeit.y *= -0.8;
        return ls;
    }
}



class Boom {
    Typ = "Effekt"
    Bildquelle = 'themes/galaxy/simple/images/Boom.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 0, y: 0 },
        source_size: { x: 128, y: 128 },
        target_size: { x: 128, y: 128 }
    }
    Ort = { x: 0, y: 0 }
    Geschwindigkeit = { x: 10, y: 10 }
    Leben = 0
    Starttick = 0
    WellePos = 0
    Status = 0
    Animationszahler = 40
    bewegen = function () {
        if (this.Animationszahler > 30) {
            this.Bild.target_size.x = 32 * (this.Animationszahler - 20) / 2
        }
        this.Animationszahler--;
    }

    pruefeStatus = function () {
        if (this.Animationszahler < 0)
            this.Status = -1
    }
    schiessen() {
        return null;
    }
}