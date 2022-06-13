const Application = PIXI.Application;

const app = new Application({
    width: 500,
    height: 500,
    transparent: false,
    antialias: true
});

app.renderer.backgroundColor = 0x23395D;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.position = 'absolute';

document.body.appendChild(app.view);

//  Create rectangle



const rectangle = new Graphics();
rectangle.beginFill(0xAA33BB);
rectangle.lineStyle(4, 0xFFEA00, 1);
rectangle.drawRect(200, 200, 100, 120);
rectangle.endFill();

app.stage.addChild(rectangle);

// Create polygon

const poly = new Graphics();
poly.beginFill(0xFF66FF);
poly.lineStyle(4, 0xFFEA00, 1);
poly.drawPolygon([
        600, 50,
        800, 150,
        900, 300,
        400, 400
])
poly.endFill;

app.stage.addChild(poly);


// Create circle 

const circle = new Graphics();
circle.beginFill(0x22AACC);
circle.drawCircle(440, 200, 80);
circle.endFill();

app.stage.addChild(circle);

// Create line

const line = new Graphics();
line.lineStyle(5, 0xFFEA00, 1);
line.moveTo(1500, 100);
line.lineTo(1500, 800);
line.endFill();

app.stage.addChild(line);

// Create Text

const style = new PIXI.TextStyle({
    fontFamily: 'Montserrat',
    fontSize: 48,
    fill: 'deepskyblue',
    stroke: "#ffffff",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowDistance: 10,
    dropShadowAngle : Math.PI / 2,
    dropShadowBlur: 4,
    dropShadowColor : "#000000"
});

const myText = new PIXI.Text('Hello World!', style);

app.stage.addChild(myText);

myText.text = 'Text Changed!';

// Create Ticker

/*
app.ticker.add(delta => loop(delta));

function loop(delta){
    const rect = new Graphics();
    rect.beginFill(0xFFFFFF)
    .drawRect(Math.random() * app.screen.width, Math.random() * app.screen.height, 10, 10)
    .endFill();

    app.stage.addChild(rect);

}*/

// Import Image

//const char1Texture = PIXI.Texture.from('../images/1.gif');
//const char1Sprite = new PIXI.Sprite(char1Texture);
const char1Sprite = new PIXI.Sprite.from('../images/1.gif');
app.stage.addChild(char1Sprite);

//char1Sprite.width = 500;
//char1Sprite.height = 500;

//char1Sprite.scale.x = 1.5;
//char1Sprite.scale.y = 2;
char1Sprite.scale.set(2, 2);

//char1Sprite.x = 200;
//char1Sprite.y = 500;
char1Sprite.position.set(2,400);

//char1Sprite.anchor.x = 0.5;
//char1Sprite.anchor.y = 0.5;
char1Sprite.anchor.set(0.5, 0.5);

app.ticker.add(delta => loop(delta));

function loop(delta){
    char1Sprite.x += 1;
    char1Sprite.rotation += 0.1;
}

// keyboard and mouse event

const char2Sprite = new PIXI.Sprite.from('../images/2.PNG');
app.stage.addChild(char2Sprite);

char2Sprite.position.set(200,600);
char2Sprite.anchor.set(0.5, 0.5);

char2Sprite.interactive = true;
char2Sprite.buttonMode = true;

char2Sprite.on('pointerdown', function(){
    char2Sprite.scale.x += 0.1;
    char2Sprite.scale.y += 0.1;
});


document.addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight')
        char2Sprite.scale.x -= 0.1;
        char2Sprite.scale.y -= 0.1;
});

// container

const container = new PIXI.Container();

const char3Sprite = new PIXI.Sprite.from('../images/3.png');
container.addChild(char3Sprite);

const char4Sprite = new PIXI.Sprite.from('../images/4.png');
container.addChild(char4Sprite);

app.stage.addChild(container);

console.log(container.width, container.height);
container.pivot.set(container.width / 2, container.height / 2);
console.log(container.pivot);
container.position.set(500,500);

app.ticker.add(delta => loop2(delta));

function loop2(delta){
    container.rotation -= 0.05;
}

// particule Container
/*
const particuleContainer = new PIXI.ParticuleContainer(1000, {
    position : true,
    rotation : true,
    vertices : true,
    tint : true,
    uvs : true
});

const loader = PIXI.loader.shared;

loader.add('char5Texture', '../images/4.png');

loader.load(setup);

fucntion setup(loader, ressources){
    const char5Sprite = new PIXI.Sprite(
        ressources.char5Texture.tecture
    );
    char5Sprite. y = 400;
    app.stage.addChild(char5Sprite);
}*/