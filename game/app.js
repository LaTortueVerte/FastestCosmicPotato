import {create_button, create_text, Stat, SpaceShip, Info, Steering_wheel, Map, Background, bringToFront, Find_Slot_Bar} from './sources/functions.js';

//-----------------------------------------------------------------------------------------------------
// INIT game screen
//-----------------------------------------------------------------------------------------------------

const Application = PIXI.Application;
const Graphics = PIXI.Graphics;

const app = new Application({
    transparent: false,
    antialias: true,
    resizeTo: window
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

app.renderer.backgroundColor = 0x001E4D; //2B2B54 - 23395D
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.position = 'absolute';
document.body.appendChild(app.view);

window.onresize = function(){ 
    window.location.href = "./index.php"; // redirect to itself = reload page
}

//-----------------------------------------------------------------------------------------------------
// OBJECTS
//-----------------------------------------------------------------------------------------------------

// Global --------------------------------------------------------------------------------

const pixel_size = Math.floor(window.innerWidth/400);

// Background -----------------------------------------------------------------------------

const background = new Background(app, pixel_size);

// Info ------------------------------------------------------------------------------------

var info = new Info(app, pixel_size);

// Spaceship -----------------------------------------------------------------------------

var spaceship_shape = [ [2,1,1,1,0],
                        [0,0,1,1,1],
                        [2,1,1,1,0]];

var spaceship = new SpaceShip(app, spaceship_shape, pixel_size, Graphics);

app.ticker.add(function() { // background in function direction - to change
    background.background_sprite.tilePosition.x -= pixel_size / 4 * Math.cos(spaceship.spaceship_container.rotation);
    background.background_sprite.tilePosition.y -= pixel_size / 4 * Math.sin(spaceship.spaceship_container.rotation);
});

// Find slot -----------------------------------------------------------------------------

var number_of_find_slot = 3;
var find_slot_bar = new Find_Slot_Bar(app.stage, number_of_find_slot, pixel_size);


// Engine_button -------------------------------------------------------------------------

function create_sparks(){
    spaceship.engine_status = !spaceship.engine_status;
    if (spaceship.engine_status){
        console.log("added");
        spaceship.mini_spaceship_container.addChild(spaceship.mini_spaceship_flame);
    }
    else
    {
        spaceship.mini_spaceship_container.removeChild(spaceship.mini_spaceship_flame);
        console.log("removed");
    }
}
var sEngine_Button = create_button(app, pixel_size, create_sparks, window.innerWidth * 0.05, pixel_size * 200, "dashboard/sEngineButton_", 6);

// Steering_Wheel ------------------------------------------------------------------------

var steering_wheel = new Steering_wheel(app, pixel_size, window.innerWidth * 0.17, pixel_size * 208);
spaceship.bind_steering_wheel(steering_wheel);

// Common Button 1 -------------------------------------------------------------------------

// Logout 
function log_out(){
    window.location.href = "./logout.php";
}
var Log_out_Button_sprite = create_button(app, pixel_size, log_out, window.innerWidth * 0.025, window.innerHeight * 0.05, "dashboard/sCommonButton_", 4);

var Log_out_Button_text = create_text(app, pixel_size, Log_out_Button_sprite.x + window.innerWidth * 0.04, Log_out_Button_sprite.y + window.innerHeight * 0.02, "dashboard/logout_text", 0, 0);

// Account settings
function account_settings(){
    // access to account settings
}
var Account_Settings_Button_sprite = create_button(app, pixel_size, account_settings, window.innerWidth * 0.025, Log_out_Button_sprite.y + 16 * pixel_size + window.innerHeight * 0.01, "dashboard/sCommonButton_", 4);

var Account_Settings_Button_text = create_text(app, pixel_size, Account_Settings_Button_sprite.x + window.innerWidth * 0.04, Account_Settings_Button_sprite.y + window.innerHeight * 0.02, "dashboard/account_settings_text", 0, 0);

// Info button ------------------------------------------------------------------------

function toggle_info(){
    if (info.active){
        info.hide();
        spaceship.show();
        app.stage.addChild(Log_out_Button_sprite);
        app.stage.addChild(Account_Settings_Button_sprite);
        app.stage.addChild(Log_out_Button_text);
        app.stage.addChild(Account_Settings_Button_text);
    }
    else{
        info.show();
        spaceship.hide();
        app.stage.removeChild(Log_out_Button_sprite);
        app.stage.removeChild(Account_Settings_Button_sprite);
        app.stage.removeChild(Log_out_Button_text);
        app.stage.removeChild(Account_Settings_Button_text);
    }
}

var Info_Button_sprite = create_button(app, pixel_size, toggle_info, window.innerWidth * 0.84, pixel_size * 204, "dashboard/sCommonButton_", 4);

var info_text = create_text(app, pixel_size, window.innerWidth * 0.84, pixel_size * 192, "dashboard/info_text", 0, 0);

// Stat Bar -------------------------------------------------------------------------------

var stat = new Stat(app, pixel_size, 5, window.innerWidth - 150 * pixel_size, pixel_size * 19);

// Map -------------------------------------------------------------------------------------------

var map = new Map(app, Graphics, pixel_size);

var sMinimap_Button = null;
function toggle_map(){
    map.active = !map.active;
    background.toggle();
    if (map.active){
        map.show();
        if (info.active == true){
            toggle_info();
        }
        find_slot_bar.hide();
        app.stage.removeChild(stat.Stat_container);
        app.stage.removeChild(Info_Button_sprite);
        app.stage.removeChild(info_text);
        
    }
    else{
        map.hide();
        find_slot_bar.show();
        app.stage.addChild(stat.Stat_container);
        app.stage.addChild(Info_Button_sprite);
        app.stage.addChild(info_text);
    }
    spaceship.toggle_sprite();
    bringToFront(Log_out_Button_sprite);
    bringToFront(Log_out_Button_text);
    bringToFront(Account_Settings_Button_sprite);
    bringToFront(Account_Settings_Button_text);
    bringToFront(sEngine_Button);
    bringToFront(steering_wheel.Steering_wheel_sprite);
    bringToFront(sMinimap_Button);
}
sMinimap_Button = create_button(app, pixel_size, toggle_map, window.innerWidth * 0.9, pixel_size * 190, "dashboard/minimap_button_", 3);

//-----------------------------------------------------------------------------------------------------
// All Updates
//-----------------------------------------------------------------------------------------------------

function update(){
    spaceship.update()
}
setInterval(update, 10);