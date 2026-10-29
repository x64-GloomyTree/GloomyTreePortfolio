# Gloomy Tree Portfolio (ASCII / Windows XP edition)
Static site, no build step. Files: index.html, style.css, script.js, .nojekyll
Deploy: repo "GloomyTreePortfolio" > Settings > Pages > Deploy from branch > main / (root).
URL: https://<username>.github.io/GloomyTreePortfolio/
Tweak: CYCLE_SECONDS, FISH_PER, WATER / SKY_* palettes in script.js; CSS variables at the top of style.css.
Sea life: SEA (sprites), SPECIES (field guide facts), PASSERS (whales, shark, turtle, manta) in script.js. Creatures sit at their real depth via yAt(metres).
Music: drop a looping track at music/theme.mp3. It starts on the visitor's first click, gets muffled (low-pass filter) once underwater and deeper still in the abyss; the tray button mutes it and remembers the choice.
