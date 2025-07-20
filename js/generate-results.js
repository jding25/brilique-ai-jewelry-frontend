import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyAVuyDg3JuEeYPesCdQubz0gNQPH6U9KU0",
  authDomain: "brilique-3ae3b.firebaseapp.com",
  projectId: "brilique-3ae3b",
  storageBucket: "brilique-3ae3b.appspot.com",
  messagingSenderId: "622180990908",
  appId: "1:622180990908:web:65204b3249eedf13b475b9",
  measurementId: "G-QMS5PFKFWG"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const API_URL = "https://api.runpod.ai/v2/ipw9i6om7ahag6/run";
const STATUS_URL = "https://api.runpod.ai/v2/ipw9i6om7ahag6/status/";
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer rpa_S1AKUXS4YH0V5XI9T1DO54YHOM71NRPV8OKGPOYNlpzoub'
};
async function uploadImage(base64Image, prompt, style, jewelryType, enhancedPrompt) {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be signed in to upload images.");
    return null;
  }
  console.log("user: ", user);
  console.log("base64Image.length:", base64Image.length);
  console.log("userPrompt:", prompt);
  console.log("Uploading to backend with:", {
    imageBase64: base64Image.slice(0, 100), // trimmed
    userPrompt: prompt,
    style,
    type: jewelryType,
    enhancedPrompt,
    userId: user.email
  });
  try {
    const res = await fetch("https://brilique-ai-jewelry-backend-4.onrender.com/api/designs/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          imageBase64: base64Image,
          userPrompt: prompt,
          style: style,
          type: jewelryType,
          enhancedPrompt: enhancedPrompt,
          userId: user.email
        })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server responded with ${res.status}: ${text}`);
    }
    console.log("this is res");
    console.log(res);

    const url = await res.text();
    console.log("this is res.text()");
    console.log(url);
//    return url;
    return "https://brilique-ai-jewelry-backend-4.onrender.com/" + url;

  } catch (err) {
    console.error("❌ Failed to upload image", err);
    return null;
  }
}

async function pollForResultAndRender(jobId, divIndex, productDivs, customPrompt, style, jewelryType) {
  const div = productDivs[divIndex];
  const img = div.querySelector("img.product-copy");

  // Check if we already have a cached result
  const cachedUrl = localStorage.getItem(divIndex);
  if (cachedUrl) {
    img.src = cachedUrl;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.alt = "Generated Jewelry";
    img.style.display = "block";
    return;
  }

  // Hide the image immediately to prevent original placeholder from showing
  img.style.display = "none";

  // Create and show spinner
  let spinner = div.querySelector(".spinner");
  if (!spinner) {
    spinner = document.createElement("div");
    spinner.className = "spinner";
    img.parentElement.insertBefore(spinner, img);
  }
  spinner.style.display = "block";

  async function poll() {
    try {
      const res = await fetch(`${STATUS_URL}${jobId}`, { headers: HEADERS });
      const status = await res.json();

      if (status.status === "COMPLETED") {
        spinner.remove();
        img.style.display = "block";

        const imageBase64 = status.output?.image_path;
        const enhancedPrompt = status.output?.prompt;
        console.log("enhanced prompt is: ");
        console.log(enhancedPrompt);
        const base64WithPrefix = imageBase64.startsWith("data:image")
          ? imageBase64
          : `data:image/png;base64,${imageBase64}`;

        const uploadedUrl = await uploadImage(base64WithPrefix, customPrompt, style, jewelryType, enhancedPrompt);
        console.log("uploadedUrl: ", uploadedUrl);
        if (uploadedUrl) {
          localStorage.setItem(divIndex, uploadedUrl);
          img.src = uploadedUrl;
          img.removeAttribute("srcset");
          img.removeAttribute("sizes");
          img.alt = "Loading Generated Jewelry";
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

  // Check if we already have a cached result
  const cachedUrl = localStorage.getItem(divIndex);
  if (cachedUrl) {
    img.src = cachedUrl;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.alt = "Generated Jewelry";
    img.style.display = "block";
    return;
  }

  // Hide the image immediately to prevent original placeholder from showing
  img.style.display = "none";

  // Create and show spinner
  let spinner = div.querySelector(".spinner");
  if (!spinner) {
    spinner = document.createElement("div");
    spinner.className = "spinner";
    img.parentElement.insertBefore(spinner, img);
  }
  spinner.style.display = "block";

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

      return await pollForResultAndRender(jobId, divIndex, productDivs, customPrompt, style, jewelryType);
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        return await submitAndPoll();
      } else {
        // Show error state if all retries failed
        spinner.remove();
        img.style.display = "block";
        img.alt = "Generation failed after retries.";
        img.src = "images/image-failed-placeholder.png";
      }
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
        pollForResultAndRender(job.id, job.divIndex, productDivs, customPrompt, style, jewelryType);
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