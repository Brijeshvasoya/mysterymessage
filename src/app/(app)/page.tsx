"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

const Home = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-br from-black via-gray-400 to-gray-50">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-gray-100 via-gray-200 to-gray-450 text-transparent bg-clip-text">
          Drive into the world of Anonymous Conversations
        </h1>
        <p className="mt-3 md:mt-4 text-lg md:text-xl text-white">
          Explore Mystery Message, a platform for sharing messages and experiences in a unique way.
        </p>
      </section>
      <Carousel plugins={[Autoplay({ delay: 3000 })]} className="w-full">
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-4">
                <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg h-auto">
                  <CardHeader className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-800 text-white font-bold">
                    {message.title}
                  </CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-2 h-40">
                    <span className="text-3xl font-semibold text-gray-800">{message.content}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-gray-600" />
        <CarouselNext className="text-gray-600" />
      </Carousel>
    </main>
    <footer className="text-center p-4 md:p-6">
      <p className="text-gray-700">
        &copy; 2025 Mystery Message. All rights reserved.
      </p>
    </footer>
    </>
  );
};

export default Home;