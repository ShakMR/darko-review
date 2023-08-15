import { NextApiRequest, NextApiResponse } from "next";
import orders from "./orders.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(orders);
  const { orderNumber } = req.query;
  const zipCode = req.query.zip;
  const order = orders.find(
    (o) => o.tracking_number === orderNumber && o.zip_code === zipCode
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res
      .status(404)
      .json({ message: "Order not found, please check your input" });
  }
}
