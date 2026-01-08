/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSingleProduct } from "@/services/public/product";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { addToCartCookie } from "@/utils/cartCookie";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // 🔍 zoom states
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  const ZOOM = 2.5;
  const LENS = 150;

  // fetch product
  useEffect(() => {
    if (!params?.slug) return;

    getSingleProduct(params.slug as string).then((res) => {
      setProduct(res.data);
      setSelectedVariant(res.data.variantOption[0]);
    });
  }, [params?.slug]);

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

  // cookie 
  const handleAddToCart = () => {
    addToCartCookie({
      productId: product.id,
      title: product.title,
      image: activeImage,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      quantity: 1,
    });
    setOpen(false);
  };

  const handleOrderNow = () => {
    addToCartCookie({
      productId: product.id,
      title: product.title,
      image: activeImage,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      quantity: 1,
    });

    router.push("/cart");
  };

  return (
    <div>
      <div className="flex gap-6">
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
        <div className="space-y-4 max-w-md">
          <h1 className="text-2xl font-bold uppercase">
            {product.title}
          </h1>
          <p className="text-3xl font-semibold">
            ৳ {product.price}
          </p>

          <p className="text-sm text-gray-500">
            {product.description?.intro}
          </p>

          {/* SIZE */}
          <div>
            <p className="mb-2 font-medium">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {product.variantOption.map((v: any) => (
                <Button
                  key={v.id}
                  variant={
                    selectedVariant.id === v.id
                      ? "default"
                      : "outline"
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
            <Button variant="secondary" onClick={() => setOpen(true)}>Add To Cart</Button>
            <Button onClick={handleOrderNow}>Order Now</Button>
          </div>

          <AlertDialog open={open} onOpenChange={setOpen}>
            {/* Modal */}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Add product to cart?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  <span className="font-medium">{product.title}</span> <br />
                  Size: <b>{selectedVariant.size}</b> <br />
                  Price: ৳ {product.price}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleAddToCart}
                  className="bg-black hover:bg-black/90"
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>



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
      <div className="pt-6 max-w-3xl">
        <h3 className="font-bold">Description:</h3>
        <p className="font-semibold">{product.description?.intro}</p>
        <ul className="list-disc pl-5 mt-2">
          {product.description?.bulletPoints.map(
            (b: string, i: number) => (
              <li key={i}>{b}</li>
            )
          )}
        </ul>
        <p className="mt-2 font-semibold">{product.description?.outro}</p>
      </div>
    </div>
  );
}
