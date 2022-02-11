const ItemCategories = ['Skin', 'Eyes', 'Hair', 'Mouth', 'Eyebrows', 'Nose', 'Facial', 'TopOutfit', 'BottomOutfit', 'Shoes', 'Glasses', 'NeckItem', 'HeadItem', 'BackItem', 'HandItem'];

const AnimationsData = {
    1: {
        fps: 30,
        repeat: -1,
        start: 1,
        end: 14,
        order: [
            'rightHand',
            'leftHand',
            'rightLeg',
            'leftLeg',
            'pelvis',
            'bodyLayer',
            'ears',
            'face'
        ]
    },
    2: {
        fps: 30,
        repeat: -1,
        start: 1,
        end: 14,
        order: [
            "rightHand",
            "rightLeg",
            "leftLeg",
            "pelvis",
            "bodyLayer",
            "leftHand",
            "ears",
            "face"
        ]
    },
    3: {
        fps: 30,
        repeat: -1,
        start: 1,
        end: 14,
        order: [
            "rightHand",
            "rightLeg",
            "leftLeg",
            "pelvis",
            "bodyLayer",
            "leftHand",
            "ears",
            "face"
        ]
    }
}

class AvatarItem extends Phaser.GameObjects.Container {
    constructor(scene, x, y, category, part, forceNoBack = false, options = {}) {
        super(scene, x, y);

        if (typeof category === 'string') {
            const index = ItemCategories.indexOf(category);
            if (index === -1)
                throw 'Invalid category name';
            this.category = category;
            this.categoryID = index + 1;
        } else if (Number.isInteger(category)) {
            const cat = ItemCategories[category - 1];
            if (!cat)
                throw 'Invalid category identifier.';
            this.category = cat;
            this.categoryID = category;
        }
        if (!part)
            throw 'Part name can\'t be undefined.';
        this.part = part;
        this.itemID = 0;
        this.animationID = 0;
        this.additionals = {};

        this.transform = {
            offsetX: options.offsetX || 0,
            offsetY: options.offsetY || 0,
            rotation: options.rotation || 0,
            scale: options.scale || 1
        };

        this.transformControls = {
            scale: !!options.scalable,
            rotation: !!options.rotatable,
            verticalMove: !!options.verticalMove,
            horizontalMove: !!options.horizontalMove
        };

        this.isReady = false;
        this.colorable = false;
        this.hasFeatures = false;

        this.hasBackSide = false;
        this.isBackSide = false;

        this.fillColor = -0x00_00_01;
    }

    get id() {
        return (this.categoryID * 1000) + this.itemID;
    }

    get keyName() {
        return 'A' + this.animationID + '.' + this.category + '_' + this.itemID;
    }

    get frameNumber() {
        const sprite = this.colorable ? this.getByName('fill') : this.getByName('part');
        if (!sprite) return 0;
        return parseInt(sprite.frame.name.replace(/[^0-9.]/g, ''));
    }

    /**
     * @param name {string}
     * @param object {AvatarItem}
     */
    setAdditional(name, object) {
        this.additionals[name] = object;
        this.add(object);
        object.on('item_loaded', () => {
            this.moveTo(object, this.list.length - Object.values(this.additionals).length);
        });
    }

    /**
     * @param name {string}
     * @returns {AvatarItem}
     */
    getAdditional(name) {
        return this.additionals[name];
    }

    /**
     * @param name {string}
     */
    removeAdditional(name) {
        this.remove(this.additionals[name], true);
        delete this.additionals[name]; 
    }

