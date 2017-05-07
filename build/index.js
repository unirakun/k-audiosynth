'use strict';

var _require = require('./audiosynth'),
    Synth = _require.Synth;

Synth.loadModulationFunction(function (i, sampleRate, frequency, x) {
	return 1 * Math.sin(2 * Math.PI * (i / sampleRate * frequency) + x);
}, function (i, sampleRate, frequency, x) {
	return 1 * Math.sin(4 * Math.PI * (i / sampleRate * frequency) + x);
}, function (i, sampleRate, frequency, x) {
	return 1 * Math.sin(8 * Math.PI * (i / sampleRate * frequency) + x);
}, function (i, sampleRate, frequency, x) {
	return 1 * Math.sin(0.5 * Math.PI * (i / sampleRate * frequency) + x);
}, function (i, sampleRate, frequency, x) {
	return 1 * Math.sin(0.25 * Math.PI * (i / sampleRate * frequency) + x);
}, function (i, sampleRate, frequency, x) {
	return 0.5 * Math.sin(2 * Math.PI * (i / sampleRate * frequency) + x);
}, function (i, sampleRate, frequency, x) {
	return 0.5 * Math.sin(4 * Math.PI * (i / sampleRate * frequency) + x);
}, function (i, sampleRate, frequency, x) {
	return 0.5 * Math.sin(8 * Math.PI * (i / sampleRate * frequency) + x);
}, function (i, sampleRate, frequency, x) {
	return 0.5 * Math.sin(0.5 * Math.PI * (i / sampleRate * frequency) + x);
}, function (i, sampleRate, frequency, x) {
	return 0.5 * Math.sin(0.25 * Math.PI * (i / sampleRate * frequency) + x);
});

Synth.loadSoundProfile({
	name: 'piano',
	attack: function attack() {
		return 0.002;
	},
	dampen: function dampen(sampleRate, frequency, volume) {
		return Math.pow(0.5 * Math.log(frequency * volume / sampleRate), 2);
	},
	wave: function wave(i, sampleRate, frequency, volume) {
		var base = this.modulate[0];
		return this.modulate[1](i, sampleRate, frequency, Math.pow(base(i, sampleRate, frequency, 0), 2) + 0.75 * base(i, sampleRate, frequency, 0.25) + 0.1 * base(i, sampleRate, frequency, 0.5));
	}
}, {
	name: 'organ',
	attack: function attack() {
		return 0.3;
	},
	dampen: function dampen(sampleRate, frequency) {
		return 1 + frequency * 0.01;
	},
	wave: function wave(i, sampleRate, frequency) {
		var base = this.modulate[0];
		return this.modulate[1](i, sampleRate, frequency, base(i, sampleRate, frequency, 0) + 0.5 * base(i, sampleRate, frequency, 0.25) + 0.25 * base(i, sampleRate, frequency, 0.5));
	}
}, {
	name: 'acoustic',
	attack: function attack() {
		return 0.002;
	},
	dampen: function dampen() {
		return 1;
	},
	wave: function wave(i, sampleRate, frequency) {

		var vars = this.vars;
		vars.valueTable = !vars.valueTable ? [] : vars.valueTable;
		if (typeof vars.playVal == 'undefined') {
			vars.playVal = 0;
		}
		if (typeof vars.periodCount == 'undefined') {
			vars.periodCount = 0;
		}

		var valueTable = vars.valueTable;
		var playVal = vars.playVal;
		var periodCount = vars.periodCount;

		var period = sampleRate / frequency;
		var p_hundredth = Math.floor((period - Math.floor(period)) * 100);

		var resetPlay = false;

		if (valueTable.length <= Math.ceil(period)) {

			valueTable.push(Math.round(Math.random()) * 2 - 1);

			return valueTable[valueTable.length - 1];
		} else {

			valueTable[playVal] = (valueTable[playVal >= valueTable.length - 1 ? 0 : playVal + 1] + valueTable[playVal]) * 0.5;

			if (playVal >= Math.floor(period)) {
				if (playVal < Math.ceil(period)) {
					if (periodCount % 100 >= p_hundredth) {
						// Reset
						resetPlay = true;
						valueTable[playVal + 1] = (valueTable[0] + valueTable[playVal + 1]) * 0.5;
						vars.periodCount++;
					}
				} else {
					resetPlay = true;
				}
			}

			var _return = valueTable[playVal];
			if (resetPlay) {
				vars.playVal = 0;
			} else {
				vars.playVal++;
			}

			return _return;
		}
	}
}, {
	name: 'edm',
	attack: function attack() {
		return 0.002;
	},
	dampen: function dampen() {
		return 1;
	},
	wave: function wave(i, sampleRate, frequency) {
		var base = this.modulate[0];
		var mod = this.modulate.slice(1);
		return mod[0](i, sampleRate, frequency, mod[9](i, sampleRate, frequency, mod[2](i, sampleRate, frequency, Math.pow(base(i, sampleRate, frequency, 0), 3) + Math.pow(base(i, sampleRate, frequency, 0.5), 5) + Math.pow(base(i, sampleRate, frequency, 1), 7))) + mod[8](i, sampleRate, frequency, base(i, sampleRate, frequency, 1.75)));
	}
});

module.exports = Synth;