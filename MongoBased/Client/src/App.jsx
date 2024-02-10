import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table, Container, Row, Col, Form } from "react-bootstrap";
import "./assets/extra.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addBook = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/books/${editId}`, {
          title,
          author,
        });
        window.alert("Book Updated Successfully!");
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/books", { title, author });
        window.alert("Book Added Successfully!");
      }
      fetchBooks();
      setTitle("");
      setAuthor("");
    } catch (error) {
      console.error("Error adding/updating book:", error);
    }
  };

  const deleteBook = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this book?"
      );
      if (!confirmed) return;
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const editBook = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setEditId(book._id); // Update editId with book._id
  };

  // handling the search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // filter the search items based in the search
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="mt-5 txt">
            Book Library <i class="bi bi-journal fs-2"></i>
          </h1>
          <Form className="mb-5">
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </Col>
              <Col>
                <Button variant="primary" onClick={addBook}>
                  <i class="fa-solid fa-book"></i>{" "}
                  {editId ? "Update Book" : "Add Book"}
                </Button>
              </Col>
            </Row>
            <Col className="mt-3 txt">
              <h2>
                Search Books <i class="bi bi-search"></i>
              </h2>
            </Col>
            <Row className="mt-2">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Search by title.."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col className="text">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Sr. no.</th>
                <th>
                  <i class="fa-solid fa-user-pen"></i> Title
                </th>
                <th>
                  <i class="fa-regular fa-user"></i> Author
                </th>
                <th>
                  <i class="bi bi-box-arrow-up-left"></i> Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr key={book._id}>
                  <td>{index + 1}</td> {/* Serial Number */}
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => deleteBook(book._id)}
                    >
                      <i class="fa-solid fa-trash-can"></i> Delete
                    </Button>{" "}
                    <Button
                      variant="btn btn-success"
                      onClick={() => editBook(book)}
                    >
                      <i class="fa-solid fa-pen-to-square"></i> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
