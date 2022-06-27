
// Basics

function keyboard(value) {
    const key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = (event) => {
      if (event.key === key.value) {
        if (key.isUp && key.press) {
          key.press();
        }
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = (event) => {
      if (event.key === key.value) {
        if (key.isDown && key.release) {
          key.release();
        }
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };
  
    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener("keydown", downListener, false);
    window.addEventListener("keyup", upListener, false);
    
    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };
    
    return key;
  }

export function bringToFront(object) {
    if (object.parent){		
        var parent = object.parent;		
        parent.removeChild(object);		
        parent.addChild(object);	
    }
}

function getRandomColor() {
    var letters_1 = '0123456789ABCDEF';
    var letters_2 = '2345678';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
        if (i%2==0){
            color += letters_2[Math.floor(Math.random() * 7)];
        }
        else{
            color += letters_1[Math.floor(Math.random() * 16)];
        }
      
    }
    return color;
  }

// --------------------------------------------------------------------------------------------------------------------------------------
// OBJECTS
// --------------------------------------------------------------------------------------------------------------------------------------

// Mouse_slot ------------------------------------------------------------------------------------------------------------------------------

export class Mouse_slot{
    constructor(app, pixel_size){
        this.mouse_slot_container = new PIXI.Container();
        this.mouse_slot_container.pivot.set(8, 8);
        this.mouse_slot_container.scale.set(pixel_size);
        this.app = app;
        this.isEmpty = true;

        var this_obj = this;

        function getMousePosition() {
            return app.renderer.plugins.interaction.mouse.global;
        }
        
        function follow_mouse(delta){
            let mousePosition = getMousePosition();
            this_obj.mouse_slot_container.x = mousePosition.x;
            this_obj.mouse_slot_container.y = mousePosition.y;
        }

        app.ticker.add(delta => follow_mouse(delta));

        this.item_sprite = null;
    }

    add_item(item_sprite){
        this.item_sprite = item_sprite;
        this.mouse_slot_container.addChild(item_sprite);
        this.app.stage.addChild(this.mouse_slot_container);
        this.isEmpty = false;
    }

    remove_item(){
        this.mouse_slot_container.removeChild(this.item_sprite);
        this.item_sprite = null;
        this.app.stage.removeChild(this.mouse_slot_container);
        this.isEmpty = true;
    }
}

// Background ---------------------------------------------------------------------------------------------------------------------------

export class Background {
    constructor(app, pixel_size){   
        this.is_on_map_mode = false;
        this.app = app;

        this.background_texture = PIXI.Texture.from('../images/starry_sky.png');
        this.app.renderer.backgroundColor = 0x18213B;

        this.background_sprite = new PIXI.TilingSprite(
            this.background_texture,
            app.screen.width,
            app.screen.height
            );
        
            this.background_sprite.tileScale.set(pixel_size, pixel_size);
        
        app.stage.addChild(this.background_sprite);

        
    }

    toggle(){
        this.is_on_map_mode = !this.is_on_map_mode;
        if (this.is_on_map_mode){
            this.app.stage.removeChild(this.background_sprite);
        }
        else{
            this.app.stage.addChild(this.background_sprite);
        }
    }
}

// Inventory ----------------------------------------------------------------------------------------------------------------------------

export class Item{
    constructor(app, item_id, slot_size, mouse_pt, pixel_size){
        this.slot_size = slot_size;
        this.item_size = 16;
        this.parent_slot = null;
        this.mouse_pt = mouse_pt;
        this.is_following_mouse = false;

        // Sprite

        var image = "";

        switch (item_id){
            case 1: image = '../images/items/fuel.png'; break;      // fuel
            case 2: image = '../images/items/potato.png'; break;    // potato
            case 3: image = '../images/items/tools.png'; break;     // tools
            default: image = '../images/items/potato.png'; break;
        }

        this.item_sprite = PIXI.Sprite.from(image);
        this.item_sprite.anchor.set(0.5);
        this.item_sprite.position.set(this.slot_size / 2 );
        
        // Drag Interaction

        this.item_sprite.interactive = true;
        this.item_sprite.buttonMode = true;

        var this_obj = this;

        this.item_sprite.on('pointerdown', function(){ // mouse over sprite
            console.log("clic");
            if (this_obj.parent_slot != null){
                mouse_pt.dragged_item = this;

                this_obj.is_following_mouse = !this_obj.is_following_mouse;
                if (this_obj.is_following_mouse){
                    console.log("following");
                    this_obj.parent_slot.hide_item();
                    this_obj.mouse_pt.add_item(this_obj.item_sprite);
                }
                else{
                    console.log("not following");
                    this_obj.parent_slot.show_item();
                    this_obj.mouse_pt.remove_item();
                }
            }
        });

        // Over Animation

        var mouse_is_over = false;

        this.item_sprite.on('mouseover', function(){ // mouse over sprite
            //console.log("over");
            if (this_obj.parent_slot != null){
                if (!mouse_is_over){
                    this_obj.item_sprite.scale.x += 0.5;
                    this_obj.item_sprite.scale.y += 0.5;
                    mouse_is_over = true;
                }
            }
        });

        this.item_sprite.on('pointerout', function(){ // mouse not over sprite
            //console.log("not over");
            if (this_obj.parent_slot != null){
                if (mouse_is_over){
                    this_obj.item_sprite.scale.x -= 0.5;
                    this_obj.item_sprite.scale.y -= 0.5;
                    mouse_is_over = false;
                }
            }
        });
    }
}

export class Action_Item{
    constructor(parent, image, x, y, action, pixel_size, mouse_pt){

        this.mouse_pt = mouse_pt;

        // Sprite 

        this.action_item_sprite = PIXI.Sprite.from(image);

        this.action_item_sprite.anchor.set(0.5);
        this.action_item_sprite.position.set(x,y);
        this.action_item_sprite.scale.set(pixel_size);

        parent.addChild(this.action_item_sprite);

        this.action_item_sprite.interactive = true;
        this.action_item_sprite.buttonMode = true;

        var tmp = this.action_item_sprite;

        this.action_item_sprite.on('pointerdown', function(){ // mouse clic on sprite
            console.log("clic");
            // action();
        });
    
        this.action_item_sprite.on('mouseover', function(){ // mouse over sprite
            console.log("over");
            tmp.scale.x += 0.5;
            tmp.scale.y += 0.5;
        });

        this.action_item_sprite.on('pointerout', function(){ // mouse not over sprite
            console.log("not over");
            tmp.scale.x -= 0.5;
            tmp.scale.y -= 0.5;
        });

        
    }

    show(){
        parent.addChild(this.action_item_sprite);
    }

    hide(){
        parent.removeChild(this.action_item_sprite);
    }


}

// Spaceship ----------------------------------------------------------------------------------------------------------------------------

class Slot{
    constructor(parent, x, y, slot_texture){
        this.parent = parent;

        this.slot_container = new PIXI.Container();
        this.slot_container.position.set(x, y);
        this.parent.addChild(this.slot_container);

        // slot frame 

        this.slot_sprite = new PIXI.Sprite(slot_texture);
        this.slot_sprite.position.set(0, 0);
        this.slot_container.addChild(this.slot_sprite);

        // Item place

        this.item = null;
    }

    show_item(){
        this.slot_container.addChild(this.item.item_sprite);
    }

    hide_item(){
        this.slot_container.removeChild(this.item.item_sprite);
    }

    add_item(item){
        this.item = item;
        this.item.parent_slot = this;
        this.show_item();
    }

    remove_item(){
        this.item.parent_slot = null;
        this.item = null;
    }
}

export class SpaceShip {
    constructor(game, app, spaceship_shape, pixel_size, Graphics){
        this.game = game;

        //------------------------------------------------------------------------------------------------
        // Game variables
        //------------------------------------------------------------------------------------------------

        this.crew_size = this.game.crew_size;
        this.engine_status = false;
        this.active = true;
        this.is_on_map_mode = false;

        //------------------------------------------------------------------------------------------------
        // Visual
        //------------------------------------------------------------------------------------------------

        this.app = app;
        this.Graphics = Graphics;
        this.pixel_size = pixel_size;

        this.reactors = new Array();
        this.slots = new Array();

        // Mini_Spaceship_container

        this.slot_size = 24;
        
        this.mini_spaceship_flame = PIXI.Sprite.from('../images/spaceship/flame.png');
        this.mini_spaceship_flame.position.set(0, 1);
        this.mini_spaceship_sprite = PIXI.Sprite.from('../images/spaceship/spaceship.png');
        this.mini_spaceship_sprite.position.set(9, -1);
        this.mini_spaceship_container = new PIXI.Container();
        this.mini_spaceship_container.addChild(this.mini_spaceship_sprite);

        this.mini_spaceship_container.pivot.set(12, 5);
        this.mini_spaceship_container.position.set(window.innerWidth/2, pixel_size * 120);
        this.mini_spaceship_container.scale.set(pixel_size, pixel_size);

        // Spaceship_container

        this.spaceship_container = new PIXI.Container();
        const newSlot_texture = PIXI.Texture.from('../images/spaceship/slot.png');
        const newReactor_texture = PIXI.Texture.from('../images/spaceship/reactor.png');
    
        for (var i = 0 ; i < spaceship_shape.length ; i++){
            for (var j = 0 ; j < spaceship_shape[i].length ; j++){
                if (spaceship_shape[i][j] == 1){
                    var newSlot = new Slot( this.spaceship_container, 
                                            j * this.slot_size, 
                                            i * this.slot_size,
                                            newSlot_texture );

                    this.slots.push(newSlot);
                }
                else if (spaceship_shape[i][j] == 2){
                    var newReactor = new PIXI.Sprite(newReactor_texture);
                    this.spaceship_container.addChild(newReactor);
                    newReactor.position.set(j * this.slot_size, i * this.slot_size);
                    this.reactors.push(newReactor);
                }
            }
        }

        this.spaceship_container.pivot.set(spaceship_shape[0].length * this.slot_size / 2, spaceship_shape.length * this.slot_size / 2);
        this.spaceship_container.position.set(pixel_size * 200, pixel_size * 120);
        this.spaceship_container.scale.set(pixel_size, pixel_size);
        app.stage.addChild(this.spaceship_container);

        // Steering wheel

        this.steering_wheel = null;
        this.spaceship_rotation = 0;
        this.spaceship_rotation_speed = 0;

        const left = keyboard("ArrowLeft"),
            right = keyboard("ArrowRight");

        left.press = () => { this.spaceship_rotation = -1; };
        right.press = () => {  this.spaceship_rotation = 1; };

        left.release = () => { this.spaceship_rotation = 0; };
        right.release = () => { this.spaceship_rotation = 0; };

        // Reactor sparks

        this.spark_amount = 50;
        this.reactor_sparks = new Array(this.reactors.length);
        this.timer = 0;
        this.max_timer = 100;

        for (var r = 0 ; r < this.reactors.length ; r++){
            this.reactor_sparks[r] = new Array(this.spark_amount);
            for (var i = 0 ; i < this.spark_amount ; i++){
                this.reactor_sparks[r][i] = null;
            }
        }
    }

    //------------------------------------------------------------------------------------------------
    // Class functions
    //------------------------------------------------------------------------------------------------

    create_sparks(){
        for (var r = 0 ; r < this.reactors.length ; r++){
            for (var i = 0 ; i < this.spark_amount ; i++){
                if (this.reactor_sparks[r][i] == null){
                    if (this.engine_status == true){
                        if (this.timer == 0){
                            this.reactor_sparks[r][i] = new Reactor_spark(  this.app, 
                                                                            this.spaceship_container, 
                                                                            this.reactors[r].x + this.slot_size/2, 
                                                                            this.reactors[r].y + this.slot_size/2, 
                                                                            this.spaceship_container.rotation, 
                                                                            this.pixel_size, 
                                                                            this.Graphics, 
                                                                            this.spark_texture  );
                            this.timer = this.max_timer;
                            bringToFront(this.reactors[r]);
                        }
                        else{
                            this.timer -= 1;
                        }
                    }
                }
                else if (this.reactor_sparks[r][i].rectangle.width <= 0.2){
                    this.reactor_sparks[r][i].destroy();
                    delete this.reactor_sparks[r][i];
                    this.reactor_sparks[r][i] = null;
                }
                else{
                    this.reactor_sparks[r][i].update()
                }
            }
        }
    }

    toggle_sprite(){
        this.is_on_map_mode = !this.is_on_map_mode;
        if (this.is_on_map_mode){
            this.app.stage.removeChild(this.spaceship_container);
            this.app.stage.addChild(this.mini_spaceship_container);
        }
        else{
            this.app.stage.removeChild(this.mini_spaceship_container);
            this.app.stage.addChild(this.spaceship_container);
        } 
    }

    bind_steering_wheel(steering_wheel_sprite){
        this.steering_wheel = steering_wheel_sprite;
    }

    show(){
        this.app.stage.addChild(this.spaceship_container);
        this.active = true;
    }

    hide(){
        this.app.stage.removeChild(this.spaceship_container);
        this.active = false;
    }

    update(){

        // Steering Wheel

        if (this.spaceship_rotation == 1){
            this.spaceship_rotation_speed = Math.min(this.spaceship_rotation_speed + 0.0002, 0.02);
        }
        else if (this.spaceship_rotation == -1){
            this.spaceship_rotation_speed = Math.max(this.spaceship_rotation_speed - 0.0002, -0.02);
        }
        else{
            if ((this.spaceship_rotation_speed > 0.0002) || (this.spaceship_rotation_speed < -0.0002)){
                this.spaceship_rotation_speed += 0.0002 * -Math.sign(this.spaceship_rotation_speed);
            }
            else{
                this.spaceship_rotation_speed = 0;
            }
        }
        this.spaceship_container.rotation += this.spaceship_rotation_speed;
        this.mini_spaceship_container.rotation += this.spaceship_rotation_speed;
        if (this.steering_wheel != null){
            this.steering_wheel.Steering_wheel_sprite.rotation = this.spaceship_rotation_speed * 50;
        }

        // Create reactor sparks

        this.create_sparks(this.spark_texture);
        
    }

}

class Reactor_spark{
    constructor(app, container, _x, _y, direction, pixel_size, Graphics){
        this.pixel_size = pixel_size;
        this.container = container;

        this.spark_size = Math.random() * pixel_size * 2 + 6;
        this.dispersion = Math.random() * 0.1 - 0.05;

        
        const colors = [0x5E5E70, 0xE6E6FF, 0x5E5E70, 0x7A7A91, 0x8E8EAB, 0xA0A0BF, 0xBEBEE3];
        const random = Math.floor(Math.random() * colors.length);

        this.rectangle = new Graphics();
        this.rectangle.beginFill(colors[random]);

        this.rectangle.drawRect( -this.spark_size/2, -this.spark_size/2, this.spark_size, this.spark_size);
        this.rectangle.pivot.set(0, 0);
        this.rectangle.position.set(_x,_y);

        this.rectangle.endFill();
        
        this.container.addChild(this.rectangle);
        //console.log(_x,_y,this.spark_size,this.rectangle.pivot.x,this.rectangle.pivot.y);
        
        //app.stage.addChild(this.rectangle);

        
    }

    update(){
        //console.log(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
        //this.spark_size -= 0.05;
        this.rectangle.width -= 0.2;
        this.rectangle.height -= 0.2;

        //this.rectangle.rotation += 0.05;
        this.rectangle.x -= this.rectangle.width / (this.pixel_size * 3);
        this.rectangle.y -= this.dispersion / (this.pixel_size * 3);
        /*
        this.rectangle.width = this.rectangle.width - this.pixel_size * 0.01;
        this.rectangle.height = this.rectangle.height - this.pixel_size * 0.01;
        */
    }

    destroy(){
        this.container.removeChild(this.rectangle);
        this.rectangle = null;
    }
}

// Dashboard ----------------------------------------------------------------------------------------------------------------------------

export function create_button(app, pixel_size, button_function, _x, _y, path_filename, animation_length){
        // Init animation frames & Sprite

        var button_status = false;
        var button_animation = new Array();
        var anim_index_button = 0;
    
        for (var i = 0 ; i < animation_length  ; i++){
            var new_texture = PIXI.Texture.from('../images/' + path_filename + i + '.png');
            button_animation.push(new_texture);
        }
    
        var sButton = new PIXI.Sprite(button_animation[anim_index_button]);
        sButton.scale.set(pixel_size, pixel_size);
    
        app.stage.addChild(sButton);
    
        sButton.interactive = true;
        sButton.buttonMode = true;
    
        sButton.position.set(_x, _y);
    
        // Clic & Animation
    
        function Button_anim(){
            if (button_status){
                if (anim_index_button != animation_length - 1){
                    anim_index_button += 1;
                    sButton.texture = button_animation[anim_index_button];
                    setTimeout(Button_anim, 50);
                }
            }
            else{
                if (anim_index_button != 0){
                    anim_index_button -= 1;
                    sButton.texture = button_animation[anim_index_button];
                    setTimeout(Button_anim, 50);
                }
            }
        }
    
        sButton.on('pointerdown', function(){
            if (anim_index_button == 0 || anim_index_button == animation_length - 1){ // prevent spamming
                button_status = !button_status;
                if (button_function != null){
                    setTimeout(button_function, 50 * button_animation.length);
                }
                Button_anim();
            }
        });



        return sButton;
}

export function create_text(app, pixel_size, _x, _y, path_filename, anchor_x, anchor_y){
    const stext = new PIXI.Sprite.from('../images/' + path_filename + '.png'); 
    app.stage.addChild(stext);
    stext.scale.set(pixel_size, pixel_size);
    stext.anchor.set(anchor_x, anchor_y);
    stext.position.set(_x, _y);
    

    return stext;
}

export class Steering_wheel {
    constructor(app, pixel_size, _x , _y){
        this.Steering_wheel_sprite = PIXI.Sprite.from('../images/dashboard/steering_wheel.png');
        this.app = app;
        this.Steering_wheel_sprite.scale.set(pixel_size, pixel_size);
        this.Steering_wheel_sprite.anchor.set(0.5, 0.5);
        this.Steering_wheel_sprite.position.set(_x, _y);
        this.app.stage.addChild(this.Steering_wheel_sprite);
    }
}

// Statistics ---------------------------------------------------------------------------------------------------------------------------

export class StatBar {

    constructor(app, pixel_size, _x, _y){
        this.pixel_size = pixel_size;
        this.sStat_unite = PIXI.Sprite.from('../images/Stats/Stat_unite.png');
        app.addChild(this.sStat_unite);
        this.sStat_unite.scale.set(pixel_size, pixel_size);
        this.sStat_unite.anchor.set(1,0);
        this.sStat_unite.position.set(_x + 120 * pixel_size + 4 * pixel_size, _y + 4 * pixel_size);
        this.sStat_unite.width = 0;

        const sBar = new PIXI.Sprite.from('../images/Stats/Stat_Bar.png');
        app.addChild(sBar);
        sBar.scale.set(pixel_size, pixel_size);
        sBar.position.set(_x, _y);
    }

    set_StatBar(percentage){
        this.sStat_unite.width = percentage * 120 * this.pixel_size;
    }
}

export class Stat_item {
    constructor(app, pixel_size, _x, _y, path_filename){
        this.sStat_item = PIXI.Sprite.from('../images/' + path_filename + '.png');
        app.addChild(this.sStat_item);
        this.sStat_item.scale.set(pixel_size, pixel_size);
        this.sStat_item.position.set(_x , _y);
        this.active = false;
    }
}

export class Stat{
    constructor(app, pixel_size, crew_size, _x, _y){

        this.Stat_container = new PIXI.Container();
        this.Stat_container.position.set(_x, _y); 
        
        // SpaceShip Health
        this.health_Stat_item = new Stat_item(this.Stat_container, pixel_size, 0, pixel_size * 3, "Stats/health");
        this.spaceship_health = new StatBar(this.Stat_container, pixel_size, pixel_size * 15, 0);
        this.spaceship_health.set_StatBar(0.9);

        // Fuel
        this.fuel_Stat_item = new Stat_item(this.Stat_container, pixel_size, 0, pixel_size * 23, "Stats/fuel");
        this.spaceship_fuel = new StatBar(this.Stat_container, pixel_size, pixel_size * 15, pixel_size * 21);
        this.spaceship_fuel.set_StatBar(0.65);

        // Crew
        this.screw = new Array();
        for (var i = 0 ; i < crew_size ; i++){
            this.screw.push(new Stat_item(this.Stat_container, pixel_size, pixel_size * 15 * i, pixel_size * 43, "Stats/crew"));
        }

        // Well being
        this.food_Stat_item = new Stat_item(this.Stat_container, pixel_size, 0, pixel_size * 63, "Stats/well_being");
        this.spaceship_fuel = new StatBar(this.Stat_container, pixel_size, pixel_size * 15, pixel_size * 60);
        this.spaceship_fuel.set_StatBar(0.55);

        // Food
        this.food_Stat_item = new Stat_item(this.Stat_container, pixel_size, 0, pixel_size * 83, "Stats/food");
        this.spaceship_fuel = new StatBar(this.Stat_container, pixel_size, pixel_size * 15, pixel_size * 80);
        this.spaceship_fuel.set_StatBar(0.95);

        // Water
        this.food_Stat_item = new Stat_item(this.Stat_container, pixel_size, 0, pixel_size * 103, "Stats/water");
        this.spaceship_fuel = new StatBar(this.Stat_container, pixel_size, pixel_size * 15, pixel_size * 100);
        this.spaceship_fuel.set_StatBar(0.15);

        app.stage.addChild(this.Stat_container);
    }
}

// Info ----------------------------------------------------------------------------------------------------------------------------------

export class Info {
    constructor(app, pixel_size){
        this.app = app;

        this.info_container = new PIXI.Container();
        this.info_container.position.set(pixel_size * 10, pixel_size * 10);
        this.info_container.scale.set(pixel_size, pixel_size);
        

        this.Info_sprite = PIXI.Sprite.from('../images/info/info.png');
        this.Info_background_sprite = PIXI.Sprite.from('../images/info/info_background.png');

        // Text -----------------------------------------------------

        this.info_text_array = new Array();

        const style = new PIXI.TextStyle({
            fontFamily: "Consolas",
            fontSize: this.pixel_size,
            fill: 'green'
        });

        // Console_header
        var Console_text = new PIXI.Text('Potato Corp (c) [version 88.0.1901.666]', style);
        Console_text.position.set(10, 10);
        this.info_text_array.push(Console_text);

        // Console_input
        var Console_input = new PIXI.Text('~K:\\Potato> info -p', style);
        Console_input.position.set(10, 20);
        this.info_text_array.push(Console_input);

        // Fuel_info
        var Fuel_info = new PIXI.Text('fuel : 12d-5h-12m left', style);
        Fuel_info.position.set(170, 30);
        this.info_text_array.push(Fuel_info);

        // Crew_info
        var Crew_info = new PIXI.Text('crew : 5 left', style);
        Crew_info.position.set(170, 50);
        this.info_text_array.push(Crew_info);

        // Well_being_info
        var Well_being_info = new PIXI.Text('well being : ok', style);
        Well_being_info.position.set(170, 70);
        this.info_text_array.push(Well_being_info);

        // Food_info
        var Food_info = new PIXI.Text('food : 12d-5h-12m left', style);
        Food_info.position.set(170, 90);
        this.info_text_array.push(Food_info);

        // Water_info
        var Water_info = new PIXI.Text('water : 12d-5h-12m left', style);
        Water_info.position.set(170, 110);
        this.info_text_array.push(Water_info);

        // Add to container ------------------------------------------------------------------------------

        this.info_container.addChild(this.Info_background_sprite);
        for (var i = 0 ; i < this.info_text_array.length ; i++){
            this.info_container.addChild(this.info_text_array[i]);
        }
        this.info_container.addChild(this.Info_sprite);

    }

    update_Fuel_info(new_text){
        this.info_text_array[2].text = new_text;
    }

    update_Crew_info(new_text){
        this.info_text_array[3].text = new_text;
    }

    update_Well_being_info(new_text){
        this.info_text_array[4].text = new_text;
    }
    
    update_Food_info(new_text){
        this.info_text_array[5].text = new_text;
    }

    update_Water_info(new_text){
        this.info_text_array[6].text = new_text;
    }

    show(){
        this.app.stage.addChild(this.info_container);
        this.active = true;
    }

    hide(){
        this.app.stage.removeChild(this.info_container);
        this.active = false;
    }
}

// Map -----------------------------------------------------------------------------------------------------------------------------------

class Pixelated_Circle {
    constructor(Graphics, pixel_size, parent, x, y, r, color){
        this.x = x;
        this.y = y;
        this.r = Math.floor(r + r%2); // even number
        this.parent = parent;

        // DRAW CIRCLE -----------------------------------------

        // Init

        this.circle_container = new PIXI.Container();

        function distance(x1, y1, x2, y2){
            return Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2)); 
        }

        var list = new Array();

        var drawY = r;
        var drawX = 0;
        while (drawY != 0){
            while (distance(0, 0, drawX, drawY-1) < r){
                drawX++;
            }
            if ((distance(0, 0, drawX, drawY-1) >= r) && (drawY > 0)){
                list.push([drawX, drawY]);
            }
            while ((distance(0, 0, drawX, drawY-1) >= r) && (drawY > 0)){
                drawY--;
            }
        }

        for (var i = 0 ; i < list.length ; i++){
            const rect = new Graphics();
            rect.beginFill(color);
            rect.drawRect((r - list[i][0]) * pixel_size, (r - list[i][1]) * pixel_size, list[i][0] * 2 * pixel_size, list[i][1] * 2 * pixel_size);
            rect.endFill();

            /*
            const rect = new Graphics();
            rect.beginFill(color);
            rect.drawRect(x-list[i][0], y-list[i][1], list[i][0] * 2 * pixel_size, list[i][1] * 2 * pixel_size);
            rect.endFill();*/

            this.circle_container.addChild(rect);
        }

        this.circle_container.pivot.set(this.circle_container.width / 2, this.circle_container.height / 2);
        this.circle_container.position.set(x, y);
        //this.circle_container.scale.set(pixel_size, pixel_size);
        this.parent.addChild(this.circle_container);
    }
}

