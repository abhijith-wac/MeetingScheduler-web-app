import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../styles/GoogleSignin.css";
import useAuth from "../customHooks/useAuth";

const GoogleSignin = () => {
  const { handleGoogleSuccess, handleError } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


  return (
    <Container fluid className="d-flex align-items-center justify-content-center full-height-container">
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg rounded p-4">
            <Card.Body className="text-center">
              <h1 className="mb-4 text-primary font-weight-bold">Welcome Back!</h1>
              <p className="mb-4 text-muted">Sign in to continue</p>

              {/* ✅ Add your actual Google Client ID here */}
              <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleError}
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  className="google-login-button mb-3 w-100"
                />
              </GoogleOAuthProvider>

              <div className="text-center mt-5">
                <Button variant="link" className="text-muted">Forgot Password?</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GoogleSignin;
