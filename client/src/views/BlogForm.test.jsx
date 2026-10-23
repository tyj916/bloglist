import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { useBlogActions } from "../stores/useBlogStore";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

const mockAddBlog = vi.fn().mockResolvedValue({
  id: '123',
  title: "React test title textbox",
  author: "React test author textbox",
  url: "React test url textbox",
  likes: 0,
});

vi.mock("../stores/useBlogStore", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useBlogActions: vi.fn(),
  }
})

vi.mocked(useBlogActions).mockReturnValue({ add: mockAddBlog })

describe("<BlogForm />", () => {
  const addBlog = vi.fn();

  beforeEach(() => {
    addBlog.mockClear();
    mockNavigate.mockClear();
    render(<BlogForm addBlog={addBlog} />);
  });

  test("render the form", () => {
    const element = screen.getByText("Create New");
    expect(element).toBeInTheDocument();
  });

  test("calls onSubmit", async () => {
    const user = userEvent.setup();
    const titleInput = screen.getByLabelText("Title");
    const authorInput = screen.getByLabelText("Author");
    const urlInput = screen.getByLabelText("Url");
    const submitButton = screen.getByText("Create");

    await user.type(titleInput, "React test title textbox");
    await user.type(authorInput, "React test author textbox");
    await user.type(urlInput, "React test url textbox");
    await user.click(submitButton);

    expect(mockAddBlog).toHaveBeenCalledTimes(1);
    expect(mockAddBlog).toHaveBeenCalledWith({
      title: "React test title textbox",
      author: "React test author textbox",
      url: "React test url textbox",
    });
  });
});