export class Map {
    constructor(app, Graphics, pixel_size){
        this.app = app;
        this.Graphics = Graphics;
        this.pixel_size = pixel_size;
        this.active = false;

        this.map_container = new PIXI.Container();
        this.Objects_array = new Array(); // [[x1,y1,r1], [x2,y2,r2],  ... ]

        this.Objects_array.push([200, 200, 50]); // 
        /*
        for (var i = 0 ; i < this.Objects_array.length ; i++){
            
            var circle = new this.Graphics();
            circle.beginFill(0x22AACC);
            circle.drawCircle(this.Objects_array[i][0] * pixel_size, this.Objects_array[i][1] * pixel_size, this.Objects_array[i][2] * pixel_size);
            circle.endFill();
        }
        */

        var planet_1 = new Pixelated_Circle(Graphics, pixel_size, this.map_container, 200 * pixel_size, 200 * pixel_size, 30, getRandomColor());
        var planet_2 = new Pixelated_Circle(Graphics, pixel_size, this.map_container, 50 * pixel_size, 50 * pixel_size, 10, getRandomColor());
        var planet_3 = new Pixelated_Circle(Graphics, pixel_size, this.map_container, 400 * pixel_size, 250 * pixel_size, 100, getRandomColor());

        // cache

        this.cache_rect = new Graphics();
        this.cache_rect.beginFill(0x18213B);
        this.cache_rect.drawRect(0, pixel_size * 232, window.innerWidth, window.innerHeight - pixel_size * 210);
        this.cache_rect.endFill();

        
    }

    show(){
        this.app.stage.addChild(this.map_container);
        this.app.stage.addChild(this.cache_rect);
        this.active = true;
    }

    hide(){
        this.app.stage.removeChild(this.map_container);
        this.app.stage.removeChild(this.cache_rect);
        this.active = false;
    }
}

// Game ---------------------------------------------------------------------------------------------------------------------------------

export class Game {
    constructor (){
        // get server info

        this.velocity = 5;
        this.direction = 0;

        // info

        this.Space_Objects_array = [];
        this.Players_array = [];

        // stat

        this.spaceship_health = 0.9;
        this.spaceship_fuel = 0.8;
        this.crew_size = 4;
        this.crew_food = 0.7;
        this.crew_well_being = 0.6;
    }

    fetch_data(){
        // fetch all 30 secondes
    }

    push_data(){
        // push at all changement
    }
}
