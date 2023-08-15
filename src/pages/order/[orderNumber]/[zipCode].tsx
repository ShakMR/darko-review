import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link"; // For external links

type Meta = {
  pickup_address?: string;
  pickup_address_map_url ?: string;
  pickup_address_link?: string;
};
type Checkpoint = {
  status: string;
  status_details: string;
  city: string;
  event_timestamp: string; // adjust type if needed
  meta?: Meta;
};

type Article = {
  articleImageUrl?: string;
  articleName: string;
  articleNo: string;
  price: number;
};

type Order = {
  meta?: {
    pickup_address_link?: string;
  };
  checkpoints: Checkpoint[];
  delivery_info: {
    articles: Article[];
  };
};

const OrderView = () => {
  const router = useRouter();
  const { orderNumber, zipCode } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatTimestamp = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  useEffect(() => {
    if (orderNumber && zipCode) {
      fetch(`/api/${orderNumber}?zip=${zipCode}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            // Handle specific error message returned from server if it exists
            throw new Error(data.message);
          }
          setOrder(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [orderNumber, zipCode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center space-y-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="rounded mb-4 w-24 h-24 mx-auto"
          />
          <h1 className="text-xl font-bold text-blue-500">
            Loading Order Details...
          </h1>
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="text-gray-600">Please wait a moment.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Go back to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <img src="/logo.png" alt="Logo" className="rounded mb-8 w-24 h-24" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-500 mb-4">
            Error Occurred
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Go back to homepage
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-start justify-center min-h-screen p-8">
      <img src="/logo.png" alt="Logo" className="rounded mb-8 w-24 h-24" />
      {/* Three main sections */}
      <div className="flex space-x-8">
        {/* Details Element */}
        <div className="flex-1 bg-white p-8 rounded-lg">
          <h2 className="text-xl font-bold">{order?.checkpoints[0].status}</h2>
          <p className="text-gray-600 mt-2">
            {order?.checkpoints[0].status_details}
          </p>

          {order?.checkpoints[0].meta ? (
            <>
              <p className="text-gray-500 mt-2">
                {order.checkpoints[0].meta.pickup_address}
              </p>

              {order.checkpoints[0].meta.pickup_address_map_url ? (
                <img
                  src={order.checkpoints[0].meta.pickup_address_map_url}
                  alt="Map"
                  className="mt-4 rounded-lg"
                />
              ) : (
                <div className="bg-gray-200 text-center py-8 text-gray-500">
                  Map coming soon...
                </div>
              )}

              {order.checkpoints[0].meta.pickup_address_link ? (
                <Link
                  href={order.checkpoints[0].meta?.pickup_address_link}
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="mt-4 inline-block bg-blue-900 text-white px-4 py-2 rounded w-full">
                    Open in Google Maps
                  </button>
                </Link>
              ) : (
                <div className="bg-gray-200 text-center py-2 text-gray-500 mt-4">
                  Link coming soon...
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-200 text-center py-8 text-gray-500">
              More data coming soon...
            </div>
          )}
        </div>

        {/* Shipping Updates */}
        <div className="flex-1 bg-white p-8 rounded-lg">
          <h2 className="text-xl font-bold">Shipping Updates</h2>
          <ul className="mt-4 space-y-4">
            {order?.checkpoints.map((checkpoint, idx) => (
              <li key={idx}>
                <h3 className="font-medium">{checkpoint.status}</h3>
                <p className="text-gray-600">{checkpoint.status_details}</p>
                <p className="text-gray-500 flex justify-between">
                  {checkpoint.city}
                  <span>{formatTimestamp(checkpoint.event_timestamp)}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Articles & Details */}
        <div className="flex-1 bg-white p-8 rounded-lg">
          <h2 className="text-xl font-bold">Articles</h2>
          {/* Here's a placeholder for your articles list. You'd iterate over your articles data, similar to how checkpoints are done. */}
          {order?.delivery_info.articles.map((article, idx) => (
            <div className="flex items-center mt-4" key={idx}>
              {article.articleImageUrl ? (
                <img
                  src={article.articleImageUrl}
                  alt="Article Image"
                  className="w-20 h-20 rounded-lg mr-4"
                />
              ) : (
                <div className="bg-gray-200 text-sm text-center py-2 text-gray-500 w-20 h-20 rounded-lg mr-4">
                  Image coming soon...
                </div>
              )}

              <div>
                <h3 className="font-medium">{article.articleName}</h3>
                <p className="text-gray-600">
                  Article number: {article.articleNo}
                </p>
                <p className="text-gray-500 font-bold">{article.price} €</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderView;
