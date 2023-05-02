
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

const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

canvas.width = WIDTH;
canvas.height = HEIGHT;

ctx.fillRect(0, 0, WIDTH, HEIGHT);

const background = new Assets({
    position:{
        x:0,
        y:-220
    },
    imageSrc: './image/Free Pixel Art Hill/Background-ByEdermuniz.png'
    
});

// player1 instance
const player1 = new Sprite({
    position:{
        x:0 + 200,
        y:0 + 200
    },
    velocity:{
        // 2-dimensional velocity moving left-right, up-down
        // 0: not moving by default
        x:0,
        y:0
    },
    color: 'red',
    imageSrc: './image/EVil Wizard 2/Sprites/Idle.png',
    framesTotal: 8,
    scale:3.0,
    offset: {
        x:335,
        y:365
    },
    sprites: {
        idle: {
            imageSrc: './image/EVil Wizard 2/Sprites/Idle.png',
            framesTotal: 8
        },
        run: {
            imageSrc: './image/EVil Wizard 2/Sprites/Run.png',
            framesTotal: 8
        },
        jump: {
            imageSrc: './image/EVil Wizard 2/Sprites/Jump.png',
            framesTotal: 2
        },
        fall: {
            imageSrc: './image/EVil Wizard 2/Sprites/Fall.png',
            framesTotal: 2
        },
        attack1: {
            imageSrc: './image/EVil Wizard 2/Sprites/Attack1.png',
            framesTotal: 8,
            hitFrame: 5 - 1
        },
        attack2: {
            imageSrc: './image/EVil Wizard 2/Sprites/Attack2.png',
            framesTotal: 8,
            hitFrame: 6 - 1
        },
        takeHit: {
            imageSrc: './image/EVil Wizard 2/Sprites/Take hit.png',
            framesTotal: 3
        },
        death: {
            imageSrc: './image/EVil Wizard 2/Sprites/Death.png',
            framesTotal: 7
        }
    },
    attackBox: {
        offset: {
            x:0 - 3,
            y:0
        },
        width:340,
        height: 50
    }
});

// player2 instance
const player2 = new Sprite({
    position:
    {
        x:canvas.width - 200 - CHAR_WIDTH,
        y:0 + 200
    },
    velocity:
    {
        x:0,
        y:0
    },
    color: 'blue',
    imageSrc: './image/Fantasy Warrior/Sprites/Idle.png',
    framesTotal: 8,
    scale:4.0,
    offset: {
        x:295,
        y:270
    },
    sprites: {
        idle: {
            imageSrc: './image/Fantasy Warrior/left/Idle.png',
            framesTotal: 10,
        },
        run: {
            imageSrc: './image/Fantasy Warrior/left/Run.png',
            framesTotal: 8
        },
        jump: {
            imageSrc: './image/Fantasy Warrior/left/Jump.png',
            framesTotal: 3
        },
        fall: {
            imageSrc: './image/Fantasy Warrior/left/Fall.png',
            framesTotal: 3
        },
        attack1: {
            imageSrc: './image/Fantasy Warrior/left/Attack1.png',
            framesTotal: 7,
            hitFrame: 5 - 1
        },
        attack2: {
            imageSrc: './image/Fantasy Warrior/left/Attack3.png',
            framesTotal: 8,
            hitFrame: 6 - 1
        },
        takeHit: {
            imageSrc: './image/Fantasy Warrior/left/Take hit.png',
            framesTotal: 3
        },
        death: {
            imageSrc: './image/Fantasy Warrior/left/Death.png',
            framesTotal: 7
        }
    },
    attackBox: {
        offset: {
            x:-165,
            y:0
        },
        width:220,
        height: 50
    }
});

// call animation loop
animation();

