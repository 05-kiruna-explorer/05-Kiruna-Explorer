import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function LoginForm({ handleLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await handleLogin(username, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="position-absolute top-50 start-50 translate-middle w-25">
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Login</Card.Title>
                    {error && <div className="alert alert-danger text-center">{error}</div>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(ev) => setUsername(ev.target.value)}
                                required
                                autoFocus
                                placeholder="Enter your Username"
                                autoComplete="on"
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(ev) => setPassword(ev.target.value)}
                                required
                                minLength={6}
                                placeholder="Enter your password"
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                type="submit"
                                className="mb-2"
                                disabled={!username || !password}
                            >
                                Login
                            </Button>
                            <Link className="btn btn-danger" to={"/"}>
                                Cancel
                            </Link>
                        </div>
                    </Form>
                    <div className="text-center mt-3">
                        <small>
                            Don't have an account? <Link to="/registration">Register here</Link>
                        </small>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default LoginForm;
