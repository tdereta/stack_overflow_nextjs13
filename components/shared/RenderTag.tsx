import React from 'react'
import Link from "next/link"
import { Badge } from "@/components/ui/badge"


interface Props {
    name: string;
    _id: string;
    number?: number;
    showCount?: boolean;
}

const RenderTag = ({ name, _id, number, showCount } : Props ) => {
    return (
        <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
            <Badge className="subtle-middle background-light800_dark300 text-light400_light500
            rounded-md border-none px-4 py-2 uppercase">{name}
            </Badge>
            {showCount && <p className="small-medium text-dark500_light700">{number}</p>}
        </Link>
    );
};

export default RenderTag;
