let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var score = 0;
var scoreText;
let BtnLeft = {};
let BtnRight = {};
let BtnUp = {};
BtnLeft.isDown = false;
BtnUp.isDown = false;
BtnRight.isDown = false;

function restartGame(stars, darkness, GameObjectPhysic, enemyes) {
    // Сбросить счетчики
    score = 0;
    stars.children.iterate(function(child) {

        child.enableBody(true, child.x, 0, true, true);
    })
    darkness.destroy();
    // enemyes.getChildren().forEach(function(bomb) {
    //   bomb.destroy();
    // });
    // enemyes.destroy();
    // Возобновить физику
    GameObjectPhysic.physics.resume();
    // Здесь можно выполнить другие действия для перезапуска игры
}

let pll1;
let LoaderText;
var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.jpg');
    this.load.image('play', 'assets/play.png');
    this.load.image('boom', 'assets/boom.png');
    this.load.image('left', 'assets/left.png');
    this.load.image('right', 'assets/right.png');
    this.load.image('up', 'assets/up.png');
    this.load.audio('backgroundMusic', 'assets/music/mp3/ce8e6287c767e45.mp3');
    this.load.audio('boomMP3', 'assets/music/mp3/zvuk-vzryva-dlya-video.mp3');
    this.load.audio('starMP3', 'assets/music/mp3/b146dc8d75d05f3.mp3');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('pol', 'assets/platformbottom.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        }
    );
    this.load.spritesheet('boomGifSprite',
        'assets/boomGif.png', {
            frameWidth: 505,
            frameHeight: 429
        }
    );
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    //Loader
    this.load.on('progress', function(value) {
        console.log(value);
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * value, 30);
        percentText.setText(parseInt(value * 100) + '%');
    });

    this.load.on('fileprogress', function(file) {
        console.log(file.src);
        assetText.setText('Загрузка ресурса: ' + file.key);
    });

    this.load.on('complete', function() {
        console.log('Завершено');
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    let loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Загрузка...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    assetText.setOrigin(0.5, 0.5);
    percentText.setOrigin(0.5, 0.5);
    loadingText.setOrigin(0.5, 0.5);
}

function create() {
    var music = this.sound.add('backgroundMusic', {
        loop: true
    });
    var starMusic = this.sound.add('starMP3', {
        loop: false
    });
    var BOOM_MP = this.sound.add('boomMP3', {
        loop: false
    });
    music.play();
    this.physics.world.gravity.y = 500;
    let SKY = this.add.image(400, 300, 'sky');
    SKY.setDisplaySize(800, 600);
    scoreText = this.add.text(16, 16, 'score: 0', {
        fontSize: '32px',
        fill: '#ffffff'
    });
    //Gamer
    player = this.physics.add.sprite(10, 450, 'dude');
    //player.setTexture('boom');
    //player.setDisplaySize(32, 48);

    //Stolknovenie

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    platforms = this.physics.add.staticGroup();
    platformsSky = this.physics.add.staticGroup();
    pll1 = platforms.create(400, 568, 'pol');
    let pl1 = platformsSky.create(100, 500, 'platform');
    let pl2 = platformsSky.create(300, 400, 'platform');
    let pl3 = platformsSky.create(500, 350, 'platform');
    pl1.displayWidth = 70;
    pl1.displayHeight = 70;
    pl2.displayWidth = 70;
    pl2.displayHeight = 70;
    pl3.displayWidth = 70;
    pl3.displayHeight = 70;
    pll1.displayWidth = 1000;
    pll1.displayHeight = 100;
    // Обновление свойств тела физики платформы "pol"
    pll1.body.immovable = true;
    // Обновление физических границ платформ
    pl1.refreshBody();
    pl2.refreshBody();
    pl3.refreshBody();
    pll1.refreshBody();
    BtnLeft = this.add.image(600, 550, 'left');
    BtnLeft.setDisplaySize(80, 80);
    BtnRight = this.add.image(713, 550, 'right');
    BtnRight.setDisplaySize(80, 80);
    BtnUp = this.add.image(655, 550, 'up');
    BtnUp.setDisplaySize(80, 80);
    BtnLeft.setInteractive();
    BtnRight.setInteractive();
    BtnUp.setInteractive();
    BtnLeft.on('pointerdown', function() {
        BtnLeft.isDown = true;
    });
    BtnLeft.on('pointerup', function() {
        BtnLeft.isDown = false;
    });
    BtnRight.on('pointerdown', function() {
        BtnRight.isDown = true;
    });
    BtnRight.on('pointerup', function() {
        BtnRight.isDown = false;
    });
    BtnUp.on('pointerdown', function() {
        BtnUp.isDown = true;
    });
    BtnUp.on('pointerup', function() {
        BtnUp.isDown = false;
    });
    platformsSky.children.iterate(function(platform) {
        platform.body.immovable = true;
    });
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, platformsSky);

    var darkness = this.add.graphics();
    darkness.fillStyle(0x000000, 0.5); // Цвет и прозрачность затемнения
    darkness.fillRect(0, 0, 800, 600); // Затемнение всего игрового поля
    // Создание кнопки
    var button = this.add.image(400, 400, 'play');
    // Определение параметров анимации
    var scaleConfig = {
        targets: button,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 1000,
        ease: 'Power1',
        yoyo: true,
        repeat: -1
    };

    // Запуск анимации
    this.tweens.add(scaleConfig);
    // Добавление обработчика события для кнопки
    button.setInteractive();
    const Phys = this;
    button.on('pointerdown', function() {
        player.clearTint();
        BOMBS.forEach((bomb) => {
            bomb.destroy();
        });
        restartGame(stars, darkness, Phys, bombs);
        score = 0;
        scoreText.setText('Score: ' + score);
        scoreText.setVisible(true)
    });
    // Установка маски на кнопку
    button.setMask(darkness.createGeometryMask());

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{
            key: 'dude',
            frame: 4
        }],
        frameRate: 20
    });
    let BOMBS = [];
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 5,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('dude', {
            start: 5,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });
    //Bombs
    let bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platformsSky);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: {
            x: 12,
            y: 0,
            stepX: 70
        }
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(stars, platformsSky);
    //Столкновение звезды с игроком
    this.physics.add.overlap(player, stars, collectStar, null, this);

    function hitBomb(player, bomb) {
        this.physics.pause();
        bomb.setTexture("boom");
        bomb.setDisplaySize(250, 250);
        BOOM_MP.play();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
        scoreText.setVisible(false);
        setTimeout(() => {
            let GAME_OVER = this.add.text(290, 260, 'GAME OVER!', {
                fontSize: '40px',
                fill: 'red'
            });
            // Создание графического объекта для затемнения
            var darkness = this.add.graphics();
            darkness.fillStyle(0x000000, 0.5); // Цвет и прозрачность затемнения
            darkness.fillRect(0, 0, 800, 600); // Затемнение всего игрового поля
            // Создание кнопки
            var button = this.add.image(400, 400, 'play');
            // Определение параметров анимации
            var scaleConfig = {
                targets: button,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 1000,
                ease: 'Power1',
                yoyo: true,
                repeat: -1
            };

            // Запуск анимации
            this.tweens.add(scaleConfig);
            // Добавление обработчика события для кнопки
            button.setInteractive();
            const Phys = this;
            button.on('pointerdown', function() {
                GAME_OVER.destroy();
                BOOM_MP.destroy();
                player.clearTint();
                BOMBS.forEach((bomb) => {
                    bomb.destroy();
                });
                restartGame(stars, darkness, Phys, bombs);
                score = 0;
                scoreText.setText('Score: ' + score);
                scoreText.setVisible(true)
            });
            // Установка маски на кнопку
            button.setMask(darkness.createGeometryMask());

            // Удаление маски с кнопки
            //button.clearMask();
        }, 2000);
    }

    function collectStar(player, star) {
        //Отключаем видимость звезды
        star.disableBody(true, true);
        score += 10;
        starMusic.play();
        scoreText.setText('Score: ' + score);
        if (stars.countActive(true) < 3) {
            stars.children.iterate(function(child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.displayWidth = 20;
            bomb.displayHeight = 20;
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            BOMBS.push(bomb)
        }
    }
    stars.children.iterate(function(child) {

        // child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setBounce(.5);
        child.displayWidth = 20;
        child.displayHeight = 20;
    });
    //Keyboard
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.enabled = true;

}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('up', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else if (BtnLeft.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (BtnRight.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else if (BtnUp.isDown) {
        player.setVelocityY(-160);
        player.anims.play('up', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}