/**
 * Asset Loader - Preloads and caches game assets
 */

import assetManifest from '../../assets/asset-manifest.json';

class AssetLoader {
    constructor() {
        this.towerAssets = new Map();
        this.enemyAssets = new Map();
        this.waypointAssets = new Map();
        this.loaded = false;
        this.loadProgress = 0;
    }

    /**
     * Preload all assets and return promise when complete
     */
    async load() {
        const towerPromises = Object.entries(assetManifest.towers).map(([type, path]) =>
            this.loadImage(path).then(img => this.towerAssets.set(type, img))
        );

        const enemyPromises = Object.entries(assetManifest.enemies).map(([type, path]) =>
            this.loadImage(path).then(img => this.enemyAssets.set(type, img))
        );

        const waypointPromises = assetManifest.waypoints
            ? Object.entries(assetManifest.waypoints).map(([type, path]) =>
                this.loadImage(path).then(img => this.waypointAssets.set(type, img))
            )
            : [];

        const allPromises = [...towerPromises, ...enemyPromises, ...waypointPromises];
        const total = allPromises.length;

        await Promise.all(allPromises.map((p, i) =>
            p.then(() => {
                this.loadProgress = ((i + 1) / total) * 100;
            }).catch(err => {
                console.warn(`Failed to load asset: ${err}`);
            })
        ));

        this.loaded = true;
        console.log(`✅ Loaded ${this.towerAssets.size} tower, ${this.enemyAssets.size} enemy, ${this.waypointAssets.size} waypoint assets`);
    }

    /**
     * Load a single image and return promise
     */
    loadImage(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = `/assets/${path}`;
        });
    }

    /**
     * Get tower asset by type
     */
    getTowerAsset(type) {
        return this.towerAssets.get(type) || null;
    }

    /**
     * Get enemy asset by type
     */
    getEnemyAsset(type) {
        return this.enemyAssets.get(type) || null;
    }

    /**
     * Get waypoint asset by type (castle, shrine)
     */
    getWaypointAsset(type) {
        return this.waypointAssets.get(type) || null;
    }

    /**
     * Check if all assets are loaded
     */
    isLoaded() {
        return this.loaded;
    }

    /**
     * Get load progress (0-100)
     */
    getLoadProgress() {
        return this.loadProgress;
    }
}

// Create singleton instance
const assetLoader = new AssetLoader();
export default assetLoader;
