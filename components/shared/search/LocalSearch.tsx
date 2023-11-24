"use client"

import React from 'react'
import Image from "next/image"
import { Input } from "@/components/ui/input"
interface CustomInputProps {
    route: string,
    iconPosition: string,
    imgSrc: string,
    placeholder: string,
    otherClasses?: string
}

const LocalSearch = ({ route, iconPosition, imgSrc, placeholder, otherClasses } : CustomInputProps) => {
    return (
        <div className="flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
            <div className={`background-light800_darkgradient relative flex min-h-[30px] grow items-center
            gap-1 rounded px-4 ${otherClasses}`}>
                {iconPosition === "left" && (
                    <Image
                        src={imgSrc}
                        alt="Search Icon"
                        width={24}
                        height={24}
                        className="cursor-pointer" />
                )}
                <Input
                    type="text"
                    placeholder={placeholder}
                    onChange={() => {}}
                    className="paragraph-regular no-focus placeholder
                    background-light800_darkgradient border-none shadow-none outline-none" />
                {iconPosition === "right" && (
                    <Image
                        src={imgSrc}
                        alt="Search Icon"
                        width={24}
                        height={24}
                        className="cursor-pointer" />
                )}
            </div>
        </div>
    );
};

export default LocalSearch
