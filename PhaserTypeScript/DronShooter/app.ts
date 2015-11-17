﻿class Game extends Phaser.Game {

	constructor() {
		super(640, 400, Phaser.AUTO, "content", State);
	}
}

class State extends Phaser.State {

	private static CANNON_SPEED = 2;
	private static MISSILE_SPEED = 6;

	private _cannon: Phaser.Sprite;
	private _cannonTip: Phaser.Point = new Phaser.Point();

	private _space: Phaser.Key;


	preload() {
		this.game.load.path = "assets/";
		this.game.load.image("BG", "bg.jpg");
		this.game.load.atlas("atlas");
	}

	create() {
		// Use the P2 physics engine.
		this.game.physics.startSystem(Phaser.Physics.P2JS);

		this.add.image(0, 0, "BG");

		// The cannon is placed at the bottom center.
		this._cannon = this.game.add.sprite(this.world.centerX, this.world.height, "atlas", "cannon");
		this._cannon.anchor.setTo(-0.75, 0.5);
		// Rotate so it points straight up.
		this._cannon.rotation = -Math.PI / 2;

		var base = this.game.add.sprite(this.world.centerX, this.world.height, "atlas", "base");
		base.anchor.setTo(0.5, 1);
	}
}

class Dron extends Phaser.Sprite {

	public setUp() {
		this.anchor.setTo(0.5);
		// Put it in a random location.
		this.reset(this.game.rnd.between(40, 600), this.game.rnd.between(60, 150));
		// Movement range.
		var range: number = this.game.rnd.between(60, 120);
		// Duration of complete move.
		var duration: number = this.game.rnd.between(30000, 50000);
		// Random wiggle properties.
		var xPeriod1: number = this.game.rnd.between(2, 13);
		var xPeriod2: number = this.game.rnd.between(2, 13);
		var yPeriod1: number = this.game.rnd.between(2, 13);
		var yPeriod2: number = this.game.rnd.between(2, 13);

		// Add tweens. Target the body since physics are enabled.
		var xTween = this.game.add.tween(this.body);
		xTween.to({ x: this.position.x + range }, duration, function (aProgress: number) {
			return wiggle(aProgress, xPeriod1, xPeriod2);
		}, true, 0, -1);

		var yTween = this.game.add.tween(this.body);
		yTween.to({ y: this.position.y + range }, duration, function (aProgress: number) {
			return wiggle(aProgress, yPeriod1, yPeriod2);
		}, true, 0, -1);

		// Define animations.
		this.animations.add("anim", ["dron1", "dron2"], this.game.rnd.between(2, 5), true);
		this.animations.add("explosion", Phaser.Animation.generateFrameNames("explosion", 1, 6, "", 3));
		// Start the first animation by default.
		this.play("anim");
	}

	public explode() {
		// Remove the movement tween.
		this.game.tweens.removeFrom(this.body);
		// Explode and kill itself.
		this.play("explosion", 8, false, true);
	}
}

/**
 * Tween function to give a target a bit of wiggle, but ending back at the same spot.
 * @param aProgress
 * @param aPeriod1
 * @param aPeriod2
 * @returns
 */
function wiggle(aProgress: number, aPeriod1: number, aPeriod2: number): number {
	var current1: number = aProgress * Math.PI * 2 * aPeriod1;
	var current2: number = aProgress * Math.PI * 2 * aPeriod2;

	return Math.sin(current1) * Math.cos(current2);
}

window.onload = () => {
	new Game();
};