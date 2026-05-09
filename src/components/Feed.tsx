import ProductCard, { Product as ProductType } from "./ProductCard";
import AdPlaceholder from "./AdPlaceholder";
import connectToDatabase from '@/lib/mongodb';
import { Product } from '@/models/Product';

export default async function Feed() {
  let dbProducts: ProductType[] = [];
  try {
    await connectToDatabase();
    const productsDoc = await Product.find({}).sort({ createdAt: -1 }).lean();
    dbProducts = productsDoc.map((p: any) => ({
      id: p._id.toString(),
      title: p.title,
      price: p.price,
      imageUrl: p.imageUrl,
      link: p.link
    }));
  } catch (error) {
    console.error("Failed to fetch products from DB:", error);
  }

  const renderFeedItems = () => {
    const items: React.ReactNode[] = [];
    let productIndex = 0;
    let feedIndex = 0;
    
    if (dbProducts.length === 0) {
       return <div className="col-span-full text-center py-12 text-muted-foreground col-span-2 md:col-span-3 lg:col-span-4">No products found. Add some from the Admin Panel!</div>
    }

    while (productIndex < dbProducts.length) {
      if ((feedIndex + 1) % 4 === 0) {
        items.push(<AdPlaceholder key={`ad-${feedIndex}`} type="in-feed" />);
      } else {
        const product = dbProducts[productIndex];
        items.push(<ProductCard key={product.id} product={product} priority={productIndex < 4} />);
        productIndex++;
      }
      feedIndex++;
    }

    return items;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {renderFeedItems()}
      </div>
    </div>
  );
}
