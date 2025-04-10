export type PaymentLinkType =
  | "donation"
  | "fundraising"
  | "event"
  | "product_digital"
  | "product_physical";

export interface BaseLinkData {
  id: string;
  title: string;
  description: string;
  images: string[];
  merchant: {
    name: string;
    avatar: string;
    bio: string;
    location: string;
    verified: boolean;
    joinedDate: string;
  };
  raised?: number;
  goal?: number;
  daysLeft?: number;
  supporters?: number;
  category: string;
  type: PaymentLinkType;
}

export interface DonationLinkData extends BaseLinkData {
  type: "donation";
  donationOptions: Array<{
    amount: number;
    label: string;
  }>;
}

export interface FundraisingLinkData extends BaseLinkData {
  type: "fundraising";
  donationOptions: Array<{
    amount: number;
    label: string;
  }>;
  updates: Array<{
    date: string;
    title: string;
    content: string;
  }>;
  comments: Array<{
    author: {
      name: string;
      avatar: string;
    };
    date: string;
    content: string;
  }>;
}

export interface EventLinkData extends BaseLinkData {
  type: "event";
  date: string;
  time: string;
  location: string;
  organizer: string;
  ticketOptions: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    available: number;
    maxPerOrder?: number;
  }>;
  eventDetails: {
    agenda?: string;
    speakers?: Array<{
      name: string;
      bio: string;
      avatar: string;
    }>;
  };
}

export interface ProductDigitalLinkData extends BaseLinkData {
  type: "product_digital";
  price: number;
  discountPrice?: number;
  features: string[];
  fileType?: string;
  fileSize?: string;
  deliveryMethod: "download" | "email";
  previewUrl?: string;
}

export interface ProductPhysicalLinkData extends BaseLinkData {
  type: "product_physical";
  price: number;
  discountPrice?: number;
  features: string[];
  variants?: Array<{
    id: string;
    name: string;
    options: Array<{
      id: string;
      name: string;
      price?: number;
    }>;
  }>;
  inventory: number;
  weight?: string;
  dimensions?: string;
  shippingOptions?: Array<{
    id: string;
    name: string;
    price: number;
    estimatedDelivery: string;
  }>;
}

export type PaymentLinkData =
  | DonationLinkData
  | FundraisingLinkData
  | EventLinkData
  | ProductDigitalLinkData
  | ProductPhysicalLinkData;
