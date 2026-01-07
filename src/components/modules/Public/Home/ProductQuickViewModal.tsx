/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
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

  if (!product) return null;

  const activeImage = product.images[current];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-2 overflow-y-auto">
        <div className="pt-6 md:px-4 md:p-6">
          {/* LEFT SIDE */}
          <div className="md:flex md:flex-row-reverse gap-2 space-y-4 md:space-y-0">
            {/* Carousel + Zoom */}
            <div
              ref={imageRef}
              className="relative w-full overflow-hidden rounded-lg"
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
              <Carousel setApi={setApi} className="w-full rounded-lg">
                <CarouselContent>
                  {product.images.map((item: string) => (
                    <CarouselItem
                      key={item}
                      className="flex justify-center items-center"
                    >
                      <Image
                        src={item}
                        alt="product"
                        width={500}
                        height={650}
                        className="rounded-lg max-h-[60vh] object-contain"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* 🔍 Magnifier */}
              {showZoom && imgSize.w > 0 && (
                <div
                  className="pointer-events-none absolute z-30 rounded-full border bg-no-repeat shadow-lg"
                  style={{
                    width: LENS,
                    height: LENS,
                    top: position.y - LENS / 2,
                    left: position.x - LENS / 2,
                    backgroundImage: `url(${activeImage})`,
                    backgroundSize: `${imgSize.w * ZOOM}px ${
                      imgSize.h * ZOOM
                    }px`,
                    backgroundPosition: `
                      -${position.x * ZOOM - LENS / 2}px
                      -${position.y * ZOOM - LENS / 2}px
                    `,
                  }}
                />
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex md:flex-col gap-1">
              {product.images.map((item: string, i: number) => (
                <button
                  key={item}
                  onClick={() => api?.scrollTo(i)}
                  className={`border rounded-lg transition
                    ${current === i ? "border-black" : "border-gray-200"}
                  `}
                >
                  <Image
                    src={item}
                    alt="thumb"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                </button>
              ))}
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
