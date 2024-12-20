import React, { useEffect, useState } from 'react';
import { bouncyArc } from 'ldrs';

bouncyArc.register();

const Loading: React.FC = () => {
    const [loadingComplete, setLoadingComplete] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoadingComplete(true);
        }, 2000);
    }, []);
    return (
        <div className={`loading-container ${loadingComplete ? 'fade-out' : ''}`}>
            <l-bouncy-arc
                size="70"
                speed="1.65"
                color="white" // Set the color to white
            ></l-bouncy-arc>
        </div>
    );
};

export default Loading;

