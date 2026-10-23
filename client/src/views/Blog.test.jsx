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

const loggedInUser = {
  id: "root",
  username: "root",
  name: "Superuser",
};

const creatorUser = {
  id: "god",
  username: "Username",
  name: "Username",
};

const renderBlog = () => 
  render(
  <MemoryRouter>
    <Blog />
  </MemoryRouter>
  );

describe("<Blog />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useBlogs.mockReturnValue(mockBlogs)
    useBlogActions.mockReturnValue({ like })
    useLoginUser.mockReturnValue(null)
  });

  test("render blog", () => {
    renderBlog();

    expect(
      screen.getByText("Component test with react-testing-library")
    ).toBeVisible();
    expect(screen.getByText("by Author Name")).toBeVisible();
    expect(screen.getByText("http://localhost:3003/")).toBeVisible();
    expect(screen.getByText("Likes: 1")).toBeVisible();
    expect(screen.getByText("Added by Username")).toBeVisible();
  });

  test("like button is not displayed to unauthenticated user", () => {
    renderBlog();

    const button = screen.queryByRole("button", { name: "Like" });
    expect(button).not.toBeInTheDocument();
  });

  describe("when a user is logged in", () => {
    beforeEach(() => {
      useLoginUser.mockReturnValue(loggedInUser)
    });

    test("like button is shown", () => {
      renderBlog();
      const button = screen.getByRole("button", { name: "Like" });
      expect(button).toBeVisible();
    });

    test("remove button is not shown to non creator", () => {
      renderBlog();
      const button = screen.queryByRole("button", { name: "Remove" });
      expect(button).not.toBeInTheDocument();
    });

    test("clicking the like button 2 times calls event handler twice", async () => {
      const user = userEvent.setup();

      renderBlog();

      const likeButton = screen.getByRole("button", { name: "Like" });
      await user.click(likeButton);
      await user.click(likeButton);

      expect(like).toHaveBeenCalledTimes(2);
    });
  });

  describe("and the user is creator", () => {
    beforeEach(() => {
      useLoginUser.mockReturnValue(creatorUser)
    });

    test("blog creator is shown the remove button", () => {
      renderBlog();
      const button = screen.getByRole("button", { name: "Remove" });
      expect(button).toBeVisible();
    });
  });
});
