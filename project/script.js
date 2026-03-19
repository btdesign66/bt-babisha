const userImageInput = document.getElementById("userImage");
const dressImageInput = document.getElementById("dressImage");

const userPreviewImg = document.getElementById("userPreview");
const dressPreviewImg = document.getElementById("dressPreview");

const userPreviewHint = document.getElementById("userPreviewHint");
const dressPreviewHint = document.getElementById("dressPreviewHint");

const tryOnForm = document.getElementById("tryOnForm");
const tryOnBtn = document.getElementById("tryOnBtn");
const retryBtn = document.getElementById("retryBtn");

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");

const resultImage = document.getElementById("resultImage");
const resultPlaceholder = document.getElementById("resultPlaceholder");

function setError(message) {
  errorEl.textContent = message;
  errorEl.style.display = message ? "block" : "none";
}

function setLoading(isLoading) {
  loadingEl.style.display = isLoading ? "flex" : "none";
  tryOnBtn.disabled = isLoading;
  userImageInput.disabled = isLoading;
  dressImageInput.disabled = isLoading;
}

function clearResult() {
  resultImage.style.display = "none";
  resultPlaceholder.style.display = "block";
  resultImage.removeAttribute("src");
  setError("");
}

userImageInput.addEventListener("change", () => {
  const file = userImageInput.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  userPreviewImg.src = url;
  userPreviewImg.style.display = "block";
  if (userPreviewHint) userPreviewHint.style.display = "none";
});

dressImageInput.addEventListener("change", () => {
  const file = dressImageInput.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  dressPreviewImg.src = url;
  dressPreviewImg.style.display = "block";
  if (dressPreviewHint) dressPreviewHint.style.display = "none";
});

retryBtn.addEventListener("click", () => {
  retryBtn.disabled = true;
  clearResult();
});

tryOnForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError("");

  const userFile = userImageInput.files?.[0];
  const dressFile = dressImageInput.files?.[0];

  if (!userFile || !dressFile) {
    setError("Please upload both your photo and a dress image.");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("userImage", userFile);
    formData.append("dressImage", dressFile);

    const response = await fetch("/generate", {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
      const msg = data?.message || `Request failed (${response.status}).`;
      throw new Error(msg);
    }

    if (!data.imageUrl) {
      throw new Error("Server did not return an image. Please try again.");
    }

    resultImage.src = data.imageUrl;
    resultImage.style.display = "block";
    resultPlaceholder.style.display = "none";
    retryBtn.disabled = false;
  } catch (err) {
    setError(err?.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
});

