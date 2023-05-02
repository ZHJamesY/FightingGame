// assets render class
class Assets
{
    // constructor define position x,y, and velocity
    constructor({position, imageSrc, scale = 1, framesTotal = 1, offset = {x:0, y:0}})
    {
        // character position
        this.position = position;

        // create image
        this.image = new Image();

        // set image source
        this.image.src = imageSrc;

        // image scale and frames
        this.scale = scale;
        this.framesTotal = framesTotal;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;

        // adjust asset position
        this.offset = offset;

    }

    // frames animation
    animateFrames()
    {
        this.framesElapsed++

        // frames speed
        if(this.framesElapsed % this.framesHold == 0)
        {
            if(this.framesCurrent < this.framesTotal - 1)
            {
                this.framesCurrent++
            }
            else
            {
                this.framesCurrent = 0
            }
        }
    }

    // draw assets
    draw()
    {
        ctx.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width/this.framesTotal), //crop start position x
            0, //crop start position y
            this.image.width/this.framesTotal, //crop width
            this.image.height, //crop height
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width/this.framesTotal) * this.scale,
            this.image.height * this.scale
            );
    }

    // updates new position
    update()
    {
        this.draw();
        this.animateFrames();

    }
}

// character sprite class: extends Assets class
class Sprite extends Assets
{
    // constructor define position x,y, and velocity
    constructor({position, velocity, color, imageSrc, scale = 1, framesTotal = 1, 
        offset = {x:0, y:0}, sprites, 
        attackBox = {offset: {}, width: undefined, height: undefined}})
    {
        // call constructor of parent
        super({position, imageSrc, scale, framesTotal, offset})

        // frames variables
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;

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
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        };
        this.color = color;
        // check if player currently attacking
        this.isAttacking = false;
        this.attackMoves = 'none';

        this.health = 100;

        this.sprites = sprites;

        for(let sprite in this.sprites)
        {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    // updates new position
    update(player)
    {
        this.draw();

        this.animateFrames();

        // adjust attackBox facing
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

        // position + velocity.y every update
        this.position.y += this.velocity.y;

        // position + velocity.x every update
        this.position.x += this.velocity.x;

        // stops when reach bottom of canvas, else increase speed
        if(this.position.y + CHAR_HEIGHT + this.velocity.y >= HEIGHT)
        {
            this.velocity.y = 0;
            this.position.y = 430;
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
    attack(moves)
    {
        // attack do ...
        this.switchSprites(moves);
        this.isAttacking = true;
        this.attackMoves = moves;

    }

    // correspond image for different sprite cases
    switchSprites(sprite)
    {
        if(this.image == this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesTotal - 1) return
        if(this.image == this.sprites.attack2.image && this.framesCurrent < this.sprites.attack2.framesTotal - 1) return


        switch (sprite)
        {
            case 'idle':
                if(this.image != this.sprites.idle.image)
                {
                    this.image = this.sprites.idle.image;
                    this.framesTotal = this.sprites.idle.framesTotal;

                    // set frame start back to 0 when change sprite
                    this.framesCurrent = 0;

                }
                break 
            case 'run':
                if(this.image != this.sprites.run.image)
                {
                    this.image = this.sprites.run.image;
                    this.framesTotal = this.sprites.run.framesTotal;
                    this.framesCurrent = 0;

                }
                break
            case 'jump':
                if(this.image != this.sprites.jump.image)
                {
                    this.image = this.sprites.jump.image;
                    this.framesTotal = this.sprites.jump.framesTotal;
                    this.framesCurrent = 0;

                }
                break
            case 'fall':
                if(this.image != this.sprites.fall.image)
                {
                    this.image = this.sprites.fall.image;
                    this.framesTotal = this.sprites.fall.framesTotal;
                    this.framesCurrent = 0;

                }
                break
            case 'attack1':
                if(this.image != this.sprites.attack1.image)
                {
                    this.image = this.sprites.attack1.image;
                    this.framesTotal = this.sprites.attack1.framesTotal;
                    this.framesCurrent = 0;

                }
                break
            case 'attack2':
                if(this.image != this.sprites.attack2.image)
                {
                    this.image = this.sprites.attack2.image;
                    this.framesTotal = this.sprites.attack2.framesTotal;
                    this.framesCurrent = 0;

                }
                break
        }
    }
}