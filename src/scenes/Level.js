
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		this.avatarCount = 0;
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// textAvatars
		const textAvatars = this.add.text(3, 580, "", {});
		textAvatars.text = "Avatars: ";
		textAvatars.setStyle({ "fontFamily": "Arial" });

		this.textAvatars = textAvatars;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Text} */
	textAvatars;

	/* START-USER-CODE */

	preload() {
		// this.load.atlas('ef', './assets/clothes/3015/3015.1.png', './assets/clothes/3015/3015.1.json');
	}

	create() {
		this.editorCreate();
		const SkinList = [1, 2];
		const EyeList = [1, 2, 3, 100];
		const HairList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 100];
		const MouthList = [1];
		const EyebrowList = [1];
		const NoseList = [1];
		const FacialList = [0, 1];
		const TopList = [0, 1, 2];
		const BotList = [0, 1];
		const ShoesList = [0, 1, 2];
		const GlassesList = [0, 1];
		const NeckList = [0, 1];
		const HatList = [0, 1];
		const BackList = [0, 1];

		const categories = {
			'Skin': SkinList,
			'Eyes': EyeList,
			'Hair': HairList,
			'Mouth': MouthList,
			'Eyebrows': EyebrowList,
			'Nose': NoseList,
			'Facial': FacialList,
			'TopOutfit': TopList,
			'BottomOutfit': BotList,
			'Shoes': ShoesList,
			'Glasses': GlassesList,
			'NeckItem': NeckList,
			'HeadItem': HatList,
			'BackItem': BackList
		};
		const cont = this.add.container(0, 0);
		this.input.on('pointerdown', (ptr) => {
			const avatar = new Avatar(this, ptr.downX, ptr.downY);
			for (const entry of Object.entries(categories)) {
				avatar.load(entry[0], entry[1].random());
				avatar.fill(entry[0], Math.floor(Math.random() * 0xff_ff_ff));
			}
			avatar.play(Object.keys(Animations).random());
			avatar.scale = 0.5;
			this.avatarCount++;
			this.textAvatars.setText('Avatars: ' + this.avatarCount);
			cont.add(avatar);
		});
		window.cont = cont;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
