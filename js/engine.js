var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext("2d");

//AUXILIARES

var mvLeft = mvRight = mvUp = mvDown = false;
const UP = 38, LEFT = 37, RIGHT = 39, DOWN = 40;
const W = 87, S = 83, A = 65, D = 68, Q = 81, E = 69, R = 82, T = 84, Y = 89, P = 80, C = 67;
const SHIFT = 16, CTRL = 17, ALT = 18, SPACE = 32;

//OBJETOS
class Obj {
    constructor({ x, y, w, h, sprite = null, color = "#083", visible = true, speed = 1, hp = 100, dir = DOWN }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sprite = sprite;
        this.color = color
        this.dir = dir;
        this.visible = visible;
        this.cont = 0;
        this.speed = speed;
        this.hp = hp;

        this.middleW = this.w / 2;
        this.middleH = this.h / 2;
        this.centerX = this.x + this.middleW;
        this.centerY = this.y + this.middleH;
    }

    simpleColision(obj) {
        if ((this.x + this.w) > obj.x &&
            this.x < (obj.x + obj.w) &&
            (this.y + this.h) > obj.y &&
            this.y < (obj.y + obj.h)) {
            return true;
        } else {
            return false;
        }
    }
    solidColision(obj) {

        this.middleW = this.w / 2;
        this.middleH = this.h / 2;
        this.centerX = this.x + this.middleW;
        this.centerY = this.y + this.middleH;
        obj.middleW = obj.w / 2;
        obj.middleH = obj.h / 2;
        obj.centerX = obj.x + obj.middleW;
        obj.centerY = obj.y + obj.middleH;

        let catx = this.centerX - obj.centerX;
        let caty = this.centerY - obj.centerY;

        let sumMidW = this.middleW + obj.middleW;
        let sumMidH = this.middleH + obj.middleH;

        if (Math.abs(catx) < sumMidW && Math.abs(caty) < sumMidH) {
            let overX = sumMidW - Math.abs(catx);
            let overY = sumMidH - Math.abs(caty);

            if (overX >= overY) {
                //Cima ou baixo
                if (caty > 0) {
                    this.y += overY;
                } else {
                    this.y -= overY;
                }
            } else {
                //laterais
                if (catx > 0) {
                    this.x += overX;
                } else {
                    this.x -= overX;
                }
            }
        }

    }


    drawColor() {

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

    }
    drawSprite() {

        if (mvRight || mvLeft || mvUp || mvDown) {
            this.cont++;
            if (this.cont > (this.sprite.num_sprite * this.sprite.speed - 1)) {
                this.cont = 0;
            }
        } else {
            this.cont = 0;
        }
        this.sprite.draw(this.x, this.y, this.w, this.h, this.dir, this.cont);

    }
}

class Item{
    constructor({name, desc, status = {magic: 0, fisic: 0, defense: 0, hp: 0, mana: 0, xp: 0}, rarity = 1, price = 1, sprite = "#000", quantity = 0}){
        this.name = name;
        this.desc = desc;
        this.status = status;
        this.rarity = rarity;
        this.price = price;
        this.sprite = sprite;
        this.quantity = quantity;
    }
}

class Player extends Obj{

    addCaracter({inventory = [], attributes = {magic: 1, fisic: 1, defense: 1}}, mana = 100, level = 1, ...args){
        this.inventory = inventory;
        this.attributes = attributes;
        this.mana = mana;
        this.level = level;
    }

