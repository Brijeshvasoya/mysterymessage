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

const Home = () => {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-100">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Drive into the world of Anonymous Conversations
        </h1>
        <p className="mt-3 md:mt-4 text-lg md:text-xl text-gray-700">
          Explore Mystery Message, a platform for sharing messages and experiences in a unique way.
        </p>
      </section>
      <Carousel plugins={[Autoplay({ delay: 3000 })]} className="w-full">
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-4">
                <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg h-auto">
                  <CardHeader className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-800 text-white rounded-t-lg">
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