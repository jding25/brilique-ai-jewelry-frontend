const API_URL = "https://api.runpod.ai/v2/ipw9i6om7ahag6/run";
const STATUS_URL = "https://api.runpod.ai/v2/ipw9i6om7ahag6/status/";
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer rpa_S1AKUXS4YH0V5XI9T1DO54YHOM71NRPV8OKGPOYNlpzoub'
};

async function uploadImage(base64Image) {
  try {
    const res = await fetch("http://localhost:8080/api/designs/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server responded with ${res.status}: ${text}`);
    }

    const url = await res.text(); // Server returns: "uploads/xxx.png"
    return "http://localhost:8080/" + url; // Absolute URL for rendering
  } catch (err) {
    console.error("❌ Failed to upload image", err);
    return null;
  }
}

async function generateImageForDiv(div, jewelryType, style, customPrompt, maxRetries = 3) {
  const img = div.querySelector("img.product-copy");

  // Show spinner
  const spinner = document.createElement("div");
  spinner.className = "spinner";
  img.parentElement.insertBefore(spinner, img);
  spinner.style.display = "block";
  img.style.display = "none";

  let attempt = 0;

  async function submitAndPoll() {
    attempt++;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({
          input: { jewelry_type: jewelryType, style, custom_prompt: customPrompt }
        })
      });

      const runData = await res.json();
      const jobId = runData.id;
      if (!jobId) throw new Error("No job ID returned.");
      return await pollForResult(jobId);
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) return await submitAndPoll();
      return null;
    }
  }

  async function pollForResult(jobId) {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const res = await fetch(`${STATUS_URL}${jobId}`, { headers: HEADERS });
          const status = await res.json();

          if (status.status === "COMPLETED") {
            resolve(status.output?.image_path || null);
          } else if (status.status === "FAILED") {
            reject(new Error("Generation failed."));
          } else {
            setTimeout(poll, 3000);
          }
        } catch (err) {
          reject(err);
        }
      };
      poll();
    });
  }

  const imageBase64 = await submitAndPoll();
  spinner.style.display = "none";
  img.style.display = "block";

  if (imageBase64) {
    const base64WithPrefix = imageBase64.startsWith("data:image")
      ? imageBase64
      : `data:image/png;base64,${imageBase64}`;

    // Upload to backend
    const uploadedUrl = await uploadImage(base64WithPrefix);

    if (uploadedUrl) {
      img.src = uploadedUrl;
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.alt = "Generated Jewelry";

      const saved = JSON.parse(localStorage.getItem("myDesigns") || "[]");
      saved.push(uploadedUrl);
      localStorage.setItem("myDesigns", JSON.stringify(saved));
    } else {
      img.alt = "Upload failed.";
      img.src = "images/image-failed-placeholder.png";
    }
  } else {
    img.alt = "Generation failed.";
    img.src = "images/image-failed-placeholder.png";
  }
}

// Run on load
document.addEventListener("DOMContentLoaded", () => {
  const jewelryType = sessionStorage.getItem("selectedJewelryType") || "";
  const style = sessionStorage.getItem("selectedStyle") || "";
  const customPrompt = sessionStorage.getItem("customPrompt") || "";

  if (!jewelryType && !style && !customPrompt) {
    alert("Missing design input. Please return to the Generate page.");
    return;
  }

  const productDivs = document.querySelectorAll(".single-product-copy");
  productDivs.forEach(div => {
    generateImageForDiv(div, jewelryType, style, customPrompt);
  });
});
