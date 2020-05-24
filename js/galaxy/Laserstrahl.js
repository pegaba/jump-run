class Laserstrahl {
    Schaden = 50 // pro tick
    Ort = { x: 0, y: 0 }
    YRichtung = -1
    Typ = 'Spielerwaffe'
    End = { x: 0, y: 10000 }
    LaserBreite = 5;


    zeichenFunktion = function (ctx) {
        ctx.beginPath();
        ctx.moveTo(this.Ort.x, this.Ort.y);
        ctx.lineTo(this.End.x, this.End.y);
        //ctx.strokeStyle = gradient;
        var gradient = ctx.createLinearGradient(0, 1000, 0, 0);
        gradient.addColorStop("0", "red");
        gradient.addColorStop("0.5", "purple");
        gradient.addColorStop("1", "gold");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.LaserBreite;
        ctx.stroke();
    }
    trifft = function (gegner) {
        if (this.YRichtung < 0) {
            if (gegner.Ort.y < this.Ort.y && gegner.Ort.x < this.Ort.x && (gegner.Ort.x + gegner.Bild.target_size.x) > this.Ort.x) {
                gegner.getroffen(this);
            }
        }

        if (this.YRichtung > 0) {
            if (gegner.Ort.y > this.Ort.y && gegner.Ort.x < this.Ort.x && (gegner.Ort.x + gegner.Bild.target_size.x) > this.Ort.x) {
                gegner.getroffen(this);
            }
        }

    }
}