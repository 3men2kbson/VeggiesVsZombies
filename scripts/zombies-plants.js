Quintus.ZombiesPlants = function(Q) {
        
    //Plants Types
    Q.plantTypes = {
        
        carnivorous: {
            asset: 'carnivorousplant.png',
            cost: 100,
            energy: 10,
            isShooter: true,
            shootingFrequency: 3,
            damage: 2,
        },
        
        corn: {
            asset: 'corn.png',
            cost: 150,
            energy: 20,
            isShooter: true,
            shootingFrequency: 5,
            damage: 3,
        },
        
        chilli: {
            asset: 'chilli.png',
            cost: 50,
            energy: 10,
            isExploding: true,
            damage: 50,
        },
        
        sunflower: {
            asset: 'sunflower.png',
            cost: 75,
            energy: 15,
            isSunProducer: true,
            sunFrequency: 8,
        }
        
    };
    
    //Plants
    Q.Sprite.extend("Plant", {
        init: function(p) {
            this._super(p, {
                type: Q.SPRITE_PLANT,
            });
            
            this.add('2d');
            
            //init timer for shooters
            if(this.p.isShooter) {
                this.p.timeToShoot = this.p.shootingFrequency;
            }
            
            //init timer for sun producers
            if(this.p.isSunProducer) {
                this.p.timeToSun = this.p.sunFrequency;
            }
            
        },
        
        step: function(dt) {
            
            //shooter plants
            if(this.p.isShooter) {
                this.p.timeToShoot -= dt;
                
                if(this.p.timeToShoot <= 0) {
                    this.p.timeToShoot = this.p.shootingFrequency;
                    
                    //create new bullet
                    this.stage.insert(new Q.Bullet({
                        x: this.p.x,
                        y: this.p.y,
                        damage: this.p.damage
                    }));
                }
            }
            
            //plants that produce sun
            if(this.p.isSunProducer) {
                this.p.timeToSun -= dt;
                
                if(this.p.timeToSun <= 0) {
                    this.p.timrToSun = this.p.sunFrequency;
                    
                    //create new sun and add to the sun stage
                    Q.stage(1).insert(new Q.Sun({
                        x: this.p.x - 50 + 100*Math.random(),
                        y: this.p.y,
                        finalY: this.p.y,
                        vy: 0,
                    }));
                }
            }
            
            //check for death
            if(this.p.energy <= 0) {
                this.destroy();
            }
        },
        
        takeDamage: function(damage) {
            this.p.energy -= damage/50;
//            console.log(this.p.energy);
        },
        
        destroy: function() {
            Q("Level").first().plantsGrid[this.p.gridRow][this.p.gridCol] = null;
            this._super();
        }
        
    });
    
     //Sun
    Q.Sprite.extend("Sun", {
        init: function(p) {
            this._super(p, {
                asset: "sun.png",
                type: Q.SPRITE_SUN,
                y: -120,
                x: 300 + Math.random() * (1080-360),
                vy: 80,
                finalY: 60 + Math.random() * (720 - 60),
                expirationTime: 3
            });
            
            this.add("2d");
            
            this.on("touch");
            
        },
        
        step: function(dt) {
            //when it reaches it's final destination, stop velocity in y
            if(this.p.y >= this.p.finalY) {
                this.p.vy = 0;

                //when reaches the end start counting time
                this.p.expirationTime -= dt;

                if(this.p.expirationTime <= 0) {
                    this.destroy();
                }
            }                        
        },
        
        touch: function(touch) {
//            console.log(touch);
//            console.log("touching sun");
            Q.state.inc("sun", 25);
            Q.audio.play('collect.mp3');
            this.destroy();
        }
    });
    
    //Bullets
    Q.Sprite.extend("Bullet", {
        init: function(p) {
            this._super(p, {
                type: Q.SPRITE_BULLET,
                asset: 'bullet.png',
                vx: 300
            });
            
            this.add('2d');
            
        },
        
        step: function(dt) {
            //destroy if out of range
            if(this.p.x >= 1110) {
                this.destroy();
            }
        }
    });
    
}