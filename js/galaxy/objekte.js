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
    LaserstrahlKorrektur = [16, 17];
    LaserEnergie = 50;
    MaxLaserEnergie = 50;
    SchiesstLaser = 0;
    LaserFrei = 0;

    bewegen = function () {
        var x_soll = 84 + (this.WellePos % 5) * 100;
        var y_soll = 50 + (this.WellePos % 2) * 100;

        if (this.Ort.x < x_soll)
            this.Ort.x += this.Geschwindigkeit.x;
        if (this.Ort.y < y_soll)
            this.Ort.y += this.Geschwindigkeit.y;

        if (this.Ort.x >= x_soll && this.Ort.y >= y_soll) {
            this.LaserFrei = 1;
        }
    }

    schiessen = function () {
        if (_Game.Status != 'running') {
            return;
        }
        if (this.LetzterSchussTick + this.Schussabstand < ticks) {
            this.LetzterSchussTick = ticks;

            var r1 = [7, 15]
            var r2 = [8, 15]

            var s = [];
            s.push(this.erstelleUfoschuss(this.Ort, r1));
            s.push(this.erstelleUfoschuss(this.Ort, r2));

            return s;
        }

        return null;
    }

    schiesseEnergiewaffe = function () {
        if (this.MaxLaserEnergie == this.LaserEnergie)
            this.SchiesstLaser = 1;

        if (this.LaserFrei == 1 && this.SchiesstLaser == 1) {
            this.LaserEnergie -= 1;
            var ls = new Laserstrahl();
            ls.Ort.x = this.Ort.x + this.LaserstrahlKorrektur[0];
            ls.Ort.y = this.Ort.y + this.LaserstrahlKorrektur[1];
            ls.End.x = this.Ort.x;
            ls.YRichtung = 1;
            ls.End.y *= ls.YRichtung;

            ls.Typ = 'AlienWaffe';

            if (this.LaserEnergie == 0)
                this.SchiesstLaser = 0;

            return [ls];
        }
        return null;
    }

    pruefeStatus = function () {
        if (this.Leben <= 0) {
            this.Status = -1;
        }

        if (this.SchiesstLaser == 0 && this.LaserEnergie < this.MaxLaserEnergie && ticks % 5 == 0) {
            this.LaserEnergie += 1;
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

class Boss01 {
    Typ = "Gegner"
    Bildquelle = 'themes/galaxy/simple/images/boss1.png'
    Bild = {
        spriteMap: new Image(),
        sprite: { x: 0, y: 0 },
        source_size: { x: 254, y: 254 },
        target_size: { x: 128, y: 128 }
    }
    Ort = { x: 0, y: 0 }
    Geschwindigkeit = { x: 5, y: 5 }
    Leben = 50000
    Starttick = 0
    WellePos = 0
    Status = 0
    LetzterSchussTick = 0;
    Schussabstand = 30;
    Richtung = 1;

    LaserStartTick = 0;
    LaserPauseTick = 300;

    bewegen = function () {
        console.log(this.Richtung + ' - ' + this.Ort.x);

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

            var r1 = [57, 125]
            var r2 = [73, 125]

            var s = [];
            //s.push(this.erstelleUfoschuss(this.Ort, r1));
            //s.push(this.erstelleUfoschuss(this.Ort, r2));

            s.push(erstellLaserball(this.Ort, r1));
            s.push(erstellLaserball(this.Ort, r2));

            return s;
        }
        else {
            return null;
        }
    }

    schiesseEnergiewaffe = function () {
        //var laser01 = [87, 132, 110, 180]
        //var laser02 = [110, 143, 110, 180]
        //var laser03 = [133, 132, 110, 180]
        //var laser04 = [110, 180]

        var laser01 = [43, 66, 55, 90]
        var laser02 = [55, 71, 55, 90]
        var laser03 = [66, 66, 55, 90]
        var laser04 = [55, 90]

        //var laser01Delay = 0;
        var laser02Delay = 20;
        //var laser03Delay = 0;
        var laser04Delay = 60;

        var z = [];

        // Phase 1: Laser links + Laser rechts
        if (this.LaserStartTick < ticks && this.LaserStartTick + 160 > ticks) {
            var l1 = new Laserstrahl();
            l1.Ort.x = this.Ort.x + laser01[0];
            l1.Ort.y = this.Ort.y + laser01[1];
            l1.End.x = this.Ort.x + laser01[2];
            l1.End.y = this.Ort.y + laser01[3];
            l1.trifft = () => { }
            l1.Typ = "AlienWaffe";
            l1.LaserBreite = 2;

            z.push(l1);

            var l3 = new Laserstrahl();
            l3.Ort.x = this.Ort.x + laser03[0];
            l3.Ort.y = this.Ort.y + laser03[1];
            l3.End.x = this.Ort.x + laser03[2];
            l3.End.y = this.Ort.y + laser03[3];
            l3.trifft = () => { }
            l3.Typ = "AlienWaffe";
            l3.LaserBreite = 2;
            z.push(l3);

            
        }

        if (this.LaserStartTick + laser02Delay < ticks && this.LaserStartTick + 160 > ticks) {
            var l2 = new Laserstrahl();
            l2.Ort.x = this.Ort.x + laser02[0];
            l2.Ort.y = this.Ort.y + laser02[1];
            l2.End.x = this.Ort.x + laser02[2];
            l2.End.y = this.Ort.y + laser02[3];
            l2.trifft = () => { }
            l2.Typ = "AlienWaffe";
            l2.LaserBreite = 2;
            z.push(l2);
        }

        if (this.LaserStartTick + laser04Delay < ticks && this.LaserStartTick + 220 > ticks) {
            var l4 = new Laserstrahl();
            l4.Ort.x = this.Ort.x + laser04[0];
            l4.Ort.y = this.Ort.y + laser04[1];
            l4.End.x = this.Ort.x + laser04[0];
            l4.Typ = "AlienWaffe";
            l4.YRichtung = 1;
            l4.End.y *= l4.YRichtung;
            l4.LaserBreite = 10;
            l4.Schaden = 100;
            z.push(l4);
        }

        if (z.length > 0)
            return z;

        if (this.LaserStartTick + 220 < ticks) {
            this.LaserStartTick = ticks + 220 + this.LaserPauseTick;
        }
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
        if (this.Leben < 42000)
            this.Bild.sprite.y = 255;
        if (this.Leben < 34000)
            this.Bild.sprite.y = 510;
        if (this.Leben < 26000)
            this.Bild.sprite.y = 765;
        if (this.Leben < 18000)
            this.Bild.sprite.y = 1020;
        if (this.Leben < 9000)
            this.Bild.sprite.y = 1274;

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
    schiesseEnergiewaffe = function () {
        return null;
    }
}