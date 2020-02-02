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
    bewegen = function () {
        if (this.Ort.x < (200 + (this.WellePos * 50)))
            this.Ort.x += this.Geschwindigkeit.x;
        if (this.Ort.y < 100)
            this.Ort.y += this.Geschwindigkeit.y;
    }

    schiessen = function () {

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
}