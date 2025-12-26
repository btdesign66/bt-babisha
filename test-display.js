// Test script to verify products display
window.testDisplay = function() {
    console.log("=== TEST DISPLAY FUNCTION ===");
    const grid = document.getElementById("fabricGrid");
    console.log("Grid element:", grid);
    if (grid) {
        console.log("Grid innerHTML length:", grid.innerHTML.length);
        console.log("Grid children count:", grid.children.length);
        grid.style.border = "3px solid red";
        grid.style.minHeight = "200px";
        grid.style.backgroundColor = "yellow";
    }
    
    console.log("fabricData:", window.fabricData ? window.fabricData.length : "undefined");
    console.log("filteredFabrics:", window.filteredFabrics ? window.filteredFabrics.length : "undefined");
    console.log("sampleFabrics:", window.sampleFabrics ? window.sampleFabrics.length : "undefined");
    
    if (window.displayFabrics) {
        console.log("displayFabrics function exists");
        try {
            window.displayFabrics();
            console.log("displayFabrics called successfully");
        } catch(e) {
            console.error("Error calling displayFabrics:", e);
        }
    } else {
        console.error("displayFabrics function NOT FOUND!");
    }
};
