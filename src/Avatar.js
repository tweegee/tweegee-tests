class Avatar extends Phaser.GameObjects.Container {

    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene.add.existing(this);

        this.isPaused = false;
        this.animationID = 1;
        this.isBackSide = false;

        this.skin = this.scene.add.container(0, 0);
        /* Skin */
        this.ears = new AvatarItem(scene, 0, 0, 'Skin', 'ears');
        this.face = new AvatarItem(scene, 0, 0, 'Skin', 'face');

        this.bodyLayer = new AvatarItem(scene, 0, 0, 'Skin', 'body');
        this.bodyLayer.setAdditional('clothe', new AvatarItem(scene, 0, 0, 'TopOutfit', 'body'));
        this.bodyLayer.setAdditional('item', new AvatarItem(scene, 0, 0, 'NeckItem', 'neck-item'))

        this.rightHand = new AvatarItem(scene, 0, 0, 'Skin', 'right-hand');
        this.rightHand.setAdditional('clothe', new AvatarItem(scene, 0, 0, 'TopOutfit', 'right-hand'));
        this.rightHand.setAdditional('item', new AvatarItem(scene, 0, 0, 'HandItem', 'right-hand'));

        this.leftHand = new AvatarItem(scene, 0, 0, 'Skin', 'left-hand');
        this.leftHand.setAdditional('clothe', new AvatarItem(scene, 0, 0, 'TopOutfit', 'left-hand'));
        this.leftHand.setAdditional('item', new AvatarItem(scene, 0, 0, 'HandItem', 'left-hand'));

        this.pelvis = new AvatarItem(scene, 0, 0, 'Skin', 'pelvis');
        this.pelvis.setAdditional('clothe', new AvatarItem(scene, 0, 0, 'BottomOutfit', 'pelvis'));

        this.rightLeg = new AvatarItem(scene, 0, 0, 'Skin', 'right-leg');
        this.rightLeg.setAdditional('clothe', new AvatarItem(scene, 0, 0, 'BottomOutfit', 'right-leg'));
        this.rightLeg.setAdditional('item', new AvatarItem(scene, 0, 0, 'Shoes', 'right-leg'));

        this.leftLeg = new AvatarItem(scene, 0, 0, 'Skin', 'left-leg');
        this.leftLeg.setAdditional('clothe', new AvatarItem(scene, 0, 0, 'BottomOutfit', 'left-leg'));
        this.leftLeg.setAdditional('item', new AvatarItem(scene, 0, 0, 'Shoes', 'left-leg'));

        /* Avatar front */
        this.avatarFront = scene.add.container(0, 0);
        this.hairstyle = new AvatarItem(scene, 0, 0, 'Hair', 'hairstyle');
        this.headItem = new AvatarItem(scene, 0, 0, 'HeadItem', 'head-item');

        /* Face items */
        this.faceItems = scene.add.container(0, 0);

        this.rightEye = new AvatarItem(scene, 0, 0, 'Eyes', 'right-eye');
        this.leftEye = new AvatarItem(scene, 0, 0, 'Eyes', 'left-eye');

        this.rightEyebrow = new AvatarItem(scene, 0, 0, 'Eyebrows', 'right-eyebrow');
        this.leftEyebrow = new AvatarItem(scene, 0, 0, 'Eyebrows', 'left-eyebrow');

        this.facial = new AvatarItem(scene, 0, 0, 'Facial', 'facial');
        this.nose = new AvatarItem(scene, 0, 0, 'Nose', 'nose');
        this.mouth = new AvatarItem(scene, 0, 0, 'Mouth', 'mouth');
        this.glasses = new AvatarItem(scene, 0, 0, 'Glasses', 'glasses');

        /* Avatar back */
        this.avatarBack = scene.add.container(0, 0);
        this.hairstyleBack = new AvatarItem(scene, 0, 0, 'Hair', 'hairstyle-back');
        this.headItemBack = new AvatarItem(scene, 0, 0, 'HeadItem', 'head-item-back');
        this.neckItemBack = new AvatarItem(scene, 0, 0, 'NeckItem', 'neck-item-back');

        /* Back item */
        this.backItem = scene.add.container(0, 0);
        this.backItemFront = new AvatarItem(scene, 0, 0, 'BackItem', 'back-item');
        this.backItemBack = new AvatarItem(scene, 0, 0, 'BackItem', 'back-item-back');
        this.backItem.add([this.backItemBack, this.backItemFront]);

        this.add([this.avatarBack, this.skin, this.avatarFront]);

        this.skin.add([this.ears, this.face, this.bodyLayer, this.rightHand, this.leftHand, this.pelvis, this.rightLeg, this.leftLeg]);
        this.faceItems.add([this.rightEyebrow, this.leftEyebrow, this.rightEye, this.leftEye, this.nose, this.facial, this.mouth, this.glasses]);
        this.avatarFront.add([this.faceItems, this.hairstyle, this.headItem]);
        this.avatarBack.add([this.neckItemBack, this.hairstyleBack, this.headItemBack, this.backItem]);

        this.initEvents();

    }

    get frameNumber() {
        return this.skin.list[0].frameNumber;
    }

    initEvents() {
        for (const entry of Object.entries(this)) {
            const [_, object] = entry;
            if (object instanceof AvatarItem) {
                object.on('item_loaded', () => {
                    if (!this.isPaused && this.animationID) {
                        this.play(this.animationID, this.frameNumber);
                    }
                });
                this.initAdditionalEvents(object);
            }
        }
    }

    initAdditionalEvents(object) {
        for (const additional of Object.values(object.additionals)) {
            additional.on('item_loaded', () => {
                if (!this.isPaused && this.animationID !== -1) {
                    this.play(this.animationID, object.frameNumber);
                }
            });
            this.initAdditionalEvents(additional);
        }
    }

    stop() {
        for (const entry of Object.entries(this)) {
            const [_, obj] = entry;
            if (obj instanceof AvatarItem) {
                obj.stop();
            }
        }
        this.isPaused = true;
        return this;
    }

    gotoAndStop(frame) {
        for (const entry of Object.entries(this)) {
            const [_, obj] = entry;
            if (obj instanceof AvatarItem) {
                obj.gotoAndStop(frame);
            }
        }
        this.isPaused = true;
        return this;
    }

    play(animId, startFrame = 1, ignoreIfPlaying) {
        const anim = AnimationsData[animId];
        if (!anim)
            return this;
        if (anim.order) {
            for (let i = 0; i < anim.order.length; ++i) {
                this.skin.moveTo(this[anim.order[i]], i);
            }
        }
        for (const entry of Object.entries(this)) {
            const [_, obj] = entry;
            if (obj instanceof AvatarItem) {
                obj.play(animId);
            }
        }
        this.animationID = animId;
        this.isPaused = false;
        return this;
    }

    setBackSide(value) {
        if (value && !this.isBackSide) {
            this.isBackSide = true;
            this.moveTo(this.avatarBack, this.list.length - 1);
            this.moveTo(this.avatarFront, this.list.length - 2);
            this.backItem.swap(this.backItemFront, this.backItemBack);
            this.faceItems.alpha = 0;
            this.bodyLayer.getAdditional('item').alpha = 0;
        } else if (!value && this.isBackSide) {
            this.isBackSide = false;
            this.moveTo(this.avatarBack, 0);
            this.moveTo(this.avatarFront, this.list.length - 1);
            this.backItem.swap(this.backItemFront, this.backItemBack);
            this.faceItems.alpha = 1;
            this.bodyLayer.getAdditional('item').alpha = 1;
        }
        for (const entry of Object.entries(this)) {
            const [_, obj] = entry;
            if (obj instanceof AvatarItem) {
                if (['hairstyle'].includes(obj.part)) continue
                obj.setBackSide(value);
            }
        }
        return this;
    }

    async setSkin(skinID) {
        await this.ears.load(skinID, this.animationID);
        await this.face.load(skinID, this.animationID);
        await this.bodyLayer.load(skinID, this.animationID);
        await this.rightHand.load(skinID, this.animationID);
        await this.leftHand.load(skinID, this.animationID);
        await this.pelvis.load(skinID, this.animationID);
        await this.rightLeg.load(skinID, this.animationID);
        await this.leftLeg.load(skinID, this.animationID);
        return this;
    }

    async setTopOutfit(clotheID) {
        if (!clotheID) return this;
        await this.bodyLayer.getAdditional('clothe').load(clotheID, this.animationID);
        await this.rightHand.getAdditional('clothe').load(clotheID, this.animationID);
        await this.leftHand.getAdditional('clothe').load(clotheID, this.animationID);
        return this;
    }

    async setBottomOutfit(clotheID) {
        if (!clotheID) return this;
        await this.pelvis.getAdditional('clothe').load(clotheID, this.animationID);
        await this.rightLeg.getAdditional('clothe').load(clotheID, this.animationID);
        await this.leftLeg.getAdditional('clothe').load(clotheID, this.animationID);
        return this;
    }

    async setHairstyle(hairID) {
        if (!hairID) return this;
        await this.hairstyle.load(hairID, this.animationID);
        await this.hairstyleBack.load(hairID, this.animationID);
        return this;
    }

    async setFaceItems(items) {
        if (items.eyes) {
            if (items.eyes.id) {
                await this.rightEye.load(items.eyes.id, this.animationID);
                await this.leftEye.load(items.eyes.id, this.animationID);
            }
            if (items.eyes.color) {
                this.rightEye.fill(items.eyes.color);
                this.leftEye.fill(items.eyes.color);
            }
        }
        if (items.eyebrows) {
            await this.rightEyebrow.load(items.eyebrows, this.animationID);
            await this.leftEyebrow.load(items.eyebrows, this.animationID);
        }
        if (items.nose) {
            await this.nose.load(items.nose, this.animationID);
        }
        if (items.mouth) {
            await this.mouth.load(items.mouth, this.animationID);
        }
        if (items.glasses) {
            if (items.glasses.id) {
                await this.glasses.load(items.glasses.id, this.animationID);
            }
            if (items.glasses.color) {
                this.glasses.fill(items.glasses.color);
            }
        }
        if (items.facial) {
            await this.facial.load(items.facial, this.animationID);
        }
        return this;
    }

    async setNeckItem(item) {
        if (!item) return this;
        await this.bodyLayer.getAdditional('item').load(item, this.animationID);
        await this.neckItemBack.load(item, this.animationID);
        return this;
    }

    async setHeadItem(item) {
        if (!item) return this;
        await this.headItem.load(item, this.animationID);
        await this.headItemBack.load(item, this.animationID);
        return this;
    }

    async setBackItem(item) {
        if (!item) return this;
        await this.backItemFront.load(item, this.animationID);
        await this.backItemBack.load(item, this.animationID);
        return this;
    }

    async setShoes(item) {
        if (!item) return this;
        await this.rightLeg.getAdditional('item').load(item, this.animationID);
        await this.leftLeg.getAdditional('item').load(item, this.animationID);
        return this;
    }


    fillSkin(color) {
        for (const item of this.skin.list) {
            item.fill(color);
        }
        return this;
    }

    fillTopOutfit(color) {
        this.bodyLayer.getAdditional('clothe').fill(color);
        this.rightHand.getAdditional('clothe').fill(color);
        this.leftHand.getAdditional('clothe').fill(color);
        return this;
    }

    fillBottomOuttfit(color) {
        this.pelvis.getAdditional('clothe').fill(color);
        this.rightLeg.getAdditional('clothe').fill(color);
        this.leftLeg.getAdditional('clothe').fill(color);
        return this;
    }

    fillHairstyle(color) {
        this.hairstyle.fill(color);
        this.hairstyleBack.fill(color);
        this.rightEyebrow.fill(color);
        this.leftEyebrow.fill(color);
        return this;
    }

    fillHeadItem(color) {
        this.headItem.fill(color);
        this.headItemBack.fill(color);
        return this;
    }

    fillNeckItem(color) {
        this.bodyLayer.getAdditional('item').fill(color);
        this.neckItemBack.fill(color);
        return this;
    }

    fillBackItem(color) {
        this.backItemFront.fill(color);
        this.backItemBack.fill(color);
        return this;
    }

    fillShoes(color) {
        this.rightLeg.getAdditional('item').fill(color);
        this.leftLeg.getAdditional('item').fill(color);
        return this;
    }

    static fromCode(scene, x, y, code) {
        const items = [];
        code.split(';')
            .forEach((v, i) => {
                const d = v.split('_');
                items.push({ id: +d[0], color: parseInt(d[1], 16) });
            });
        const avatar = new Avatar(scene, x, y);
        avatar.setSkin(items[0].id || 1)
            .then(() => {
                avatar.fillSkin(items[0].color);
            });
        avatar.setTopOutfit(items[1]?.id)
            .then(() => {
                avatar.fillTopOutfit(items[1]?.color);
            });
        avatar.setBottomOutfit(items[2]?.id)
            .then(() => {
                avatar.fillBottomOuttfit(items[2]?.color);
            });
        avatar.setHairstyle(items[3]?.id)
            .then(() => {
                avatar.fillHairstyle(items[3]?.color);
            });
        avatar.setFaceItems({
            eyes: items[4],
            eyebrows: items[5],
            nose: items[6],
            mouth: items[7],
            facial: items[8],
            glasses: items[9]
        });
        avatar.setHeadItem(items[10]?.id)
            .then(() => {
                avatar.fillHeadItem(items[10]?.color);
            });
        avatar.setBackItem(items[11]?.id)
            .then(() => {
                avatar.fillBackItem(items[11]?.color);
            });
        avatar.setNeckItem(items[12]?.id)
            .then(() => {
                avatar.fillNeckItem(items[12]?.color);
            });
        avatar.setShoes(items[13]?.id)
            .then(() => {
                avatar.fillShoes(items[13]?.color);
            });
        return avatar;
    }

    static fromData(scene, x, y, data) {
        if (!data) throw 'Data could not be undefined.';
        const avatar = new Avatar(scene, x, y);
        avatar.setSkin(data?.skin?.id || 1)
            .then(() => {
                avatar.fillSkin(data?.skin?.color);
            });
        avatar.setTopOutfit(data?.top?.id)
            .then(() => {
                avatar.fillTopOutfit(data?.top?.color);
            });
        avatar.setBottomOutfit(data?.bottom?.id)
            .then(() => {
                avatar.fillBottomOuttfit(data?.bottom?.color);
            });
        avatar.setHairstyle(data?.hair?.id)
            .then(() => {
                avatar.fillHairstyle(data?.hair?.color);
            });
        avatar.setFaceItems(data?.faceItems);
        avatar.setHeadItem(data?.head?.id)
            .then(() => {
                avatar.fillHeadItem(data?.head?.color);
            });

        avatar.setBackItem(data?.back?.id)
            .then(() => {
                avatar.fillBackItem(data?.back?.color)
            });
        avatar.setNeckItem(data?.neck?.id)
            .then(() => {
                avatar.fillNeckItem(data?.neck?.color)
            });
        avatar.setShoes(data?.shoes?.id).then(() => {
            avatar.fillShoes(data?.shoes?.color);
        })
        return avatar;
    }

    toString() {
        const data = {};
        for (const entry of Object.entries(this)) {
            const [name, value] = entry;
            if (value instanceof AvatarItem) {
                data[name] = value.toString();
            } else if (value instanceof Phaser.GameObjects.Container) {
                data[name] = [];
                for (const child of value.list) {
                    if (child instanceof AvatarItem) {
                        data[name].push(child.toString());
                    }
                }
            }
        }
        return data;
    }
}