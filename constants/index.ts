import {
  aboutitems,
  categoryDisplay,
  NavbarLink,
  ServiceCardType,
  ServiceType,
  socialLink
} from '@/types'

export const Navbarlist: NavbarLink[] = [
  {
    iconUrl: '',
    route: '/',
    label: 'Home'
  },
  {
    iconUrl: '',
    route: '/products',
    label: 'Products'
  },
  {
    iconUrl: '',
    route: '/policy',
    label: 'Policy'
  },
  {
    iconUrl: '',
    route: '/contract',
    label: 'Contact'
  }
]

export const clients = [
  { id: 1, logo: '/image/client-logos/pran.png' },
  { id: 2, logo: '/image/client-logos/akiz-logo.png' },
  { id: 3, logo: '/image/client-logos/apexlogo.png' },
  { id: 4, logo: '/image/client-logos/banglalink-logo.png' },
  { id: 5, logo: '/image/client-logos/bashundhara-group-logo.png' },
  { id: 6, logo: '/image/client-logos/batalogo.png' },
  { id: 7, logo: '/image/client-logos/BEXIMCO.png' },
  { id: 8, logo: '/image/client-logos/Biman-Bangladesh-Airlines-Logo-tumb.png' },
  { id: 9, logo: '/image/client-logos/bun-logo.png' },
  { id: 10, logo: '/image/client-logos/dailystarlogo.png' },
  { id: 11, logo: '/image/client-logos/partexlogo.png' },
  { id: 12, logo: '/image/client-logos/rfl-logo.png' },
  { id: 13, logo: '/image/client-logos/rob-logo.png' },
  { id: 14, logo: '/image/client-logos/megna.png' },
  { id: 15, logo: '/image/client-logos/Aamal.png' },
  { id: 16, logo: '/image/client-logos/yamcha.webp' },
  { id: 17, logo: '/image/client-logos/tastytreat.jpg' },
  { id: 18, logo: '/image/client-logos/le-meridien-logo.svg' }
]

export const socialitem: socialLink[] = [
  {
    iconUrl: '/icon/Facebook.svg',
    alt: 'Facebook social',
    sociallink: 'https://www.facebook.com/'
  },
  {
    iconUrl: '/icon/Twitter.svg',
    alt: 'Yousuf refri twtter social',
    sociallink: 'https://www.instagram.com/'
  },
  {
    iconUrl: '/icon/Instagram.svg',
    alt: 'Yousuf refrigeration insta social',
    sociallink: 'https://www.instagram.com/'
  }
]

export const about: aboutitems[] = [
  {
    iconUrl: '/icon/done.svg',
    title: 'Top Quality Product',
    subtitle:
      'We serverd millons of customers thousands of resellers . We always try to provide best quality product as possible'
  },
  {
    iconUrl: '/icon/lightning_fill.svg',
    title: 'Fast and Efficient',
    subtitle:
      'Our verified technicians have years of experiance no matter what your problem is they solve with ease !'
  },
  {
    iconUrl: '/icon/happy.svg',
    title: 'Happy Customers',
    subtitle:
      'With our efficient managment and superve survices , we always make a smile in our customer'
  }
]

export const category = [
  { value: 'refrigeration', label: 'Refrigeration' },
  { value: 'air-conditioning', label: 'Air Conditioning' },
  { value: 'ventilation', label: 'Ventilation' },
  { value: 'heating', label: 'Heating' },
  { value: 'commercial-kitchen', label: 'Commercial Kitchen' },
  { value: 'food-cart', label: 'Food Cart' },
  { value: 'restaurant-equipment', label: 'Restaurant Equipment' },
  { value: 'bakery-equipment', label: 'Bakery Equipment' },
  { value: 'spare-parts', label: 'Spare Parts' }
]

