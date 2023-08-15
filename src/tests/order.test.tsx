import { render, screen, waitFor } from "@testing-library/react";
import OrderView from "../pages/order/[orderNumber]/[zipCode]";
import { useRouter } from "next/router";

// Mock useRouter
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    query: { orderNumber: "12345", zipCode: "67890" },
  }),
}));

// Mock data
const mockOrderData = {
  checkpoints: [
    {
      status: "Delivered",
      status_details: "Package delivered successfully",
      city: "San Francisco",
      event_timestamp: "2023-08-13T15:00:00Z",
      meta: {
        pickup_address: "123 Mock Street",
        pickup_address_map_url: "/path-to-mock-image.jpg",
        pickup_address_link: "https://google.com/maps?q=123+Mock+Street",
      },
    },
  ],
  delivery_info: {
    articles: [
      {
        articleImageUrl: "/path-to-article-image.jpg",
        articleName: "Sample Article",
        articleNo: "A12345",
        price: 100,
      },
    ],
  },
};

const mockFetchResponse = {
  ok: true,
  json: jest.fn().mockResolvedValueOnce(mockOrderData),
  headers: new Headers(),
  redirected: false,
  status: 200,
  statusText: "OK",
  type: "default",
  url: "",
};

describe("OrderView", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue(mockFetchResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders order details correctly", async () => {
    render(<OrderView />);

    // Assert loading state
    expect(screen.getByText(/Loading Order Details.../i)).toBeInTheDocument();

    // Wait for the loading state to be removed
    await waitFor(() =>
      expect(
        screen.queryByText(/Loading Order Details.../i)
      ).not.toBeInTheDocument()
    );

    // Assert order details
    expect(
      screen.getByText(mockOrderData.checkpoints[0].status)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockOrderData.checkpoints[0].status_details)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockOrderData.checkpoints[0].meta!.pickup_address!)
    ).toBeInTheDocument();

    // Assert article details
    expect(
      screen.getByText(mockOrderData.delivery_info.articles[0].articleName)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Article number: ${mockOrderData.delivery_info.articles[0].articleNo}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${mockOrderData.delivery_info.articles[0].price} €`)
    ).toBeInTheDocument();

    // Cleanup mock
    (global.fetch as any).mockClear();
  });
});
