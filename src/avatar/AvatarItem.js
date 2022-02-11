const ItemCategories = ['Skin', 'Eyes', 'Hair', 'Mouth', 'Eyebrows', 'Nose', 'Facial', 'TopOutfit', 'BottomOutfit', 'Shoes', 'Glasses', 'NeckItem', 'HeadItem', 'BackItem', 'HandItem'];
const ASSETS_CLOTHES = './assets/clothes';
class AvatarItem {
    constructor(avatar, category, part, x = 0, y = 0, options = {}) {
        this.events = new Phaser.Events.EventEmitter();
        this.parent = null;
        this.avatar = avatar;

        this.itemID = 0;
        this.categoryID = ItemCategories.indexOf(category) + 1;
        if (!this.categoryID)
            throw 'Invalid avatar category.';
        this.category = category;

        this.part = part;
        this.scene = avatar.scene;

        this.isBack = false;
        this.isLoading = false;
        this.isPlayAfterLoad = false;

        this.isColorable = !!options.controls?.colorable;
        this.isScalable = !!options.controls?.scalable;
        this.isRotatable = !!options.controls?.rotatable;
        this.isHorizontalMoveable = !!options.controls?.hMoveable;
        this.isVerticalMoveable = !!options.controls?.vMoveable;

        this.__color = options.transform?.color || -0x00_00_01;
        this.__offsetX = options.transform?.x || 0;
        this.__offsetY = options.transform?.y || 0;
        this.__rotation = options.transform?.rotation || 0;
        this.__scale = options?.transform?.scale || 1;


        this.isFrontOnly = !!options.frontOnly;
        this.isVanishIfBack = !!options.vanishIfBack;

        this.sprite = this.scene.add.sprite(x, y, '__DEFAULT', '__BASE');
        this.sprite.name = `${this.category}_${this.itemID}.${this.part}`;

        this.features = this.scene.add.sprite(x, y, '__DEFAULT', '__BASE');
        this.features.name = `${this.category}_${this.itemID}.${this.part}-features`;

        this.extras = {};

        this.avatar.add([this.sprite, this.features]);
    }

    get id() {
        return this.categoryID * 1000 + this.itemID;
    }

    get keyName() {
        return 'A' + this.avatar.animationID + '.' + this.category + '_' + this.itemID;
    }

    get animationID() {
        return this.avatar.animationID;
    }

    get currentFrame() {
        return this.avatar.currentFrame;
    }

    get isPlaying() {
        return this.sprite.anims.isPlaying;
    }

    /**
     * @param name {string}
     * @param item {AvatarItem}
     */
    addExtra(name, item) {
        this.extras[name] = item;
        item.parent = this;
        const index = this.avatar.getIndex(this.features);
        this.avatar.addAt(item.sprite, index);
        this.avatar.addAt(item.features, index + 1);
        return this;
    }

    /**
     * @param name {string}
     * @return {AvatarItem}
     */
    getExtra(name) {
        return this.extras[name] || null;
    }

    /**
     * @param name {string}
     * @param destroyChild {boolean}
     */
    removeExtra(name, destroyChild) {
        if (this.extras[name]) {
            if (destroyChild) {
                this.extras[name].sprite.destroy();
                this.extras[name].features.destroy();
            }
            delete this.extras[name];
        }
        return this;
    }

    /**
     * @return {boolean}
     */
    get fillable() {
        return !!this.sprite.getData('fillable');
    }

    /**
     * @return {boolean}
     */
    get featureable() {
        return !!this.sprite.getData('featureable');
    }

    /**
     * @return {boolean}
     */
    get backable() {
        return !!this.sprite.getData('backable') && !this.isFrontOnly;
    }

    /**
     * @param value {boolean}
     * @return {boolean}
     */
    set fillable(value) {
        this.sprite.setData('fillable', value);
        return value;
    }

    /**
     * @param value {boolean}
     * @return {boolean}
     */
    set featureable(value) {
        this.sprite.setData('featureable', value);
        return value;
    }
    /**
     * @param value {boolean}
     * @return {boolean}
     */
    set backable(value) {
        this.sprite.setData('backable', value);
        return value;
    }

    /**
     * @return {Phaser.GameObjects.Sprite}
     */
    get features() {
        return this.sprite.getData('features');
    }

    /**
     * @return {Phaser.GameObjects.Sprite}
     */
    set features(sprite) {
        this.sprite.setData('features', sprite);
        return sprite;
    }