export const ServiceCard: ServiceCardType[] = [
  {
    value: 'ff',
    title: 'The key to your success!',
    details:
      "Give your fast food restaurant a new dimension! from our chinese equipment, such as deep fryers, waffle makers, French fry cutters, and juice makers, will reduce your cooking time and enhance quality. Win your customers' hearts by serving fast and delicious food. Get our equipment today and take your business to the pinnacle of success!",

    img: [
      {
        url: '/image/commeercialfride.jpg',
        title: 'Buy old and new Fridge'
      },
      {
        url: '/image/outdoor.webp',
        title: 'Rent/buy used AC / brand new AC'
      },
      {
        url: '/image/r134.png',
        title: 'Buy any AC/fridge eqiupment'
      }
    ]
  },
  {
    value: 'ke',
    title: 'Revolutionize Your Kitchen with Advanced Equipment!',
    details:
      'Transform your kitchen with state-of-the-art equipment! Our cutting-edge appliances, including advanced stoves, versatile food processors, precision ovens, and efficient refrigeration systems, elevate culinary excellence. Enhance productivity and culinary precision with our equipment, ensuring every dish exceeds expectations. Elevate your kitchen operations and deliver exceptional culinary experiences with ease and efficiency',

    img: [
      {
        url: '/image/restourent-equiptments.webp',
        title: 'Frience Frice Maker'
      },
      {
        url: '/image/displayfreezer.webp',
        title: 'Stainless BBQ Grill, Hotplate '
      },
      {
        url: '/image/pizza-oven.webp',
        title: 'Commercial Gas Stove'
      }
    ]
  },
  {
    value: 're',
    title: 'Give your restaurant a touch of modernity!',
    details:
      'Elevate your dining experience with our contemporary decor, state-of-the-art kitchen equipment, and innovative menu offerings. Experience culinary excellence and ambiance that captivates every guest, ensuring a memorable dining experience unlike any other.',

    img: [
      {
        url: '/image/male-technician.jpg',
        title: 'A stainless steel commercial refrigerator'
      },
      {
        url: '/image/service1.webm',
        title: 'freezer showcaser '
      },
      {
        url: '/image/service2.webm',
        title: 'restourent equiptments'
      }
    ]
  }
  // Add more service cards as needed
]

export const service: ServiceType[] = [
  {
    id: 1,
    title: 'Buy and sell kitchen items',
    details:
      'Yes, you can buy old and used kitchen equipment from us at significantly lower rates! Also, you can sell your extra items',
    icon: '/icon/kitchen.png'
  },
  {
    id: 2,
    title: 'Get any restaurant display freezer ',
    details:
      'We offer various display showcases, with and without chilling functionality, to suit your needs.',
    icon: '/icon/restaurant.png'
  },
  {
    id: 3,
    title: 'Refrigeration parts',
    details:
      'We offer various refrigeration parts for any level. From household fridges and ACs to commercial units, you can find a wide range of products with us',
    icon: '/icon/refrigerationparts.png'
  }
]

export const productSliderBg = [
  { src: '/product-slider/kitchen-equipment-background.png', link: '/products', alt: 'kitchen equipment background', external: true },
  { src: '/product-slider/refrigeration-slider-background.png', link: '/test', alt: 'refrigeration slider background', external: true },
  { src: '/product-slider/restaurant-display.jpeg', link: '/test', alt: 'restaurant display background', external: false }
]

/**
 * tags : refrigarent , restaurant , kitchen item , fast food , chinese product , electric product , gas product , commercial , mechanical , technical , bakery,
 */
