"use client"
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  User,
  ShoppingBag,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { useState } from 'react'
// --- Types & Data ---
type SubCategory = {
  title: string
  items: string[]
}
type NavItem = {
  id: string
  label: string
  hasMegaMenu: boolean
  categories?: SubCategory[]
  featuredImage?: string
  featuredTitle?: string
}
const NAV_ITEMS: NavItem[] = [
  {
    id: 'women',
    label: 'Women',
    hasMegaMenu: true,
    featuredImage:
      'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=800&auto=format&fit=crop',
    featuredTitle: 'New Season Collection',
    categories: [
      {
        title: 'Clothing',
        items: [
          'New Arrivals',
          'Coats & Jackets',
          'Knitwear',
          'Dresses',
          'Trousers',
          'Shirts & Blouses',
        ],
      },
      {
        title: 'Accessories',
        items: ['Bags', 'Scarves', 'Jewelry', 'Belts', 'Hats', 'Sunglasses'],
      },
      {
        title: 'Collections',
        items: [
          'Essential Warmth',
          'Office Wear',
          'Weekend Comfort',
          'Sustainable Choice',
        ],
      },
    ],
  },
  {
    id: 'men',
    label: 'Men',
    hasMegaMenu: true,
    featuredImage:
      'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop',
    featuredTitle: 'Modern Classics',
    categories: [
      {
        title: 'Clothing',
        items: [
          'New Arrivals',
          'Outerwear',
          'Cashmere & Wool',
          'T-Shirts',
          'Denim',
          'Suits',
        ],
      },
      {
        title: 'Accessories',
        items: ['Watches', 'Bags', 'Ties', 'Belts', 'Socks'],
      },
      {
        title: 'Edits',
        items: [
          'Smart Casual',
          'Winter Layers',
          'Activewear',
          'Travel Essentials',
        ],
      },
    ],
  },
  {
    id: 'home',
    label: 'Home',
    hasMegaMenu: true,
    featuredImage:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=800&auto=format&fit=crop',
    featuredTitle: 'Warm Living',
    categories: [
      {
        title: 'Living',
        items: ['Cushions', 'Throws', 'Rugs', 'Lighting', 'Decor'],
      },
      {
        title: 'Dining',
        items: ['Tableware', 'Glassware', 'Linens', 'Serveware'],
      },
      {
        title: 'Bedroom',
        items: ['Bedding', 'Pillows', 'Sleepwear', 'Robes'],
      },
    ],
  },
  {
    id: 'journal',
    label: 'Journal',
    hasMegaMenu: false,
  },
  {
    id: 'about',
    label: 'Our Story',
    hasMegaMenu: false,
  },
]
// --- Components ---
const TopBar = () => (
  <div
    className="w-full py-2 text-center relative overflow-hidden"
    style={{
      background: 'linear-gradient(to right, #D4AF37, #C9A961)',
    }}
  >
    <p className="text-[#FAFAF8] text-sm font-medium tracking-wide">
      Complimentary Shipping on Orders Over $150 | Winter Sale Ends Soon
    </p>
  </div>
)
const MegaMenu = ({ item }: { item: NavItem }) => {
  if (!item.categories) return null
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 5,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      className="absolute left-0 w-full z-50 pt-2"
    >
      <div className="w-full bg-[#F5F5F0] shadow-xl border-t border-[#E8E4D9]">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-12 gap-8">
            {/* Categories */}
            <div className="col-span-8 grid grid-cols-3 gap-8">
              {item.categories.map((category, idx) => (
                <motion.div
                  key={category.title}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: idx * 0.05 + 0.1,
                  }}
                >
                  <h3 className="text-[#B8860B] font-bold text-sm uppercase tracking-wider mb-6">
                    {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.items.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-[#6B5744] hover:text-[#B8860B] transition-colors duration-200 text-[15px] block py-1"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Featured Image */}
            <div className="col-span-4">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.4,
                }}
                className="relative group cursor-pointer overflow-hidden rounded-lg h-full min-h-[300px]"
              >
                <img
                  src={item.featuredImage}
                  alt={item.featuredTitle}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6B5744]/60 to-transparent flex flex-col justify-end p-8">
                  <span className="text-white/90 text-sm font-medium mb-2 uppercase tracking-widest">
                    Featured
                  </span>
                  <h3 className="text-white text-2xl font-serif mb-4">
                    {item.featuredTitle}
                  </h3>
                  <div className="flex items-center text-white/90 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
export function PublicNavbar() {
  const [activeHover, setActiveHover] = useState<string | null>(null)
  return (
    <header className="w-full relative z-50 font-sans">
      <TopBar />

      <nav
        className="bg-[#FAFAF8] relative"
        onMouseLeave={() => setActiveHover(null)}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a
                href="#"
                className="text-3xl font-serif font-bold text-[#6B5744] tracking-tight"
              >
                HAYA
              </a>
            </div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-2">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setActiveHover(item.id)}
                >
                  <motion.a
                    href="#"
                    className={`
                      px-5 py-3 rounded-full text-[15px] font-medium transition-colors duration-300 flex items-center gap-1
                      ${activeHover === item.id ? 'bg-[#F0EDE5] text-[#6B5744]' : 'text-[#6B5744] hover:bg-[#F0EDE5]'}
                    `}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    {item.label}
                    {item.hasMegaMenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${activeHover === item.id ? 'rotate-180' : ''}`}
                      />
                    )}
                  </motion.a>
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6 text-[#6B5744]">
              <motion.button
                whileHover={{
                  scale: 1.1,
                  color: '#B8860B',
                }}
                className="p-2 rounded-full hover:bg-[#F0EDE5] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  color: '#B8860B',
                }}
                className="p-2 rounded-full hover:bg-[#F0EDE5] transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  color: '#B8860B',
                }}
                className="p-2 rounded-full hover:bg-[#F0EDE5] transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#B8860B] rounded-full"></span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mega Menu Container */}
        <AnimatePresence>
          {activeHover &&
            NAV_ITEMS.find((i) => i.id === activeHover)?.hasMegaMenu && (
              <MegaMenu item={NAV_ITEMS.find((i) => i.id === activeHover)!} />
            )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
