
"use client"
import React, { useState, useEffect } from 'react';
import home from "@/assests/home.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Card from "@/components/card";
import { directusUrl } from '@/lib/constants';
import Pagination from '@/components/pagination';
import { aggregate } from '@directus/sdk';

type NewsFeeds = {
    id: string,
    status: string,
    sort: null,
    user_created: string,
    date_created: string,
    user_upadted: null,
    date_updated: null,
    title: string,
    content: string,
    category: string,
    image: string,
    time: string
}

type Item = {
    id: string,
    name: string
}

export default function Filter() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 3;
    const [initial, setInitial] = useState<NewsFeeds[]>([]);
    const [current, setCurrent] = useState<NewsFeeds[]>([]);
    const [category, setCategory] = useState<Item[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string>('View all');

    const fetchData = async () => {
        const newsResponse = await fetch(`${directusUrl}/items/news_and_feeds`).then(res => res.json());
        const totalResponse = await fetch(`${directusUrl}/items/news_and_feeds?aggregate[count]=*`).then(res => res.json());
        const categoryResponse = await fetch(`${directusUrl}/items/categories`).then(res => res.json());
        const totalCount = totalResponse.count;

        const newsData = newsResponse.data as NewsFeeds[];
        const categoryData = categoryResponse.data as Item[];

        setInitial(newsData);
        setCurrent(newsData);
        setCategory(categoryData);
        setTotalItems(totalCount);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (currentCategory === 'View all') {
            setCurrent(initial);
        } else {
            setCurrent(initial.filter(data => data.category === currentCategory));
        }
    }, [initial, currentCategory]);

    const fetchCurrentPageData = () => {
        const lastPostIndex = currentPage * itemsPerPage;
        const firstPostIndex = lastPostIndex - itemsPerPage;
        const currentPosts = current.slice(firstPostIndex, lastPostIndex);
        return currentPosts;
    };

    return (
        <div className="container flex flex-col gap-4">
            <div className="flex flex-col items-center gap-8 m-4 ">
                <p className="text-4xl md:text-6xl font-bold text-center">News and insights</p>
                <p className="max-w-lg text-center ">Learn about Real Estate, Marketing, and Property Insight, discover latest product updates, partnership announcements, user stories, and more.</p>
            </div>
            <div className="flex justify-center m-2 p-4 ">
                <div className="flex  gap-4 border-solid border-[1px] p-2 ">
                    <Button onClick={() => setCurrentCategory("View all")}>View all</Button>
                    {category.map((item, i) => (
                        <div key={i} className="hover:bg-orange-500 rounded-lg ">
                            <Button className='p-2' onClick={() => setCurrentCategory(item.name)}>{item.name}</Button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 m-2 p-4">
                <div className="w-full md:w-1/2 h-full">
                    <img src={home.src} className="h-full w-full object-cover" alt="Home" />
                </div>
                <div className="flex flex-col gap-4 md:w-1/2 h-full border-solid border-[1px]">
                    <div className="flex gap-8 m-4">
                        <Button className="bg-orange-500">News</Button>
                        <p className="font-bold p-2">5 min read</p>
                    </div>
                    <div className="flex flex-col gap-4 m-4">
                        <p className="text-2xl md:text-4xl">There is a property where you can invest</p>
                        <p>Whether you're searching for a cozy apartment in the heart of the city, a charming suburban house with a spacious backyard, or a luxurious waterfront estate, we have something to suit every taste and lifestyle.</p>
                    </div>
                    <div className='flex justify-center m-2'>
                        <Button className="w-full md:w-32 object-contain m-4">Read More &nbsp; &gt;</Button>
                    </div>
                </div>
            </div>
            <div className="container grid grid-cols-1 md:grid-cols-3 gap-4 ">
                {fetchCurrentPageData().map((item, i) => (
                    <div key={i} className="flex flex-col gap-4  border-solid border-[1px] w-full ">
                        <Card {...item} />
                    </div>
                ))}
            </div>
            <div className='flex justify-center m-8'>
                {totalItems && <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
                }
            </div>
            <div className="flex flex-col items-center gap-8">
                <p className="text-2xl md:text-4xl">Stay in the loop</p>
                <p className="container max-w-xl text-center">Subscribe to our newsletter to receive the latest updates on the A2A and stay informed about Certification trends. Don’t miss out the magic!</p>
                <div className="flex gap-1 m-4">
                    <Input type="email" name="email" required placeholder="name@gmail.com" />
                    <Button>Subscribe</Button>
                </div>
            </div>
        </div>
    );
}