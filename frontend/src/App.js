// React kütüphanesinden useState ve useEffect hook'ları import ediliyor. 
// useState, bileşen içinde durum (state) yönetimi sağlar, useEffect ise yan etkileri (side effects) yönetir.
import React, { useState, useEffect } from 'react';

// ethers kütüphanesinden BrowserProvider ve Contract nesneleri import ediliyor. 
// BrowserProvider, kullanıcı cüzdanı sağlayıcısını (provider) temsil ederken, Contract, blockchain'deki bir akıllı kontrat ile etkileşim sağlar.
import { BrowserProvider, Contract } from 'ethers';

// Bootstrap kütüphanesinin CSS dosyası import ediliyor. 
// Bu, uygulamanın Bootstrap stiline sahip olmasını sağlar.
import 'bootstrap/dist/css/bootstrap.min.css';

// React Bootstrap bileşenleri import ediliyor. 
// Container, Row, Col gibi bileşenler sayfanın düzenini (layout) oluşturmak için kullanılır.
import { Container, Row, Col, Form, Button, Alert, Card, Table } from 'react-bootstrap';

// Kontrat adresi ve ABI bilgileri, kontrat ile etkileşim kurmak için gereken bilgiler olarak import ediliyor.
import { contractAddress, contractABI } from './contractConfig';

