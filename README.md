# 🛒 README - eCommerce TP Final UNTREF

Este proyecto es una tienda online completa desarrollada como **Trabajo Práctico Final para UNTREF**.  
Permite a los usuarios navegar productos, ver detalles, agregar al carrito, realizar pagos simulados y obtener una factura de compra.  
El código está documentado y estructurado para facilitar su comprensión y mantenimiento.

---

## 📂 Estructura del Proyecto

```
index.html
script.js
style.css
assets/
favicon.ico
chatbot/
├─ script.js
├─ style.css
css/
├─ style.css
js/
├─ script.js
├─ settings.js
cart/
├─ index.html
├─ script.js
├─ style.css
pay/
├─ index.html
├─ script.js
├─ style.css
├─ bills/
│ ├─ firma.png
│ ├─ index.html
│ ├─ script.js
│ ├─ style.css
├─ success/
├─ index.html
├─ script.js
├─ style.css
productinfo/
├─ index.html
├─ script.js
├─ style.css
about/
├─ index.html
├─ script.js
├─ style.css
eula/
├─ index.html
├─ script.js
├─ style.css
images/
├─ AnaTorres.jpg
├─ CarlosGomez.webp
├─ JuanPerez.jpg
├─ MariaLopez.jpg

```

---

## 📑 Descripción de Carpetas y Archivos

### `index.html`, `script.js`, `style.css`

Página principal que lista productos obtenidos desde la API.

- **script.js**: renderiza productos, maneja el carrito con `localStorage`.

### `/cart`

Página del carrito de compras.

- Gestiona listado, cantidades, eliminación de productos y navegación.

### `/pay`

Página de pago y procesamiento de la compra.

- Validaciones de tarjeta, CVV y dirección.
- Simulación de pago y modal de confirmación.
- **/bills**: Generación de facturas dinámicas.
- **/success**: Confirmación de compra, impresión de factura y actualización de stock.

### `/productinfo`

Muestra detalles de un producto individual y permite añadirlo o quitarlo del carrito.

### `/about`

Información sobre el equipo y el proyecto.

### `/eula`

Términos y condiciones de uso.

---

## 🔄 Flujo de la Aplicación

### **Inicio (`index.html`)**

- Se listan productos desde una API externa.
- Se puede ver detalle o añadir al carrito.
- El carrito persiste con `localStorage`.

### **Carrito (`/cart`)**

- Vista de productos agregados con opción de modificar cantidades.
- Botón **“Pagar”** redirige al formulario de pago.

### **Pago (`/pay`)**

- Formulario con validaciones (nombre, tarjeta, expiración, CVV, dirección).
- Validación de tarjeta con algoritmo de **Luhn**.
- Modal de confirmación antes de procesar.

### **Éxito (`/pay/success`)**

- Muestra resumen de compra y datos del cliente.
- Permite imprimir factura y limpia el carrito.
- Actualiza stock en la API con **PUT**.

### **Factura (`/pay/bills`)**

- Genera una factura dinámica usando parámetros en la URL.
- Lista para impresión automática.

### **Detalle de Producto (`/productinfo`)**

- Muestra datos ampliados del producto.
- Opción de añadir/quitar del carrito.

---

## 🛠️ Decisiones de Diseño y Conceptos Aplicados

- **Persistencia del Carrito**  
  Uso de `localStorage` para mantener productos entre sesiones.

- **Fetch y AJAX**  
  Productos obtenidos desde API externa.  
  Actualización de stock con métodos HTTP (**GET, PUT**).

- **Objetos y JSON**  
  Productos, carrito y facturas representados como objetos.  
  Comunicación con API basada en JSON.

- **Promesas y Asincronía**  
  Uso de `fetch` con promesas para obtener y actualizar datos.  
  Manejo de respuestas con `then` y `catch`.

- **Eventos**  
  Botones de agregar/eliminar productos, submit del formulario de pago, impresión de factura, confirmaciones de modal.

- **Validaciones de Pago**  
  Incluye algoritmo de Luhn, fechas y comprobación de tipo de tarjeta.

- **UX y Accesibilidad**  
  Botones deshabilitados cuando corresponde, mensajes claros y modales de confirmación.

- **Responsividad**  
  Estilos diseñados para dispositivos móviles y escritorio.

---

## 📜 Licencia

Este proyecto es solo para fines educativos.

---

## 👤 Autor

**Trabajo Práctico Final UNTREF**  
Desarrollado por Tiziano Tomas Luzi Ramos
