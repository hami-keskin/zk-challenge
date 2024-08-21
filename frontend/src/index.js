// Bootstrap kütüphanesinin CSS dosyası import ediliyor. 
// Bu, uygulamanın Bootstrap stiline sahip olmasını sağlar.
import 'bootstrap/dist/css/bootstrap.min.css';

// React kütüphanesi import ediliyor. 
// React, UI bileşenlerini oluşturmak için kullanılan bir JavaScript kütüphanesidir.
import React from 'react';

// ReactDOM kütüphanesinden 'createRoot' fonksiyonu import ediliyor. 
// Bu fonksiyon, React bileşenlerini DOM'a yerleştirmek için kullanılır.
import ReactDOM from 'react-dom/client';

// Uygulamaya özel CSS dosyası import ediliyor. 
// Bu dosya, uygulamanın özel stilini tanımlar.
import './index.css';

// App bileşeni import ediliyor. 
// Bu bileşen, uygulamanın ana bileşeni olarak tüm UI ve işlevselliği içerir.
import App from './App';

// Uygulamanın performans ölçümünü yapmak için reportWebVitals modülü import ediliyor. 
// Bu modül, uygulamanın performansını izlemeye ve raporlamaya olanak tanır.
import reportWebVitals from './reportWebVitals';

// React uygulamasının kök DOM elemanını oluşturmak için 'createRoot' fonksiyonu kullanılıyor. 
// Bu kök eleman, index.html dosyasındaki 'root' id'li elementtir.
const root = ReactDOM.createRoot(document.getElementById('root'));

// 'render' fonksiyonu ile React bileşenleri DOM'a yerleştiriliyor.
// React.StrictMode, uygulama geliştirme sırasında hataları daha erken yakalamak için kullanılır.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Uygulamanın performansını ölçmeye başlamak için 'reportWebVitals' fonksiyonu çağrılıyor.
// Bu, uygulamanın performansı hakkında bilgi toplamak için kullanılır. İsteğe bağlıdır.
reportWebVitals();
