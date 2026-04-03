"use client";

import React, { useId } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const TextArea = ({
    label,
    error,
    id,
    className = "",
    ...props
}: TextAreaProps) => {
    const reactId = useId();
    const textAreaId = id || reactId;

    return (
        <div className="w-full space-y-2">
            {label && (
                <label
                    htmlFor={textAreaId}
                    className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-1 cursor-pointer hover:text-text-primary transition-colors"
                >
                    {label}
                </label>
            )}
            <textarea
                id={textAreaId}
                className={`
                    w-full min-h-[120px] px-4 py-3 rounded-2xl
                    bg-surface-secondary shadow-neumorph-inset
                    text-sm text-text-primary placeholder:text-text-muted/50
                    outline-none border border-transparent
                    focus:border-[var(--theme-base)]/30 transition-all duration-smooth
                    resize-none
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="text-[10px] text-danger-base font-medium ml-1 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
};