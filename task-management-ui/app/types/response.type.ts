export type ErrorData = {
  message: string;
};

export type ApiError = {
  statusCode?: number;
  data?: ErrorData;
};

export type ApiResponse = {
  data: any;
  statusCode: number;
};

export type StoreActionResponse = {
  success: boolean;
  message: string;
  statusCode: number;
};
