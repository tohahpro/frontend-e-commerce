/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSingleProduct } from "@/services/public/product";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function ProductDetails() {
  const params = useParams(); // URL থেকে slug নেবে
  const [product, setProduct] = useState<any>(null);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  // const [activeImage, setActiveImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  console.log(params.slug);

  // Product fetch
  useEffect(() => {
    if (!params?.slug) return;

    getSingleProduct(params?.slug).then((res) => {
      const data = res.data;
      setProduct(data);
      // setActiveImage(data.images[0]);
      setSelectedVariant(data.variantOption[0]);
    });
  }, [params?.slug]);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <div>
        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT: IMAGE */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2">
              {product.images.map((img:any, i:any) => (
                <button
                  key={img}
                  onClick={() => api?.scrollTo(i)}
                  className={`border rounded-lg transition ${
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

            {/* Main Carousel */}
            <div className="flex-1">
              <Carousel setApi={setApi}>
                <CarouselContent>
                  {product.images.map((img:string) => (
                    <CarouselItem key={img} className="flex justify-center px-0">
                      <Image
                        src={img}
                        alt="product"
                        width={500}
                        height={650}
                        className="rounded-lg"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>

          {/* RIGHT: DETAILS */}
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
            <div className="flex gap-3 pt-4 flex-wrap">
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
        <div className="pt-4">
          <h3 className="font-semibold">Description:</h3>
          <p>{product.description?.intro}</p>
          <ul className="list-disc pl-5 mt-2">
            {product.description?.bulletPoints.map((b: string, i: number) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <p className="mt-2">{product.description?.outro}</p>
        </div>
      </div>
    </>
  );
}
