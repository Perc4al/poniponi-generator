document.addEventListener('DOMContentLoaded', () => {
    // Fetch CSV Data function
    function fetchCSVData(url) {
        return fetch(url)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                const result = rows.slice(1).map(row => row.split(','));
                return result;
            });
    }

    // Existing code for Pony Generator
    fetchCSVData('data.csv').then(data => {
        const races = data.map(row => row[0]).filter(Boolean);
        const themes = data.map(row => row[1]).filter(Boolean);
        const personalities = data.map(row => row[2]).filter(Boolean);
        const clothings = data.map(row => row[3]).filter(Boolean);

        function getRandomElements(arr, count) {
            let shuffled = arr.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        }

        function createListItems(items) {
            return items.map(item => `<li>${item}</li>`).join('');
        }

        document.getElementById('randomizeRace').addEventListener('click', () => {
            document.getElementById('race').textContent = races[Math.floor(Math.random() * races.length)];
        });

        document.getElementById('randomizeTheme').addEventListener('click', () => {
            document.getElementById('theme').textContent = themes[Math.floor(Math.random() * themes.length)];
        });

        document.getElementById('randomizePersonality').addEventListener('click', () => {
            const numPersonality = document.getElementById('numPersonality').value || 3;
            document.querySelector('#personality ul').innerHTML = createListItems(getRandomElements(personalities, numPersonality));
        });

        document.getElementById('randomizeClothing').addEventListener('click', () => {
            const numClothing = document.getElementById('numClothing').value || 3;
            document.querySelector('#clothing ul').innerHTML = createListItems(getRandomElements(clothings, numClothing));
        });

        document.getElementById('randomizeAll').addEventListener('click', () => {
            document.getElementById('randomizeRace').click();
            document.getElementById('randomizeTheme').click();
            document.getElementById('randomizePersonality').click();
            document.getElementById('randomizeClothing').click();
        });
    });

    // Code for Color Generator
    function generateRandomColor() {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        return `rgb(${red}, ${green}, ${blue})`;
    }

    function rgbToHex(rgb) {
        const rgbValues = rgb.match(/\d+/g).map(Number);
        return `#${rgbValues.map(value => value.toString(16).padStart(2, '0')).join('')}`;
    }

    function generateColors() {
        const numColors = parseInt(document.getElementById('numColors').value, 10);
        console.log(`Generating ${numColors} colors`);  // Debug statement
        const colorScheme = document.querySelector('input[name="colorScheme"]:checked').value;
        const shiftType = document.querySelector('input[name="shiftType"]:checked').value;
        const colorTableBody = document.getElementById('colorTableBody');
        colorTableBody.innerHTML = '';

        let colors = new Set();
        let baseColor = generateRandomColor();
        console.log(`Base color: ${baseColor}`);  // Debug statement

        if (colorScheme === 'analogous') {
            let shiftValues;
            if (shiftType === 'fixed') {
                const randomShift = Math.floor(Math.random() * 21) + 10; // Shift between 10 and 30 degrees
                shiftValues = Array(numColors).fill(randomShift);
            } else {
                shiftValues = Array.from({ length: numColors }, () => Math.floor(Math.random() * 21) + 10);
            }

            for (let i = 0; i < numColors; i++) {
                let color, hue, lightness;
                do {
                    color = shiftHue(baseColor, shiftValues[i] * i);
                    if (shiftType === 'random') {
                        [hue, , lightness] = rgbToHsl(...color.match(/\d+/g).map(Number));
                        const randomLightness = Math.random() * 0.5 + 0.25; // Lightness between 0.25 and 0.75
                        color = `rgb(${hslToRgb(hue, 1, randomLightness).map(Math.round).join(', ')})`;
                    }
                } while (colors.has(color));
                colors.add(color);
            }
        } else {
            for (let i = 0; i < numColors; i++) {
                let color = baseColor;

                switch (colorScheme) {
                    case 'triadic':
                        color = shiftHue(baseColor, 120 * ((i + 1) % 3));
                        break;
                    case 'complementary':
                        color = shiftHue(baseColor, 180);
                        break;
                    default:
                        break;
                }
                colors.add(color);
            }
        }

        colors.forEach(color => {
            console.log(`Generated color: ${color}`);  // Debug statement
            const hex = rgbToHex(color);
            const row = `<tr><td style="background-color:${color};width:50px;"></td><td><code>${hex}</code></td></tr>`;
            colorTableBody.innerHTML += row;
        });
    }

    function shiftHue(color, angle) {
        let [r, g, b] = color.match(/\d+/g).map(Number);
        let [h, s, l] = rgbToHsl(r, g, b);

        h = (h + angle) % 360;
        if (h < 0) h += 360;

        let [newR, newG, newB] = hslToRgb(h, s, l);
        return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [h * 360, s, l];
    }

    function hslToRgb(h, s, l) {
        let r, g, b;

        h /= 360;

        if (s == 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [r * 255, g * 255, b * 255];
    }

    document.getElementById('generateColors').addEventListener('click', generateColors);

});