    load(itemID, pose = 1) {
        return new Promise((resolve, reject) => {
            const id = (this.categoryID * 1000) + itemID;
            const texture = this.scene.game.textures.exists(`A${pose}.${this.category}_${itemID}`);
            if (texture) {
                this.itemID = itemID;
                this.onItemLoaded(pose);
                this.emit('item_loaded');

                return resolve();
            }
            const keyName = `A${pose}.${this.category}_${itemID}`;
            const CLOTHES_URI = './assets/clothes';
            this.scene.load.atlas(keyName, `${CLOTHES_URI}/${id}/${id}.${pose}.png`, `${CLOTHES_URI}/${id}/${id}.${pose}.json`);
            this.scene.load.once('loaderror', () => {
                this.isFail = true;
                reject();
            }, this);
            this.scene.load.once('complete', () => {
                this.isFail = false;
                this.itemID = itemID;
                this.onItemLoaded(pose);
                this.emit('item_loaded');
                resolve();
            }, this);
            this.scene.load.start();
        });
    }

    reset() {
        const additionals = Object.values(this.additionals);

        this.removeBetween(0, this.list.length - additionals.length, true);
    }

    setBackSide(value) {
        if (value && !this.isBackSide) {
            this.isBackSide = true;
            if (this.hasBackSide)
                this.play(this.animationID, this.frameNumber);
        } else if (!value && this.isBackSide) {
            this.isBackSide = false;
            if (this.hasBackSide)
                this.play(this.animationID, this.frameNumber);
        }
        for (const additional of Object.values(this.additionals)) {
            additional.setBackSide(value);
        }
    }

    onItemLoaded(pose) {
        if (this.isFail) return;
        this.reset();

        this.animationID = pose;
        const texture = this.scene.textures.get(this.keyName);

        if (!texture)
            return;

        let sprite;

        this.colorable = false;
        this.hasFeatures = false;
        this.hasBackSide = false;

        if (texture.has(this.part + '-fill0001')) {
            sprite = this.scene.add.sprite(0, 0, this.keyName, this.part + '-fill0001');
            sprite.name = 'fill';
            this.colorable = true;
        } else if (texture.has(this.part + '0001')) {
            sprite = this.scene.add.sprite(0, 0, this.keyName, this.part + '0001');
            sprite.name = 'part';
        } else {
            return;
        }
        this.add(sprite);

        if (!sprite)
            return;

        if (texture.has(this.part + '-features0001')) {
            sprite = this.scene.add.sprite(0, 0, this.keyName, this.part + '-features0001');
            sprite.name = 'features';
            this.hasFeatures = true;
            this.add(sprite);
        }

        const backFrame = this.part + '-back' + (this.colorable ? '-fill' : '') + '0001';
        if (texture.has(backFrame))
            this.hasBackSide = true;

        this.createAnimation();
        this.rearrange();
        if (this.colorable && this.fillColor !== -1) {
            this.fill(this.fillColor);
        }

    }

    rearrange() {
        const sprite = this.colorable ? this.getByName('fill') : this.getByName('part');
        this.moveTo(sprite, 0);
        if (this.hasFeatures) {
            this.moveTo(this.getByName('features'), 1);
        }
    }

    createAnimation(animationID) {
        if (this.isFail) return;
        if (!animationID) animationID = this.animationID;

        const animation = AnimationsData[animationID];
        if (!animation)
            return;

        const texture = this.scene.textures.get(this.keyName);
        if (!texture)
            return;

        const key = `A_${animationID}.${this.id}.${this.part}`;

        const options = {
            key,
            frames: {},
            repeat: animation.repeat,
            frameRate: animation.fps
        };
        const frameOptions = {
            zeroPad: 4,
            prefix: '',
            start: animation.start,
            end: animation.end
        };

        if (!this.scene.anims.exists(key)) {
            frameOptions.prefix = this.part + (this.colorable ? '-fill' : '');
            options.frames = this.scene.anims.generateFrameNames(this.keyName, frameOptions);
            this.scene.anims.create(options);
        }

        if (this.hasBackSide && !this.scene.anims.exists(key + '_b')) {
            frameOptions.prefix = this.part + '-back' + (this.colorable ? '-fill' : '');
            options.key = key + '_b';
            options.frames = this.scene.anims.generateFrameNames(this.keyName, frameOptions);
            this.scene.anims.create(options);
        }

        if (this.hasFeatures && !this.scene.anims.exists(key + '_f')) {
            frameOptions.prefix = this.part + '-features';
            options.key = key + '_f';
            options.frames = this.scene.anims.generateFrameNames(this.keyName, frameOptions);
            this.scene.anims.create(options);

            if (this.hasBackSide && !this.scene.anims.exists(key + '_f_b')) {
                if (texture.has(this.part + '-back-features0001')) {
                    frameOptions.prefix = this.part + '-back-features';
                    options.key = key + '_f_b';
                    options.frames = this.scene.anims.generateFrameNames(this.keyName, frameOptions);
                    this.scene.anims.create(options);
                }
            }
        }

    }

