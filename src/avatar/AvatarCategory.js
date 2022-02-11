const ItemCategories = ['Skin', 'Eyes', 'Hair', 'Mouth', 'Eyebrows', 'Nose', 'Facial', 'TopOutfit', 'BottomOutfit', 'Shoes', 'Glasses', 'NeckItem', 'HeadItem', 'BackItem', 'HandItem'];

/**
 * const skin = new AvatarCategory(scene, 100, 100, 'Skin');
 * const face = new AvatarPart('face', skin);
 * const glasses = new AvatarItem(face,)
 * 
 * skin.addPart(face)
 */

class AvatarCategory extends Phaser.GameObjects.Container {
    constructor(scene, x, y, category) {
        super(scene, x, y);
        this.id = ItemCategories.indexOf(category) + 1;
        if (!this.id)
            throw 'Invalid avatar category.';

        this.name = category;
        this.id = ItemCategories.indexOf(category) + 1;

        this.items = {};

        this.animationID = 1;

        this.scene.add.existing(this);
    }

    /**
     * @param name {string}
     * @param item {AvatarItem}
     */
    setItem(name, item) {
        this.items[name] = item;
    }

    /**
     * @param name {string}
     */
    getItem(name) {
        return this.items[name] || null;
    }

    /**
     * @param name {string}
     */
    removeItem(name) {
        delete this.items[name];
    }
}