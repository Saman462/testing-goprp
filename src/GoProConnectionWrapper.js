import React, { useState } from 'react';
import axios from 'axios';

const GoProConnectionWrapper = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkConnection = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://10.5.5.9/gopro/camera/state');
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

    return (
        <div>
            <button onClick={checkConnection} disabled={loading}>
                {loading ? 'Checking...' : 'Check GoPro Connection'}
            </button>
            <div style={{ marginTop: '10px' }}>
                {isConnected ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'green', marginRight: '10px' }}>●</span>
                        <span>Connected to GoPro</span>
                    </div>
                ) : (
                    !loading && <p>Not connected to GoPro</p>
                )}
            </div>
        </div>
    );
};

export default GoProConnectionWrapper;
