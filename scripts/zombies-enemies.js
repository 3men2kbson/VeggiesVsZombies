Quintus.ZombiesEnemies = function(Q) {
    
    //Types of Zoombies
    Q.zombieTypes = {
        basic: {
            asset: "zombie1.png",  //image file
            vx: -8,   //speed,
            damage: 1,
            energy: 10
        },
        
        skelleton: {
            asset: "zombie2.png",
            vx: -10,
            damage: 1,
            energy: 10
        },
        
        chicken: {
            asset: "chicken.png",
            vx: -20,
            damage: 0.5,
            energy: 3
        },
        
        hatzombie: {
            asset: "zombie2.png",
            vx: -9,
            damage: 1,
            energy: 35
        }
    };
    
    //zombie
  Q.Sprite.extend('Zombie', {
    init: function(p) {
      this._super(p, { 
          type: Q.SPRITE_ZOMBIE,
          collisionMask: Q.SPRITE_PLANT | Q.SPRITE_BULLET,
          x: 1080+60,
      });
      this.add('2d');

      this.p.originalVx = this.p.vx;

      this.on("bump.left",function(collision) {

        if(collision.obj.isA('Plant')) {
          //if exploding plant, take damage and destroy plant, otherwise just damage plant
          if(collision.obj.p.isExploding) {
            this.p.energy -= collision.obj.p.damage;
            Q.audio.play('boom.mp3');
            collision.obj.destroy();
          }
          else {
            collision.obj.takeDamage(this.p.damage);
          }                    
        }
        else if(collision.obj.isA('Bullet')) {
          this.p.energy -= collision.obj.p.damage;
          Q.audio.play('hit.mp3');
          collision.obj.destroy();
        }            
        this.p.vx = this.p.originalVx;
      });
    },
    step: function(dt) {
      if(this.p.x <= 240) {
        this.destroy();
        console.log('The zombies ate your brain!');  
        //restart game                          
        Q.stageScene('level', {levelData: Q('Level').items[0].p.levelData});           
      }
      //check for death
      if(this.p.energy <= 0) {
        this.destroy();
      }
    }
  });
}