// App bileşeni, uygulamanın ana bileşeni olarak tanımlanıyor.
function App() {
  // Uygulamanın durumlarını (states) yönetmek için useState hook'u kullanılıyor.
  const [provider, setProvider] = useState(null);         // Ethereum sağlayıcısını tutar
  const [signer, setSigner] = useState(null);             // Kullanıcı imzalayıcısını (signer) tutar
  const [contract, setContract] = useState(null);         // Kontrat ile etkileşim sağlayan nesneyi tutar
  const [productName, setProductName] = useState("");     // Yeni ürünün adını tutar
  const [productLocation, setProductLocation] = useState(""); // Yeni ürünün başlangıç lokasyonunu tutar
  const [productId, setProductId] = useState("");         // Ürün ID'sini tutar
  const [newLocation, setNewLocation] = useState("");     // Ürünün yeni lokasyonunu tutar
  const [newStatus, setNewStatus] = useState("");         // Ürünün yeni durumunu tutar
  const [productInfo, setProductInfo] = useState(null);   // Ürün bilgilerini tutar
  const [productHistory, setProductHistory] = useState([]); // Ürün geçmişini tutar
  const [statusMessage, setStatusMessage] = useState(""); // Kullanıcıya gösterilecek durum mesajını tutar
  const [allProducts, setAllProducts] = useState([]);     // Tüm ürünlerin listesini tutar

  // useEffect hook'u, bileşen ilk kez yüklendiğinde Ethereum sağlayıcısını ve kontratı yüklemek için kullanılır.
  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        // Kullanıcı cüzdanını (MetaMask) sağlayıcı olarak ayarlar.
        const provider = new BrowserProvider(window.ethereum);
        
        // Kullanıcının imzalayıcısını alır (bu imzalayıcı ile işlemler yapılabilir).
        const signer = await provider.getSigner();
        
        // Kontrat ile etkileşim sağlamak için kontrat adresi ve ABI bilgileri kullanılarak bir kontrat nesnesi oluşturulur.
        const contract = new Contract(contractAddress, contractABI, signer);
        
        // Sağlayıcı, imzalayıcı ve kontrat durumları güncellenir.
        setProvider(provider);
        setSigner(signer);
        setContract(contract);
      } else {
        // Ethereum sağlayıcısı bulunamadığında kullanıcıya bir hata mesajı gösterilir.
        setStatusMessage("Ethereum provider not found. Install MetaMask.");
      }
    };

    // Sağlayıcıyı yükleme işlemi başlatılır.
    loadProvider();
  }, []);

  // Yeni bir ürün eklemek için kullanılan fonksiyon
  const addProduct = async () => {
    try {
      // Kontrata yeni ürün ekleme işlemi yapılır.
      const tx = await contract.addProduct(productName, productLocation);
      
      // İşlemin blockchain'de onaylanması beklenir.
      await tx.wait();
      
      // Başarılı bir şekilde ürün eklendiğinde bir durum mesajı gösterilir.
      setStatusMessage(`Product ${productName} added successfully!`);
    } catch (error) {
      // Bir hata oluşursa kullanıcıya bir hata mesajı gösterilir.
      setStatusMessage("Error adding product.");
    }
  };

  // Belirli bir ürünü ID ile getirmek için kullanılan fonksiyon
  const fetchProduct = async () => {
    try {
      // Ürün ID'sine göre kontrattan ürün bilgileri getirilir.
      const product = await contract.getProduct(productId);
      
      // Alınan ürün bilgileri uygun formatta ayarlanır ve productInfo durumuna atanır.
      setProductInfo({
        name: product[0],
        productId: product[1].toString(),
        manufacturer: product[2],
        owner: product[3],
        currentLocation: product[4],
        status: product[5],
        timestamp: new Date(Number(product[6].toString()) * 1000).toLocaleString()
      });
      
      // Başarılı bir şekilde ürün bilgileri getirildiğinde bir durum mesajı gösterilir.
      setStatusMessage(`Product ${productId} fetched successfully!`);
    } catch (error) {
      // Bir hata oluşursa kullanıcıya bir hata mesajı gösterilir.
      setStatusMessage("Error fetching product.");
    }
  };

  // Ürünün lokasyonunu ve durumunu güncellemek için kullanılan fonksiyon
  const updateProductLocation = async () => {
    try {
      // Kontrata ürün lokasyonunu ve durumunu güncelleme işlemi yapılır.
      const tx = await contract.updateLocation(productId, newLocation, newStatus);
      
      // İşlemin blockchain'de onaylanması beklenir.
      await tx.wait();
      
      // Başarılı bir şekilde lokasyon ve durum güncellendiğinde bir durum mesajı gösterilir.
      setStatusMessage(`Product ${productId} location updated to ${newLocation} with status ${newStatus}.`);
    } catch (error) {
      // Bir hata oluşursa kullanıcıya bir hata mesajı gösterilir.
      setStatusMessage("Error updating product location.");
    }
  };

  // Belirli bir ürünün geçmişini almak için kullanılan fonksiyon
  const fetchProductHistory = async () => {
    try {
      // Ürün ID'sine göre kontrattan ürün geçmişi getirilir.
      const history = await contract.getProductHistory(productId);
      
      // Geçmiş kayıtları uygun formatta ayarlanır ve productHistory durumuna atanır.
      const formattedHistory = history.map(item => ({
        location: item.location,
        status: item.status,
        timestamp: new Date(Number(item.timestamp.toString()) * 1000).toLocaleString()
      }));
      setProductHistory(formattedHistory);
      
      // Başarılı bir şekilde ürün geçmişi getirildiğinde bir durum mesajı gösterilir.
      setStatusMessage(`Product history for ${productId} fetched successfully!`);
    } catch (error) {
      // Bir hata oluşursa kullanıcıya bir hata mesajı gösterilir.
      setStatusMessage("Error fetching product history.");
    }
  };

  // Tüm ürünleri almak için kullanılan fonksiyon
  const fetchAllProducts = async () => {
    try {
      // Kontrattan toplam ürün sayısı getirilir.
      const productCount = await contract.productCount(); 
      let products = [];
      
      // Her bir ürün ID'sine göre ürün bilgileri alınır ve listeye eklenir.
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

      // Tüm ürünler allProducts durumuna atanır ve başarılı bir durum mesajı gösterilir.
      setAllProducts(products);
      setStatusMessage("All products fetched successfully!");
    } catch (error) {
      // Bir hata oluşursa kullanıcıya bir hata mesajı gösterilir.
      setStatusMessage("Error fetching products.");
    }
  };

  // Uygulamanın arayüzünün render edilmesi
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
                <Table striped bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Manufacturer</th>
                      <th>Owner</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.productId}</td>
                        <td>{product.name}</td>
                        <td>{product.manufacturer}</td>
                        <td>{product.owner}</td>
                        <td>{product.currentLocation}</td>
                        <td>{product.status}</td>
                        <td>{product.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
}

// App bileşeni dışa aktarılıyor (export ediliyor), böylece diğer dosyalarda kullanılabiliyor.
export default App;
