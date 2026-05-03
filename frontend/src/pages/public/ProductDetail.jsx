import React, { useState, useEffect, useRef } from 'react';
import { useParams, useOutletContext, Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle, XCircle, Download, Minus, Plus, 
  Star, StarHalf, 
  Layers 
} from 'lucide-react';
import { ProductRatingSummary } from '../../components/public/ProductRatingSummary';
import { ExpertCallout } from '../../components/public/ExpertCallout';
// 1. Import the new components
import { TrustedBy } from '../../components/public/TrustedBy';
import { WarrantyInfo } from '../../components/public/WarrantyInfo';
import { useCompare } from '../../context/CompareContext';
import { productService } from '../../services/api';

// Added parsePrice helper for product:price meta tag
const parsePrice = (priceString) => {
  if (!priceString) return null;
  return parseFloat(priceString.replace(/[$,]/g, ''));
};

const normalizeDescriptionText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t');
};

/** Turns API shortDescription (tab + CRLF separated specs) into rows for display. */
const parseShortDescriptionRows = (text) => {
  if (!text || typeof text !== 'string') return [];
  const normalized = normalizeDescriptionText(text);
  return normalized
    .split(/\r\n|\n|\r/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const tabIdx = line.indexOf('\t');
      if (tabIdx === -1) {
        return { label: line, value: null };
      }
      return {
        label: line.slice(0, tabIdx).trim(),
        value: line.slice(tabIdx + 1).trim() || null,
      };
    });
};

