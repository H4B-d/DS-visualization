class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let head = null;

function render(state = {}, message = "") {
  const logContent = document.getElementById("log-content");
  if (logContent) logContent.innerHTML = `${message}`;
  
  const list = document.getElementById("list");
  list.innerHTML = "";

  const { current, prev, dummy, newNode, deleteNode } = state;

  if (dummy) {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div class="list-row">
        <div class="node-column">
          <div class="pointer">&nbsp;</div>
          <div class="node dummy">DUMMY</div>
        </div>
        <span class="arrow">→</span>
      </div>`;
    list.appendChild(item);
  }

  let temp = head;
  while (temp) {
    const item = document.createElement("div");
    item.className = "list-item";
    const nodeColumn = document.createElement("div");
    nodeColumn.className = "node-column";

    const pointer = document.createElement("div");
    pointer.className = "pointer";
    if (temp === head) {
      pointer.textContent = "HEAD";
      pointer.classList.add("head-pointer");
    } else if (temp.next === null) {
      pointer.textContent = "TAIL";
      pointer.classList.add("tail-pointer");
    } else {
      pointer.innerHTML = "&nbsp;";
    }

    const div = document.createElement("div");
    div.className = "node";
    div.textContent = temp.value;
    
    if (temp === current) div.classList.add("current");
    if (temp === prev) div.classList.add("prev");
    if (temp === newNode) div.classList.add("new");
    if (temp === deleteNode) div.classList.add("delete");

    nodeColumn.appendChild(pointer);
    nodeColumn.appendChild(div);

    const row = document.createElement("div");
    row.className = "list-row";
    row.appendChild(nodeColumn);

    if (temp.next) {
      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.textContent = "→";
      row.appendChild(arrow);
    }

    item.appendChild(row);
    list.appendChild(item);
    temp = temp.next;
  }

  if (head !== null) {
    const nullDiv = document.createElement("div");
    nullDiv.innerHTML = `<div class="list-row"><span class="arrow">→</span><div class="null-text">NULL</div></div>`;
    list.appendChild(nullDiv);
  }
}


async function insertHead() {
  const input = document.getElementById("valueHT");
  if (!input.value) return;
  const val = Number(input.value);
  
  render({}, `Initializing: Preparing to insert <span class="highlight">${val}</span> at the Head.`);
  await sleep();

  const dummy = new Node(null);
  dummy.next = head;
  render({ dummy }, "Creating a <b>Dummy Node</b> to safely handle the insertion.");
  await sleep();

  const nNode = new Node(val);
  render({ dummy, newNode: nNode }, `New Node created with value <span class="highlight">${val}</span>.`);
  await sleep();

  nNode.next = head;
  render({ dummy, newNode: nNode }, "Linking: Setting <b>next</b> pointer of new node to current Head.");
  await sleep();
  
  head = nNode;
  render({ current: nNode }, `Success: <span class="highlight">${val}</span> is now the new Head.`);
  await sleep();

  render();
  input.value = ""; 
}

async function insertTail() {
  const input = document.getElementById("valueHT");
  if (!input.value) return;
  const val = Number(input.value);

  if (!head) { alert("List is empty! Please use Insert Head first."); return; }

  render({}, `Searching for the Tail to insert <span class="highlight">${val}</span>.`);
  const nNode = new Node(val);
  let curr = head;

  while (curr.next) {
    render({ current: curr }, `Traversing: Passing through Node <span class="highlight">${curr.value}</span>...`);
    await sleep();
    curr = curr.next;
  }

  curr.next = nNode;
  render({ current: curr, newNode: nNode }, "Tail found. Successfully linked the new node.");
  await sleep();

  render();
  input.value = "";
}

async function insertBeforeNode() {
  const val = Number(document.getElementById("valueBA").value);
  const target = Number(document.getElementById("targetBA").value);
  if (!head) { alert("List is empty!"); return; }

  const dummy = new Node(null);
  dummy.next = head;
  let p = dummy;
  let c = head;

  while (c) {
    render({ dummy, prev: p, current: c }, `Checking Node <span class="highlight">${c.value}</span>...`);
    await sleep();

    if (c.value === target) {
      const nNode = new Node(val);
      nNode.next = c;
      p.next = nNode;
      head = dummy.next;
      render({ dummy, newNode: nNode, current: c }, "Target found. Inserting new node before the target.");
      await sleep();
      render();
      return;
    }
    p = c;
    c = c.next;
  }
  render({}, `Result: Target node <span class="highlight">${target}</span> not found.`);
}

async function insertAfterNode() {
  const val = Number(document.getElementById("valueBA").value);
  const target = Number(document.getElementById("targetBA").value);
  if (!head) { alert("List is empty!"); return; }

  let c = head;
  while (c) {
    render({ current: c }, `Traversing: Looking for Node <span class="highlight">${c.value}</span>...`);
    await sleep();

    if (c.value === target) {
      const nNode = new Node(val);
      nNode.next = c.next;
      c.next = nNode;
      render({ current: c, newNode: nNode }, "Target found! Inserting new node after the target.");
      await sleep();
      render();
      return;
    }
    c = c.next;
  }
  render({}, `Result: Target <span class="highlight">${target}</span> not found.`);
}

async function deleteNode() {
  const val = Number(document.getElementById("valueDel").value);
  if (!head) { alert("List is empty!"); return; }

  const dummy = new Node(null);
  dummy.next = head;
  let p = dummy;
  let c = head;

  while (c) {
    render({ dummy, prev: p, current: c }, `Searching for Node <span class="highlight">${val}</span> to delete...`);
    await sleep();

    if (c.value === val) {
      render({ dummy, prev: p, deleteNode: c }, "Target found. Updating links to bypass the node.");
      await sleep();
      p.next = c.next;
      head = dummy.next;
      render();
      return;
    }
    p = c;
    c = c.next;
  }
  render({}, `Result: Value <span class="highlight">${val}</span> not found in the list.`);
}






