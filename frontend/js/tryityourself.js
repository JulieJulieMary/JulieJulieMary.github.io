function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            var videoElement = document.getElementById('cameraFeed');
            videoElement.srcObject = stream;
            videoElement.play();
            videoElement.style.display = 'block';
        })
        .catch(function (error) {
            console.log('Error accessing camera:', error);
        });

    var captureButton = document.getElementById('capture_image_button');
    captureButton.style.display = 'block';
}



function captureImage() {
    var video = document.getElementById('cameraFeed');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    // Capture the image from the video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a Blob object instead of a data URL
    canvas.toBlob(function (blob) {
        // Create a FormData object to send the Blob in a POST request
        var formData = new FormData();
        formData.append('file', blob, 'captured.png');

        // Send the image to the Flask backend using fetch
        fetch('https://6fc1-79-118-187-217.ngrok-free.app/upload', {  // Use your updated ngrok URL
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.blob();
            })
            .then(processedBlob => {
                // Create a URL for the processed image and display it
                var processedImageURL = URL.createObjectURL(processedBlob);
                var capturedImageContainer = document.getElementById('capturedImageContainer');
                var imgElement = document.createElement('img');
                imgElement.src = processedImageURL;

                capturedImageContainer.innerHTML = ''; // Clear the container
                capturedImageContainer.appendChild(imgElement); // Append the new processed imgElement
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
    }, 'image/png'); // The type of the image to be created by toBlob
}





