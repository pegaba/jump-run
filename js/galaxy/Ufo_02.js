class Ufo02 {
    Typ = "Gegner"
    Bildquelle = 'themes/galaxy/simple/images/ufo_02.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 5, y: 0 },
        source_size: { x: 55, y: 60 },
        target_size: { x: 32, y: 32 }
    }
    Ort = { x: 0, y: 0 }
    Geschwindigkeit = { x: 10, y: 10 }
    Leben = 7500
    Starttick = 0
    WellePos = 0
    Status = 0
    LetzterSchussTick = 0;
    Schussabstand = 40;

    bewegen = function () {
        if (this.Ort.x > 500) {
            this.Geschwindigkeit.x = 0;
            this.Geschwindigkeit.y = 7;
            this.Ort.x = 500;
        }

        if (this.Ort.x <= 84) {
            this.Geschwindigkeit.x = 0;
            this.Geschwindigkeit.y = -7;
            this.Ort.x = 84;
        }

        if (this.Ort.y > 150) {
            this.Geschwindigkeit.x = -7;
            this.Geschwindigkeit.y = 0;
            this.Ort.y = 150;
        }

        if (this.Ort.y < 50) {
            this.Geschwindigkeit.y = 0;
            this.Geschwindigkeit.x = 7;
            this.Ort.y = 50;
        }

        this.Ort.x += this.Geschwindigkeit.x
        this.Ort.y += this.Geschwindigkeit.y

    }

    schiessen = function () {
        if (_Game.Status != 'running') {
            return;
        }
        if (this.LetzterSchussTick + this.Schussabstand < ticks) {
            this.LetzterSchussTick = ticks;

            var r1 = [14, 30]
            var r2 = [16, 30]

            var s = [];
            s.push(this.erstelleUfoschuss(this.Ort, r1));
            s.push(this.erstelleUfoschuss(this.Ort, r2));

            return s;
        }
        else {
            return null;
        }
    }

    schiesseEnergiewaffe = function () {
        return null;
    }

    pruefeStatus = function () {
        if (this.Leben <= 0) {
            this.Status = -1;
        }
    }
    getroffen = function (m) {
        if (this.Starttick > ticks)
            return;

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