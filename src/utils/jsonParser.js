import { readFileSync } from 'fs';

// Reads the contents of a JSON file from the given path
function readJsonFile(filePath) {
    try {
        const data = readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading JSON file at ${filePath}:`, error);
        throw error;
    }
}

function updateContent(jsonData, selectedTab) {
    const body = jsonData.celestialBodies.find(b => b.name === selectedTab);
    if (!body) {
        console.error(`Celestial body "${selectedTab}" not found.`);
        return [];
    }

    const possibleSituations = jsonData.situations.filter(situation => {
        if (situation.requiresAtmosphere && !body.hasAtmosphere) return false;
        if (situation.requiresWater && !body.hasWater) return false;
        if (situation.requiresLanding && !body.canLand) return false;
        return true;
    });

    return possibleSituations.map(situation => ({
        body: selectedTab,
        situation: situation.name
    }));
}

export default {
    readJsonFile,
    updateContent
};
