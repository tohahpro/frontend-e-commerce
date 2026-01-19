/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function ProductQuickViewModal({ open, setOpen, product }: any) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  
  // 🔍 zoom states
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLDivElement>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  const ZOOM = 2.5;
  const LENS = 120;

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // image size detect (modal open / image change)
  useEffect(() => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setImgSize({ w: rect.width, h: rect.height });
    }
  }, [current, open]);


    // carousel sync
  useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  // image size for zoom
  useEffect(() => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setImgSize({ w: rect.width, h: rect.height });
    }
  }, [current]);

  if (!product) return <p>Loading...</p>;

  const activeImage = product.images[current];

  const isFirst = current === 0;
  const isLast = current === product.images.length - 1;


  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="lg:min-w-5xl max-h-[90vh] flex flex-col p-0">
        <div className="lg:flex lg:gap-3 py-6 px-2 md:px-4 md:p-6">
          {/* LEFT SIDE */}
          <div className="flex gap-2">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2">
              {product.images.map((img: string, i: number) => (
                <button
                  key={img}
                  onClick={() => api?.scrollTo(i)}
                  className={`border cursor-pointer rounded-md p-1 ${current === i ? "border-black" : "border-gray-200"
                    }`}
                >
                  <Image
                    src={img}
                    alt="thumb"
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Main image + carousel */}
            <div
              ref={imageRef}
              className="relative cursor-pointer w-[500px] overflow-hidden rounded-lg group"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPosition({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
            >
              <Carousel setApi={setApi}>
                <CarouselContent>
                  {product.images.map((img: string) => (
                    <CarouselItem
                      key={img}
                      className="flex justify-center"
                    >
                      <Image
                        src={img}
                        alt="product"
                        width={500}
                        height={650}
                        className="object-contain"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* LEFT button */}
              {
                !isFirst && (
                  <button
                    onClick={() => api?.scrollPrev()}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20
                          bg-white/80 hover:bg-white
                          rounded-full p-2 shadow
                          opacity-0 group-hover:opacity-100
                          transition-all cursor-pointer"
                  >
                    <ChevronLeft size={22} />
                  </button>
                )
              }

              {/* RIGHT button */}
              {
                !isLast && (
                  <button
                    onClick={() => api?.scrollNext()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20
                          bg-white/80 hover:bg-white
                          rounded-full p-2 shadow
                          opacity-0 group-hover:opacity-100
                          transition-all cursor-pointer"
                  >
                    <ChevronRight size={22} />
                  </button>
                )
              }

              {/* 🔍 Zoom lens */}
              {showZoom && (
                <div
                  className="pointer-events-none absolute z-10 rounded-full border bg-no-repeat shadow-lg"
                  style={{
                    width: LENS,
                    height: LENS,
                    top: position.y - LENS / 2,
                    left: position.x - LENS / 2,
                    backgroundImage: `url(${activeImage})`,
                    backgroundSize: `${imgSize.w * ZOOM}px ${imgSize.h * ZOOM
                      }px`,
                    backgroundPosition: `
                              -${position.x * ZOOM - LENS / 2}px
                              -${position.y * ZOOM - LENS / 2}px
                            `,
                  }}
                />
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-2 pt-3">
            <h2 className="text-base md:text-xl font-semibold uppercase">
              {product.title}
            </h2>

            <p className="text-lg md:text-2xl font-bold">৳ {product.price}</p>

            <p className="text-sm">
              <span className="text-gray-500">Color : </span>
              {product.color || "Default"}
            </p>

            <p className="text-sm">
              <span className="text-gray-500">Barcode : </span>
              {product.barcode || "Default"}
            </p>

            <p className="text-sm text-gray-500">
              Category :{" "}
              {product.productCategory?.map((item: any, index: number) => (
                <span key={item.categoryId} className="text-black">
                  {item.category?.name}
                  {index < product.productCategory.length - 1 && ", "}
                </span>
              ))}
            </p>

            {/* SIZE */}
            <div>
              <p className="text-sm mb-2">
                Select Size : {selectedVariant?.size || "Choose"}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variantOption?.map((variant: any) => {
                  const isOutOfStock = variant.stock === 0;
                  const isSelected = selectedVariant?.id === variant.id;

                  return (
                    <Button
                      key={variant.id}
                      size="sm"
                      disabled={isOutOfStock}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => setSelectedVariant(variant)}
                      className={
                        isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
                      }
                    >
                      {variant.size}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-1 md:gap-2 pt-3">
              <Button variant="secondary" className="text-sm">
                Add To Cart
              </Button>
              <Button className="text-sm">Order Now</Button>
              <Button variant="outline" size="icon">
                <Heart />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
