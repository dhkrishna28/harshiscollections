import { useState } from "react";

interface Props {
  images: string[];
  alt?: string;
}

const ProductGallery = ({ images, alt = "Product image" }: Props) => {
  const [main, setMain] = useState(images[0]);

  return (
    <div>
      <div className="bg-white rounded-md overflow-hidden aspect-[4/5] mb-4">
        <img src={main} alt={alt} className="w-full h-full object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((src) => (
          <button
            key={src}
            onClick={() => setMain(src)}
            className={`border rounded overflow-hidden aspect-square transition ${
              src === main ? "border-ink" : "border-ink/15 hover:border-ink"
            }`}
          >
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
