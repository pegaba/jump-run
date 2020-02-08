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
        if (this.LetzterSchussTick + this.Schussabstand < ticks) {
            this.LetzterSchussTick = ticks;
            var schuss = new Laserschuss();
            schuss.Bild.spriteMap.src = schuss.Bildquelle;
            schuss.Ort.x = this.Ort.x
            schuss.Ort.y = this.Ort.y + 50;
         schuss.Geschwindigkeit.y *=-0,5;
            return schuss;
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