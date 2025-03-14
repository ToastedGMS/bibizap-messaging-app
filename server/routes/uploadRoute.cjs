const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const bucket = require('../firebase.cjs');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFileToFirebase = async (req, res) => {
	try {
		const file = req.file;

		if (!file) {
			return res.status(400).send('No file uploaded.');
		}

		// Define the file path with WebP extension
		const filePath = `uploads/${Date.now()}-${
			file.originalname.split('.')[0]
		}.webp`;

		// Process the image with sharp (convert to WebP and compress)
		const processedImage = await sharp(file.buffer)
			.webp({ quality: 80 }) // Convert to WebP with compression
			.toBuffer();

		// Upload the processed image to Firebase Storage
		const blob = bucket.file(filePath);
		const blobStream = blob.createWriteStream({
			resumable: false,
			contentType: 'image/webp', // Set correct content type
		});

		blobStream.on('finish', async () => {
			try {
				await blob.makePublic();
				const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
				res
					.status(200)
					.send({ message: 'File uploaded successfully!', fileUrl });
			} catch (err) {
				console.log(err);
				res.status(500).send('Error making file public: ' + err.message);
			}
		});

		blobStream.on('error', (err) => {
			console.log(err);
			res.status(500).send('Error uploading file: ' + err);
		});

		blobStream.end(processedImage); // Upload the processed image buffer
	} catch (error) {
		console.log(error);
		res.status(500).send('Error: ' + error.message);
	}
};

router.post('/', upload.single('file'), uploadFileToFirebase);

module.exports = router;
