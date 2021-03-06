var levels = [
    {
        name: "Erstes Level",
        theme: 'simple',
        background: '#0000ff',
        Gruppen: [
             {
                 Gegner: "Ufo_01",
                 Anzahl: 10,
                 Start: 100,
                 Pause: 15,
                 StopTick: 0
             },
             {
                 Gegner: "Ufo_01",
                 Anzahl: 5,
                 Start: 50,
                 Pause: 100,
             },
            {
                 Gegner: "Ufo_01",
                 Anzahl: 5,
                 Start: 50,
                 Pause: 100,
             },
             {
                 Gegner: "Boss_01",
                 Anzahl: 2,
                 Start: 80,
                 Pause: 100,
             },
             {
                 Gegner: "Ufo_02",
                 Anzahl: 10,
                 Start: 100,
                 Pause: 15,
                 StopTick: 0
             },
             {
                 Gegner: "Ufo_02",
                 Anzahl: 5,
                 Start: 100,
                 Pause: 30,
                 StopTick: 0
             },
            {
                Gegner: "Boss_02",
                Anzahl: 2,
                Start: 80,
                Pause: 100,
            },
            {
                Gegner: "Ufo_03",
                Anzahl: 10,
                Start: 100,
                Pause: 15,
            },
            {
            
                Gegner: "Ufo_03",
                Anzahl: 5,
                Start: 100,
                Pause: 30,
            },
            {
                Gegner: "Boss_03",
                Anzahl: 2,
                Start: 80,
                Pause: 100,
            },
        ]
    }
];

class Level {
    name = ''
    theme = ''
    background = '';
    Gruppen = [];
}

function GetLevel(idx) {
    var l = levels[idx];
    var lev = new Level();
    return Object.assign(lev, JSON.parse(JSON.stringify(l)));
}
