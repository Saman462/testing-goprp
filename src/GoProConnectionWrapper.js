import React, { useState } from 'react';
import axios from 'axios';

const GoProConnectionWrapper = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recording, setRecording] = useState(false);

    const checkConnection = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://10.5.5.9:8080/gopro/camera/state');
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

    const startRecording = async () => {
        try {
            const response = await axios.get('http://10.5.5.9:8080/gopro/camera/record?start');
            if (response.status === 200) {
                setRecording(true);
            } else {
                console.error('Failed to start recording');
            }
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = async () => {
        try {
            const response = await axios.get('http://10.5.5.9:8080/gopro/camera/record?stop');
            if (response.status === 200) {
                setRecording(false);
            } else {
                console.error('Failed to stop recording');
            }
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    };

    return (
        <div>
            <button onClick={checkConnection} disabled={loading}>
                {loading ? 'Checking...' : 'Check GoPro Connection'}
            </button>
            <div style={{ marginTop: '10px' }}>
                {isConnected ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: 'green', marginRight: '10px' }}>●</span>
                            <span>Connected to GoPro</span>
                        </div>
                        <button
                            style={{ marginTop: '10px' }}
                            onClick={recording ? stopRecording : startRecording}
                        >
                            {recording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                    </div>
                ) : (
                    !loading && (
                        <div>
                            <p>Not connected to GoPro</p>
                            <div>
                                <h4>Instructions:</h4>
                                <ul>
                                    <li>Open the Quik app on your device.</li>
                                    <li>Connect your device to the GoPro’s Wi-Fi network.</li>
                                    <li>Once connected, click the "Check GoPro Connection" button again.</li>
                                </ul>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default GoProConnectionWrapper;
