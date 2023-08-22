import { NextApiRequest, NextApiResponse } from "next";
import orders from "./orders.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderNumber, zipCode } = req.query;
  const order = orders.find(
      // you could move the types defined in the frontend into a separate folder and use them here too.
      // also, instead of using 'o' as a name, don't be lazy, use order (Clean Code)
    (o /* :Orders */) => o.tracking_number === orderNumber && o.zip_code === zipCode
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res
      .status(404)
      .json({ message: "Order not found, please check your input" });
  }
}
