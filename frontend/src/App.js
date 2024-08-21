import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { contractAddress, contractABI } from './contractConfig';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [productName, setProductName] = useState("");
  const [productLocation, setProductLocation] = useState("");
  const [productId, setProductId] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [productHistory, setProductHistory] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, contractABI, signer);
        
        setProvider(provider);
        setSigner(signer);
        setContract(contract);
      } else {
        setStatusMessage("Ethereum provider not found. Install MetaMask.");
      }
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
      setProductInfo({
        name: product[0],
        productId: product[1].toString(),
        manufacturer: product[2],
        owner: product[3],
        currentLocation: product[4],
        status: product[5],
        timestamp: new Date(Number(product[6].toString()) * 1000).toLocaleString()
      });
      setStatusMessage(`Product ${productId} fetched successfully!`);
    } catch (error) {
      setStatusMessage("Error fetching product.");
    }
  };

  const updateProductLocation = async () => {
    try {
      const tx = await contract.updateLocation(productId, newLocation, newStatus);
      await tx.wait();
      setStatusMessage(`Product ${productId} location updated to ${newLocation} with status ${newStatus}.`);
    } catch (error) {
      setStatusMessage("Error updating product location.");
    }
  };

  const fetchProductHistory = async () => {
    try {
      const history = await contract.getProductHistory(productId);
      const formattedHistory = history.map(item => ({
        location: item.location,
        status: item.status,
        timestamp: new Date(Number(item.timestamp.toString()) * 1000).toLocaleString()
      }));
      setProductHistory(formattedHistory);
      setStatusMessage(`Product history for ${productId} fetched successfully!`);
    } catch (error) {
      setStatusMessage("Error fetching product history.");
    }
  };

  const fetchAllProducts = async () => {
    try {
      const productCount = await contract.productCount(); // Toplam ürün sayısını alıyoruz
      let products = [];
      
      for (let i = 1; i <= productCount; i++) {
        const product = await contract.getProduct(i);
        products.push({
          name: product[0],
          productId: product[1].toString(),
          manufacturer: product[2],
          owner: product[3],
          currentLocation: product[4],
          status: product[5],
          timestamp: new Date(Number(product[6].toString()) * 1000).toLocaleString()
        });
      }

      setAllProducts(products);
      setStatusMessage("All products fetched successfully!");
    } catch (error) {
      setStatusMessage("Error fetching products.");
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
                  <p><strong>Name:</strong> {productInfo.name}</p>
                  <p><strong>Product ID:</strong> {productInfo.productId}</p>
                  <p><strong>Manufacturer:</strong> {productInfo.manufacturer}</p>
                  <p><strong>Owner:</strong> {productInfo.owner}</p>
                  <p><strong>Current Location:</strong> {productInfo.currentLocation}</p>
                  <p><strong>Status:</strong> {productInfo.status}</p>
                  <p><strong>Timestamp:</strong> {productInfo.timestamp}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Update Product Location</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Product ID</Form.Label>
                  <Form.Control type="text" placeholder="Enter product ID" onChange={(e) => setProductId(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Location</Form.Label>
                  <Form.Control type="text" placeholder="Enter new location" onChange={(e) => setNewLocation(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Status</Form.Label>
                  <Form.Control type="text" placeholder="Enter new status" onChange={(e) => setNewStatus(e.target.value)} />
                </Form.Group>

                <Button variant="primary" onClick={updateProductLocation}>Update Location</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Get Product History</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Product ID</Form.Label>
                  <Form.Control type="text" placeholder="Enter product ID" onChange={(e) => setProductId(e.target.value)} />
                </Form.Group>

                <Button variant="primary" onClick={fetchProductHistory}>Get History</Button>
              </Form>
              {productHistory.length > 0 && (
                <div className="mt-3">
                  <ul>
                    {productHistory.map((history, index) => (
                      <li key={index}>
                        <p><strong>Location:</strong> {history.location}</p>
                        <p><strong>Status:</strong> {history.status}</p>
                        <p><strong>Timestamp:</strong> {history.timestamp}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>All Products</Card.Title>
              <Button variant="primary" onClick={fetchAllProducts}>Fetch All Products</Button>
              {allProducts.length > 0 && (
                <div className="mt-3">
                  {allProducts.map((product, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                      <div><strong>ID:</strong> {product.productId}</div>
                      <div><strong>Name:</strong> {product.name}</div>
                      <div><strong>Manufacturer:</strong> {product.manufacturer}</div>
                      <div><strong>Location:</strong> {product.currentLocation}</div>
                      <div><strong>Status:</strong> {product.status}</div>
                      <div><strong>Timestamp:</strong> {product.timestamp}</div>
                    </div>
                  ))}
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
