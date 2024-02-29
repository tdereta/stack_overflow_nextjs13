import React from 'react'
import Link from "next/link"
import {Button} from "@/components/ui/button"
import LocalSearch from "@/components/shared/search/LocalSearch"
import Filter from "@/components/shared/Filter"
import {HomePageFilters} from "@/constants/filters"
import HomeFilters from "@/components/home/HomeFilters"
import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import {getQuestions} from "@/lib/actions/question.action";
import {SearchParamsProps} from "@/types";

export default async function Home({ searchParams }: SearchParamsProps) {
    const result = await getQuestions({
        searchQuery: searchParams.q,
    });

    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>
                <Link href="/ask-question" className="flex justify-end max-sm:w-full">
                    <Button
                        className="primary-gradient min-h[46px] px-4 py-3 !text-light-900">Ask a Question
                    </Button>
                </Link>
            </div>
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for questions"
                    otherClasses="flex-1"
                />
                <Filter
                    filters={HomePageFilters}
                    otherClasses="min-h-[30px] sm:min-w-[170px]"
                    containerClasses="hidden max-lg:flex"
                />
            </div>
            <HomeFilters />
            <div className="mt-10 flex flex-col w-full gap-6">
                {result.questions.length > 0 ?
                    result.questions.map((card) => (
                        <QuestionCard
                        key={card._id}
                        _id={card._id}
                        title={card.title}
                        tags={card.tags}
                        author={card.author}
                        upVotes={card.upVotes}
                        views={card.views}
                        answers={card.answers}
                        createdAt={card.createdAt}
                    />
                    ))
                    : <NoResult
                        title="There's no question to show"
                        description="Be the first to break the silence! Ask a Question and kickstart the discussion.
                            Our query could be the next big thing others learn from. Get involved! 💡"
                        link="/ask-question/"
                        linkTitle="Ask a Question"
                    />
                }
            </div>
        </>
    )
}

