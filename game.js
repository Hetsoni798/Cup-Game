// game.js
$(document).ready(function () {
    // Constants for cup images
    const CUPS = [
        "https://raw.githubusercontent.com/Hetsoni798/Cup-Game/refs/heads/main/img/blue.jpeg",    // Blue (0)
        "https://raw.githubusercontent.com/Hetsoni798/Cup-Game/refs/heads/main/img/green.jpeg",   // Green (1)
        "https://raw.githubusercontent.com/Hetsoni798/Cup-Game/refs/heads/main/img/purple.jpeg",  // Purple (2)
        "https://raw.githubusercontent.com/Hetsoni798/Cup-Game/refs/heads/main/img/red.jpeg",     // Red (3)
        "https://raw.githubusercontent.com/Hetsoni798/Cup-Game/refs/heads/main/img/yellow.jpeg"   // Yellow (4)
    ];

    // Game state
    let exchanges = 0;
    let targetOrder = [];
    let currentOrder = [];
    let isGameActive = false;
    let selectedCup = null;

    // DOM elements
    const targetImages = [
        document.getElementById('targetImg1'),
        document.getElementById('targetImg2'),
        document.getElementById('targetImg3'),
        document.getElementById('targetImg4'),
        document.getElementById('targetImg5')
    ];

    const cupImages = [
        document.getElementById('cupImg1'),
        document.getElementById('cupImg2'),
        document.getElementById('cupImg3'),
        document.getElementById('cupImg4'),
        document.getElementById('cupImg5')
    ];

    const cupSections = [
        document.getElementById('cup1'),
        document.getElementById('cup2'),
        document.getElementById('cup3'),
        document.getElementById('cup4'),
        document.getElementById('cup5')
    ];

    const targetRow = document.getElementById('targetRow');

    // Update stats display
    function updateStats() {
        const correctCount = currentOrder.reduce((count, pos, index) => 
            count + (pos === targetOrder[index] ? 1 : 0), 0);
        document.getElementById("exchanges").innerHTML = `Exchanges: ${exchanges}`;
        document.getElementById("correct").innerHTML = `Cup Challenge: ${correctCount} correct`;

        if (correctCount === 5 && isGameActive) {
            setTimeout(() => {
                targetRow.style.display = 'flex'; // Reveal target on win
                alert(`Congratulations! You matched the hidden order in ${exchanges} exchanges!`);
                isGameActive = false;
            }, 700);
        }
    }

    // Initialize game
    function gameStart() {
        // Generate random target order
        targetOrder = Array.from({ length: 5 }, (_, i) => i).sort(() => Math.random() - 0.5);
        
        // Generate random current order (different from target)
        do {
            currentOrder = Array.from({ length: 5 }, (_, i) => i).sort(() => Math.random() - 0.5);
        } while (currentOrder.every((val, index) => val === targetOrder[index]));

        // Set target row images (still hidden)
        targetImages.forEach((img, index) => {
            img.src = CUPS[targetOrder[index]];
            img.alt = `target ${['blue', 'green', 'purple', 'red', 'yellow'][targetOrder[index]]} cup`;
        });

        // Set player row images
        cupImages.forEach((img, index) => {
            img.src = CUPS[currentOrder[index]];
            img.alt = `cup ${['blue', 'green', 'purple', 'red', 'yellow'][currentOrder[index]]}`;
        });

        // Reset positions
        cupSections.forEach(section => {
            section.style.position = 'relative';
            section.style.left = '0';
            section.classList.remove('selected');
        });

        // Hide target row
        targetRow.style.display = 'none';

        exchanges = 0;
        isGameActive = true;
        selectedCup = null;
        updateStats();
    }

    // Select a cup for swapping
    function selectCup(index) {
        if (!isGameActive) {
            alert("Please start a new game!");
            return;
        }

        const section = cupSections[index - 1];
        if (selectedCup === null) {
            // First click: select the cup
            selectedCup = index - 1;
            section.classList.add('selected');
        } else {
            // Second click: swap with selected cup
            if (selectedCup !== index - 1) {
                const swapIndex = index - 1;
                [currentOrder[selectedCup], currentOrder[swapIndex]] = [currentOrder[swapIndex], currentOrder[selectedCup]];

                // Animate swap
                const $cup1 = $(`#cup${selectedCup + 1}`);
                const $cup2 = $(`#cup${swapIndex + 1}`);

                $cup1.animate({ left: '-50px' }, 300, () => {
                    $cup1.animate({ left: '0' }, 300);
                });
                $cup2.animate({ left: '50px' }, 300, () => {
                    $cup2.animate({ left: '0' }, 300, () => {
                        // Update images after animation
                        cupImages.forEach((img, i) => {
                            img.src = CUPS[currentOrder[i]];
                            img.alt = `cup ${['blue', 'green', 'purple', 'red', 'yellow'][currentOrder[i]]}`;
                        });
                        exchanges++;
                        updateStats();
                    });
                });
            }
            // Clear selection
            cupSections[selectedCup].classList.remove('selected');
            selectedCup = null;
        }
    }

    // Reveal target row on demand
    function revealTarget() {
        if (!isGameActive) {
            alert("Please start a new game first!");
            return;
        }
        targetRow.style.display = 'flex';
    }

    // Expose functions to global scope
    window.gameStart = gameStart;
    window.selectCup = selectCup;
    window.revealTarget = revealTarget;

    // Initialize game
    updateStats();
});
