/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getSingleProduct } from "@/services/public/product";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function ProductDetails() {
  const params = useParams();

  const [product, setProduct] = useState<any>(null);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // 🔍 zoom states
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // image container ref & size
  const imageRef = useRef<HTMLDivElement>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  const ZOOM = 2.5;
  const LENS = 150; // magnifier size

  // fetch product
  useEffect(() => {
    if (!params?.slug) return;

    getSingleProduct(params.slug as string).then((res) => {
      const data = res.data;
      setProduct(data);
      setSelectedVariant(data.variantOption[0]);
    });
  }, [params?.slug]);

  // carousel sync
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // get image container size
  useEffect(() => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setImgSize({ w: rect.width, h: rect.height });
    }
  }, [current]);

  if (!product) return <p>Loading...</p>;

  const activeImage = product.images[current];

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="flex">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2">
            {product.images.map((img: string, i: number) => (
              <button
                key={img}
                onClick={() => api?.scrollTo(i)}
                className={`border rounded-lg ${
                  current === i ? "border-black" : "border-gray-200"
                }`}
              >
                <Image
                  src={img}
                  alt="thumb"
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main image + zoom */}
          <div
            ref={imageRef}
            className="relative flex-1 overflow-hidden rounded-lg"
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
            <Carousel className="cursor-pointer" setApi={setApi}>
              <CarouselContent>
                {product.images.map((img: string) => (
                  <CarouselItem
                    key={img}
                    className="flex justify-center px-0"
                  >
                    <Image
                      src={img}
                      alt="product"
                      width={500}
                      height={650}
                      className="rounded-lg object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* 🔍 Magnifier */}
            {showZoom && imgSize.w > 0 && (
              <div
                className="pointer-events-none absolute z-20 rounded-full border bg-no-repeat shadow-lg"
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
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold uppercase">{product.title}</h1>
          <p className="text-3xl font-semibold">৳ {product.price}</p>

          <p className="text-sm text-gray-500">
            {product.description?.intro}
          </p>

          {/* SIZE */}
          <div>
            <p className="mb-2">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {product.variantOption.map((v: any) => (
                <Button
                  key={v.id}
                  variant={
                    selectedVariant.id === v.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedVariant(v)}
                >
                  {v.size}
                </Button>
              ))}
            </div>
          </div>

          {/* ACTION */}
          <div className="flex gap-3 pt-4">
            <Button variant="secondary">Add To Cart</Button>
            <Button>Order Now</Button>
          </div>

          {/* META */}
          <div className="text-sm text-gray-500 pt-4 space-y-1">
            <p>SKU: {product.sku}</p>
            <p>Barcode: {product.barcode}</p>
            <p>
              Category:{" "}
              {product.productCategory
                ?.map((c: any) => c.category.name)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="pt-6">
        <h3 className="font-semibold">Description:</h3>
        <p>{product.description?.intro}</p>
        <ul className="list-disc pl-5 mt-2">
          {product.description?.bulletPoints.map(
            (b: string, i: number) => (
              <li key={i}>{b}</li>
            )
          )}
        </ul>
        <p className="mt-2">{product.description?.outro}</p>
      </div>
    </div>
  );
}
