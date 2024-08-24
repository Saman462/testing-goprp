import React, { useState } from 'react';
import { getSortedMediaList } from './Functions';

const MediaListPage = () => {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSortedMediaList = async () => {
        setLoading(true);
        setError('');
        try {
            const sortedMediaList = await getSortedMediaList();

            if (sortedMediaList.length > 0) {
                setMediaList(sortedMediaList);
            } else {
                setError('No media found.');
                setMediaList([]);
            }
        } catch (error) {
            setError(`Error retrieving media list: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <button
                onClick={fetchSortedMediaList}
                style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
            >
                {loading ? 'Loading...' : 'Get Sorted Media List'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {mediaList.length > 0 && (
                <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                    {mediaList.map((file, index) => (
                        <li key={index} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            <strong>File Name:</strong> {file.fileName} <br />
                            <strong>Created:</strong> {new Date(file.created * 1000).toLocaleString()} <br />
                            <strong>Modified:</strong> {new Date(file.modified * 1000).toLocaleString()} <br />
                            <strong>Size:</strong> {file.size} bytes <br />
                            <strong>Folder:</strong> {file.folder} <br />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MediaListPage;
