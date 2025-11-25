export interface IProductCreate {
  title: string;
  productid: string;
  specifications: Array<{
    title: string;
    details: string;
  }>;
  materials: Array<{
    title: string;
    details: string;
  }>;
  questions: Array<{
    question: string;
    answer: string;
  }>;
  images: File[];
  tags: string[];
}

export interface ICloudinaryResponse {
  secure_url: string;
}

export interface IApiResponse {
  message: string;
  error?: string;
}
