"use server"

import React from 'react'
import Link from "next/link"
import Image from "next/image"
import RenderTag from "@/components/shared/RenderTag"
import {getHotQuestions} from "@/lib/actions/question.action"
import {getPopularTags} from "@/lib/actions/tag.action"

const RightSidebar = async () => {
    const hotQuestions = await getHotQuestions()

    const popularTags = await getPopularTags()

        return (
            <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0
        flex h-screen flex-col justify-between overflow-y-auto p-6 pt-36
        shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]">
                <div className="flex flex-1 flex-col gap-2">
                    <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                    <div className="mt-7 flex flex-col w-full gap-3">
                        {hotQuestions.map((question) => (
                            <Link href={`question/${question._id}`}
                                  key={question._id}
                                  className="flex cursor-pointer items-center justify-between gap-7">
                                <p className="body-medium text-dark500_light700">{question.title}</p>
                                <Image src="/assets/icons/chevron-right.svg"
                                       alt="Arrow Right"
                                       width={20}
                                       height={20}
                                       className="invert-colors"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="mt-16">
                    <h3 className="h3-bold text-dark200_light900 mt-10">Popular Tags</h3>
                    <div className="mt-7 flex flex-col gap-3">
                        {popularTags.map((tag) => (
                            <RenderTag
                                key={tag._id}
                                _id={tag._id}
                                name={tag.name}
                                number={tag.numberOfQuestions}
                                showCount
                            />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

export default RightSidebar