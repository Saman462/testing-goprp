// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { saveAs } from 'file-saver';
// import { useNavigate } from 'react-router-dom';
// import { getSortedMediaList } from "./Functions";
// const GoProConnectionWrapper = () => {
//     const [isConnected, setIsConnected] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [recording, setRecording] = useState(false);
//     const [projectId, setProjectId] = useState('');
//     const [projectIdError, setProjectIdError] = useState('');
//     const [recordings, setRecordings] = useState([]);
//     const [lastCaptured, setLastCaptured] = useState(null);
//     const [directory, setDirectory] = useState('');
//     const [fileName, setFileName] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedRecordings = JSON.parse(localStorage.getItem('goproRecordings')) || [];
//         setRecordings(storedRecordings);
//     }, []);

//     useEffect(() => {
//         const checkConnection = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get('/gopro/camera/state');
//                 if (response.status === 200) {
//                     setIsConnected(true);
//                 } else {
//                     setIsConnected(false);
//                 }
//             } catch (error) {
//                 setIsConnected(false);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         checkConnection();
//         const intervalId = setInterval(checkConnection, 30000);
//         return () => clearInterval(intervalId);
//     }, []);
//     // const checkConnection = async () => {
//     //     setLoading(true);
//     //     try {
//     //         const response = await axios.get('/gopro/camera/state');
//     //         if (response.status === 200) {
//     //             setIsConnected(true);
//     //         } else {
//     //             setIsConnected(false);
//     //         }
//     //     } catch (error) {
//     //         setIsConnected(false);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
//     const startRecording = async () => {
//         if (!projectId) {
//             setProjectIdError('Please enter a valid Project ID.');
//             return;
//         }
//         setProjectIdError('');
//         try {
//             const response = await axios.get('/gopro/camera/shutter/start');
//             if (response.status === 200) {
//                 setRecording(true);
//                 console.log(`Recording started for Project ID: ${projectId}`);
//             } else {
//                 console.error('Failed to start recording');
//             }
//         } catch (error) {
//             console.error('Error starting recording:', error);
//         }
//     };

//     const stopRecording = async () => {
//         try {
//             const response = await axios.get('/gopro/camera/shutter/stop');
//             if (response.status === 200) {
//                 setRecording(false);
//                 console.log(`Recording stopped for Project ID: ${projectId}`);
//             } else {
//                 console.error('Failed to stop recording');
//             }
//         } catch (error) {
//             console.error('Error stopping recording:', error);
//         }
//     };
//     const fetchLastCaptured = async () => {

//         async function lastCaptured() {
//             const sortedFiles = await getSortedMediaList();

//             if (sortedFiles.length > 0) {
//                 const recentFile = sortedFiles[sortedFiles.length - 1];
//                 console.log('\nMost Recent File:');
//                 console.log(`Media Folder: ${recentFile.folder}`);
//                 console.log(`File Name: ${recentFile.fileName}`);
//                 return recentFile;
//             } else {
//                 console.log('No files found.');
//                 return null;
//             }
//         }

//         const recentFile = await lastCaptured();
//         const stateResponse = await axios.get('/gopro/camera/state');
//         const mediaQuality = stateResponse.data.settings['2'];

//         if (recentFile) {

//             const newRecording = {
//                 projectId,
//                 mediaQuality: mediaQuality,
//                 fileName: recentFile.fileName,
//                 folder: recentFile.folder,
//             };
//             const updatedRecordings = [...recordings, newRecording];
//             setRecordings(updatedRecordings);
//             localStorage.setItem('goproRecordings', JSON.stringify(updatedRecordings));
//         }
//     };



//     const goToMediaList = () => {
//         navigate('/media');
//     };


//     const downloadSingleMedia = async (directory, filename) => {
//         const url = `/videos/DCIM/${directory}/${filename}`;
//         console.log(`Downloading file: ${filename} from URL: ${url}`);
//         try {
//             const response = await axios.get(url, { responseType: 'blob' });
//             const blob = new Blob([response.data], { type: 'video/mp4' });
//             saveAs(blob, filename);
//             console.log('Media downloaded and saved successfully.');
//         } catch (error) {
//             console.log(`Error downloading media ${filename}:`, error.message);
//         }
//     };
//     const getMediaList = async () => {
//         try {
//             const response = await axios.get('/gopro/media/list');
//             if (response.status === 200) {
//                 const data = response.data;
//                 if (data.media && data.media.length > 0) {
//                     return data.media;
//                 } else {
//                     console.log('No media found.');
//                     return [];
//                 }
//             } else {
//                 console.error('Failed to retrieve media list. Status:', response.status, 'Response:', response.data);
//                 return [];
//             }
//         } catch (error) {
//             console.error('Error retrieving media list:', error.message);
//             return [];
//         }
//     };
//     const isGroupedMedia = async (directory, filename) => {
//         console.log('Checking if media file is grouped:', filename);
//         const mediaID = filename.match(/(\d{4})\./)[1];
//         const filePrefix = filename.substring(0, 2);

//         const mediaList = await getMediaList();
//         const folder = mediaList.find(mediaItem => mediaItem.d === directory);

//         if (!folder) {
//             console.log('Folder not found.');
//             return false;
//         }

//         if (!folder.fs || folder.fs.length === 0) {
//             console.log('No files in the folder.');
//             return false;
//         }

//         const groupedFiles = folder.fs.filter(file => {
//             const fileID = file.n.match(/(\d{4})\./)[1];
//             return fileID === mediaID && file.n.startsWith(filePrefix);
//         });

//         if (groupedFiles.length > 1) {
//             console.log('Media file is grouped.');
//             return groupedFiles;
//         } else {
//             console.log('Media file is not grouped.');
//             return false;
//         }
//     };