    play(animationID, startFrame = 1, ignoreIfPlaying = true) {
        if (this.isFail) return;
        this.animationID = animationID;

        if (!this.itemID)
            return;
        const texture = this.scene.game.textures.exists(`A${animationID}.${this.category}_${this.itemID}`);

        if (!texture) {
            this.load(this.itemID, animationID)
                .then(() => {
                    this.play(animationID, startFrame, ignoreIfPlaying);
                });
            return;
        } else {
            this.onItemLoaded(animationID);
        }

        const sprite = this.colorable ? this.getByName('fill') : this.getByName('part');
        if (!sprite)
            return;

        const animationKey = `A_${animationID}.${this.id}.${this.part}`;
        if (!this.scene.anims.exists(animationKey)) {
            this.createAnimation(animationID);
        }

        for (const additional of Object.values(this.additionals)) {
            additional.play(animationID, startFrame, ignoreIfPlaying);
        }

        sprite.play({ key: animationKey + (this.isBackSide && this.hasBackSide ? '_b' : ''), startFrame }, ignoreIfPlaying);

        if (this.hasFeatures) {
            this.getByName('features')?.play({ key: animationKey + '_f' + (this.isBackSide && this.hasBackSide ? '_b' : ''), startFrame }, ignoreIfPlaying);
        }
        return this;
    }

    fill(color) {
        if (this.colorable) {
            const sprite = this.getByName('fill');
            if (sprite) {
                sprite.setTint(color);
                this.fillColor = color;
            }
        }
        return this;
    }


    stop() {
        const sprite = this.colorable ? this.getByName('fill') : this.getByName('part');

        if (!sprite) return;

        for (const additional of Object.values(this.additionals)) {
            additional.stop();
        }

        sprite.stop();

        if (this.hasFeatures) {
            this.getByName('features')?.stop();
        }
        return this;
    }

    gotoAndStop(frame) {
        this.stop();

        const sprite = this.colorable ? this.getByName('fill') : this.getByName('part');
        if (!sprite) return this;
        const frameName = sprite.frame.name.replace(/(\d+)/g, '');

        sprite.setFrame(frameName + Phaser.Utils.String.Pad(frame, 4, '0', 1));

        for (const additional of Object.values(this.additionals)) {
            additional.gotoAndStop(frame);
        }

        if (this.hasFeatures) {
            this.getByName('features')?.setFrame(frameName.replace('fill', 'features') + Phaser.Utils.String.Pad(frame, 4, '0', 1));
        }
        return this;
    }

    toString() {
        const data = {
            category: this.category,
            item: this.itemID,
            part: this.part,
            id: this.id,
            children: []
        };
        console.log(this.list);
        for (const child of this.list) {
            if (child instanceof AvatarItem) {
                data.children.push(child.toString());
            } else if (child instanceof Phaser.GameObjects.Container) {
                for (const c of child.list) {
                    if (c instanceof AvatarItem) {
                        data.children.push(c.toString());
                    }
                }
            } else if (child instanceof Phaser.GameObjects.Sprite) {
                data.children.push({ name: child.name, sprite: child })
            }
        }
        return data;
    }
}