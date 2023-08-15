import "@testing-library/jest-dom";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../pages/index";

// Mocking the Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Home", () => {
  let mockRouterPush: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouterPush = require("next/router").useRouter()
      .push as jest.MockedFunction<any>;

    // Default successful fetch mock
    (global.fetch as jest.Mock) = jest.fn(async () => ({
      ok: true,
      json: async () => ({}),
    }));
  });

  it("renders the component without crashing", () => {
    render(<Home />);
    expect(screen.getByText("Track your order")).toBeVisible();
  });

  it("shows validation errors on empty form submission", async () => {
    render(<Home />);
    userEvent.click(screen.getByText("Track"));
    await waitFor(() => {
      expect(screen.getByText("Order number is required.")).toBeVisible();
      expect(screen.getByText("Zip code is required.")).toBeVisible();
    });
  });

  it("calls the API and redirects on success", async () => {
    render(<Home />);
    userEvent.type(screen.getByLabelText("Order Number"), "12345");
    userEvent.type(screen.getByLabelText("Zip Code"), "67890");
    userEvent.click(screen.getByText("Track"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/12345?zip=67890",
        expect.anything()
      );
      expect(mockRouterPush).toHaveBeenCalled(); // Assuming a redirect happens on success
    });
  });

  it("shows an error message on API failure", async () => {
    // Setup fetch to simulate a failure response
    (global.fetch as jest.Mock) = jest.fn(async () => ({
      ok: false,
      json: async () => ({ message: "Order not found" }),
    }));

    render(<Home />);
    userEvent.type(screen.getByLabelText("Order Number"), "12345");
    userEvent.type(screen.getByLabelText("Zip Code"), "67890");
    userEvent.click(screen.getByText("Track"));

    await waitFor(() => {
      expect(
        screen.getByText("Order not found, please check your input")
      ).toBeVisible();
    });
  });
});
