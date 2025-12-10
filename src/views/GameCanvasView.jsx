/**
 * Game Canvas View - Canvas wrapper component
 * Pure UI component that provides canvas ref to parent
 */

import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function GameCanvasView({ width, height, onCanvasReady, onMouseMove, onClick }) {
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

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="block cursor-crosshair"
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        />
    );
}

GameCanvasView.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onCanvasReady: PropTypes.func,
    onMouseMove: PropTypes.func,
    onClick: PropTypes.func
};
