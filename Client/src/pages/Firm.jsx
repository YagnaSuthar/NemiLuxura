import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../CSS/pages/Firm.css";
import image_3 from "../assets/Foam.png";
import image_4 from "../assets/image_4.jpg";
import image_5 from "../assets/image_5.jpg";
import wordmarkLogo from "../assets/logo_text/image.png";
import { apiService } from "../services/apiService";

import { Check, Layers, Wind, Shield, Thermometer, Bug } from "lucide-react";

const WordmarkInline = ({ size = "1em", className = "" }) => (
  <img
    src={wordmarkLogo}
    alt="NemLUXURA wordmark"
    className={`wordmark-inline ${className}`.trim()}
    style={{ height: size }}
    loading="lazy"
  />
);

const renderWithWordmark = (text, size = "1em", keyPrefix = "wordmark") => {
  if (typeof text !== "string" || !text.includes("NemLUXURA")) {
    return text;
  }

  const segments = text.split("NemLUXURA");

  return segments.reduce((acc, segment, index) => {
    acc.push(segment);

    if (index < segments.length - 1) {
      acc.push(
        <WordmarkInline key={`${keyPrefix}-${index}`} size={size} />
      );
    }

    return acc;
  }, []);
};

const ProductPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("product");
  const [firmContent, setFirmContent] = useState(null);
  const observerRef = useRef(null);

  const foams = firmContent?.foams && firmContent.foams.length > 0
    ? firmContent.foams
    : [
      { name: "Fire Retardant - FR", stock: "In Stock" },
      { name: "Pure Foam", stock: "In Stock" },
      { name: "High Resilience Foam - HR", stock: "In Stock" },
      { name: "Ultra Premium Foam", stock: "In Stock" },
      { name: "Memory Foam", stock: "In Stock" },
      { name: "Latex Foam", stock: "In Stock" },
      { name: "Factory Fit Foam", stock: "In Stock" },
    ];

  const mattressLayers = [
    {
      number: 1,
      name: "Breathable Sleep Surface",
      description: "Soft & breathable fabric",
    },
    {
      number: 2,
      name: "Memory Foam Layer",
      description: "Cooling gel memory foam",
    },
    {
      number: 3,
      name: "Fast-Responsive Layer",
      description: "High-resilience (HR) foam",
    },
    {
      number: 4,
      name: "Supportive Base Layer",
      description: "Sink-resistant foam",
    },
    {
      number: 5,
      name: "FlexAdapt Cover",
      description: "Breathable and stretchy",
    },
  ];

  const mattressFeatures = [
    // {
    //   icon: <Layers size={32} />,
    //   title: "Soft Feathers",
    //   description:
    //     "The accommodating nature of memory foam mattresses means they can support all types of sleeping positions and still evenly distributes body weight. The softer the mattress, the better it is for side sleepers, but a not-too-firm and not-too-soft memory foam is recommended for back sleepers too.",
    // },
    // {
    //   icon: <Shield size={32} />,
    //   title: "Spine Aligner",
    //   description:
    //     "Memory foam mattresses are designed to provide support to and promote a neutral spinal alignment. This goes a long way in preventing chronic neck pain, spondylitis, spinal pain and the mental stress arising from these.",
    // },
    {
      icon: <Thermometer size={32} />,
      title: "Temperature Control",
      description:
        "Designed to wick away excess heat, these orthopedic mattresses balance your personal micro-climate and keep you thermo-neutral. With all season feature, you get a constant comfort zone for your body.",
    },
    {
      icon: <Bug size={32} />,
      title: "Anti-Bug Feature",
      description:
        "With the anti-bug feature, you can say goodbye to allergies, bed pests and harmful bacteria growth. An added benefit for asthma and allergy prone patients.",
    },
  ];

  const mattresses =
    firmContent?.mattresses && firmContent.mattresses.length > 0
      ? firmContent.mattresses
      : [
        {
          name: "Soft Feathers – Memory Foam Mattress",
          description:
            "Accommodating nature of memory foam supports all sleeping positions. Even distribution of body weight. Softer mattress ideal for side sleepers. Medium-soft memory foam recommended for back sleepers. Designed to provide support and promote a neutral spinal alignment.",
        },
        {
          name: "Spine Aligner – Ortho (Bonded) Foam Mattress",
          description:
            "Made from ortho/bonded foam. Designed specifically to promote spinal alignment. Ideal for people with orthopedic concerns. Firm support helps maintain posture throughout the night.",
        },
        {
          name: "Doux Comfort – Body-Contour Foam Mattress",
          description:
            "Breathable, Hypoallergenic, Standard 100 fabric. Shape-supportive medium soft foam. Body-contouring soft foam for better pressure relief. HR (High Resilience) foam core for durability.",
        },
      ];

  const pillowTypes = [
    {
      emoji: "🌙",
      name: "NemLUXURA Memory Pillow",
      subtitle: "Adaptive Comfort. Advanced Support.",
      description:
        "The NemLUXURA Memory Pillow is designed to cradle your head and neck with precision. Using high-density viscoelastic memory foam, it responds to your body's shape and temperature, reducing pressure points and keeping your spine aligned throughout the night.",
      features: [
        "Pressure-relieving memory foam that adapts to your contours",
        "Orthopedic support ideal for neck and shoulder pain relief",
        "Breathable, hypoallergenic cover for cool, hygienic sleep",
        "Durable structure that resists sagging and maintains its shape",
      ],
      bestFor:
        "Side sleepers, back sleepers, and anyone seeking therapeutic comfort with personalized support.",
    },
    {
      emoji: "🌿",
      name: "NemLUXURA Natural Latex Pillow",
      subtitle: "Reuseable. Responsive. Naturally Cooling.",
      description:
        "Crafted from premium natural latex, the NemLUXURA Latex Pillow offers buoyant support and exceptional breathability. Its open-cell structure and gentle responsiveness ensure a refreshing, cool, and consistent sleep experience every night.",
      features: [
        "Natural latex core for exceptional resilience and lift",
        "Instant responsiveness—no sinking, no flattening",
        "Naturally anti-dust mite and anti-microbial",
        "Ventilated design for superior airflow and temperature regulation",
      ],
      bestFor:
        "Hot sleepers, those who prefer a slightly firmer yet bouncy feel, and eco-conscious customers seeking a long-lasting, natural product.",
    },
    {
      emoji: "☁️",
      name: "NemLUXURA Fibre Pillow",
      subtitle: "Lightweight. Plush. Effortlessly Comfortable.",
      description:
        "Soft, airy, and inviting—our NemLUXURA Fibre Pillow provides classic comfort with modern performance. Filled with premium micro-fibre clusters, it mimics the luxurious feel of down while offering better breathability and easier maintenance.",
      features: [
        "Ultra-soft micro-fibre fill for cloud-like comfort",
        "Fluff-retaining design that stays plush through daily use",
        "Machine-washable and quick-drying for easy care",
        "Hypoallergenic materials suitable for sensitive sleepers",
      ],
      bestFor:
        "Stomach sleepers, combination sleepers, and anyone who loves a soft, plush pillow with low-maintenance convenience.",
    },
  ];

  // Fetch Firm content from backend
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await apiService.getFirmContent();
        if (data.success) {
          setFirmContent(data);
        }
      } catch (err) {
        console.error("Error fetching firm content:", err);
      }
    };
    fetchContent();
  }, []);

  // Handle URL hash to set active tab
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash === "product" || hash === "mattress" || hash === "pillow") {
      setActiveTab(hash);
    } else {
      setActiveTab("product");
      // Set default hash if none exists
      if (!location.hash) {
        window.history.replaceState(null, "", "/firm#product");
      }
    }
  }, [location.hash]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible-product");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".scroll-reveal-product");
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeTab]);

  return (
    <div className="product-page-product">
      {/* Navigation Tabs */}
      <nav className="tabs-container-product">
        <button
          className={`tab-button-product ${activeTab === "product" ? "active-product" : ""
            }`}
          onClick={() => {
            setActiveTab("product");
            window.history.replaceState(null, "", "/firm#product");
          }}
        >
          Foam
        </button>
        <button
          className={`tab-button-product ${activeTab === "mattress" ? "active-product" : ""
            }`}
          onClick={() => {
            setActiveTab("mattress");
            window.history.replaceState(null, "", "/firm#mattress");
          }}
        >
          Mattress
        </button>
        <button
          className={`tab-button-product ${activeTab === "pillow" ? "active-product" : ""
            }`}
          onClick={() => {
            setActiveTab("pillow");
            window.history.replaceState(null, "", "/firm#pillow");
          }}
        >
          Pillow
        </button>
      </nav>

      {/* Product Section */}
      {activeTab === "product" && (
        <div className="section-product">
          <section className="hero-section-product scroll-reveal-product">
            <div className="hero-content-product">
              <h1 className="hero-title-product">Nemi Foam Products</h1>
              <p className="hero-subtitle-product">
                Premium Quality Foam Solutions for Every Need
              </p>
              <div className="hero-image-wrapper-product">
                <img
                  src={firmContent?.foamHero?.imageUrl || image_3}
                  alt="Nemi Foam Products"
                  className="hero-image-product"
                />
              </div>
            </div>
          </section>

          <section className="content-section-product scroll-reveal-product">
            <div className="content-container-product">
              <h2 className="section-heading-product">Our Foam Collection</h2>
              <div className="section-divider-product"></div>

              <p className="section-intro-product">
                Discover our comprehensive range of premium foam products, each
                designed with specific applications and superior quality
                standards. Our collection represents years of innovation and
                commitment to excellence in foam manufacturing.
              </p>

              <div className="foam-list-product">
                {foams.map((foam, index) => (
                  <div key={index} className="foam-item-product">
                    <div className="foam-number-product">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="foam-details-product">
                      <h3 className="foam-name-product">{foam.name}</h3>
                      <span className="foam-status-product">{foam.stock}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="quality-content-product">
                <h2 className="section-heading-product heading-with-wordmark">
                  <span>Why Choose</span>
                  <img
                    src={wordmarkLogo}
                    alt="Nem Luxura"
                    className="product-wordmark-img"
                  />
                  ?
                </h2>
                <div className="section-divider-product"></div>

                <div className="quality-text-product">
                  <p className="quality-paragraph-product">
                    <strong className="quality-highlight-product">
                      Extensive PU Foam:&nbsp;
                    </strong>
                    Offers an extensive selection of PU foams available in
                    multiple colors, sizes, and densities, ensuring the perfect
                    match for diverse industrial and commercial requirements.
                  </p>

                  <p className="quality-paragraph-product">
                    <strong className="quality-highlight-product">
                      Industry-Wide Applications:&nbsp;
                    </strong>
                    Supplies high-quality foam solutions to major sectors such
                    as Automobiles, Furniture, Packaging, and more, making it a
                    trusted choice across various industries.
                  </p>

                  {/* <p className="quality-paragraph-product">
                    <strong className="quality-highlight-product">
                      Durability & Hygiene:&nbsp;
                    </strong>
                    Crafted for exceptional durability and hygiene, ensuring
                    your mattress stays fresh, supportive, and long-lasting even
                    with daily use. Built to resist wear, moisture, and common
                    allergens.
                  </p> */}

                  <p className="quality-paragraph-product">
                    <strong className="quality-highlight-product">
                      Custom-Fit Foam Options:&nbsp;
                    </strong>
                    Provides fully customizable foam solutions that are designed
                    to match exact specifications, performance requirements, and
                    unique application needs.
                  </p>

                  <p className="quality-paragraph-product">
                    <strong className="quality-highlight-product">
                      Powered by&nbsp;
                      <img
                        src={wordmarkLogo}
                        alt="Nem Luxura"
                        className="product-wordmark-img-1"
                      />&nbsp;
                    </strong>
                    All foam innovations and premium products are streamlined
                    under the flagship brand&nbsp;
                    <img
                      src={wordmarkLogo}
                      alt="Nem Luxura"
                      className="product-wordmark-img-1"
                    />&nbsp;
                    , delivering consistent
                    quality, reliability, and brand assurance.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Mattress Section */}
      {activeTab === "mattress" && (
        <div className="section-product">
          <section className="hero-section-product scroll-reveal-product">
            <div className="hero-content-product">
              <h1 className="hero-title-product">Premium Foam Mattress</h1>
              <p className="hero-subtitle-product">
                Where Comfort Meets Superior Support
              </p>
              <div className="hero-image-wrapper-product">
                <img
                  src={firmContent?.mattressHero?.imageUrl || image_5}
                  alt="Memory Foam Mattress"
                  className="hero-image-product"
                />
              </div>
            </div>
          </section>

          <section className="content-section-product scroll-reveal-product">
            <div className="content-container-product">
              <h2 className="section-heading-product">Mattress Construction</h2>
              <div className="section-divider-product"></div>

              <p className="section-intro-product">
                Our premium memory foam mattress features five expertly
                engineered layers, each designed to work in harmony to provide
                optimal comfort and support throughout the night.
              </p>

              <div className="layers-content-product">
                {mattressLayers.map((layer, index) => (
                  <div key={layer.number} className="layer-item-product">
                    <div className="layer-header-product">
                      <span className="layer-number-badge-product">
                        {layer.number}
                      </span>
                      <h3 className="layer-title-product">{layer.name}</h3>
                    </div>
                    <p className="layer-text-product">{layer.description}</p>
                    {/* {index < mattressLayers.length - 1 && (
                      <div className="layer-separator-product"></div>
                    )} */}
                  </div>
                ))}
              </div>

              <div className="features-content-product">
                <h2 className="section-heading-product">
                  Key Features & Benefits
                </h2>
                <div className="section-divider-product"></div>

                {mattressFeatures.map((feature, index) => (
                  <div key={index} className="feature-block-product">
                    <div className="feature-header-product">
                      <span className="feature-icon-product">
                        {feature.icon}
                      </span>
                      <h3 className="feature-title-product">{feature.title}</h3>
                    </div>
                    <p className="feature-description-product">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mattresses-content-product">
                {mattresses.map((mattress, index) => (
                  <div key={index} className="mattress-item-product">
                    <h3 className="mattress-name-product">{mattress.name}</h3>
                    <p className="mattress-description-product">
                      {mattress.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* <div className="doux-content-product">
                <h2 className="section-heading-product">
                  Doux Comfort Technology
                </h2>
                <div className="section-divider-product"></div>

                <p className="section-intro-product">
                  Our exclusive Doux Comfort Technology combines advanced
                  materials and innovative design to deliver unparalleled sleep
                  comfort:
                </p>

                <ul className="doux-list-product">
                  <li className="doux-item-product">
                    <Check size={20} className="doux-check-product" />
                    <span>
                      Breathable Hypoallergenic OEKO-TEX® Standard 100 Fabric
                    </span>
                  </li>
                  <li className="doux-item-product">
                    <Check size={20} className="doux-check-product" />
                    <span>Shape-Supportive Medium Soft Foam</span>
                  </li>
                  <li className="doux-item-product">
                    <Check size={20} className="doux-check-product" />
                    <span>Cool Transition Body Contouring Soft Foam</span>
                  </li>
                  <li className="doux-item-product">
                    <Check size={20} className="doux-check-product" />
                    <span>High Density Firm HR Foam</span>
                  </li>
                </ul>
              </div> */}
            </div>
          </section>
        </div>
      )}

      {/* Pillow Section */}
      {activeTab === "pillow" && (
        <div className="section-product">
          <section className="hero-section-product scroll-reveal-product">
            <div className="hero-content-product">
              <h1 className="hero-title-product">
                {renderWithWordmark(
                  "NemLUXURA Premium Pillow Collection",
                  "1em",
                  "hero-title"
                )}
              </h1>
              <p className="hero-subtitle-product">
                Where Comfort Meets Intelligent Design
              </p>
              <p className="hero-description-product">
                {renderWithWordmark(
                  "At NemLUXURA, we believe sleep is more than rest — it's a daily reset that fuels your mind, body and wellbeing. Our pillow collection is crafted with advanced materials and thoughtful engineering to offer support, durability and luxury in every sleep style.",
                  "1em",
                  "hero-description"
                )}
              </p>
              <div className="hero-image-wrapper-product">
                <img
                  src={firmContent?.pillowHero?.imageUrl || image_4}
                  alt="Premium Pillows"
                  className="hero-image-product"
                />
              </div>
            </div>
          </section>

          <section className="content-section-product scroll-reveal-product">
            <div className="content-container-product">
              <h2 className="section-heading-product">
                Discover Your Perfect Pillow
              </h2>
              <div className="section-divider-product"></div>

              {pillowTypes.map((pillow, index) => (
                <div key={index} className="pillow-section-product">
                  <div className="pillow-header-product">
                    <span className="pillow-emoji-product">{pillow.emoji}</span>
                    <div className="pillow-title-group-product">
                      <h3 className="pillow-name-product">
                        {renderWithWordmark(
                          pillow.name,
                          "1em",
                          `pillow-name-${index}`
                        )}
                      </h3>
                      <p className="pillow-subtitle-product">
                        {pillow.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="pillow-description-product">
                    {renderWithWordmark(
                      pillow.description,
                      "1em",
                      `pillow-description-${index}`
                    )}
                  </p>

                  <div className="pillow-features-section-product">
                    <h4 className="features-heading-product">Features:</h4>
                    <ul className="features-list-product">
                      {pillow.features.map((feature, idx) => (
                        <li key={idx} className="feature-item-product">
                          <Check size={18} className="feature-check-product" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="best-for-section-product">
                    <strong className="best-for-label-product">
                      Best For:
                    </strong>
                    <span className="best-for-text-product">
                      {pillow.bestFor}
                    </span>
                  </div>

                  {index < pillowTypes.length - 1 && (
                    <div className="pillow-divider-product"></div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
