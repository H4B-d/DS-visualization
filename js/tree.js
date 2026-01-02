class Node {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.x = 0; this.y = 0; this.el = null;
  }
}

let root = null;
let delay = 1000;
const valueInput = document.getElementById("valueInput");
const resultEl = document.getElementById("result");
const sequenceContainer = document.getElementById("inorder-sequence");

function setStatus(msg, color = "#10b981") {
  resultEl.innerHTML = msg;
  resultEl.style.color = color;
}

function clearStatus() {
  const nodes = document.querySelectorAll(".node");
  nodes.forEach(n => n.classList.remove("highlight", "found"));
  if (sequenceContainer) sequenceContainer.innerHTML = "";
  resultEl.innerHTML = "";
}

function resetTree() {
  root = null; 
  render();    
  clearStatus();
  setStatus("Tree has been reset.", "#ef4444");
}

const sleep = () => new Promise(resolve => setTimeout(resolve, delay));

async function insert() {
  const val = Number(valueInput.value);
  if (valueInput.value === "" || isNaN(val)) return;
  valueInput.value = "";
  clearStatus();
  setStatus(`Starting insertion of <span class="highlight-text">${val}</span>...`, "#38bdf8");
  root = await insertRecursive(root, val);
  render();
}

async function insertRecursive(node, val) {
  if (!node) {
    setStatus(`Empty spot found. Inserting <span class="highlight-text">${val}</span>.`, "#10b981");
    return new Node(val);
  }
  node.el.classList.add("highlight");
  if (val < node.val) {
    setStatus(`Compare: <span class="highlight-text">${val}</span> < ${node.val}. Moving <b>Left</b>.`, "#facc15");
    await sleep();
    node.el.classList.remove("highlight");
    node.left = await insertRecursive(node.left, val);
  } else if (val > node.val) {
    setStatus(`Compare: <span class="highlight-text">${val}</span> > ${node.val}. Moving <b>Right</b>.`, "#facc15");
    await sleep();
    node.el.classList.remove("highlight");
    node.right = await insertRecursive(node.right, val);
  }
  return node;
}

async function deleteValue() {
  const val = Number(valueInput.value);
  if (valueInput.value === "" || isNaN(val)) return;
  valueInput.value = "";
  clearStatus();
  root = await deleteRecursive(root, val);
  render();
}

async function deleteRecursive(node, val) {
  if (!node) { setStatus(`Value ${val} not found.`, "#ef4444"); return null; }

  node.el.classList.add("highlight");
  if (val < node.val) {
    setStatus(`Searching: ${val} < ${node.val}. Moving <b>Left</b>.`, "#facc15");
    await sleep(); 
    node.el.classList.remove("highlight");
    node.left = await deleteRecursive(node.left, val);
  } else if (val > node.val) {
    setStatus(`Searching: ${val} > ${node.val}. Moving <b>Right</b>.`, "#facc15");
    await sleep(); 
    node.el.classList.remove("highlight");
    node.right = await deleteRecursive(node.right, val);
  } else {
    setStatus(`Found target <span class="highlight-text">${val}</span>.`, "#10b981");
    node.el.classList.remove("highlight");
    node.el.classList.add("found");
    await sleep();

    if (!node.left && !node.right) return null;
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    
    setStatus(`Finding successor...`, "#38bdf8");
    await sleep();

    let min = node.right;
    min.el.classList.add("found");
    while (min.left) {
      min = min.left;
      min.el.classList.add("found");
      await sleep();
    }
    node.val = min.val;
    await sleep();
    node.right = await deleteRecursive(node.right, min.val);
  }
  return node;
}

async function startInorder() {
  if (!root) return;
  clearStatus();
  let steps = [];
  function traverse(n) {
    if (!n) return;
    traverse(n.left);
    steps.push(n);
    traverse(n.right);
  }
  traverse(root);

  setStatus("Inorder Traversal: Generating sorted sequence...", "#38bdf8");
  for (let node of steps) {
    node.el.classList.add("highlight");
    const box = document.createElement("div");
    box.className = "seq-node";
    box.innerText = node.val;
    sequenceContainer.appendChild(box);
    await sleep();
    node.el.classList.remove("highlight");
    node.el.classList.add("found");
  }
  setStatus("Sequence is now sorted.", "#10b981");
}

async function bfsStepSearch() {
  const target = Number(valueInput.value);
  if (valueInput.value === "" || isNaN(target)) return;
  valueInput.value = "";
  clearStatus();
  let queue = [root];
  while (queue.length > 0) {
    let node = queue.shift();
    if (!node) continue;
    node.el.classList.add("highlight");
    await sleep();
    if (node.val === target) {
      node.el.classList.remove("highlight");
      node.el.classList.add("found");
      setStatus(`Target ${target} found!`, "#10b981");
      return;
    }
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
    node.el.classList.remove("highlight");
  }
  setStatus(`Target ${target} not found.`, "#ef4444");
}

/* --- RENDER LOGIC --- */
function setPosition(node, x, y, rangeStart, rangeEnd) {
  if (!node) return;
  node.x = x; node.y = y;
  if (node.left) setPosition(node.left, (rangeStart + x) / 2, y + 80, rangeStart, x);
  if (node.right) setPosition(node.right, (x + rangeEnd) / 2, y + 80, x, rangeEnd);
}

function render() {
  const container = document.getElementById("tree-container");
  container.innerHTML = "";
  if (!root) return;
  const w = container.offsetWidth;
  setPosition(root, w / 2, 50, 0, w);
  drawEdges(root, container);
  drawNodes(root, container);
}

function drawNodes(node, container) {
  if (!node) return;
  const div = document.createElement("div");
  div.className = "node";
  div.style.left = node.x + "px"; div.style.top = node.y + "px";
  div.innerText = node.val; node.el = div;
  container.appendChild(div);
  drawNodes(node.left, container); drawNodes(node.right, container);
}

function drawEdges(node, container) {
  if (!node) return;
  if (node.left) createLine(node, node.left, container);
  if (node.right) createLine(node, node.right, container);
  drawEdges(node.left, container); drawEdges(node.right, container);
}

function createLine(p, c, container) {
  const dx = c.x - p.x, dy = c.y - p.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const ang = Math.atan2(dy, dx) * (180 / Math.PI);
  const line = document.createElement("div");
  line.className = "edge";
  line.style.width = dist + "px";
  line.style.left = p.x + "px"; line.style.top = p.y + "px";
  line.style.transform = `rotate(${ang}deg)`;
  container.appendChild(line);
}

window.onresize = render;
render();
