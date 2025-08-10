let imgSrc;
let designId;
let userId;

document.addEventListener("DOMContentLoaded", () => {
    imgSrc = localStorage.getItem("selectedImage");
    designId = localStorage.getItem("selectedDesignId") ;
    userId = localStorage.getItem("userId");
    console.log("designId is: ", designId);
    console.log("userId is: ", userId);
    if (imgSrc) {
      const targetDiv = document.querySelector(".div-block-9 img");
      if (targetDiv) {
        targetDiv.src = imgSrc;
        targetDiv.srcset = imgSrc;
      }
    }
    localStorage.removeItem("selectedImage");
    localStorage.removeItem("selectedDesignId");


// Get the toggle input element
    const toggleInput = document.querySelector('.w-toggle input[type="checkbox"]');

    if (toggleInput) {
        // Add event listener for when toggle changes
        toggleInput.addEventListener('change', function() {
            const isChecked = this.checked;
            console.log('Toggle changed to:', isChecked);

            // Call the API to update addToMarket status
            updateAddToMarketStatus(isChecked);
        });
    }
});


async function updateAddToMarketStatus(addToMarket) {
    try {
        if (!userId || !designId) {
            console.error('Missing userId or designId');
            return;
        }

        // Prepare the request payload
        const requestData = {
            userId: userId,
            designId: designId,
            addToMarket: addToMarket
        };

        // Make the API call
        const response = await axios.put('https://brilique-ai-jewelry-backend-4.onrender.com/api/designs/setAddToMarket', requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log('Successfully updated addToMarket status');
            // Optionally show a success message to the user
            showNotification('Market status updated successfully!', 'success');
        }

    } catch (error) {
        console.error('Error updating addToMarket status:', error);

        // Reset the toggle to its previous state on error
        const toggleInput = document.querySelector('.w-toggle input[type="checkbox"]');
        if (toggleInput) {
            toggleInput.checked = !addToMarket;
        }

        // Show error message to user
        if (error.response) {
            const errorMessage = error.response.data?.message || 'Failed to update market status';
            showNotification(errorMessage, 'error');
        } else {
            showNotification('Network error. Please try again.', 'error');
        }
    }
}

function showNotification(message, type) {
    // Simple notification function - you can make this more sophisticated
    // or use a toast library like Toastr

    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        font-family: Inter, sans-serif;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
        ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}
