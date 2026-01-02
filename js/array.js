let arr = [];
let size = 0;
let highlightedIndex = null;
let low = 0;
let high = -1;
let mid = null;
let stepTarget = null;
let isStepMode = false;
let stepPhase = "compare";
let i = 0;
let j = 0; 
let isSorting = false;
let isSortStepMode = false;

const SEARCH_SPEED = 900;
const SORT_SPEED = 1000;

const wrapper = document.getElementById("arrayWrapper");
const createBtn = document.getElementById("createArray");
const confirmBtn = document.getElementById("confirmBtn");
const resetBtn = document.getElementById("resetBtn");
const binarySearchBtn = document.getElementById("binarySearchBtn");
const binaryStepBtn = document.getElementById("binaryStepBtn");
const bubbleAutoBtn = document.getElementById("bubbleAutoBtn");
const bubbleStepBtn = document.getElementById("bubbleStepBtn");
const searchInput = document.getElementById("searchValue");
const arrayControls = document.getElementById("arrayControls");
const searchStatus = document.getElementById("searchStatus");
const sortStatus = document.getElementById("sortStatus");
const controlPanel = document.getElementById("controlPanel");


createBtn.addEventListener("click", () => {
    size = parseInt(document.getElementById("arraySize").value);
    if (isNaN(size) || size <= 0 || size > 10) {
        alert("Array size must be between 1 and 10!");
        return;
    }
    arr = Array(size).fill(null);
    highlightedIndex = null;
    renderArray();
    arrayControls.classList.remove("disabled");
    clearLogs();
    showAllControls();
});

function renderArray() {
    wrapper.innerHTML = "";
    for (let k = 0; k < size; k++) {
        const col = document.createElement("div");
        col.className = "array-col";
        const valueCell = document.createElement("div");
        valueCell.className = "array-cell value";
        valueCell.textContent = arr[k] === null ? "?" : arr[k];
        if (k === highlightedIndex) valueCell.classList.add("highlight");
        const indexCell = document.createElement("div");
        indexCell.className = "array-cell index";
        indexCell.textContent = k;
        col.appendChild(valueCell);
        col.appendChild(indexCell);
        wrapper.appendChild(col);
    }
}

confirmBtn.addEventListener("click", () => {
    const index = parseInt(document.getElementById("indexInput").value);
    const value = parseInt(document.getElementById("valueInput").value);
    if (isNaN(index) || isNaN(value) || index < 0 || index >= size) {
        alert("Invalid Index or Value");
        return;
    }
    if (arr[index] !== null) {
        alert(`Index ${index} is already filled.`);
        return;
    }
    const targetCell = document.querySelectorAll(".array-cell.value")[index];
    animateInputToCell(value, targetCell, () => {
        arr[index] = value;
        highlightedIndex = index;
        renderArray();
        setTimeout(() => {
            highlightedIndex = null;
            renderArray();
        }, 600);
    });
});


function animateInputToCell(value, targetCell, callback) {
    const input = document.getElementById("valueInput");
    const start = input.getBoundingClientRect();
    const end = targetCell.getBoundingClientRect();
    const flying = document.createElement("div");
    flying.className = "flying-value";
    flying.textContent = value;
    document.body.appendChild(flying);
    flying.style.left = start.left + "px";
    flying.style.top = start.top + "px";
    
    requestAnimationFrame(() => {
        flying.style.left = (end.left + end.width / 2 - 12) + "px";
        flying.style.top = (end.top + end.height / 2 - 12) + "px";
        flying.style.transform = "scale(1.3)";
    });

    setTimeout(() => {
        flying.style.opacity = "0";
        setTimeout(() => flying.remove(), 200);
        callback();
    }, 500);
}

function animateSwap(idx1, idx2, callback) {
    const cols = document.querySelectorAll(".array-col");
    cols[idx1].classList.add("swap-right");
    cols[idx2].classList.add("swap-left");
    setTimeout(() => {
        cols[idx1].classList.remove("swap-right");
        cols[idx2].classList.remove("swap-left");
        callback();
    }, 500);
}

binarySearchBtn.addEventListener("click", () => {
    sortStatus.textContent = "";
    const target = Number(searchInput.value);
    if (arr.includes(null)) { alert("Array is not fully assigned!"); return; }
    if (!isSorted(arr)) { alert("Array needs to be sorted!"); return; }
    
    low = 0;
    high = arr.length - 1;
    clearSearchHighlight();
    setStatus("Searching...");
    searchStepAuto(target);
});

binaryStepBtn.addEventListener("click", () => {
    sortStatus.textContent = "";
    const target = Number(searchInput.value);
    if (arr.includes(null)) { alert("Array is not fully assigned!"); return; }
    if (!isSorted(arr)) { alert("Array needs to be sorted!"); return; }

    if (!isStepMode) {
        resetSearchUI();
        isStepMode = true;
        stepTarget = target;
        low = 0;
        high = arr.length - 1;
        mid = Math.floor((low + high) / 2);
        highlightSearch(low, mid, high);
        setStatus(`Step mode: Checking index ${mid}`);
        return;
    }
    runBinaryStep();
});

function searchStepAuto(target) {
    if (low > high) { setStatus("Value not found!"); return; }
    mid = Math.floor((low + high) / 2);
    highlightSearch(low, mid, high);

    if (arr[mid] === target) {
        setStatus(`Success: Found ${target} at index ${mid}`);
        return;
    }
    setTimeout(() => {
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
        searchStepAuto(target);
    }, SEARCH_SPEED);
}

