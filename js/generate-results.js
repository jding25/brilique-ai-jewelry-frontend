const API_URL = "https://api.runpod.ai/v2/ipw9i6om7ahag6/run";
const STATUS_URL = "https://api.runpod.ai/v2/ipw9i6om7ahag6/status/";
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer rpa_S1AKUXS4YH0V5XI9T1DO54YHOM71NRPV8OKGPOYNlpzoub'
};

// Generate 1 image for 1 div
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
        body: JSON.stringify({ input: { jewelry_type: jewelryType, style, custom_prompt: customPrompt } })
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

  const imageData = await submitAndPoll();

  spinner.style.display = "none";
  img.style.display = "block";

  if (imageData) {
    const src = imageData.startsWith("data:image")
      ? imageData
      : "data:image/png;base64," + imageData;
    img.src = src;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.alt = "Generated Jewelry";
  } else {
    img.alt = "Failed to load image.";
    img.src = "images/image-failed-placeholder.png";
  }
}

// Run once on page load
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