    moviment() {
        window.addEventListener('keydown', this.keydownHandler, false);
        window.addEventListener('keyup', this.keyupHandler, false);
        if (mvLeft) {
            this.x = this.x - this.speed;
            this.dir = LEFT;
            mvUp = false;
            mvDown = false;
            mvRight = false
        }
        if (mvRight) {
            this.x = this.x + this.speed;
            this.dir = RIGHT;
            mvUp = false;
            mvDown = false;
            mvLeft = false
        }
        if (mvUp) {
            this.y = this.y - this.speed;
            this.dir = UP;
            mvLeft = false;
            mvDown = false;
            mvRight = false
        }
        if (mvDown) {
            this.y = this.y + this.speed;
            this.dir = DOWN;
            mvUp = false;
            mvLeft = false;
            mvRight = false
        }

        this.x = Math.max(0, Math.min(canvas.width - this.w, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.h, this.y));

        this.middleW = this.w / 2;
        this.middleH = this.h / 2;
        this.centerX = this.x + this.middleW;
        this.centerY = this.y + this.middleH;
    }
    keydownHandler(e) {
        let key = e.keyCode;

        switch (key) {
            case UP:
                mvUp = true;
                break;
            case DOWN:
                mvDown = true;
                break;
            case LEFT:
                mvLeft = true;
                break;
            case RIGHT:
                mvRight = true;
            case W:
                mvUp = true;
                break;
            case S:
                mvDown = true;
                break;
            case A:
                mvLeft = true;
                break;
            case D:
                mvRight = true;
        }
    }
    keyupHandler(e) {
        let key = e.keyCode;

        switch (key) {
            case UP:
                mvUp = false;
                break;
            case DOWN:
                mvDown = false;
                break;
            case LEFT:
                mvLeft = false;
                break;
            case RIGHT:
                mvRight = false;
            case W:
                mvUp = false;
                break;
            case S:
                mvDown = false;
                break;
            case A:
                mvLeft = false;
                break;
            case D:
                mvRight = false;
        }
    }

    addItem(item){
        this.inventory.push(item);

        this.attributes.magic += item.magic;
        this.attributes.fisic += item.fisic;
        this.attributes.defense += item.defense;
    }
    dropItem(item){
        this.inventory.pop(item);

        this.attributes.magic -= item.magic;
        this.attributes.fisic -= item.fisic;
        this.attributes.defense -= item.defense;
    }
    consumeItem(item){
        
        if(item.hp > 0){
            this.hp += item.hp;
        }

        if(item.mana > 0){
            this.mana += item.mana;
        }
        if(item.xp > 0){
            this.xp += item.xp;
        }
    }
}

class Sprite {
    constructor({ img, x, y, w, h, num_sprite, speed = 5 }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = new Image();
        this.img.src = img;
        this.num_sprite = num_sprite;
        this.speed = speed;
    }

    draw(x, y, w, h, dir, cont) {


        if (dir == LEFT) {
            this.y = this.h * 2;
            this.x = Math.floor(cont / this.speed) * this.w
        }
        if (dir == RIGHT) {
            this.y = this.h * 3;
            this.x = Math.floor(cont / this.speed) * this.w
        }
        if (dir == UP) {
            this.y = this.h;
            this.x = Math.floor(cont / this.speed) * this.w
        }
        if (dir == DOWN) {
            this.y = this.h * 0;
            this.x = Math.floor(cont / this.speed) * this.w
        }
        ctx.drawImage(this.img, this.x, this.y, this.w,
            this.h, x, y, w, h);
    }
}

class Maps {
    constructor({ x, y, scale, src = null }) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.src = src;
        this.img = new Image();
        this.img.src = this.src;
        this.ctx = ctx
    }
    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.scale, this.scale,
            0, 0, canvas.width, canvas.height);
    }
}

class Scene {
    constructor({ objects = [], player, background = "#000", order = 0 }) {
        this.objects = objects;
        this.player = player;
        this.background = background
        this.order = order
    }
}

class Game {
    constructor({ scene }) {
        this.scene = scene;
        this.ctx = ctx
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        // if (!this.scene.background.src) {
        //     this.ctx.fillStyle = this.scene.background;
        //     this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        //} else {
        this.scene.background.draw();
        //}


        for (var i in this.scene.objects) {
            let obj = this.scene.objects[i];
            if (obj.visible) {
                if (obj.sprite == null) {
                    obj.drawColor();
                } else {
                    obj.drawSprite();
                }
            }
        }



        if (this.scene.player.visible) {
            if (this.scene.player.sprite == null) {
                this.scene.player.drawColor();
            } else {
                this.scene.player.drawSprite();
            }
        }

    }


    loop() {

        this.scene.player.moviment()

        this.draw();
    }
}


/*
COMANDS

----------------CTX--------------------
ctx.fillRect(x, y, w, h) -> draw a fill rect
 ctx.drawImage(img, x, y, w, h, origemX, origemY, canvas.width, canvas.height); -> draw an Image
---------------KeyCode-----------------
A = 65
S = 83
D = 68
W = 87
Q = 81
E = 69
R = 82
T = 84
Y = 89
P = 80
C = 67

shift = 16
ctrl = 17
alt = 18
space = 32

up = 38
down = 40
left = 37
right = 39
*/
