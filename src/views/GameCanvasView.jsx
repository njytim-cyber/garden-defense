/**
 * Game Canvas View - Canvas wrapper component
 * Pure UI component that provides canvas ref to parent
 */

import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function GameCanvasView({ width, height, lives = 20, onCanvasReady, onMouseMove, onClick }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current && onCanvasReady) {
            const ctx = canvasRef.current.getContext('2d');
            onCanvasReady(canvasRef.current, ctx);
        }
    }, [onCanvasReady]);

    const handleMouseMove = (e) => {
        if (!canvasRef.current || !onMouseMove) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        onMouseMove(x, y);
    };

    const handleClick = (e) => {
        if (!canvasRef.current || !onClick) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        onClick(x, y);
    };

    // Calculate danger vignette intensity
    const dangerIntensity = lives < 5 ? Math.min(1, (5 - lives) / 4) : 0;
    const isCritical = lives === 1;

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="block cursor-crosshair"
                style={{ filter: 'saturate(0.85)' }}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            />
            {/* Vignette overlay for enhanced focus */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)'
                }}
            />
            {/* Danger vignette - red edges when low health */}
            {dangerIntensity > 0 && (
                <div
                    className={`absolute inset-0 pointer-events-none ${isCritical ? 'animate-pulse' : ''}`}
                    style={{
                        background: `radial-gradient(ellipse at center, transparent 30%, rgba(220,38,38,${dangerIntensity * 0.6}) 100%)`,
                        boxShadow: `inset 0 0 ${60 * dangerIntensity}px rgba(220,38,38,${dangerIntensity * 0.4})`
                    }}
                />
            )}
        </div>
    );
}

GameCanvasView.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    lives: PropTypes.number,
    onCanvasReady: PropTypes.func,
    onMouseMove: PropTypes.func,
    onClick: PropTypes.func
};
