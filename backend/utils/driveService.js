const { google } = require('googleapis');
const stream = require('stream');
const path = require('path');
const fs = require('fs');

// Path to service account credentials
const KEYFILEPATH = path.join(__dirname, '..', 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// The folder ID provided by the user
const FOLDER_ID = '1zswGIrbi8zzTAo3W7-4phiWxaFBTEdOf';

const auth = new google.auth.GoogleAuth({
  keyFile: fs.existsSync(KEYFILEPATH) ? KEYFILEPATH : undefined,
  scopes: SCOPES,
});

const driveService = google.drive({ version: 'v3', auth });

/**
 * Uploads a file buffer to Google Drive and returns the public link
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} fileName - The name of the file
 * @param {string} mimeType - The mime type of the file
 * @returns {Promise<string>} The public webViewLink
 */
const uploadFileToDrive = async (fileBuffer, fileName, mimeType) => {
  if (!fs.existsSync(KEYFILEPATH)) {
    console.warn("credentials.json not found. Skipping Google Drive upload.");
    return null; // Graceful degradation if credentials are not provided yet
  }

  // Check if it's the dummy credential file
  try {
    const creds = JSON.parse(fs.readFileSync(KEYFILEPATH, 'utf8'));
    if (creds.private_key && creds.private_key.includes("YOUR_PRIVATE_KEY_HERE")) {
      console.warn("Dummy credentials.json detected. Skipping Google Drive upload.");
      return null;
    }
  } catch (e) {
    // Ignore parse errors here, let the googleauth handle it
  }

  try {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    const fileMetadata = {
      name: fileName,
      parents: [FOLDER_ID],
    };

    const media = {
      mimeType: mimeType,
      body: bufferStream,
    };

    // Upload the file
    const response = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = response.data.id;

    // Set permissions to anyone with the link can view
    await driveService.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Return the direct content link (or webViewLink if preferred)
    return response.data.webContentLink || response.data.webViewLink;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
};

module.exports = {
  uploadFileToDrive,
};
