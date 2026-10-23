import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import Blog from "./Blog";
import { useBlogs, useBlogActions } from "../stores/useBlogStore";
import { useLoginUser } from "../stores/useLoginStore";

const mockNavigate = vi.fn();
const like = vi.fn();

vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "blog-id" })
  };
});

vi.mock("../stores/useBlogStore", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useBlogs: vi.fn(),
    useBlogActions: vi.fn()
  }
})

vi.mock("../stores/useLoginStore", () => ({
  useLoginUser: vi.fn(),
}))

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("<Blog />", () => {
  const mockBlogs = [{
    id: "blog-id",
    title: "Component test with react-testing-library",
    author: "Author Name",
    url: "http://localhost:3003/",
    likes: 1,
    user: {
      id: "god",
      name: "Username",
    },
  }]

  beforeEach(() => {
    vi.clearAllMocks();
    useBlogs.mockReturnValue(mockBlogs)
    useBlogActions.mockReturnValue({ like })
    useLoginUser.mockReturnValue(null)
  });

  test("render blog", () => {
    renderWithRouter(<Blog />);

    const title = screen.getByText("Component test with react-testing-library");
    const author = screen.getByText("by Author Name");
    const url = screen.getByText("http://localhost:3003/");
    const likes = screen.getByText("Likes: 1");
    const name = screen.getByText("Added by Username");

    expect(title).toBeVisible();
    expect(author).toBeVisible();
    expect(url).toBeVisible();
    expect(likes).toBeVisible();
    expect(name).toBeVisible();
  });

  test("like button is not displayed to unauthenticated user", () => {
    renderWithRouter(<Blog />);

    const button = screen.queryByRole("button", { name: "Like" });
    expect(button).not.toBeInTheDocument();
  });

  describe("when a user is logged in", () => {
    beforeEach(() => {
      const user = {
        id: "root",
        username: "root",
        name: "Superuser",
      };

      useLoginUser.mockReturnValue(user)
    });

    test("like button is shown", () => {
      renderWithRouter(<Blog />);
      const button = screen.getByRole("button", { name: "Like" });
      expect(button).toBeVisible();
    });

    test("remove button is not shown to non creator", () => {
      renderWithRouter(<Blog />);
      const button = screen.queryByRole("button", { name: "Remove" });
      expect(button).not.toBeInTheDocument();
    });

    test("clicking the like button 2 times calls event handler twice", async () => {
      const user = userEvent.setup();

      renderWithRouter(<Blog />);

      const likeButton = screen.getByText("Like");
      await user.click(likeButton);
      await user.click(likeButton);

      expect(like).toHaveBeenCalledTimes(2);
    });

    describe("and the user is creator", () => {
      beforeEach(() => {
        const user = {
          id: "god",
          username: "Username",
          name: "Username",
        };

        useLoginUser.mockReturnValue(user)
      });

      test("blog creator is shown the remove button", () => {
        renderWithRouter(<Blog />);
        const button = screen.getByRole("button", { name: "Remove" });
        expect(button).toBeVisible();
      });
    });
  });
});