const ShortDescriptionBlock = ({ text }) => {
  const rows = parseShortDescriptionRows(text);
  if (rows.length === 0) return null;

  return (
    <ul className="mt-6 list-outside list-disc space-y-2 pl-6 text-base marker:text-gray-400">
      {rows.map((row, i) => (
        <li key={i} className="text-gray-700">
          {row.value != null && row.value !== '' ? (
            <>
              <span className="font-bold text-gray-900">{row.label}</span>
              <span>: {row.value}</span>
            </>
          ) : (
            <span>{row.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

const isSpecContinuationLine = (line) =>
  /^\s*\+/.test(line) ||
  /^\s*\d+\s+x\s/i.test(line) ||
  /^\s*\d+\s+port\b/i.test(line);

const isLikelySectionHeading = (line) => {
  if (!line || line.length > 52) return false;
  if (/^\d/.test(line) || isSpecContinuationLine(line)) return false;
  if (/,/.test(line) && line.length > 28) return false;
  return true;
};

/**
 * Parses longDescription: tab-separated label/value rows, section titles,
 * subheadings (trailing ":"), and value continuations (e.g. "1 x COM", "8 port …").
 */
const parseLongDescriptionBlocks = (text) => {
  const normalized = normalizeDescriptionText(text);
  if (!normalized.trim()) return [];

  const rawLines = normalized.split(/\r\n|\n|\r/);
  /** @type {{ type: 'heading' | 'subheading' | 'item' | 'paragraph'; text?: string; label?: string; value?: string }[]} */
  const blocks = [];
  /** @type {{ type: 'item'; label: string; value: string } | null} */
  let lastItem = null;

  const lastBlock = () => (blocks.length ? blocks[blocks.length - 1] : null);

  for (const raw of rawLines) {
    const line = raw.trim();
    if (!line) continue;

    const tabIdx = line.indexOf('\t');
    if (tabIdx !== -1) {
      const label = line.slice(0, tabIdx).trim();
      const value = line.slice(tabIdx + 1).trim();
      if (!label && !value) continue;
      if (label && !value) {
        blocks.push({ type: 'heading', text: label });
        lastItem = null;
        continue;
      }
      if (!label && value) {
        blocks.push({ type: 'paragraph', text: value });
        lastItem = null;
        continue;
      }
      const item = { type: 'item', label, value };
      blocks.push(item);
      lastItem = item;
      continue;
    }

    if (lastItem && isSpecContinuationLine(line)) {
      lastItem.value = `${lastItem.value}\n${line}`;
      continue;
    }

    if (/:\s*$/.test(line)) {
      blocks.push({ type: 'subheading', text: line.trimEnd() });
      lastItem = null;
      continue;
    }

    const prev = lastBlock();
    if (prev?.type === 'heading') {
      blocks.push({ type: 'subheading', text: line });
      lastItem = null;
      continue;
    }

    if (isLikelySectionHeading(line)) {
      blocks.push({ type: 'heading', text: line });
      lastItem = null;
      continue;
    }

    if (lastItem) {
      lastItem.value = `${lastItem.value}\n${line}`;
      continue;
    }

    blocks.push({ type: 'paragraph', text: line });
    lastItem = null;
  }

  return blocks;
};

const LongDescriptionBlock = ({ text }) => {
  const blocks = parseLongDescriptionBlocks(text);
  if (blocks.length === 0) return null;

  const nodes = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'item') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'item') {
        items.push(blocks[i]);
        i += 1;
      }
      nodes.push(
        <ul
          key={`ld-items-${nodes.length}`}
          className="list-outside list-disc space-y-1 pl-5 text-base leading-snug marker:text-gray-400"
        >
          {items.map((it, j) => (
            <li key={j} className="text-gray-700">
              <span className="font-bold text-gray-900">{it.label}</span>
              <span className="whitespace-pre-line">: {it.value}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (b.type === 'heading') {
      nodes.push(
        <h4
          key={`ld-h-${nodes.length}`}
          className="text-base font-bold text-gray-900 sm:text-lg"
        >
          {b.text}
        </h4>
      );
    } else if (b.type === 'subheading') {
      nodes.push(
        <p key={`ld-sh-${nodes.length}`} className="text-base font-semibold text-gray-800">
          {b.text}
        </p>
      );
    } else if (b.type === 'paragraph') {
      nodes.push(
        <p key={`ld-p-${nodes.length}`} className="text-base text-gray-700">
          {b.text}
        </p>
      );
    }
    i += 1;
  }

  return <div className="flex flex-col gap-2 text-gray-700">{nodes}</div>;
};

// --- StarRating component ---
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const roundedRating = Math.round(rating * 2) / 2;
    if (i <= roundedRating) {
      stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    } else if (i - 0.5 === roundedRating) {
      stars.push(<StarHalf key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    } else {
      stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />);
    }
  }
  return <div className="flex items-center">{stars}</div>;
};


export const ProductDetail = () => {
  const { productId } = useParams();
  const { handleOpenQuoteModal } = useOutletContext();
  const location = useLocation(); 
  
  const { addToCompare, removeFromCompare, isCompared } = useCompare();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); 

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState('');
  
  const tabsRef = useRef(null);

  const isProductCompared = product ? isCompared(product._id) : false;

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data: foundProduct } = await productService.getProductById(productId);
        setProduct(foundProduct);
        
        if (foundProduct) {
          setActiveImage(foundProduct.images[0]);
          setQuantity(1); 
          
          if (foundProduct.specs.length > 0) {
            setActiveTab('specifications');
          } else {
            setActiveTab('description');
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); 

  // ... (quantity handlers are correct)
  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setQuantity(isNaN(val) || val < 1 ? 1 : val);
  };
  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  const handleQuoteClick = () => {
    handleOpenQuoteModal({ ...product, defaultQuantity: quantity });
  };
  
  const handleTabSelect = (tabName) => {
    setActiveTab(tabName);
    tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleAskExpertClick = () => {
    handleOpenQuoteModal(null); 
  };

  const handleCompareClick = () => {
    if (isProductCompared) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  if (loading) {
     return (
      <>
        <title>Loading... | Trace Networks</title>
        <div className="container mx-auto max-w-7xl px-4 py-24 text-center">
          <h1 className="text-2xl font-semibold text-gray-700">Loading Product...</h1>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <title>Product Not Found | Trace Networks</title>
        <div className="container mx-auto max-w-7xl px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-red-600">Product Not Found</h1>
          <p className="mt-4 text-lg text-gray-700">
            Sorry, we couldn't find that product.
          </p>
        </div>
      </>
    );
  }

  // Create dynamic SEO variables
  const title = `${product.name} (${product.model}) | Trace Networks`;
  const description = product.shortDescription;
  const canonicalUrl = `https://www.tracenetworks.com${location.pathname}`;
  const imageUrl = product.images[0];

  return (
    <>
      {/* --- SEO Tags (React 19) --- */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="product" />
      <meta property="product:brand" content={product.brand} />
      <meta property="product:availability" content={product.stock > 0 ? 'in stock' : 'out of stock'} />
      {product.price && (
        <meta property="product:price:amount" content={parsePrice(product.price)} />
      )}
      <meta property="product:price:currency" content="USD" />
      <meta property="product:condition" content="new" />


      {/* --- Page Content --- */}
      <div className="bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          {/* Breadcrumbs */}
          <nav className="mb-4 text-sm">
            <Link to="/" className="text-gray-500 hover:text-blue-600">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to={`/products?category=${product.category}`} className="text-gray-500 hover:text-blue-600">
              {product.category}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{product.model}</span>
          </nav>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            
            {/* Left Column: Image Gallery */}
            <div>
              <div className="aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-contain object-center"
                />
              </div>
              {/* Thumbnails */}
              <div className="mt-4 grid grid-cols-5 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square w-full overflow-hidden rounded-md border
                              ${activeImage === img ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'}
                              transition-all`}
                  >
                    <img src={img} alt={`${product.name} thumb ${idx + 1}`} className="h-full w-full object-contain object-center" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Product Info & Quote */}
            <div>
              <Link to={`/products?brand=${product.brand}`} className="font-semibold text-blue-600 hover:underline">
                {product.brand}
              </Link>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
              <p className="mt-2 text-xl font-semibold text-gray-500">{product.model}</p>
              
              <ProductRatingSummary 
                reviews={product.reviews}
                questions={product.questions}
                onTabSelect={handleTabSelect}
              />
              
              <ShortDescriptionBlock text={product.shortDescription} />

              {/* Price, Stock & Quantity Layout */}
              <div className="mt-6 flex items-start justify-between border-t border-gray-200 py-4">
                {/* Left Side: Price & Stock */}
                <div>
                  {product.price ? (
                    <p className="text-3xl font-bold text-gray-900">{product.price}</p>
                  ) : (
                    <p className="text-2xl font-bold text-blue-600">Price On Request</p>
                  )}
                  
                  {product.stock > 0 ? (
                    <div className="mt-2 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="ml-2 font-semibold text-green-600">
                        In Stock
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="ml-2 font-semibold text-red-600">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Right Side: Quantity Selector & Compare */}
                <div className="flex flex-col items-end">
                  {/* Compare Button */}
                  <button
                    onClick={handleCompareClick}
                    className={`mb-2 flex items-center text-sm font-medium transition-colors
                                ${isProductCompared ? 'text-red-600 hover:text-red-700' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    <Layers size={16} className="mr-1.5" />
                    {isProductCompared ? 'Remove from Compare' : 'Add to Compare'}
                  </button>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-2">
                    <label htmlFor="quantity-detail" className="font-semibold text-gray-700">Qty:</label>
                    <div className="flex rounded-md border border-gray-300">
                      <button
                        onClick={decrementQuantity}
                        className="rounded-l-md border-r border-gray-300 bg-white px-3 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="text"
                        id="quantity-detail"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-12 border-none text-center text-sm focus:outline-none focus:ring-0"
                      />
                      <button
                        onClick={incrementQuantity}
                        className="rounded-r-md border-l border-gray-300 bg-white px-3 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* --- End of Updated Layout --- */}

              <div className="pb-4 mb-4 border-b border-gray-200">
                <button
                  onClick={handleQuoteClick}
                  className="w-full rounded-full bg-green-500 px-6 py-3 text-base font-bold
                            text-white shadow-lg transition-transform hover:scale-[1.02]
                            hover:bg-green-600"
                >
                  Get a Quote Now
                </button>
              </div>
              
              <ExpertCallout onAskExpertClick={handleAskExpertClick} />

            </div>
          </div>

          {/* --- Full-Width Tabs Section --- */}
          <div ref={tabsRef} className="mt-16 w-full">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex flex-wrap space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium
                    ${activeTab === 'description'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium
                    ${activeTab === 'specifications'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium
                    ${activeTab === 'reviews'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  Reviews ({product.reviews.length})
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium
                    ${activeTab === 'questions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  Q&A ({product.questions.length})
                </button>
                <button
                  onClick={() => setActiveTab('downloads')}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium
                    ${activeTab === 'downloads'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  Downloads
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="py-10">
              {activeTab === 'description' && (
                // 3. Added prose class for high-end text formatting
                <div className="max-w-none text-base text-gray-700">
                  {product.longDescription ? (
                    <LongDescriptionBlock text={product.longDescription} />
                  ) : (
                    <p>No detailed description available.</p>
                  )}
                </div>
              )}
              
              {/* 4. UPDATED Specifications Tab */}
              {activeTab === 'specifications' && (
                <div>
                  {product.specImage && (
                    <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
                      <img 
                        src={product.specImage} 
                        alt={`${product.name} specifications diagram`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-y border-gray-200">
                      <tbody className="border-y border-gray-200 bg-white">
                        {product.specs.map((spec) => (
                          <tr key={spec._id || spec.name} className="even:bg-gray-50">
                            <td className="w-1/3 px-6 py-4 text-sm font-medium text-gray-900">{spec.name}</td>
                            <td className="w-2/3 px-6 py-4 text-sm text-gray-600">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="mb-6 text-xl font-semibold">Customer Reviews</h3>
                  <div className="space-y-6">
                    {product.reviews.length === 0 ? (
                      <p>No reviews yet for this product.</p>
                    ) : (
                      product.reviews.map(review => (
                        <div key={review._id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-center">
                            <StarRating rating={review.rating} />
                            <h4 className="ml-3 text-lg font-semibold">{review.title}</h4>
                          </div>
                          <p className="mt-3 text-base text-gray-700">{review.body}</p>
                          <p className="mt-2 text-sm text-gray-500">
                            By {review.author} on {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'questions' && (
                <div>
                  <h3 className="mb-6 text-xl font-semibold">Questions & Answers</h3>
                  <div className="space-y-6">
                    {product.questions.length === 0 ? (
                      <p>No questions yet for this product.</p>
                    ) : (
                      product.questions.map(qna => (
                        <div key={qna._id} className="border-b border-gray-200 pb-6">
                          <p className="text-base font-semibold text-gray-900">Q: {qna.question}</p>
                          <p className="mt-2 pl-6 text-base text-gray-700">
                            {qna.answer ? (
                              <><strong>A:</strong> {qna.answer}</>
                            ) : (
                              <span className="italic text-gray-500">No answer yet.</span>
                            )}
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            Asked by {qna.author} on {new Date(qna.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'downloads' && (
                <div>
                  <a
                    href={product.datasheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white
                              px-4 py-2 text-sm font-medium text-gray-700 shadow-sm
                              hover:bg-gray-50"
                  >
                    <Download size={18} className="mr-2" />
                    Download Datasheet (PDF)
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* --- 5. NEW Static Sections --- */}
          <TrustedBy />
          <WarrantyInfo />
          {/* --- End New Sections --- */}

        </div>
      </div>
    </>
  );
};