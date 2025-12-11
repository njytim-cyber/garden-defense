import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SkinShopView from '../../src/views/SkinShopView';

describe('SkinShopView', () => {
    it('renders correctly', () => {
        const onBack = vi.fn();
        render(<SkinShopView onBack={onBack} />);

        // Check title
        expect(screen.getByText('SKIN SHOP')).toBeInTheDocument();

        // Check "Coming Soon" text
        expect(screen.getByText(/coming soon/i)).toBeInTheDocument();

        // Check placeholders
        expect(screen.getByText('🤖')).toBeInTheDocument();
        expect(screen.getByText('🐉')).toBeInTheDocument();
        expect(screen.getByText('🎃')).toBeInTheDocument();
    });

    it('handles back button click', () => {
        const onBack = vi.fn();
        render(<SkinShopView onBack={onBack} />);

        const backButton = screen.getByRole('button', { name: /back to menu/i });
        fireEvent.click(backButton);

        expect(onBack).toHaveBeenCalledTimes(1);
    });
});
