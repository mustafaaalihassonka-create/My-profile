
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "mz-personal-island-v1";

const defaults = {
  name: "مصطفى علي",
  bio: "هنا عالمي الصغير، حساباتي، اهتماماتي وكل شيء أحب أشاركه وياكم.",
  photo: "",
  links: [
    { name: "Telegram", url: "https://t.me/soof0", symbol: "TG" },
    { name: "TikTok", url: "https://www.tiktok.com/@_mu_66", symbol: "TT" },
    { name: "Facebook", url: "https://www.facebook.com/mustafaa.Ali.hasson", symbol: "FB" }
  ]
};

let data;
let toastTimer;

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    data = saved && Array.isArray(saved.links)
      ? { ...defaults, ...saved, links: saved.links }
      : structuredClone(defaults);
  } catch {
    data = structuredClone(defaults);
  }
}

function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function saveData(message = "انحفظت التغييرات على هذا الجهاز") {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    render();
    notify(message);
  } catch {
    notify("الصورة كبيرة أو مساحة الحفظ ممتلئة. جرّب صورة أصغر.");
  }
}

function render() {
  $("displayName").textContent = data.name || defaults.name;
  $("displayBio").textContent = data.bio || defaults.bio;
  $("nameInput").value = data.name || "";
  $("bioInput").value = data.bio || "";

  const photo = $("profilePhoto");
  const placeholder = $("photoPlaceholder");
  if (data.photo) {
    photo.src = data.photo;
    photo.hidden = false;
    placeholder.hidden = true;
  } else {
    photo.removeAttribute("src");
    photo.hidden = true;
    placeholder.hidden = false;
  }

  const list = $("socialList");
  list.replaceChildren();

  data.links.forEach((link, index) => {
    const card = document.createElement("div");
    card.className = "social-card";

    const symbol = document.createElement("span");
    symbol.className = "social-symbol";
    symbol.textContent = link.symbol || "↗";

    const info = document.createElement("a");
    info.className = "social-info";
    info.href = link.url;
    info.target = "_blank";
    info.rel = "noopener noreferrer";

    const title = document.createElement("strong");
    title.textContent = link.name;
    const address = document.createElement("small");
    address.textContent = link.url;
    info.append(title, address);

    const edit = document.createElement("button");
    edit.className = "close-btn";
    edit.type = "button";
    edit.textContent = "✎";
    edit.setAttribute("aria-label", "تعديل " + link.name);
    edit.addEventListener("click", () => showLinkForm(index));

    card.append(symbol, info, edit);
    list.append(card);
  });
}

function openSettings() {
  $("settingsModal").hidden = false;
  $("nameInput").value = data.name;
  $("bioInput").value = data.bio;
}

function closeSettings() {
  $("settingsModal").hidden = true;
}

$("openSettings").addEventListener("click", openSettings);
$("closeSettings").addEventListener("click", closeSettings);

$("settingsModal").addEventListener("click", (event) => {
  if (event.target === $("settingsModal")) closeSettings();
});

$("saveSettings").addEventListener("click", () => {
  data.name = $("nameInput").value.trim() || defaults.name;
  data.bio = $("bioInput").value.trim() || defaults.bio;
  saveData();
  closeSettings();
});

$("resetSettings").addEventListener("click", () => {
  if (!confirm("ترجع الموقع إلى النموذج الأصلي؟")) return;
  data = structuredClone(defaults);
  localStorage.removeItem(STORAGE_KEY);
  render();
  closeSettings();
  notify("رجع الموقع إلى النموذج الأصلي");
});

