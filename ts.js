(function () {
    'use strict';

    const ENEMY_NICKS = ['enemy1', 'enemy2', 'enemy3']; // Replace with actual enemy names
    const detectedPlayers = new Map();

    function getPlayerStore() {
        if (!window.app?.tabManager) return null;
        const symbols = Object.getOwnPropertySymbols(window.app.tabManager);
        for (let s of symbols) {
            const val = window.app.tabManager[s];
            if (val?.store?.all) return val.store.all;
        }
        return null;
    }

    function detectEnemies() {
        const store = getPlayerStore();
        const skinMap = window.parent?.Texture?.customSkinMap || new Map();
        const seenKeys = new Set();

        if (store) {
            for (const player of Object.values(store)) {
                const id = player.id;
                const nick = player.nick || player._nick || `ID_${id}`;
                const skinURL = player.skinURL || '';

                const key = `${nick}|${skinURL}`;
                seenKeys.add(key);

                if (!detectedPlayers.has(key)) {
                    detectedPlayers.set(key, true);

                    const isEnemy = ENEMY_NICKS.some(enemy => nick.toLowerCase().includes(enemy.toLowerCase()));
                    if (isEnemy) {
                        console.log(`⚠️ Enemy detected: ${nick}`);
                        alert(`Enemy spotted: ${nick}`);
                        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
                        audio.play();
                    }
                }
            }
        }

        // Also detect players with no skinURL but present in skinMap
        skinMap.forEach((value, key) => {
            const nick = key;
            const skinURL = value || '';
            const mapKey = `${nick}|${skinURL}`;
            if (!seenKeys.has(mapKey) && !detectedPlayers.has(mapKey)) {
                detectedPlayers.set(mapKey, true);

                const isEnemy = ENEMY_NICKS.some(enemy => nick.toLowerCase().includes(enemy.toLowerCase()));
                if (isEnemy) {
                    console.log(`⚠️ Enemy detected (texture map): ${nick}`);
                    alert(`Enemy spotted (texture): ${nick}`);
                    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
                    audio.play();
                }
            }
        });
    }

    setInterval(detectEnemies, 1000);

    const btn = document.createElement('button');
    btn.textContent = 'Enemy Log';
    btn.style.cssText = 'position:fixed;top:10px;left:10px;z-index:9999;padding:6px;background:#c00;color:white;';
    btn.onclick = () => {
        const log = Array.from(detectedPlayers.keys()).join('\n');
        alert('Detected Players:\n' + log);
    };
    document.body.appendChild(btn);
})();
