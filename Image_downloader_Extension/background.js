// Add a context menu item for image download
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "dynamicImageDownload",
    title: "Download Image with Dynamic Name",
    contexts: ["image"],
  });
});

// Listen for the context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "dynamicImageDownload") {
    const imageUrl = info.srcUrl;

    // Step 1: Fetch the image description using Hugging Face API
    const description = await getImageDescription(imageUrl);

    // Step 2: Sanitize the description for file naming
    const fileName = sanitizeFileName(description) + ".jpg";

    // Step 3: Download the image with the dynamic name
    chrome.downloads.download({
      url: imageUrl,
      filename: fileName, // Dynamic filename based on labels
    });
  }
});

async function getImageDescription(imageUrl) {
  const apiKey = "add your Hugging face open ai key here"; // Your Hugging Face API key
  const apiUrl = "https://api-inference.huggingface.co/models/facebook/detr-resnet-50"; // Example model

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: imageUrl }), // Send the image URL to the model
    });

    console.log("Response Status: ", response.status);

    if (!response.ok) {
      console.error("API Request Failed with status: ", response.status);
      return "image"; // Return fallback name
    }

    // Read the response text and log it for debugging
    const responseText = await response.text();
    console.log("Raw Response: ", responseText);

    // If the response text is empty, log and return fallback
    if (!responseText) {
      console.error("Empty response received.");
      return "image"; // Return fallback name if no content in response
    }

    // Try parsing the response as JSON
    let result = null;
    try {
      result = JSON.parse(responseText);
      console.log("Parsed Response: ", result);
    } catch (error) {
      console.error("Failed to parse JSON response: ", error);
      return "image"; // Return fallback name if JSON parsing fails
    }

    // Ensure the response structure has labels
    if (result && result[0] && result[0].labels) {
      const labels = result[0].labels;
      if (labels.length > 0) {
        return labels.join(", "); // Join labels into a string for the filename
      }
    }

    // If no labels found, return fallback
    return "image";

  } catch (error) {
    console.error("Error fetching image description: ", error);
    return "image"; // Return fallback name in case of any other errors
  }
}






// Function to sanitize file names (remove illegal characters and handle spaces)
function sanitizeFileName(name) {
  return name
    .replace(/[\/\\?%*:|"<>]/g, "") // Remove illegal characters
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .trim(); // Trim any extra spaces
}
