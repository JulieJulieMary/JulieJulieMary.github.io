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

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    var imageData = canvas.toDataURL('image/png'); // Convert canvas to image data URL
   
    // Create an anchor element to trigger the download
    var downloadLink = document.createElement('a');
    downloadLink.href = imageData; // Set the href to the image data
    downloadLink.download = 'captured_image.png'; // Set the download attribute to the desired file name

    // Programmatically click the download link to start the download
    downloadLink.click();

    // Optionally display the captured image on the page (as in your original function)
    var capturedImageContainer = document.getElementById('capturedImageContainer');
    var imgElement = document.createElement('img');
    imgElement.src = imageData;
    
    capturedImageContainer.innerHTML = ''; // Clear the container
    capturedImageContainer.appendChild(imgElement); // Append the new imgElement
}