function runBinaryStep() {
    if (low > high) { setStatus("Value not found!"); isStepMode = false; return; }

    if (stepPhase === "compare") {
        highlightSearch(low, mid, high);
        setStatus(`Compare: Target ${stepTarget} with arr[${mid}] = ${arr[mid]}`);
        if (arr[mid] === stepTarget) {
            setStatus(`Found ${stepTarget} at index ${mid}!`);
            isStepMode = false;
            return;
        }
        stepPhase = "move";
    } else if (stepPhase === "move") {
        if (arr[mid] < stepTarget) {
            setStatus(`arr[${mid}] < ${stepTarget} → Target is on the right, set Low = ${mid + 1}`);
            low = mid + 1;
        } else {
            setStatus(`arr[${mid}] > ${stepTarget} → Target is on the left, set High = ${mid - 1}`);
            high = mid - 1;
        }
        stepPhase = "next";
    } else if (stepPhase === "next") {
        mid = Math.floor((low + high) / 2);
        setStatus(`Set new Mid = ${mid}`);
        highlightSearch(low, mid, high);
        stepPhase = "compare";
    }
}

bubbleAutoBtn.addEventListener("click", async () => {
    if (arr.includes(null)) { alert("Array is not fully assigned!"); return; }
    if (isSorting || isSortStepMode) return;
    
    searchStatus.textContent = "";
    resetSearchUI();
    isSorting = true;
    setSortStatus("Starting...");

    for (let a = 0; a < arr.length - 1; a++) {
        for (let b = 0; b < arr.length - a - 1; b++) {
            highlightCompare(b, b + 1);
            setSortStatus(`Compare ${arr[b]} and ${arr[b + 1]}`);
            await new Promise(r => setTimeout(r, SORT_SPEED));

            if (arr[b] > arr[b + 1]) {
                setSortStatus(`Swap ${arr[b]} ↔ ${arr[b + 1]}`);
                await new Promise(resolve => {
                    animateSwap(b, b + 1, () => {
                        [arr[b], arr[b + 1]] = [arr[b + 1], arr[b]];
                        renderArray();
                        highlightCompare(b, b + 1);
                        resolve();
                    });
                });
            }
        }
    }
    clearCompareHighlight();
    setSortStatus("Array is sorted!");
    isSorting = false;
});

bubbleStepBtn.addEventListener("click", () => {
    searchStatus.textContent = "";
    if (!isSortStepMode) {
        if (arr.includes(null)) { alert("Array is not fully assigned"); return; }
        resetSearchUI();
        isSortStepMode = true;
        i = 0; j = 0;
        setSortStatus("Starting...Press Sort (step) to continue!");
        return;
    }
    runBubbleStep();
});

function runBubbleStep() {
    if (i >= arr.length - 1) {
        setSortStatus("Array is sorted!");
        isSortStepMode = false;
        clearCompareHighlight();
        return;
    }
    highlightCompare(j, j + 1);
    setSortStatus(`Compare: arr[${j}] and arr[${j+1}]`);

    if (arr[j] > arr[j + 1]) {
        setSortStatus(`Swap: ${arr[j]} > ${arr[j+1]}`);
        animateSwap(j, j + 1, () => {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            renderArray();
            highlightCompare(j, j + 1);
        });
        return;
    }
    j++;
    if (j >= arr.length - i - 1) { j = 0; i++; }
}


function highlightSearch(l, m, h) {
    const cells = document.querySelectorAll(".array-cell.value");
    cells.forEach(c => {
        c.style.borderColor = "#3b82f6";
        c.querySelectorAll(".pointer-label").forEach(p => p.remove());
    });
    if (cells[l]) { addPointer(cells[l], "LOW", "pointer-low"); cells[l].style.borderColor = "#10b981"; }
    if (cells[m]) { addPointer(cells[m], "MID", "pointer-mid"); cells[m].style.borderColor = "#facc15"; }
    if (cells[h]) { addPointer(cells[h], "HIGH", "pointer-high"); cells[h].style.borderColor = "#ef4444"; }
}

function addPointer(cell, text, className) {
    const label = document.createElement("div");
    label.className = `pointer-label ${className}`;
    label.textContent = text;
    cell.appendChild(label);
}

function highlightCompare(idx1, idx2) {
    const cells = document.querySelectorAll(".array-cell.value");
    cells.forEach((c, idx) => {
        c.classList.remove("cell-compare");
        if (idx === idx1 || idx === idx2) c.classList.add("cell-compare");
    });
}

function clearCompareHighlight() {
    document.querySelectorAll(".array-cell.value").forEach(c => c.classList.remove("cell-compare"));
}

function clearSearchHighlight() {
    document.querySelectorAll(".array-cell.value").forEach(c => {
        c.style.borderColor = "#3b82f6";
        c.querySelectorAll(".pointer-label").forEach(p => p.remove());
    });
}

function resetSearchUI() {
    isStepMode = false;
    stepPhase = "compare";
    clearSearchHighlight();
    searchStatus.textContent = "";
    renderArray();
}

function isSorted(data) {
    for (let k = 1; k < data.length; k++) {
        if (data[k - 1] > data[k]) return false;
    }
    return true;
}

function clearLogs() { searchStatus.textContent = ""; sortStatus.textContent = ""; }
function showAllControls() { controlPanel.classList.remove("hidden"); }
function hideAllControls() { controlPanel.classList.add("hidden"); }
function setStatus(msg) { searchStatus.textContent = msg; }
function setSortStatus(msg) { sortStatus.textContent = msg; }

resetBtn.addEventListener("click", () => location.reload());

window.addEventListener("DOMContentLoaded", hideAllControls);