$("photoInput").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    notify("اختار صورة صحيحة");
    return;
  }

  if (file.size > 12 * 1024 * 1024) {
    notify("اختار صورة حجمها أقل من 12 ميغابايت");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 700 / Math.max(image.width, image.height));
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      data.photo = canvas.toDataURL("image/jpeg", 0.78);
      saveData("تم تغيير الصورة على هذا الجهاز");
      event.target.value = "";
    };
    image.onerror = () => notify("ما كدرت أفتح الصورة. جرّب غير صورة.");
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function showLinkForm(index = -1) {
  document.querySelector(".link-form")?.remove();

  const existing = index >= 0 ? data.links[index] : { name: "", url: "", symbol: "↗" };
  const form = document.createElement("form");
  form.className = "link-form";
  form.innerHTML = `
    <h3>${index >= 0 ? "تعديل الحساب" : "إضافة حساب جديد"}</h3>
    <label>اسم المنصة أو الحساب
      <input name="name" maxlength="40" required placeholder="مثلاً: YouTube">
    </label>
    <label>رابط الحساب الكامل
      <input name="url" type="url" required placeholder="https://..." dir="ltr">
    </label>
    <div>
      <button type="submit">حفظ الحساب</button>
      <button type="button" class="cancel-link">إلغاء</button>
      ${index >= 0 ? '<button type="button" class="cancel-link delete-link">حذف الحساب</button>' : ""}
    </div>
  `;

  form.elements.name.value = existing.name;
  form.elements.url.value = existing.url;
  $("socialList").after(form);
  form.scrollIntoView({ behavior: "smooth", block: "center" });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const url = form.elements.url.value.trim();

    try {
      const parsed = new URL(url);
      if (!["https:", "http:"].includes(parsed.protocol)) throw new Error();
    } catch {
      notify("اكتب رابط صحيح يبدأ بـ https://");
      return;
    }

    const item = {
      name,
      url,
      symbol: name.slice(0, 2).toUpperCase()
    };

    if (index >= 0) data.links[index] = item;
    else data.links.push(item);

    form.remove();
    saveData("تم حفظ الحساب");
  });

  form.querySelector(".cancel-link").addEventListener("click", () => form.remove());

  form.querySelector(".delete-link")?.addEventListener("click", () => {
    if (!confirm("متأكد تريد تحذف هذا الحساب؟")) return;
    data.links.splice(index, 1);
    form.remove();
    saveData("تم حذف الحساب");
  });
}

$("addLinkButton").addEventListener("click", () => showLinkForm());

loadData();
render();
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "mz-personal-island-v1";

const defaults = {
  name: "مصطفى علي",
  bio: "هنا عالمي الصغير، حساباتي، اهتماماتي وكل شيء أحب أشاركه وياكم.",
  photo: "",
  links: [
    { name: "Telegram", url: "https://t.me/soof0", symbol: "TG" },
    { name: "TikTok", url: "https://www.tiktok.com/@_mu_66", symbol: "TT" },
    { name: "Facebook", url: "https://www.facebook.com/mustafaa.Ali.hasson", symbol: "FB" }
  ]
};

let data;
let toastTimer;

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    data = saved && Array.isArray(saved.links)
      ? { ...defaults, ...saved, links: saved.links }
      : structuredClone(defaults);
  } catch {
    data = structuredClone(defaults);
  }
}

function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function saveData(message = "انحفظت التغييرات على هذا الجهاز") {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    render();
    notify(message);
  } catch {
    notify("الصورة كبيرة أو مساحة الحفظ ممتلئة. جرّب صورة أصغر.");
  }
}

function render() {
  $("displayName").textContent = data.name || defaults.name;
  $("displayBio").textContent = data.bio || defaults.bio;
  $("nameInput").value = data.name || "";
  $("bioInput").value = data.bio || "";

  const photo = $("profilePhoto");
  const placeholder = $("photoPlaceholder");
  if (data.photo) {
    photo.src = data.photo;
    photo.hidden = false;
    placeholder.hidden = true;
  } else {
    photo.removeAttribute("src");
    photo.hidden = true;
    placeholder.hidden = false;
  }

  const list = $("socialList");
  list.replaceChildren();

  data.links.forEach((link, index) => {
    const card = document.createElement("div");
    card.className = "social-card";

    const symbol = document.createElement("span");
    symbol.className = "social-symbol";
    symbol.textContent = link.symbol || "↗";

    const info = document.createElement("a");
    info.className = "social-info";
    info.href = link.url;
    info.target = "_blank";
    info.rel = "noopener noreferrer";

    const title = document.createElement("strong");
    title.textContent = link.name;
    const address = document.createElement("small");
    address.textContent = link.url;
    info.append(title, address);

    const edit = document.createElement("button");
    edit.className = "close-btn";
    edit.type = "button";
    edit.textContent = "✎";
    edit.setAttribute("aria-label", "تعديل " + link.name);
    edit.addEventListener("click", () => showLinkForm(index));

    card.append(symbol, info, edit);
    list.append(card);
  });
}

