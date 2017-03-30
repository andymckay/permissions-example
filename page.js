
let permissionsEl;
let resultEl;

async function updatePermissions() {
  while (permissionsEl.firstChild) {
    permissionsEl.removeChild(permissionsEl.firstChild);
  }

  function make(what, name) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(`${what}: ${name}`));
    let b = document.createElement("button");
    b.textContent = "Revoke";
    b.addEventListener("click", async () => {
      let param = {};
      param[`${what}s`] = [name];
      try {
        let result = await browser.permissions.remove(param);
        resultEl.textContent = `remove() returned ${result}`;
      } catch (err) {
        resultEl.textContent = `remove() threw ${err.message}`;
      }
      updatePermissions();
    });
    div.appendChild(b);

    permissionsEl.appendChild(div);
  }

  let perms = await browser.permissions.getAll();
  for (let p of perms.permissions) {
    make("permission", p);
  }
  for (let o of perms.origins) {
    make("origin", o);
  }
}

async function click(e) {
  e.preventDefault();
  
  let p = document.getElementById("perms").value;
  let o = document.getElementById("origins").value;

  try {
    let result = await browser.permissions.request({
      permissions: p ? p.split(",").map(s => s.trim()) : [],
      origins: o ? o.split(",").map(s => s.trim()) : [],
    });
    resultEl.textContent = `request() returned ${result}`;
  } catch (err) {
    resultEl.textContent = `request() threw ${err.message}`;
  }

  updatePermissions();
}

window.addEventListener("load", () => {
  permissionsEl = document.getElementById("permissions");
  resultEl = document.getElementById("result");

  updatePermissions();

  let button = document.getElementById("apply");
  button.addEventListener("click", click);
});