//     const downloadMedia = async (directory, filename) => {
//         console.log('downloadMedia:', filename);
//         const result = await isGroupedMedia(directory, filename);
//         if (result && Array.isArray(result)) {
//             await downloadGroupedMedia(directory, result);
//         } else {
//             await downloadSingleMedia(directory, filename);
//         }
//     };

//     const downloadGroupedMedia = async (directory, groupedFiles) => {
//         console.log('Downloading grouped media files:', groupedFiles);
//         for (const file of groupedFiles) {
//             const filename = file.n;
//             await downloadSingleMedia(directory, filename);
//         }
//     };

//     const handleDownload = async () => {
//         if (!directory || !fileName) {
//             alert('Please enter both directory and file name.');
//             return;
//         }
//         await downloadMedia(directory, fileName);
//     };


//     return (
//         <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>

//             <div>
//                 {loading ? (
//                     <div style={{ textAlign: 'center', color: '#008000' }}>
//                         <p>Checking connection...</p>

//                     </div>
//                 ) : isConnected ? (
//                     <div style={{ textAlign: 'center' }}>
//                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
//                             <span style={{ color: 'green', marginRight: '5px' }}>●</span>
//                             <span>Connected to GoPro</span>
//                         </div>
//                         <input
//                             type="text"
//                             placeholder="Enter Project ID"
//                             value={projectId}
//                             onChange={(e) => setProjectId(e.target.value)}
//                             style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
//                         />
//                         {projectIdError && <p style={{ color: 'red', fontSize: '14px' }}>{projectIdError}</p>}
//                         <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
//                             <button
//                                 onClick={recording ? stopRecording : startRecording}
//                                 style={{ flex: '1', padding: '10px', backgroundColor: recording ? '#dc3545' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//                             >
//                                 {recording ? 'Stop Recording' : 'Start Recording'}
//                             </button>
//                             <button
//                                 onClick={fetchLastCaptured}
//                                 style={{ flex: '1', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//                             >
//                                 Get lastCaptured
//                             </button>
//                             <button
//                                 onClick={goToMediaList}
//                                 style={{ flex: '1', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//                             >
//                                 Go to Media List
//                             </button>
//                         </div>
//                         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
//                             <input
//                                 type="text"
//                                 value={directory}
//                                 onChange={(e) => setDirectory(e.target.value)}
//                                 placeholder="Enter Directory"
//                                 style={{
//                                     width: '100%',
//                                     maxWidth: '400px',
//                                     padding: '10px',
//                                     marginBottom: '10px',
//                                     borderRadius: '5px',
//                                     border: '1px solid #ccc',
//                                     fontSize: '16px',
//                                     boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
//                                     transition: 'border-color 0.2s',
//                                 }}
//                             />
//                             <input
//                                 type="text"
//                                 value={fileName}
//                                 onChange={(e) => setFileName(e.target.value)}
//                                 placeholder="Enter Filename"
//                                 style={{
//                                     width: '100%',
//                                     maxWidth: '400px',
//                                     padding: '10px',
//                                     marginBottom: '10px',
//                                     borderRadius: '5px',
//                                     border: '1px solid #ccc',
//                                     fontSize: '16px',
//                                     boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
//                                     transition: 'border-color 0.2s',
//                                 }}
//                             />
//                             <button
//                                 onClick={handleDownload}
//                                 style={{
//                                     width: '100%',
//                                     maxWidth: '400px',
//                                     padding: '10px',
//                                     backgroundColor: '#007bff',
//                                     color: 'white',
//                                     border: 'none',
//                                     borderRadius: '5px',
//                                     cursor: 'pointer',
//                                     fontSize: '16px',
//                                     boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
//                                     transition: 'background-color 0.2s',
//                                 }}
//                             >
//                                 Download Media
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <div style={{ textAlign: 'left' }}>
//                         <p>Not connected to GoPro</p>
//                         <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Instructions:</h4>
//                         <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#555' }}>
//                             <li>Open the Quik app on your device.</li>
//                             <li>Connect your device to the GoPro’s Wi-Fi network.</li>
//                             <li>Once connected, click the "Check GoPro Connection" button again.</li>
//                         </ul>
//                     </div>
//                 )}

//             </div>

//             {/* Display stored recordings */}
//             <div style={{ marginTop: '20px' }}>
//                 <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Recordings:</h4>
//                 {recordings.length > 0 ? (
//                     <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '14px', color: '#555' }}>
//                         {recordings.map((recording, index) => (
//                             <li key={index} style={{ marginBottom: '10px' }}>
//                                 <strong>Project ID:</strong> {recording.projectId} <br />
//                                 <strong>File Name:</strong> {recording.fileName} <br />
//                                 <strong>Media Quality:</strong> {recording.mediaQuality} <br />
//                                 <strong>Folder:</strong> {recording.folder} <br />
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>No recordings found.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default GoProConnectionWrapper;
import { useEffect, useState } from 'react';
import axios from 'axios';

const CheckGoProConnection = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
            setLoading(true);
            try {
                // Use the proxied URL instead of the direct GoPro URL
                const response = await axios.get('/api/camera/state');
                if (response.status === 200) {
                    setIsConnected(true);
                } else {
                    setIsConnected(false);
                }
            } catch (error) {
                setIsConnected(false);
            } finally {
                setLoading(false);
            }
        };

        checkConnection();
        // Set up interval to check connection every 30 seconds
        const intervalId = setInterval(checkConnection, 30000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : isConnected ? (
                <p>GoPro is connected!</p>
            ) : (
                <p>GoPro is not connected.</p>
            )}
        </div>
    );
};

export default CheckGoProConnection;