function openSettings() {
  $("settingsModal").hidden = false;
  $("nameInput").value = data.name;
  $("bioInput").value = data.bio;
}

function closeSettings() {
  $("settingsModal").hidden = true;
}

$("openSettings").addEventListener("click", openSettings);
$("closeSettings").addEventListener("click", closeSettings);

$("settingsModal").addEventListener("click", (event) => {
  if (event.target === $("settingsModal")) closeSettings();
});

$("saveSettings").addEventListener("click", () => {
  data.name = $("nameInput").value.trim() || defaults.name;
  data.bio = $("bioInput").value.trim() || defaults.bio;
  saveData();
  closeSettings();
});

$("resetSettings").addEventListener("click", () => {
  if (!confirm("ترجع الموقع إلى النموذج الأصلي؟")) return;
  data = structuredClone(defaults);
  localStorage.removeItem(STORAGE_KEY);
  render();
  closeSettings();
  notify("رجع الموقع إلى النموذج الأصلي");
});

$("photoInput").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    notify("اختار صورة صحيحة");
    return;
  }

  if (file.size > 12 * 1024 * 1024) {
    notify("اختار صورة حجمها أقل من 12 ميغابايت");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 700 / Math.max(image.width, image.height));
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      data.photo = canvas.toDataURL("image/jpeg", 0.78);
      saveData("تم تغيير الصورة على هذا الجهاز");
      event.target.value = "";
    };
    image.onerror = () => notify("ما كدرت أفتح الصورة. جرّب غير صورة.");
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function showLinkForm(index = -1) {
  document.querySelector(".link-form")?.remove();

  const existing = index >= 0 ? data.links[index] : { name: "", url: "", symbol: "↗" };
  const form = document.createElement("form");
  form.className = "link-form";
  form.innerHTML = `
    <h3>${index >= 0 ? "تعديل الحساب" : "إضافة حساب جديد"}</h3>
    <label>اسم المنصة أو الحساب
      <input name="name" maxlength="40" required placeholder="مثلاً: YouTube">
    </label>
    <label>رابط الحساب الكامل
      <input name="url" type="url" required placeholder="https://..." dir="ltr">
    </label>
    <div>
      <button type="submit">حفظ الحساب</button>
      <button type="button" class="cancel-link">إلغاء</button>
      ${index >= 0 ? '<button type="button" class="cancel-link delete-link">حذف الحساب</button>' : ""}
    </div>
  `;

  form.elements.name.value = existing.name;
  form.elements.url.value = existing.url;
  $("socialList").after(form);
  form.scrollIntoView({ behavior: "smooth", block: "center" });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const url = form.elements.url.value.trim();

    try {
      const parsed = new URL(url);
      if (!["https:", "http:"].includes(parsed.protocol)) throw new Error();
    } catch {
      notify("اكتب رابط صحيح يبدأ بـ https://");
      return;
    }

    const item = {
      name,
      url,
      symbol: name.slice(0, 2).toUpperCase()
    };

    if (index >= 0) data.links[index] = item;
    else data.links.push(item);

    form.remove();
    saveData("تم حفظ الحساب");
  });

  form.querySelector(".cancel-link").addEventListener("click", () => form.remove());

  form.querySelector(".delete-link")?.addEventListener("click", () => {
    if (!confirm("متأكد تريد تحذف هذا الحساب؟")) return;
    data.links.splice(index, 1);
    form.remove();
    saveData("تم حذف الحساب");
  });
}

$("addLinkButton").addEventListener("click", () => showLinkForm());

loadData();
render();