export const products = [
  {
    id: 'custom-food-cart-price-in-dhaka',
    title: 'Customized Food Cart',
    details: {
      features: [
        'high quality ss',
        'modern customizable desgin',
        'Safety meassured'
      ],
      spec: {
        power: '10v-380v',
        weight: '500kg +/-',
        color: 'Customized color',
        type: 'street food cart'
      },
      about: {
        'high quality stainless steel':
          'we provide high quality steel for your food cart, cause after all this product mostly covered in ss and it need to be long lasting .so with that in mind we inlcude best possibe stainless steel possible',

        'customizeable design':
          'we urge customers to provide their visonary design to us to help them accomplist their need , its your food cart , your choice to how it will be made , you can make motorcyle , van or event auto . also you can add you desired colors , stickers and with all that we will hand you over your fully customized food cart',
        'safety measured':
          'Working with fire requires proper saftey measure. Your food cart can be build with deep fire , hotplate,gas kitchen or many customized kithen equitpment . we will make your product such a way that you will feel comfortable and feel safe  with our heat managment system we will assure lesser disaster possible'
      }
    },

    media: [
      {
        img: '/food-van/fast-food-cart.webp',
        alt: 'black foocart with mutor system'
      },
      {
        img: '/food-van/foodcart.webp',
        alt: 'fully ss customized food cart van with cycle system'
      },
      {
        img: '/food-van/Food-Cart.webp',
        alt: 'custom stainless foocart for the street food with heavy glass'
      },
      {
        img: '/food-van/food-van.webp',
        alt: 'custom sticker food cart attached in easy bike '
      },
      {
        img: '/food-van/food-van-cart.png',
        alt: 'custom sticker food cart attached portable street food cart'
      },
      {
        img: '/food-van/food-van-cart.png',
        alt: 'custom colored food cart in cyleing portable street food cart'
      }
    ],
    category: 'food-cart'
  },
  {
    id: 'custom-food-cart-price-in-dhaka-2',
    title: 'Customized Food Cart',
    details: {
      features: [
        'high quality ss',
        'modern customizable desgin',
        'Safety meassured'
      ],
      spec: {
        power: '10v-380v',
        weight: '500kg +/-',
        color: 'Customized color',
        type: 'street food cart'
      },
      about: {
        'high quality stainless steel':
          'we provide high quality steel for your food cart, cause after all this product mostly covered in ss and it need to be long lasting .so with that in mind we inlcude best possibe stainless steel possible',

        'customizeable design':
          'we urge customers to provide their visonary design to us to help them accomplist their need , its your food cart , your choice to how it will be made , you can make motorcyle , van or event auto . also you can add you desired colors , stickers and with all that we will hand you over your fully customized food cart',
        'safety measured':
          'Working with fire requires proper saftey measure. Your food cart can be build with deep fire , hotplate,gas kitchen or many customized kithen equitpment . we will make your product such a way that you will feel comfortable and feel safe  with our heat managment system we will assure lesser disaster possible'
      }
    },

    media: [
      {
        img: '/food-van/fast-food-cart.webp',
        alt: 'black foocart with mutor system'
      },
      {
        img: '/food-van/foodcart.webp',
        alt: 'fully ss customized food cart van with cycle system'
      },
      {
        img: '/food-van/Food-Cart.webp',
        alt: 'custom stainless foocart for the street food with heavy glass'
      },
      {
        img: '/food-van/food-van.webp',
        alt: 'custom sticker food cart attached in easy bike '
      },
      {
        img: '/food-van/food-van-cart.png',
        alt: 'custom sticker food cart attached portable street food cart'
      },
      {
        img: '/food-van/food-van-cart.png',
        alt: 'custom colored food cart in cyleing portable street food cart'
      }
    ],
    category: 'food-cart'
  },
  {
    id: 'custom-food-cart-price-in-dhaka-3',
    title: 'Customized Food Cart',
    details: {
      features: [
        'high quality ss',
        'modern customizable desgin',
        'Safety meassured'
      ],
      spec: {
        power: '10v-380v',
        weight: '500kg +/-',
        color: 'Customized color',
        type: 'street food cart'
      },
      about: {
        'high quality stainless steel':
          'we provide high quality steel for your food cart, cause after all this product mostly covered in ss and it need to be long lasting .so with that in mind we inlcude best possibe stainless steel possible',

        'customizeable design':
          'we urge customers to provide their visonary design to us to help them accomplist their need , its your food cart , your choice to how it will be made , you can make motorcyle , van or event auto . also you can add you desired colors , stickers and with all that we will hand you over your fully customized food cart',
        'safety measured':
          'Working with fire requires proper saftey measure. Your food cart can be build with deep fire , hotplate,gas kitchen or many customized kithen equitpment . we will make your product such a way that you will feel comfortable and feel safe  with our heat managment system we will assure lesser disaster possible'
      }
    },

    media: [
      {
        img: '/food-van/fast-food-cart.webp',
        alt: 'black foocart with mutor system'
      },
      {
        img: '/food-van/foodcart.webp',
        alt: 'fully ss customized food cart van with cycle system'
      },
      {
        img: '/food-van/Food-Cart.webp',
        alt: 'custom stainless foocart for the street food with heavy glass'
      },
      {
        img: '/food-van/food-van.webp',
        alt: 'custom sticker food cart attached in easy bike '
      },
      {
        img: '/food-van/food-van-cart.png',
        alt: 'custom sticker food cart attached portable street food cart'
      },
      {
        img: '/food-van/food-van-cart.png',
        alt: 'custom colored food cart in cyleing portable street food cart'
      }
    ],
    category: 'food-cart'
  },
  {
    id: 'custom-food-cart-price-in-dhaka-3',
    title: 'Customized Food Cart',
    details: {
      features: [
        'high quality ss',
        'modern customizable desgin',
        'Safety meassured'
      ],
      spec: {
        power: '10v-380v',
        weight: '500kg +/-',
        color: 'Customized color',
        type: 'street food cart'
      },
      about: {
        'high quality stainless steel':
          'we provide high quality steel for your food cart, cause after all this product mostly covered in ss and it need to be long lasting .so with that in mind we inlcude best possibe stainless steel possible',

        'customizeable design':
          'we urge customers to provide their visonary design to us to help them accomplist their need , its your food cart , your choice to how it will be made , you can make motorcyle , van or event auto . also you can add you desired colors , stickers and with all that we will hand you over your fully customized food cart',
        'safety measured':
          'Working with fire requires proper saftey measure. Your food cart can be build with deep fire , hotplate,gas kitchen or many customized kithen equitpment . we will make your product such a way that you will feel comfortable and feel safe  with our heat managment system we will assure lesser disaster possible'
      }
    },

    media: [
      {
        img: '/food-van/fast-food-cart.webp',
        alt: 'black foocart with mutor system'
      },
      {
        img: '/food-van/foodcart.webp',
        alt: 'fully ss customized food cart van with cycle system'
      },
      {
        img: '/food-van/Food-Cart.webp',
        alt: 'custom stainless foocart for the street food with heavy glass'
      },
      {
        img: '/food-van/food-van.webp',
        alt: 'custom sticker food cart attached in easy bike '
      },
      {
        img: '/food-van/food-van-cart.png',
        alt: 'custom sticker food cart attached portable street food cart'
      },
      {
        img: '/food-van/food-van-cart.png',
        alt: 'custom colored food cart in cyleing portable street food cart'
      }
    ],
    category: 'food-cart'
  }
]

