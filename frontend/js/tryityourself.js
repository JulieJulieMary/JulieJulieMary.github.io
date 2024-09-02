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
    var canvas = document.getElementsByClassName('camera-container');
    canvas[0].style.backgroundColor = "rgba(250, 128, 114, 0)";
    var captureButton = document.getElementById('capture_image_button');
    captureButton.style.display = 'block';
}

function getColor(cellValue) {
    switch (cellValue) {
        case 0:
            return 'white'; // White circle for 0
        case 1:
            return 'red'; // Red circle for 1
        case 2:
            return 'yellow'; // Yellow circle for 2
        case 3:
            return 'green' // Green circle for best move
        default:
            return 'grey'; // Grey for unexpected values
    }
}


function captureImage() {
    var video = document.getElementById('cameraFeed');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    // Capture the image from the video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a Blob object
    canvas.toBlob(function (blob) {
        // Create a FormData object to send the Blob in a POST request
        var formData = new FormData();
        formData.append('file', blob, 'captured.png');

        // Send the image to the Flask backend using fetch
        fetch('https://frequently-guiding-kitten.ngrok-free.app/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json(); // Parse the response as JSON
            })
            .then(data => {
                // Extract the integer (firstMove) and 2D array (game) from the response data
                var firstMove = data.firstMove;
                var gameArray = data.game;

                // Display the firstMove on the screen
                var outputContainer = document.getElementById('outputContainer');
                outputContainer.innerHTML = ''; // Clear the container

                var firstMoveElement = document.createElement('p');
                firstMoveElement.textContent = 'I will play here: ' + (firstMove + 1);
                outputContainer.appendChild(firstMoveElement);

                // Create a visual representation of the Connect Four board
                var boardContainer = document.createElement('div');
                boardContainer.style.display = 'grid';
                boardContainer.style.gridTemplateColumns = 'repeat(7, 50px)';
                boardContainer.style.gridGap = '5px';
                boardContainer.style.marginTop = '20px';

                gameArray.forEach(row => {
                    row.forEach(cell => {
                        var cellElement = document.createElement('div');
                        cellElement.style.width = '50px';
                        cellElement.style.height = '50px';
                        cellElement.style.borderRadius = '50%';
                        cellElement.style.backgroundColor = getColor(cell);
                        boardContainer.appendChild(cellElement);
                    });
                });

                outputContainer.appendChild(boardContainer);
            })

            .catch(error => {
                console.error('Error uploading image:', error);
            });
    }, 'image/png'); // The type of the image to be created by toBlob
}