    load(itemID, options = {}) {
        if (!itemID) return;

        const key = `A${this.animationID}.${this.category}_${itemID}`;
        const texture = this.scene.textures.exists(key);
        const id = this.categoryID * 1000 + itemID;

        if (texture) {
            this.onItemLoaded(itemID, options);
            return;
        }

        const url = ASSETS_CLOTHES + '/' + id + '/' + id + '.' + this.animationID;

        this.scene.load.atlas({
            key,
            atlasURL: url + '.json',
            textureURL: url + '.png'
        });
        this.scene.load.start();
        this.isLoading = true;
        this.events.once('item_loaded', () => {
            if (this.isPlayAfterLoad) {
                this.play(true, this.currentFrame);
                this.isPlayAfterLoad = false;
            }
        });
        this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
            this.onItemLoaded(itemID, options);
        }, this);
    }

    onItemLoaded(itemID, options = {}) {
        this.itemID = itemID;
        if (!this.itemID) return;

        const texture = this.scene.textures.get(this.keyName);

        if (texture.key === '__MISSING') {
            this.load(itemID, options);
            return;
        }

        const frame = Phaser.Utils.String.Pad(options.frame || this.currentFrame, 4, '0', 1);

        this.fillable = texture.has(this.part + '-fill' + frame);
        this.backable = texture.has(this.part + '-back' + (this.fillable ? '-fill' : '') + frame);
        this.featureable = texture.has(this.part + '-features' + frame);
        const exists = texture.has(this.part + (this.fillable ? '-fill' : '') + frame);
        const back = this.isBack && this.backable && !this.isFrontOnly;

        this.sprite.name = this.keyName + '.' + this.part;
        this.features.name = this.keyName + '.' + this.part + '-features';
        
        if (!exists) {
            this.sprite.setTexture('__DEFAULT', '__BASE');
            this.sprite.stop();

            this.features.setTexture('__DEFAULT', '__BASE');
            this.sprite.stop();
            return;
        }
        this.isLoading = false;

        this.sprite.setTexture(this.keyName, this.part + (back ? '-back' : '') + (this.fillable ? '-fill' : '') + frame);

        if (this.featureable) {
            this.features.setTexture(this.keyName, this.part + (back ? '-back' : '') + '-features' + frame);
        } else {
            this.features.setTexture('__DEFAULT', '__BASE');
        }

        if (!!options.autolpay || this.isPlaying) {
            this.play(!!options.ignoreIfPlaying, options.frame || this.currentFrame);
        }
        this.events.emit('item_loaded');
    }

    back(value) {
        if (value) {
            if (this.backable && !this.isFrontOnly) {
                this.isBack = true;
                this.onItemLoaded(this.itemID, { frame: 1 });
            } else {
                if (this.isVanishIfBack) {
                    this.sprite.alpha = 0;
                    this.features.alpha = 0;
                }
            }
        } else {
            this.isBack = false;
            this.sprite.alpha = 1;
            this.features.alpha = 1;
            this.onItemLoaded(this.itemID, { frame: 1 });
        }
        return this;
    }

    fill(color) {
        if (this.fillable) {
            this.sprite.setTint(color);
        }
        return this;
    }

    play(ignoreIfPlaying = false, startFrame = 1) {
        if (this.isLoading) {
            this.isPlayAfterLoad = true;
            return;
        }

        if (!this.itemID)
            return;

        const texture = this.scene.textures.exists(this.keyName);
        if (!texture) {
            this.load(this.itemID, { autolpay: true, frame: startFrame });
            return;
        }

        const animKey = `A_${this.animationID}.${this.id}.${this.part}`;

        if (!this.scene.anims.exists(animKey)) {
            this.createAnimations();
        }

        const back = this.isBack && this.backable && !this.isFrontOnly;
        const key = animKey + (back ? '_b' : '');


        this.sprite.play({ key, startFrame }, ignoreIfPlaying);
        if (this.featureable) {
            this.features?.play({ key: key + '_f', startFrame }, ignoreIfPlaying);
        }
        return this;
    }

    stop() {
        const texture = this.scene.textures.exists(this.keyName);
        if (!texture) return;

        this.sprite.stop();
        this.features?.stop();
        return this;
    }

    createAnimations() {
        const animation = Animations[this.animationID];
        if (!animation)
            return;
        const texture = this.scene.textures.get(this.keyName);
        if (!texture)
            return;

        const key = 'A_' + this.animationID + '.' + this.id + '.' + this.part;

        const options = {
            key,
            frames: {},
            repeat: animation.repeat,
            frameRate: animation.fps
        };

        const frameOptions = {
            prefix: '',
            start: animation.start,
            end: animation.end,
            zeroPad: 4,
        };

        if (!this.scene.anims.exists(key)) {
            frameOptions.prefix = this.part + (this.fillable ? '-fill' : '');
            options.frames = this.scene.anims.generateFrameNames(this.keyName, frameOptions);
            this.scene.anims.create(options);
        }

        if (this.backable && !this.scene.anims.exists(key + '_b')) {
            frameOptions.prefix = this.part + '-back' + (this.fillable ? '-fill' : '');
            options.key = key + '_b'
            options.frames = this.scene.anims.generateFrameNames(this.keyName, frameOptions);
            this.scene.anims.create(options);
        }

        if (this.featureable && !this.scene.anims.exists(key + '_f')) {
            frameOptions.prefix = this.part + '-features';
            options.key = key + '_f';
            options.frames = this.scene.anims.generateFrameNames(this.keyName, frameOptions);
            this.scene.anims.create(options);

            if (this.backable && !this.scene.anims.exists(key + '_b_f')) {
                frameOptions.prefix = this.part + '-back-features';
                options.key = key + '_b_f';
                options.frames = this.scene.anims.generateFrameNames(this.keyName, frameOptions);
                this.scene.anims.create(options);
            }
        }
    }

}