
var spr_player = new Sprite({ img: "img/sprite_walk.png", x: 0, y: 0, w: 410, h: 632, num_sprite: 4, speed: 15 });

var square = new Obj({ x:200, y: 200, w: 50, h: 50, color: "#f00" });
var square2 = new Obj({ x: 150, y: 70, w: 150, h: 50, color: "#f8f" });
var square3 = new Obj({ x: 300, y: 370, w: 20, h: 50, color: "#ff5" });

var player1 = new Player({ x: 50, y: 50, w: 25, h: 50, speed: 2, hp: 250, sprite: spr_player });
player1.addCaracter({});

var mapa = new Maps({ x: 0, y: 0, scale: 400, src: "img/imgteste.png" });


secene1 = new Scene({
    objects: [square, square2,square3],
    player: player1,
    background: mapa,
    order: 0
})

function update() {

    player1.solidColision(square2);
    square.solidColision(player1);
    square.solidColision(square2);
    
    if(player1.simpleColision(square3)){
        square3.color = "#124";
    }else if(square.simpleColision(square3)){
        square3.color = "#580";
    }else{
        square3.color = "#ff5";
    }
}

game = new Game({ scene: secene1 });

function gameLoop() {
    window.requestAnimationFrame(gameLoop, canvas);

    update();
    game.loop();
}

gameLoop();