// key down event
$(document).keydown(function(event){
    // if player 1 death = false, perform moves
    if(!player1.death)
    {
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
                player1.attack('attack1');
                break
            case 'k':
                player1.attack('attack2');
                break
        }
    }

    // if player 2 death = false, perform moves
    if(!player2.death)
    {
        switch(event.key)
        {
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
                player2.attack('attack1');
                break
            case '2':
                player2.attack('attack2');
                break
        }
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

// detect rectangle(attack box) collision
function rectangleCollision({rectangle1,rectangle2})
{
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + CHAR_WIDTH
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + CHAR_HEIGHT
    )
}

// player win scenario message
function gameEnd()
{
    let gameEndMsg = document.getElementById('gameEnd');

    if(player1.health <= 0)
    {
        gameEndMsg.innerHTML = 'Player2 Wins!';
        gameEndMsg.style.display = 'flex';
    }
    else if(player2.health <= 0)
    {
        gameEndMsg.innerHTML = 'Player1 Wins!';
        gameEndMsg.style.display = 'flex';
    }
}

// animation infinite loop
function animation()
{
    // game end message
    gameEnd();

    // loop over animation function 
    window.requestAnimationFrame(animation);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    background.draw();

    // fading background, makes characters more visible
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    player1.update('player1');
    player2.update('player2');

    // initial x velocity is 0
    player1.velocity.x = 0;
    player2.velocity.x = 0;

    // player1 movements a: left, d: right 
    if(PLAYER1_KEYS.a.pressed && player1.lastKey == 'a')
    {
        player1.velocity.x = -2.5;
        player1.switchSprites('run');
    }
    else if(PLAYER1_KEYS.d.pressed && player1.lastKey == 'd')
    {
        player1.velocity.x = 2.5;
        player1.switchSprites('run');
    }
    else if(PLAYER1_KEYS.a.pressed)
    {
        player1.velocity.x = -2.5;
        player1.switchSprites('run');
    }
    else if(PLAYER1_KEYS.d.pressed)
    {
        player1.velocity.x = 2.5;
        player1.switchSprites('run');
    }   
    else
    {
        // idle state if 'a' and 'd' not pressed
        player1.switchSprites('idle')
    }

    // player1 movements w: jump
    if(PLAYER1_KEYS.w.pressed)
    {
        if(PLAYER1_KEYS.w.occurred == 0)
        {
            player1.velocity.y = -11;
        }
    }
    if(player1.velocity.y < 0)
    {
        player1.switchSprites('jump');
    }
    else if(player1.velocity.y > 0)
    {
        player1.switchSprites('fall');

    }
    
    // player2 movements a: left, d: right 
    if(PLAYER2_KEYS.a.pressed && player2.lastKey == 'a')
    {
        player2.velocity.x = -2.5;
        player2.switchSprites('run');
    }
    else if(PLAYER2_KEYS.d.pressed && player2.lastKey == 'd')
    {
        player2.velocity.x = 2.5;
        player2.switchSprites('run');

    }
    else if(PLAYER2_KEYS.a.pressed)
    {
        player2.velocity.x = -2.5;
        player2.switchSprites('run');

    }
    else if(PLAYER2_KEYS.d.pressed)
    {
        player2.velocity.x = 2.5;
        player2.switchSprites('run');

    } 
    else
    {
        // idle state if 'a' and 'd' not pressed
        player2.switchSprites('idle')
    }

    // player2 movements w: jump
    if(PLAYER2_KEYS.w.pressed)
    {
        if(PLAYER2_KEYS.w.occurred == 0)
        {
            player2.velocity.y = -11;
        }
    }
    if(player2.velocity.y < 0)
    {
        player2.switchSprites('jump');
    }
    else if(player2.velocity.y > 0)
    {
        player2.switchSprites('fall');

    }

    // detect for attack collision for player1
    if(rectangleCollision({rectangle1: player1, rectangle2: player2}) 
        && player1.isAttacking
        && player1.attackMoves != 'none'
        && player1.framesCurrent == player1.sprites[player1.attackMoves].hitFrame)
    {
        player1.isAttacking = false;
        player1.attackMoves = 'none';

        // display take hit animation
        player2.takeHit(10);

        // update health bar color
        healthBarColor('rightHealthDecrease');

        // smooth heal decrease
        gsap.to('#rightHealthDecrease', {width: player2.health + '%'});

        console.log("player1 attacking")
    }

    // set attack back to false after certain attack frame
    if(player1.isAttacking && player1.framesCurrent == player1.sprites[player1.attackMoves].hitFrame)
    {
        player1.isAttacking = false;
        player1.attackMoves = 'none';
    }

    // detect for attack collision for player2
    if(rectangleCollision({rectangle1: player2, rectangle2: player1}) 
        && player2.isAttacking
        && player2.attackMoves != 'none'
        && player2.framesCurrent == player2.sprites[player2.attackMoves].hitFrame
        )
    {
        player2.isAttacking = false;
        player2.attackMoves = 'none';

        // display take hit animation
        player1.takeHit(10);

        // update health bar color
        healthBarColor('leftHealthDecrease');

        // smooth heal decrease
        gsap.to('#leftHealthDecrease', {width: player1.health + '%'});

        console.log("player2 attacking")
    }

    // set attack back to false after certain attack frame
    if(player2.isAttacking && player2.framesCurrent == player2.sprites[player2.attackMoves].hitFrame)
    {

        player2.isAttacking = false;
        player2.attackMoves = 'none';
    }

}

// update health bar color
function healthBarColor(id)
{
    let HealthBar = document.getElementById(id);
    let totalWidth = HealthBar.offsetParent.offsetWidth;

    if((HealthBar.offsetWidth/totalWidth) * 100 <= 80)
    {
        HealthBar.style.background = "linear-gradient(to right, rgb(255, 165, 0) 100%, rgb(255, 0, 0) 50%)";
    }
    if((HealthBar.offsetWidth/totalWidth) * 100 <= 40)
    {
        HealthBar.style.background = "red";
    }
}





