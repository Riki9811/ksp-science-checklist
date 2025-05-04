const SITUATIONS = {
	type: "array",
	minItems: 1,
	items: {
		type: "object",
		properties: {
			name: { type: "string", minLength: 1 },
			displayName: { type: "string", minLength: 1 },
			requiresAtmosphere: { type: "boolean" },
			requiresWater: { type: "boolean" },
			requiresLanding: { type: "boolean" },
			activityTypes: {
				type: "object",
				properties: {
					asteroidSample: { enum: ["biome", "global", null] },
					atmosphereAnalysis: { enum: ["biome", "global", null] },
					barometerScan: { enum: ["biome", "global", null] },
					cometSample_short: { enum: ["biome", "global", null] },
					cometSample_intermediate: { enum: ["biome", "global", null] },
					cometSample_long: { enum: ["biome", "global", null] },
					cometSample_interstellar: { enum: ["biome", "global", null] },
					crewReport: { enum: ["biome", "global", null] },
					evaScience: { enum: ["biome", "global", null] },
					evaReport: { enum: ["biome", "global", null] },
					gravityScan: { enum: ["biome", "global", null] },
					infraredTelescope: { enum: ["biome", "global", null] },
					magnetometer: { enum: ["biome", "global", null] },
					mobileMaterialsLab: { enum: ["biome", "global", null] },
					mysteryGoo: { enum: ["biome", "global", null] },
					seismicScan: { enum: ["biome", "global", null] },
					surfaceSample: { enum: ["biome", "global", null] },
					temperatureScan: { enum: ["biome", "global", null] }
				}
			}
		},
		required: ["name", "displayName", "requiresAtmosphere", "requiresWater", "requiresLanding", "activityTypes"],
		additionalProperties: false
	}
};

const ACTIVITIES = {
	type: "array",
	minItems: 1,
	items: {
		type: "object",
		properties: {
			name: { type: "string", minLength: 1 },
			displayName: { type: "string", minLength: 1 },
			requiresAtmosphere: { type: "boolean" }
		},
		required: ["name", "displayName", "requiresAtmosphere"],
		additionalProperties: false
	}
};

const DEPLOYED_EXP = {
	type: "array",
	minItems: 1,
	items: {
		type: "object",
		properties: {
			name: { type: "string", minLength: 1 },
			displayName: { type: "string", minLength: 1 },
			requiresAtmosphere: { type: "boolean" },
			requiresVacuum: { type: "boolean" }
		},
		required: ["name", "displayName", "requiresAtmosphere", "requiresVacuum"],
		additionalProperties: false,
		not: {
			properties: {
				requiresAtmosphere: { const: true },
				requiresVacuum: { const: true }
			}
		}
	}
};

const CELESTIAL_BODIES = {
	type: "array",
	minItems: 1,
	items: {
		type: "object",
		properties: {
			name: { type: "string", minLength: 1 },
			displayName: { type: "string", minLength: 1 },
			isLandable: { type: "boolean" },
			hasAtmosphere: { type: "boolean" },
			hasWater: { type: "boolean" },
			biomes: {
				type: "array",
				items: { type: "string", minLength: 1 },
				default: []
			},
			specialBiomes: {
				type: "array",
				items: { type: "string", minLength: 1 },
				default: []
			},
			recovery: {
				type: "array",
				items: {
					type: "object",
					properties: {
						name: { type: "string", minLength: 1 },
						displayName: { type: "string", minLength: 1 }
					},
					required: ["name", "displayName"],
					additionalProperties: false
				},
				default: []
			},
			ROCScience: {
				type: "array",
				items: {
					type: "object",
					properties: {
						name: { type: "string", minLength: 1 },
						displayName: { type: "string", minLength: 1 }
					},
					required: ["name", "displayName"],
					additionalProperties: false
				},
				default: []
			}
		},
		required: ["name", "displayName", "isLandable", "hasAtmosphere", "hasWater", "biomes", "recovery", "ROCScience"],
		additionalProperties: false
	}
};

export default { SITUATIONS, ACTIVITIES, DEPLOYED_EXP, CELESTIAL_BODIES };
