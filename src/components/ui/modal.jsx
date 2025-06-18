'use client'

import { useEffect } from 'react';

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  size = 'default',
  className = '',
  maxWidth,
  fullScreen = false 
}) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Define size classes
    const sizeClasses = {
        small: 'max-w-md',
        default: 'max-w-2xl',
        large: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-7xl'
    };

    // Build modal classes
    const modalClasses = [
        'relative bg-white rounded-lg shadow-xl w-full',
        fullScreen ? 'h-[90vh] max-h-[90vh]' : '',
        maxWidth ? maxWidth : sizeClasses[size],
        className
    ].filter(Boolean).join(' ');

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />
            
            {/* Modal */}
            <div className={`flex min-h-full items-center justify-center ${fullScreen ? 'p-2 sm:p-4' : 'p-4'}`}>
                <div 
                    className={modalClasses}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
                        aria-label="Close"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}