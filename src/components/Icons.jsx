/**
 * UI Icon Components - SVG icons to replace emojis
 */

import React from 'react';
import PropTypes from 'prop-types';

// Heart icon for lives
export function HeartIcon({ className = "w-6 h-6", color = "#ef4444" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill={color}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );
}

// Coin icon for money
export function CoinIcon({ className = "w-6 h-6", color = "#fbbf24" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill={color}>
            <circle cx="12" cy="12" r="10" fill={color} />
            <circle cx="12" cy="12" r="8" fill="#facc15" stroke="#d97706" strokeWidth="1" />
            <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#854d0e">$</text>
        </svg>
    );
}

// Shopping cart icon
export function CartIcon({ className = "w-6 h-6", color = "#94a3b8" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
    );
}

// Crown icon for boss enemies
export function CrownIcon({ className = "w-6 h-6", color = "#fbbf24" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill={color}>
            <path d="M12 4L5 12l2 8h10l2-8-7-8zM7 18l-1-4 4 2-2 2zm10 0l-2-2 4-2-2 4zm-5-4l-4-2 4-4 4 4-4 2z" />
        </svg>
    );
}

// Ninja icon for stealth enemies
export function NinjaIcon({ className = "w-6 h-6", color = "#475569" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill={color}>
            <circle cx="12" cy="10" r="6" fill={color} />
            <rect x="6" y="8" width="12" height="4" fill="#1e293b" />
            <circle cx="9" cy="10" r="1" fill="#fff" />
            <circle cx="15" cy="10" r="1" fill="#fff" />
        </svg>
    );
}

// Book icon for compendium
export function BookIcon({ className = "w-6 h-6", color = "#8b5cf6" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill={color}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill={color} stroke="#7c3aed" strokeWidth="1" />
            <line x1="9" y1="7" x2="16" y2="7" stroke="#fff" strokeWidth="1" />
            <line x1="9" y1="11" x2="14" y2="11" stroke="#fff" strokeWidth="1" />
        </svg>
    );
}

// Shirt icon for skins
export function ShirtIcon({ className = "w-6 h-6", color = "#3b82f6" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill={color}>
            <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10h12V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
    );
}

// Menu/hamburger icon
export function MenuIcon({ className = "w-6 h-6", color = "currentColor" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    );
}

// Close X icon
export function CloseIcon({ className = "w-6 h-6", color = "currentColor" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

// Upgrade arrow icon
export function UpgradeIcon({ className = "w-6 h-6", color = "#22c55e" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill={color}>
            <path d="M12 4l-8 8h5v8h6v-8h5z" />
        </svg>
    );
}

// Basic icon prop types
const iconPropTypes = {
    className: PropTypes.string,
    color: PropTypes.string
};

HeartIcon.propTypes = iconPropTypes;
CoinIcon.propTypes = iconPropTypes;
CartIcon.propTypes = iconPropTypes;
CrownIcon.propTypes = iconPropTypes;
NinjaIcon.propTypes = iconPropTypes;
BookIcon.propTypes = iconPropTypes;
ShirtIcon.propTypes = iconPropTypes;
MenuIcon.propTypes = iconPropTypes;
CloseIcon.propTypes = iconPropTypes;
UpgradeIcon.propTypes = iconPropTypes;
