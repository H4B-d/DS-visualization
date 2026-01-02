const queue = [];
const MAX_QUEUE_SIZE = 6;

const queueEl = document.getElementById("queue");
const inputEl = document.getElementById("inputValue");
const statusEl = document.getElementById("status");

let speed = 400;

function render() {
  queueEl.innerHTML = "";

  queue.forEach((value, index) => {
    const item = document.createElement("div");
    item.className = "queue-item";
    item.textContent = value;
    if (index === 0) {
        item.classList.add("queue-front");
    }
    if (index === queue.length - 1 && queue.length > 1) {
        item.classList.add("queue-rear");
    }

    queueEl.appendChild(item);
  });
}

function enqueue() {
  const raw = inputEl.value.trim();
  if (!raw) return;

  const values = raw.split(/\s+/);
  let isFull = false;

  for (const v of values) {
    if (queue.length >= MAX_QUEUE_SIZE) {
      isFull = true;
      break;
    }
    queue.push(v);
  }

  render();
  inputEl.value = "";

  if (isFull) {
    statusEl.textContent = "Queue is full (Max size: 6)! Please pop";
    statusEl.style.color = "#ef4444";
  } else if (queue.length > 0) {
    statusEl.textContent = "Enqueued: " + queue[queue.length - 1];
    statusEl.style.color = "#38bdf8";
  }
}

function dequeue() {
  if (queue.length === 0) {
    statusEl.textContent = "Queue Empty!";
    statusEl.style.color = "#ef4444";
    return;
  }

  const firstEl = queueEl.firstElementChild;
  if (firstEl) {
    firstEl.classList.remove("queue-front");
    firstEl.classList.add("queue-pop");
  }

  setTimeout(() => {
    const removedVal = queue.shift();
    render();
    statusEl.textContent = `Dequeued: ${removedVal}`;
    statusEl.style.color = "#facc15";
  }, speed);
}

function showFront() {
  if (queue.length === 0) return;
  statusEl.textContent = `Front: ${queue[0]}`;
  statusEl.style.color = "#38bdf8";
}

function showRear() {
  if (queue.length === 0) return;
  statusEl.textContent = `Rear: ${queue[queue.length - 1]}`;
  statusEl.style.color = "#a855f7";
}

document.getElementById("enqueueBtn").onclick = enqueue;
document.getElementById("dequeueBtn").onclick = dequeue;
document.getElementById("frontBtn").onclick = showFront;
document.getElementById("rearBtn").onclick = showRear;

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") enqueue();
});

render();
