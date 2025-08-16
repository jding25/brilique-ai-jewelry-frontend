document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("div-block-17");
    const userId = localStorage.getItem("userId");
    console.log("this is userId: ", localStorage.getItem("userId"));

    container.replaceChildren();

    if (userId) {
        try {
            const url = `https://brilique-ai-jewelry-backend-4.onrender.com/api/designs/designsOnMarket?userId=${encodeURIComponent(userId)}`;
            console.log("this is request url", url);
            const res = await fetch(url);

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Backend ${res.status}: ${errText}`);
            }

            const designs = await res.json();

            designs.forEach(design => {
                console.log("this is designnnnnn!!!!", design);
                const imgUrl = design.imageUrl;
                const designId = design.designId;

                // Create main container div
                const div = document.createElement("div");
                div.setAttribute("class", "div-block-18");

                // Create image element
                const img = document.createElement("img");
                img.src = imgUrl;
                img.loading = "lazy";
                img.alt = "On sale design";
                img.setAttribute("class", "image-15");
                img.setAttribute("data-design-id", designId);
                img.setAttribute("srcset", imgUrl);
                img.setAttribute("sizes", "(max-width: 1024px) 100vw, 1024px");
                img.style.cursor = "pointer";

                // When the image is clicked, open the modal
                img.addEventListener("click", () => {
                    localStorage.setItem("selectedImage", design.imageUrl);
                    localStorage.setItem("selectedDesignId", design.designId);
                    localStorage.setItem("selectedUserId", design.userId);
                    localStorage.setItem("onSale", true);
                    window.location.href = "generate-details.html";
                });

                // Append image to the main div (not to another element)
                div.appendChild(img);

                // Create info container
                const div2 = document.createElement("div");
                div2.setAttribute("class", "div-block-3");
                div.appendChild(div2);

                // Create inner info container
                const div3 = document.createElement("div");
                div3.setAttribute("class", "div-block-6");
                div2.appendChild(div3);

                // Create project name div
                const div4 = document.createElement("div");
                div4.setAttribute("class", "designer-info-copy");
                div4.textContent = design.designName || "Name of the project";
                div3.appendChild(div4);

                // Create line break
                const br = document.createElement("br");
                div4.appendChild(br);

                // Create price div
                const div5 = document.createElement("div");
                div5.setAttribute("class", "price-tag-copy");
                div5.textContent = design.price || "$800";
                div3.appendChild(div5);

                // Append the complete structure to the container
                container.appendChild(div);
            });
        } catch(err) {
            console.error("Failed to load on sale designs: ", err);
        }
    }
});


/**
The structure achieved:

<div class="div-block-18">
    <img src="images/..." loading="lazy" sizes="(max-width: 1024px) 100vw, 1024px" srcset="..." alt="On sale design" class="image-15">
    <div class="div-block-3">
        <div class="div-block-6">
            <div class="designer-info-copy">Name of the project<br></div>
            <div class="price-tag-copy">$800</div>
        </div>
    </div>
</div>
**/