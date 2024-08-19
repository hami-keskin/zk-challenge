import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { contractAddress, contractABI } from './contractConfig'; // contractConfig dosyasını içe aktarın

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [productName, setProductName] = useState("");
  const [productLocation, setProductLocation] = useState("");
  const [productId, setProductId] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const loadProvider = async () => {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);
      
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
    };

    loadProvider();
  }, []);

  const addProduct = async () => {
    try {
      const tx = await contract.addProduct(productName, productLocation);
      await tx.wait();
      setStatusMessage(`Product ${productName} added successfully!`);
    } catch (error) {
      setStatusMessage("Error adding product.");
    }
  };

  const fetchProduct = async () => {
    try {
      const product = await contract.getProduct(productId);
      setProductInfo(product);
      setStatusMessage(`Product ${productId} fetched successfully!`);
    } catch (error) {
      setStatusMessage("Error fetching product.");
    }
  };

  return (
    <Container className="mt-5">
      <h1>Supply Chain Tracking</h1>
      {statusMessage && <Alert variant="info">{statusMessage}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Add Product</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter product name" onChange={(e) => setProductName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Initial Location</Form.Label>
                  <Form.Control type="text" placeholder="Enter initial location" onChange={(e) => setProductLocation(e.target.value)} />
                </Form.Group>

                <Button variant="primary" onClick={addProduct}>Add Product</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Get Product Info</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Product ID</Form.Label>
                  <Form.Control type="text" placeholder="Enter product ID" onChange={(e) => setProductId(e.target.value)} />
                </Form.Group>

                <Button variant="primary" onClick={fetchProduct}>Get Product</Button>
              </Form>
              {productInfo && (
                <div className="mt-3">
                  <p><strong>Name:</strong> {productInfo[0]}</p>
                  <p><strong>Product ID:</strong> {productInfo[1].toString()}</p>
                  <p><strong>Manufacturer:</strong> {productInfo[2]}</p>
                  <p><strong>Current Location:</strong> {productInfo[3]}</p>
                  <p><strong>Status:</strong> {productInfo[4]}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
