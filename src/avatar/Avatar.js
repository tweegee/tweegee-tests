const Animations = {
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
            'body',
            'ears',
            'face'
        ],
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
            "body",
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
            "body",
            "leftHand",
            "ears",
            "face"
        ],
        back: true
    }
};

class Avatar extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.animationID = 1;
        this.currentFrame = 1;
        this.isFacingBack = false;

        this.skin = [];
        this.topOutfit = [];
        this.bottomOutfit = [];
        this.shoes = [];
        this.handItem = [];
        this.hair = [];
        this.eyes = [];
        this.eyebrows = [];
        this.backItem = [];
        this.headItem = [];

        this.faceItems = [];
        this.frontElements = [];
        this.backElements = [];

        this.ears = new AvatarItem(this, 'Skin', 'ears');
        this.face = new AvatarItem(this, 'Skin', 'face');
        this.body = new AvatarItem(this, 'Skin', 'body');
        this.rightHand = new AvatarItem(this, 'Skin', 'right-hand');
        this.leftHand = new AvatarItem(this, 'Skin', 'left-hand');
        this.pelvis = new AvatarItem(this, 'Skin', 'pelvis');
        this.rightLeg = new AvatarItem(this, 'Skin', 'right-leg');
        this.leftLeg = new AvatarItem(this, 'Skin', 'left-leg');
        this.skin.push(this.ears, this.face, this.body, this.rightHand, this.leftHand, this.pelvis, this.rightLeg, this.leftLeg);

        this.bodyClothe = new AvatarItem(this, 'TopOutfit', 'body');
        this.body.addExtra('clothe', this.bodyClothe);
        this.rightHandClothe = new AvatarItem(this, 'TopOutfit', 'right-hand');
        this.rightHand.addExtra('clothe', this.rightHandClothe);
        this.leftHandClothe = new AvatarItem(this, 'TopOutfit', 'left-hand');
        this.leftHand.addExtra('clothe', this.leftHandClothe);
        this.topOutfit.push(this.bodyClothe, this.rightHandClothe, this.leftHandClothe);

        this.pelvisClothe = new AvatarItem(this, 'BottomOutfit', 'pelvis');
        this.pelvis.addExtra('clothe', this.pelvisClothe);
        this.rigthLegClothe = new AvatarItem(this, 'BottomOutfit', 'right-leg');
        this.rightLeg.addExtra('clothe', this.rigthLegClothe);
        this.leftLegClothe = new AvatarItem(this, 'BottomOutfit', 'left-leg');
        this.leftLeg.addExtra('clothe', this.leftLegClothe);
        this.bottomOutfit.push(this.pelvisClothe, this.rigthLegClothe, this.leftLegClothe);

        this.neckItem = new AvatarItem(this, 'NeckItem', 'neck-item', 0, 0, { vanishIfBack: true });
        this.body.addExtra('item', this.neckItem);

        this.rightHandItem = new AvatarItem(this, 'HandItem', 'right-hand');
        this.rightHand.addExtra('item', this.rightHandItem);
        this.leftHandItem = new AvatarItem(this, 'HandItem', 'left-hand');
        this.leftHand.addExtra('item', this.leftHandItem);
        this.handItem.push(this.rightHandItem, this.leftHandItem);

        this.rightLegItem = new AvatarItem(this, 'Shoes', 'right-leg');
        this.rightLeg.addExtra('item', this.rightLegItem);
        this.leftLegItem = new AvatarItem(this, 'Shoes', 'left-leg');
        this.leftLeg.addExtra('item', this.leftLegItem);
        this.shoes.push(this.rightLegItem, this.leftLegItem);

        this.hairstyle = new AvatarItem(this, 'Hair', 'hairstyle', 0, 0, { frontOnly: true });
        this.hairstyleBack = new AvatarItem(this, 'Hair', 'hairstyle-back');
        this.hair.push(this.hairstyle, this.hairstyleBack);

        this.rightEye = new AvatarItem(this, 'Eyes', 'right-eye');
        this.leftEye = new AvatarItem(this, 'Eyes', 'left-eye');
        this.eyes.push(this.rightEye, this.leftEye);

        this.rightEyebrow = new AvatarItem(this, 'Eyebrows', 'right-eyebrow');
        this.leftEyebrow = new AvatarItem(this, 'Eyebrows', 'left-eyebrow');
        this.eyebrows.push(this.rightEyebrow, this.leftEyebrow);

        this.nose = new AvatarItem(this, 'Nose', 'nose');
        this.mouth = new AvatarItem(this, 'Mouth', 'mouth');
        this.facial = new AvatarItem(this, 'Facial', 'facial');
        this.glasses = new AvatarItem(this, 'Glasses', 'glasses');
        this.faceItems.push(this.rightEyebrow, this.leftEyebrow, this.rightEye, this.leftEye, this.nose, this.facial, this.mouth, this.glasses);

        this.backItemFront = new AvatarItem(this, 'BackItem', 'back-item', 0, 0, { frontOnly: true, vanishIfBack: true });
        this.backItemBack = new AvatarItem(this, 'BackItem', 'back-item-back');
        this.backItem.push(this.backItemFront, this.backItemBack);

        this.headItemFront = new AvatarItem(this, 'HeadItem', 'head-item', 0, 0, { frontOnly: true, vanishIfBack: true });
        this.headItemBack = new AvatarItem(this, 'HeadItem', 'head-item-back');
        this.headItem.push(this.headItemBack, this.headItemFront);

        for (const item of this.faceItems) {
            item.vanishIfBack = true;
            item.frontOnly = true;
        }

        this.frontElements.push(...this.faceItems, this.hairstyle, this.headItemFront);
        this.backElements.push(this.hairstyleBack, this.backItemBack, this.backItemFront, this.headItemBack);

        this.face.sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.onAnimationUpdate, this);
        this.scene.add.existing(this);

        this.initEventItems();
    }

    get isPlaying() {
        return this.ears.isPlaying;
    }

    initEventItems() {
        for (const item of Object.values(this)) {
            if (item instanceof AvatarItem) {
                item.events.on('item_loaded', this.onItemLoaded, this);
            }
        }
    }

    onItemLoaded() {
        if (this.isPlaying) {
            this.sync();
            // this.play(this.animationID, false, this.currentFrame);
        }
    }

    onAnimationUpdate(animation, frame, gameObject, frameKey) {
        this.currentFrame = +frameKey.replace(/[^0-9]/g, '');
    }

    load(category, id) {
        category = category.charAt(0).toLowerCase() + category.substring(1);
        if (this.hasOwnProperty(category)) {
            if (Array.isArray(this[category])) {
                for (const item of this[category]) {
                    item.load(id, { autoplay: this.isPlaying });
                }
            } else if (this[category] instanceof AvatarItem) {
                this[category].load(id, { autoplay: this.isPlaying });
            }
        } else {
            console.error('• [Tweegee] Could not found the category', category, 'in avatar display list.')
        }
    }

    fill(category, color) {
        category = category.charAt(0).toLowerCase() + category.substring(1);
        if (this.hasOwnProperty(category)) {
            if (Array.isArray(this[category])) {
                for (const item of this[category]) {
                    item.fill(color);
                }
            } else if (this[category] instanceof AvatarItem) {
                this[category].fill(color);
            }
        } else {
            console.error('• [Tweegee] Could not found the category', category, 'in avatar display list.')
        }
    }

    reorder(order) {
        const lastIndex = this.list.length - 1;
        let i = 0, f = this.frontElements.length * 2, b = 0;
        for (const o_value of order) {
            if (this[o_value] && this[o_value] instanceof AvatarItem) {
                this.moveTo(this[o_value].sprite, i++);
                this.moveTo(this[o_value].features, i++);
                for (const extra of Object.values(this[o_value].extras)) {
                    this.moveTo(extra.sprite, i++);
                    this.moveTo(extra.features, i++);
                }
            }
        }
        

        for (let i = 0; i < this.frontElements.length; ++i) {
            const item = this.frontElements[i];
            this.moveTo(item.sprite, lastIndex - --f);
            this.moveTo(item.features, lastIndex - --f);
        }

        for (const item of this.backElements) {
            if (this.isFacingBack) {
                this.moveTo(item.sprite, lastIndex - 1);
                this.moveTo(item.features, lastIndex - 1);
            } else {
                this.moveTo(item.sprite, b++);
                this.moveTo(item.features, b++);
            }
        }
    }

    back(value) {
        this.isFacingBack = value;
        for (const property of Object.values(this)) {
            if (property instanceof AvatarItem) {
                property.back(value);
            }
        }
        this.play(this.animationID, false, 1);
    }

    play(animationID, ignoreIfPlaying, startFrame) {
        if (!animationID)
            animationID = this.animationID;

        const animation = Animations[animationID];
        if (!animation)
            return;

        this.animationID = animationID;
        this.reorder(animation.order);

        if (animation.back && !this.isFacingBack) {
            this.back(true);
            return;
        }

        for (const property of Object.values(this)) {
            if (property instanceof AvatarItem) {
                property.play(ignoreIfPlaying, startFrame || 1);
            }
        }
    }

    sync() {
        if (this.isPlaying) {
            for (const property of Object.values(this)) {
                if (property instanceof AvatarItem) {
                    property.play(false, this.currentFrame);
                }
            }
        }
    }
}