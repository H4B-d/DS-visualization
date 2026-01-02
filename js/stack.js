const stack = [];
const stackEl = document.getElementById("stack");
const inputEl = document.getElementById("inputValue");
const statusEl = document.getElementById("status");

let speed = 400;

function render() {
  stackEl.innerHTML = "";

  stack.forEach((value, index) => {
    const item = document.createElement("div");
    item.className = "stack-item";
    item.textContent = value;

    if (index === stack.length - 1) {
      item.classList.add("stack-top");
    }

    stackEl.appendChild(item);
  });
}

function push() {
  const val = inputEl.value.trim();
  if (!val) {
    statusEl.textContent = "Please enter a value!";
    return;
  }

  val.split(/\s+/).forEach(v => {
    stack.push(v);
  });

  render();
  inputEl.value = "";
  statusEl.textContent = `Pushed: ${val}`;
  statusEl.style.color = "#3b82f6";
}

function pop() {
  if (stack.length === 0) {
    statusEl.textContent = "Stack is empty!";
    statusEl.style.color = "#ef4444";
    return;
  }

  const items = document.querySelectorAll(".stack-item");
  const topEl = items[items.length - 1];
  
  topEl.classList.add("stack-pop");

  setTimeout(() => {
    const v = stack.pop();
    render();
    statusEl.textContent = `Popped: ${v}`;
    statusEl.style.color = "#facc15";
  }, speed);
}

function showTop() {
  if (stack.length === 0) {
    statusEl.textContent = "Stack is empty!";
    return;
  }
  const topVal = stack[stack.length - 1];
  statusEl.textContent = `Top: ${topVal}`;
  statusEl.style.color = "#3b82f6";
}

document.getElementById("pushBtn").onclick = push;
document.getElementById("popBtn").onclick = pop;
document.getElementById("topBtn").onclick = showTop;

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") push();
});

render();
