﻿module LevelSelectProject {
	export class MainMenu extends Phaser.State {
		create() {
			console.log((new Date).toISOString() + ' : Entered MainMenu create()');

			// Handle user input as needed.
			//this.game.state.start('Option1');
			this.game.state.start('ScrollableMap');
		}
	}
}