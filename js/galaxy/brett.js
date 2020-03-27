var Brett = {
    Groesse: { x: 0, y:0 },
    GroesseAnzeige:{x:0, y:0},
    berechneDimensionen: function(){
        //var browser_w = document.documentElement.clientWidth
        //var browser_h = document.documentElement.clientHeight
        //this.Groesse.x = browser_w - 4
        //this.Groesse.y = browser_h - 4
        this.Groesse.x = 600;
        this.Groesse.y = 800;
        this.GroesseAnzeige.x = 200;
        this.GroesseAnzeige.y = 800;
        
        canvas.width = 800;
        canvas.height = 800; //     this.Groesse.y
        // groessen.tiles.target.w = groessen.canvas.w / groessen.tile.target.w
        // groessen.tiles.target.h = groessen.canvas.h / groessen.tile.target.h
    }
}