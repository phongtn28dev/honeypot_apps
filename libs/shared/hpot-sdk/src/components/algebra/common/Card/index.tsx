import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card = ({ children, className = "" }: CardProps) => {
    return (
        <div className={`bg-white text-black rounded-3xl shadow-sm hover:shadow-md transition-all border border-[#F7931A10] hover:border-[#F7931A] duration-300 ${className}`}>
            {children}
        </div>
    );
}

export default Card;