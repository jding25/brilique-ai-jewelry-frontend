document.addEventListener("DOMContentLoaded", () => {
    const imgSrc = localStorage.getItem("selectedImage");
    if (imgSrc) {
      const targetDiv = document.querySelector(".div-block-9 img");
      if (targetDiv) {
        targetDiv.src = imgSrc;
        targetDiv.srcset = imgSrc;
      }
    }
});

