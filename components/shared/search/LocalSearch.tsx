"use client"

import React, {useEffect, useState} from 'react'
import Image from "next/image"
import { Input } from "@/components/ui/input"
import {usePathname, useRouter, useSearchParams} from "next/navigation"
import {formUrlQuery, removeKeysFromQuery} from "@/lib/utils"

interface CustomInputProps {
    route: string,
    iconPosition: string,
    imgSrc: string,
    placeholder: string,
    otherClasses?: string
}

const LocalSearch = ({ route, iconPosition, imgSrc, placeholder, otherClasses } : CustomInputProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = searchParams.get('q');

    const [search, setSearch] = useState(query || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if(search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'q',
                    value: search
                })

                router.push(newUrl, { scroll: false });
            } else {
                console.log(route, pathname)
                if(pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['q']
                    })

                    router.push(newUrl, { scroll: false });
                }
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn)
    }, [search, route, pathname, router, searchParams, query])

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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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
