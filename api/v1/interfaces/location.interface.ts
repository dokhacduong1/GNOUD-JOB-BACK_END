
export interface CoordinateResultInterface {
    status: string;
    result: {
      geometry: {
        location: {
          lat: number;
          lng: number;
        };
      };
      place_id: string;
    };
  }

 export interface DetailedAddressResultInterface {
    status: string;
    predictions: Array<{
      description: string;
      id: string;
      structured_formatting: any;
    }>;
  }