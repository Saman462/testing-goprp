import axios from 'axios';
import { saveAs } from 'file-saver';
export const getSortedMediaList = async () => {
    const url = '/gopro/media/list';
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            const data = response.data;
            let allFiles = [];
            if (data.media && data.media.length > 0) {
                data.media.forEach(mediaItem => {
                    if (mediaItem.fs && mediaItem.fs.length > 0) {
                        mediaItem.fs.forEach(file => {
                            allFiles.push({
                                fileName: file.n,
                                created: file.cre,
                                modified: file.mod,
                                size: file.s,
                                glrv: file.glrv,
                                ls: file.ls,
                                folder: mediaItem.d
                            });
                        });
                    }
                });
                allFiles.sort((a, b) => a.created - b.created);
                return allFiles;
            } else {
                console.log('No media found.');
                return [];
            }
        } else {
            console.error('Failed to retrieve media list. Status:', response.status, 'Response:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error retrieving media list:', error.message);
        return [];
    }
};

const downloadSingleMedia = async (directory, filename) => {
    const url = `/videos/DCIM/${directory}/${filename}`;
    console.log(`Downloading file: ${filename} from URL: ${url}`);
    try {
        const response = await axios.get(url, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'video/mp4' });
        saveAs(blob, filename);
        console.log('Media downloaded and saved successfully.');
    } catch (error) {
        console.log(`Error downloading media ${filename}:`, error.message);
    }
};
export const getMediaList = async () => {
    try {
        const response = await axios.get('/gopro/media/list');
        if (response.status === 200) {
            const data = response.data;
            if (data.media && data.media.length > 0) {
                return data.media;
            } else {
                console.log('No media found.');
                return [];
            }
        } else {
            console.error('Failed to retrieve media list. Status:', response.status, 'Response:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error retrieving media list:', error.message);
        return [];
    }
};
const isGroupedMedia = async (directory, filename) => {
    console.log('Checking if media file is grouped:', filename);
    const mediaID = filename.match(/(\d{4})\./)[1];
    const filePrefix = filename.substring(0, 2);

    const mediaList = await getMediaList();
    const folder = mediaList.find(mediaItem => mediaItem.d === directory);

    if (!folder) {
        console.log('Folder not found.');
        return false;
    }

    if (!folder.fs || folder.fs.length === 0) {
        console.log('No files in the folder.');
        return false;
    }

    const groupedFiles = folder.fs.filter(file => {
        const fileID = file.n.match(/(\d{4})\./)[1];
        return fileID === mediaID && file.n.startsWith(filePrefix);
    });

    if (groupedFiles.length > 1) {
        console.log('Media file is grouped.');
        return groupedFiles;
    } else {
        console.log('Media file is not grouped.');
        return false;
    }
};

const downloadMedia = async (directory, filename) => {
    const result = await isGroupedMedia(directory, filename);
    if (result && Array.isArray(result)) {
        await downloadGroupedMedia(directory, result);
    } else {
        await downloadSingleMedia(directory, filename);
    }
};

const downloadGroupedMedia = async (directory, groupedFiles) => {
    console.log('Downloading grouped media files:', groupedFiles);
    for (const file of groupedFiles) {
        const filename = file.n;
        await downloadSingleMedia(directory, filename);
    }
};


