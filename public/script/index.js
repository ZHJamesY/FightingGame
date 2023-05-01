
// constant variables
const HEIGHT = 580;
const WIDTH = 1024;
const CHAR_HEIGHT = 150;
const CHAR_WIDTH = 50;
const GRAVITY = 0.2;
const PLAYER1_KEYS = {
    a:{pressed: false}, 
    d:{pressed: false}, 
    w:{pressed: false, occurred: 0}
};

const PLAYER2_KEYS = {
    a:{pressed: false}, 
    d:{pressed: false}, 
    w:{pressed: false, occurred: 0}
};
$(document).ready(function() {
    // character sprite class
    class Sprite
    {
        // constructor define position x,y, and velocity
        constructor({position, velocity, color, offset})
        {
            // character position
            this.position = position;
            // moving speed
            this.velocity = velocity;
            // keep track of last key pressed
            this.lastKey;
            // attack box
            this.attackBox = {
                position: {
                    x: this.position.x,
                    y: this.position.y
                },
                // attack box initial position
                offset,
                width: 100,
                height: 50
            };
            this.color = color;
            // check if player currently attacking
            this.isAttacking = false;
            // attack animation on/off
            this.attackAnimation = false
            this.health = 100;
        }

        // draw object
        draw()
        {
        
            ctx.fillStyle = this.color;
            // character rect
            ctx.fillRect(this.position.x, this.position.y, CHAR_WIDTH, CHAR_HEIGHT);

            if(this.attackAnimation == true)
            {
                ctx.fillStyle = 'white';
                // attackBox rect
                ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
            }
        }

        // updates new position
        update(player)
        {
            this.draw();

            // adjust attackBox facing
            this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
            this.attackBox.position.y = this.position.y;

            // position + velocity.y every update
            this.position.y += this.velocity.y;

            // position + velocity.x every update
            this.position.x += this.velocity.x;

            // stops when reach bottom of canvas, else increase speed
            if(this.position.y + CHAR_HEIGHT + this.velocity.y >= HEIGHT)
            {
                this.velocity.y = 0;
                if(player == 'player1')
                {
                    PLAYER1_KEYS.w.occurred = 0;
                }
                else if(player == 'player2')
                {
                    PLAYER2_KEYS.w.occurred = 0;
                }
            }
            else
            {
                this.velocity.y += GRAVITY;
                if(player == 'player1')
                {
                    PLAYER1_KEYS.w.occurred = 1;
                }
                else if(player == 'player2')
                {
                    PLAYER2_KEYS.w.occurred = 1;
                }
            }
        }

        // assign true to isAttacking
        attack()
        {
            this.isAttacking = true;
            this.attackAnimation = true;

            // attack false after 100 milliseconds
            setTimeout(function(){
                this.isAttacking = false;
                this.attackAnimation = false;
            }.bind(this), 100)
        }
    }

    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // player1 instance
    const player1 = new Sprite({
        position:{
            x:0 + 200,
            y:0 + 100
        },
        velocity:{
            // 2-dimensional velocity moving left-right, up-down
            // 0: not moving by default
            x:0,
            y:0
        },
        color: 'red',
        offset:{
            x:0,
            y:0
        }
    });

    // player2 instance
    const player2 = new Sprite({
        position:
        {
            x:canvas.width - 200 - CHAR_WIDTH,
            y:0 + 100
        },
        velocity:
        {
            x:0,
            y:0
        },
        color: 'blue',
        offset:{
            x:-CHAR_WIDTH,
            y:0
        }
    });

    // detect rectangle collision
    function rectangleCollision({rectangle1,rectangle2})
    {
        return (
            rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
            && rectangle1.attackBox.position.x <= rectangle2.position.x + CHAR_WIDTH
            && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
            && rectangle1.attackBox.position.y <= rectangle2.position.y + CHAR_HEIGHT
        )
    }

    // animation infinite loop
    function animation()
    {
        // loop over animation function 
        window.requestAnimationFrame(animation);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        player1.update('player1');
        player2.update('player2');

        // initial x velocity is 0
        player1.velocity.x = 0;
        player2.velocity.x = 0;

        // player1 movements w: jump
        if(PLAYER1_KEYS.w.pressed)
        {
            if(PLAYER1_KEYS.w.occurred == 0)
            {
                player1.velocity.y = -10;
            }
        }

        // player2 movements w: jump
        if(PLAYER2_KEYS.w.pressed)
        {
            if(PLAYER2_KEYS.w.occurred == 0)
            {
                player2.velocity.y = -10;
            }
        }

        // player1 movements a: left, d: right 
        if(PLAYER1_KEYS.a.pressed && player1.lastKey == 'a')
        {
            player1.velocity.x = -2.5;
        }
        else if(PLAYER1_KEYS.d.pressed && player1.lastKey == 'd')
        {
            player1.velocity.x = 2.5;
        }
        else if(PLAYER1_KEYS.a.pressed)
        {
            player1.velocity.x = -2.5;
        }
        else if(PLAYER1_KEYS.d.pressed)
        {
            player1.velocity.x = 2.5;
        }   
        
        // player2 movements a: left, d: right 
        if(PLAYER2_KEYS.a.pressed && player2.lastKey == 'a')
        {
            player2.velocity.x = -2.5;
        }
        else if(PLAYER2_KEYS.d.pressed && player2.lastKey == 'd')
        {
            player2.velocity.x = 2.5;
        }
        else if(PLAYER2_KEYS.a.pressed)
        {
            player2.velocity.x = -2.5;
        }
        else if(PLAYER2_KEYS.d.pressed)
        {
            player2.velocity.x = 2.5;
        } 

        // detect for attack collision for player1
        if(rectangleCollision({rectangle1: player1, rectangle2: player2}) && player1.isAttacking)
        {
            player1.isAttacking = false;

            player2.health -= 10;
            document.getElementById('rightHealthDecrease').style.width = player2.health + '%';

            console.log("player1 attacking")
        }

        // detect for attack collision for player2
        if(rectangleCollision({rectangle1: player2, rectangle2: player1}) && player2.isAttacking)
        {
            player2.isAttacking = false;

            player1.health -= 10;
            document.getElementById('leftHealth').style.width = player1.health + '%';

            console.log("player2 attacking")
        }

    }

    animation();

    // key down event
    $(document).keydown(function(event){
        switch(event.key)
        {
            // player1 cases
            case 'w':
                PLAYER1_KEYS.w.pressed = true;
                break;
            case 'a':
                PLAYER1_KEYS.a.pressed = true;
                player1.lastKey = 'a';
                break
            case 'd':
                PLAYER1_KEYS.d.pressed = true;
                player1.lastKey = 'd';
                break
            case 'j':
                player1.attack();
                break


            // player2 cases
            case 'ArrowUp':
                PLAYER2_KEYS.w.pressed = true;
                break;
            case 'ArrowLeft':
                PLAYER2_KEYS.a.pressed = true;
                player2.lastKey = 'a';
                break
            case 'ArrowRight':
                PLAYER2_KEYS.d.pressed = true;
                player2.lastKey = 'd';
                break
            case '1':
                player2.attack();
                break


        }
        console.log(event.key, 'down');
    });

    // key up event
    $(document).keyup(function(event){
        // player1 cases
        switch(event.key)
        {
            case 'w':
                PLAYER1_KEYS.w.pressed = false;
                break;
            case 'a':
                PLAYER1_KEYS.a.pressed = false;
                break
            case 'd':
                PLAYER1_KEYS.d.pressed = false;
                break   

            // player2 cases
            case 'ArrowUp':
                PLAYER2_KEYS.w.pressed = false;
                break;
            case 'ArrowLeft':
                PLAYER2_KEYS.a.pressed = false;
                break
            case 'ArrowRight':
                PLAYER2_KEYS.d.pressed = false;
                break
   
              
        }
        console.log(event.key, 'up');
    });



});


