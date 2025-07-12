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

    const url = await res.text();
    return "http://localhost:8080/" + url;
  } catch (err) {
    console.error("❌ Failed to upload image", err);
    return null;
  }
}

async function pollForResultAndRender(jobId, divIndex, productDivs) {
  const div = productDivs[divIndex];
  const img = div.querySelector("img.product-copy");

  const spinner = document.createElement("div");
  spinner.className = "spinner";
  img.parentElement.insertBefore(spinner, img);
  spinner.style.display = "block";
  img.style.display = "none";

  async function poll() {
    try {
      const res = await fetch(`${STATUS_URL}${jobId}`, { headers: HEADERS });
      const status = await res.json();

      if (status.status === "COMPLETED") {
        spinner.remove();
        img.style.display = "block";

        const imageBase64 = status.output?.image_path;
        const base64WithPrefix = imageBase64.startsWith("data:image")
          ? imageBase64
          : `data:image/png;base64,${imageBase64}`;

        const uploadedUrl = await uploadImage(base64WithPrefix);
        if (uploadedUrl) {
          img.src = uploadedUrl;
          img.removeAttribute("srcset");
          img.removeAttribute("sizes");
          img.alt = "Generated Jewelry";
        } else {
          img.alt = "Upload failed.";
          img.src = "images/image-failed-placeholder.png";
        }

      } else if (status.status === "FAILED") {
        spinner.remove();
        img.style.display = "block";
        img.alt = "Generation failed.";
        img.src = "images/image-failed-placeholder.png";
      } else {
        setTimeout(poll, 3000);
      }
    } catch (err) {
      console.error("Polling error:", err);
      setTimeout(poll, 5000);
    }
  }

  poll();
}

async function generateImageForDiv(div, divIndex, jewelryType, style, customPrompt, productDivs, maxRetries = 3) {
  const img = div.querySelector("img.product-copy");

//  const spinner = document.createElement("div");
//  spinner.className = "spinner";
//  img.parentElement.insertBefore(spinner, img);
//  spinner.style.display = "block";
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

      const jobs = JSON.parse(localStorage.getItem("generationJobs") || "[]");
      jobs.push({ id: jobId, divIndex });
      localStorage.setItem("generationJobs", JSON.stringify(jobs));

      return await pollForResultAndRender(jobId, divIndex, productDivs);
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) return await submitAndPoll();
    }
  }

  await submitAndPoll();
}

document.addEventListener("DOMContentLoaded", () => {
  async function waitForProductDivs(maxTries = 20) {
    for (let i = 0; i < maxTries; i++) {
      const divs = document.querySelectorAll(".single-product-copy");
      if (divs.length > 0) return divs;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error("Timeout waiting for product divs");
  }

  waitForProductDivs().then(productDivs => {
    const jewelryType = localStorage.getItem("selectedJewelryType") || "";
    const style = localStorage.getItem("selectedStyle") || "";
    const customPrompt = localStorage.getItem("customPrompt") || "";
    const savedJobs = JSON.parse(localStorage.getItem("generationJobs") || "[]");

    console.log(savedJobs);

    if (savedJobs.length > 0) {
      savedJobs.forEach(job => {
        pollForResultAndRender(job.id, job.divIndex, productDivs);
      });
    } else {
      if (!jewelryType && !style && !customPrompt) {
        alert("Missing design input. Please return to the Generate page.");
        return;
      }

      productDivs.forEach((div, index) => {
        generateImageForDiv(div, index, jewelryType, style, customPrompt, productDivs);
      });
    }
  });
});

document.getElementById("back-to-generate").addEventListener("click", () => {
  localStorage.removeItem("selectedJewelryType");
  localStorage.removeItem("selectedStyle");
  localStorage.removeItem("customPrompt");
  localStorage.removeItem("redirectedFromGenerate");
  localStorage.removeItem("generationJobs");
  localStorage.clear();
  window.location.href = "generate.html";
});
