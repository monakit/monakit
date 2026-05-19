import { ExternalLink } from "lucide-react";
import type { ProductItem } from "../types/product";

interface ProductCardProps {
  product: ProductItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-lg border border-slate-700 bg-slate-900/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
    >
      <div className="shrink-0">
        <img
          src={product.cover}
          alt={product.name}
          className="h-24 w-24 rounded-lg border border-slate-700 object-cover md:h-28 md:w-28 bg-white/90"
          loading="lazy"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white line-clamp-2 text-base md:text-lg">
              {product.name}
            </h3>
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-emerald-400" />
          </div>
          <p className="text-sm text-white/70 line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>
    </a>
  );
};
