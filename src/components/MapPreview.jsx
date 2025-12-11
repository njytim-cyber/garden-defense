import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function MapPreview({ paths, width = 200, height = 200, color = "#ffffff", lineWidth = 4, className = "", padding = 20 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);

        // Draw paths
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Add glow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        const drawWidth = width - (padding * 2);
        const drawHeight = height - (padding * 2);

        paths.forEach(path => {
            if (!path || path.length < 2) return;

            ctx.beginPath();
            ctx.moveTo(padding + path[0].x * drawWidth, padding + path[0].y * drawHeight);

            for (let i = 1; i < path.length; i++) {
                ctx.lineTo(padding + path[i].x * drawWidth, padding + path[i].y * drawHeight);
            }

            ctx.stroke();
        });

    }, [paths, width, height, color, lineWidth, padding]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={className}
        />
    );
}

MapPreview.propTypes = {
    paths: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.shape({
                x: PropTypes.number.isRequired,
                y: PropTypes.number.isRequired
            })
        )
    ).isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
    lineWidth: PropTypes.number,
    className: PropTypes.string
};
