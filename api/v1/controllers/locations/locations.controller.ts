import e, { Request, Response } from "express";
import {
  Coordinate,
  areaDetails,
  detailedAddress,
  fullAddress,
} from "../../../../helpers/allLocation";
import { selectFields } from "../../../../helpers/selectFields";
import {
  AddressFullResultInterface,
  CoordinateResultInterface,
  DetailedAddressResultInterface,
} from "../../interfaces/location.interface";

export const getAreaDetails = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy dữ liệu từ body
    const keyword = req.body.keyword;
    //Gọi hàm này lấy ra xã/phường,quận/huyện,tỉnh/thành phố

    const result = await areaDetails(keyword);
    //Nếu không có dữ liệu trả về thì trả về một mảng rỗng
    if (result["predictions"].length === 0) {
      res.status(200).json({ code: 200, data: [] });
      return;
    }
    //convert nó thành mảng mới nếu >=1 thì cho city vào nếu >=2 thì cho district vào nếu >=3 thì cho ward vào
    const convertData = result.predictions.map((item) => {
      let ward = "";
      let district = "";
      let city = "";

      if (item.terms.length >= 1) {
        city = item.terms[item.terms.length - 1] || "";
      }

      if (item.terms.length >= 2) {
        district = item.terms[item.terms.length - 2] || "";
      }

      if (item.terms.length >= 3) {
        ward = item.terms[item.terms.length - 3] || "";
      }

      return { ward, district, city };
    });

    res.status(200).json({ code: 200, data: convertData });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDetailedAddress = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Lấy dữ liệu từ body
    const ward = req.body.ward;
    const district = req.body.district;
    const city = req.body.city;
    const keyword = req.body.keyword;
    //Gọi hàm này lấy chi tiết địa chỉ từ xã/phường,quận/huyện,tỉnh/thành phố
    const result: DetailedAddressResultInterface = await detailedAddress(
      ward,
      district,
      city,
      keyword
    );
    //Nếu không có dữ liệu trả về thì trả về một mảng rỗng
    if (result["status"] !== "OK") {
      res.status(200).json({ code: 200, data: [] });
      return;
    }
    //Chọn những trường cần thiết
    const fields = ["description", "id", "structured_formatting"];
    //Chuyển đổi dữ liệu
    const resultConvert = selectFields(result["predictions"], fields);
    //Trả về dữ liệu
    res.status(200).json({ code: 200, data: resultConvert });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//get-full-address
export const getCoordinate = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const placeid: string = req.body.placeid;
    const result: CoordinateResultInterface = await Coordinate(placeid);

    if (!result["result"] || result.status !== "OK") {
      res.status(200).json({ code: 200, data: [] });
      return;
    }

    const { location } = result.result.geometry;
    const { place_id } = result.result;

    const data = {
      location,
      place_id,
    };

    res.status(200).json({ code: 200, data });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFullAddress = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const input: string = req.body.input;
    const result: AddressFullResultInterface = await fullAddress(input);

    if (!result["predictions"] || result.status !== "OK") {
      res.status(200).json({ code: 200, data: [] });
      return;
    }

    //Chọn những trường cần thiết
    const fields = ["description", "place_id", "structured_formatting"];
    //Chuyển đổi dữ liệu
    const resultConvert = selectFields(result["predictions"], fields);

    res.status(200).json({ code: 200, resultConvert });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
