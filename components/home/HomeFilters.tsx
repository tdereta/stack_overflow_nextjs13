"use client"

import React from 'react'
import {HomePageFilters} from "@/constants/filters"
import {Button} from "@/components/ui/button"

const HomeFilters = () => {
    const isActive = 'newest'
    return (
        <div className="mt-10 flex-wrap gap-3 md:flex">
            {HomePageFilters.map((filter) => (
                <Button
                    className={`body-medium rounded px-6 py-3 capitalize shadow-none
                    ${isActive === filter.value 
                        ? "bg-primary-100 text-primary-500" 
                        : "bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:text-light-500 " +
                        "dark:hover:bg-light-700"}`}
                    key={filter.value}
                    onClick={() => {}}
                   >
                    {filter.name}
                </Button>
            ))}
        </div>
    )
}

export default HomeFilters
