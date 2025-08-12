let imgSrc;
let designId;
let userId;
let onSale;
let fromMarket;

document.addEventListener("DOMContentLoaded", async () => {
    imgSrc = localStorage.getItem("selectedImage");
    designId = localStorage.getItem("selectedDesignId");
    onSale = localStorage.getItem("onSale");
    userId = localStorage.getItem("selectedUserId");
    fromMarket = localStorage.getItem("fromMarket");

    if (fromMarket) {
        document.querySelectorAll('.toggle-wrapper').forEach(el => el.style.display = 'none');
    }

    console.log("designId is: ", designId);
    console.log("userId is: ", userId);
    console.log("onSale from localStorage: ", onSale);

    // Set the image if available
    if (imgSrc) {
        const targetDiv = document.querySelector(".div-block-9 img");
        if (targetDiv) {
            targetDiv.src = imgSrc;
            targetDiv.srcset = imgSrc;
        }
    }

    // Clean up localStorage
    localStorage.removeItem("selectedImage");
    localStorage.removeItem("selectedDesignId");
    localStorage.removeItem("onSale");
    localStorage.removeItem("fromMarket");

    // Initialize toggle button
    await initializeToggleButton();
});

async function initializeToggleButton() {
    const toggleInput = document.querySelector('.w-toggle input[type="checkbox"]');

    if (!toggleInput) {
        console.error('Toggle input not found');
        return;
    }

    // First, check current market status from API if we have userId and designId
    if (userId && designId) {
        try {
            await checkCurrentMarketStatus(toggleInput);
        } catch (error) {
            console.error('Error checking current market status:', error);
            // Fall back to localStorage value if API call fails
            setToggleFromLocalStorage(toggleInput);
        }
    } else {
        // Fall back to localStorage value
        setToggleFromLocalStorage(toggleInput);
    }

    // Add event listener for when toggle changes
    toggleInput.addEventListener('change', function() {
        const isChecked = this.checked;
        console.log('Toggle changed to:', isChecked);

        // Call the API to update addToMarket status
        updateAddToMarketStatus(isChecked);
    });
}

function setToggleFromLocalStorage(toggleInput) {
    // Check if onSale is true (handle different possible values)
    const isOnSale = onSale === 'true' || onSale === true || onSale === '1';

    console.log('Setting toggle from localStorage - isOnSale:', isOnSale);
    toggleInput.checked = isOnSale;

    // Add visual feedback
    updateToggleVisuals(toggleInput, isOnSale);
}

async function checkCurrentMarketStatus(toggleInput) {
    try {
        console.log('Checking current market status from API...');

        // Make API call to get current design status
        const response = await axios.get(`https://brilique-ai-jewelry-backend-4.onrender.com/api/designs/get/${encodeURIComponent(userId)}/${designId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 && response.data) {
            console.log("wait i dont believe this actual work1!!!!!!!!!!", response.data);
            const designData = response.data;
            const isOnMarket = designData.addToMarket === true || designData.onSale === true || designData.isOnMarket === true;

            console.log('Current market status from API:', isOnMarket);
            console.log('Full design data:', designData);

            toggleInput.checked = isOnMarket;
            updateToggleVisuals(toggleInput, isOnMarket);
        }
    } catch (error) {
        console.error('Error fetching design status:', error);
        throw error; // Re-throw to trigger fallback
    }
}

function updateToggleVisuals(toggleInput, isChecked) {
    // Find the toggle wrapper/container for visual updates
    const toggleWrapper = toggleInput.closest('.w-toggle');

    if (toggleWrapper) {
        if (isChecked) {
            toggleWrapper.classList.add('w--checked');
            console.log('Toggle set to checked state (green)');
        } else {
            toggleWrapper.classList.remove('w--checked');
            console.log('Toggle set to unchecked state');
        }
    }

    // Force a visual update by dispatching change event (if needed)
    // toggleInput.dispatchEvent(new Event('change', { bubbles: true }));
}

async function updateAddToMarketStatus(addToMarket) {
    try {
        if (!userId || !designId) {
            console.error('Missing userId or designId');
            showNotification('Missing user or design information', 'error');
            return;
        }

        console.log('Updating market status to:', addToMarket);

        // Prepare the request payload
        const requestData = {
            userId: userId,
            designId: designId,
            addToMarket: addToMarket
        };

        // Show loading state
        const toggleInput = document.querySelector('.w-toggle input[type="checkbox"]');
        if (toggleInput) {
            toggleInput.disabled = true;
        }

        // Make the API call
        const response = await axios.put('https://brilique-ai-jewelry-backend-4.onrender.com/api/designs/setAddToMarket', requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log('Successfully updated addToMarket status');

            // Update visual state
            updateToggleVisuals(toggleInput, addToMarket);

            // Show success message
            const message = addToMarket ? 'Design added to market!' : 'Design removed from market!';
            showNotification(message, 'success');
        }

    } catch (error) {
        console.error('Error updating addToMarket status:', error);

        // Reset the toggle to its previous state on error
        const toggleInput = document.querySelector('.w-toggle input[type="checkbox"]');
        if (toggleInput) {
            toggleInput.checked = !addToMarket;
            updateToggleVisuals(toggleInput, !addToMarket);
        }

        // Show error message to user
        if (error.response) {
            const errorMessage = error.response.data?.message || 'Failed to update market status';
            showNotification(errorMessage, 'error');
        } else {
            showNotification('Network error. Please try again.', 'error');
        }
    } finally {
        // Re-enable toggle
        const toggleInput = document.querySelector('.w-toggle input[type="checkbox"]');
        if (toggleInput) {
            toggleInput.disabled = false;
        }
    }
}

function showNotification(message, type) {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        font-family: Inter, sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success'
            ? 'background: linear-gradient(135deg, #28a745, #20c997);'
            : 'background: linear-gradient(135deg, #dc3545, #e74c3c);'}
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.parentNode.removeChild(notification);
            }, 300);
        }
    }, 3000);
}