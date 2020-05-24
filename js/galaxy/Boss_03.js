class Boss_03 {
    Typ = "Gegner"
    Bildquelle = 'themes/galaxy/simple/images/boss3.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 0, y: 0 },
        source_size: { x: 64, y: 64 },
        target_size: { x: 128, y: 128 }
    }
    Ort = { x: 0, y: 0 }
    Geschwindigkeit = { x: 5, y: 5 }
    Leben = 50000
    Starttick = 0
    WellePos = 0
    Status = 0
    LetzterSchussTick = 0;
    Schussabstand = 50;
    Richtung = 1;

    bewegen = function () {
        if (
            (this.Ort.x < 10 && this.Richtung < 0) ||
            (this.Ort.x >= (590 - this.Bild.target_size.x) && this.Richtung > 0)
        ) {
            this.Richtung *= -1;
        }

        this.Ort.x += this.Geschwindigkeit.x * this.Richtung;

        if (this.y < 20)
            this.Ort.y += this.Geschwindigkeit.y;


    }

    schiessen = function () {
        if (_Game.Status != 'running') {
            return;
        }
        if (this.LetzterSchussTick + this.Schussabstand < ticks) {
            this.LetzterSchussTick = ticks;

            var r1 = [22, 80]
            var r2 = [28, 88]
            var r3 = [36, 92]
            var r4 = [90, 92]
            var r5 = [96, 88]
            var r6 = [102, 80]

            var s = [];

            s.push(this.erstellLaserball(this.Ort, r1));
            s.push(this.erstellLaserball(this.Ort, r2));
            s.push(this.erstellLaserball(this.Ort, r3));
            s.push(this.erstellLaserball(this.Ort, r4));
            s.push(this.erstellLaserball(this.Ort, r5));
            s.push(this.erstellLaserball(this.Ort, r6));


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
        // if (this.Leben < 42000)
        //     this.Bild.sprite.y = 255;
        // if (this.Leben < 34000)
        //     this.Bild.sprite.y = 510;
        // if (this.Leben < 26000)
        //     this.Bild.sprite.y = 765;
        // if (this.Leben < 18000)
        //     this.Bild.sprite.y = 1020;
        // if (this.Leben < 9000)
        //     this.Bild.sprite.y = 1274;

    }

    erstellLaserball = function (ort, korr) {
        var ls = new Laserball();
        ls.Typ = "AlienMunition";
        ls.Bild.spriteMap.src = ls.Bildquelle;
        ls.Ort.y = ort.y + korr[1];
        ls.Ort.x = ort.x + korr[0];
        ls.Geschwindigkeit.y *= 0.8;
        return ls;
    }
}