export const categories: categoryDisplay[] = [
  {
    imageSrc: '',
    alt: '',
    title: 'All Product',
    link: ''
  },
  {
    imageSrc: '/category/commercial-kitchen-equipment.png',
    alt: 'commercial kitchen equipment price in bd',
    title: 'Kitchen Equipment',
    link: 'commercial-kitchen'
  },
  {
    imageSrc: '/category/fast-food-cart.webp',
    alt: 'fast food van cart price in bd ',
    title: 'Customized Food Cart',
    link: 'food-cart'
  },
  {
    imageSrc: '/category/restaourant-equipment.png',
    alt: 'restaourant equipment in dhaka',
    title: 'restaourant Equipment',
    link: 'restaurant-equiptment'
  },
  {
    imageSrc: '/category/refrigarentservice.webp',
    alt: 'refrigarent Service in dhaka',
    title: 'Refrigarent parts & equipment',
    link: 'refrigeration'
  },
  {
    imageSrc: '/category/display-chillars.png',
    alt: 'best commercial fridge and  display chillars in dhaka ',
    title: 'Commercial fridge & chillars',
    link: 'fridge-chillars'
  },
  {
    imageSrc: '',
    alt: '',
    title: 'Restaurant professional ovens',
    link: 'ovens'
  },
  {
    imageSrc: '',
    alt: '',
    title: 'Air conditioning',
    link: 'air-conditioning'
  },
  {
    imageSrc: '',
    alt: '',
    title: 'Ventilation',
    link: 'ventilation'
  },
  {
    imageSrc: '',
    alt: '',
    title: 'Heating',
    link: 'heating'
  },
  {
    imageSrc: '',
    alt: '',
    title: 'Bakery Equipment',
    link: 'bakery-equipment'
  },
  {
    imageSrc: '',
    alt: '',
    title: 'Spare Parts',
    link: 'spare-parts'
  }
]
