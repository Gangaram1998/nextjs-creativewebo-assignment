"use client"
import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import axios from "axios";
import Image from "next/image";
import Loader from "@/components/Loader";

const Page = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true)

    const getSlides = async () => {
        try {
            const res = await axios.get('/api/slides');
            if (res?.data?.status == 200) {
                setSlides(res?.data?.slides)
            }
            setLoading(false)
        }
        catch (error) {
            console.log("error:", error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getSlides()
    }, [])

    return (
        <>
            {loading ? <Loader /> : <div className="py-8 flex justify-center items-center">
                <Carousel
                    opts={{
                        align: "center",
                    }}
                    className="w-full max-w-[90%]"
                >
                    <CarouselContent>
                        {slides?.map((item: any, index: any) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <Image
                                                src={item?.slide}
                                                width={500}
                                                height={500}
                                                className="object-cover"
                                                alt="Picture of the author"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>}
        </>
    )
}

export default Page
