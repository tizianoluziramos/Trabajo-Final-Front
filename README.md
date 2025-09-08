# eCommerce - TP Final UNTREF

Este proyecto es una tienda online completa desarrollada como trabajo final para UNTREF. Permite a los usuarios navegar productos, ver detalles, agregar al carrito, realizar pagos simulados y obtener una factura de compra. El código está documentado y estructurado para facilitar su comprensión y mantenimiento.

---

# Como ejecutarlo

## En la terminal escribe el siguiente comando:

```
npm run dev
```

## Estructura del Proyecto

```
index.html
script.js
style.css
assets/
  favicon.ico
cart/
  index.html
  script.js
  style.css
pay/
  index.html
  script.js
  style.css
  bills/
    index.html
    script.js
    style.css
  success/
    index.html
    script.js
    style.css
productinfo/
  index.html
  script.js
  style.css
```

---

## Descripción de Carpetas y Archivos

- **index.html, script.js, style.css**  
  Página principal que muestra los productos disponibles.

  - `script.js`: Obtiene productos de una API, renderiza la lista y permite agregar/quitar productos del carrito usando `localStorage`.

- **/cart**  
  Página del carrito de compras.

  - `cart/index.html`: Lista los productos agregados, permite modificar cantidades o eliminar productos.
  - `cart/script.js`: Gestiona el renderizado del carrito, actualización de cantidades, eliminación y navegación.
  - `cart/style.css`: Estilos específicos para la página del carrito.

- **/pay**  
  Página de pago y procesamiento de la compra.

  - `pay/index.html`: Formulario de pago con validaciones de tarjeta, CVV y dirección.
  - `pay/script.js`: Valida los datos, simula el pago y muestra un modal de confirmación antes de finalizar la compra.
  - `pay/style.css`: Estilos para el formulario de pago.
  - **/bills**: Generación y visualización de la factura.
    - `bills/index.html`: Plantilla de factura.
    - `bills/script.js`: Rellena la factura con los datos de la compra usando parámetros de la URL.
    - `bills/style.css`: Estilos para la factura.
  - **/success**: Página de éxito tras el pago.
    - `success/index.html`: Muestra detalles de la compra y permite imprimir la factura.
    - `success/script.js`: Renderiza el resumen, actualiza el stock en la API y limpia los datos de sesión.
    - `success/style.css`: Estilos para la página de éxito.

- **/productinfo**  
  Página de detalle de producto.
  - `productinfo/index.html`: Muestra información detallada de un producto.
  - `productinfo/script.js`: Obtiene el producto por ID, permite agregar o quitar del carrito.
  - `productinfo/style.css`: Estilos para la vista de detalle.

---

## Flujo de la Aplicación

1. **Inicio (index.html):**

   - Se listan productos obtenidos de una API externa.
   - Cada producto puede ser visualizado en detalle o agregado/eliminado del carrito.
   - El carrito se almacena en `localStorage` para persistencia.

2. **Carrito (/cart):**

   - Se muestran los productos agregados, permitiendo modificar cantidades o eliminar productos.
   - El botón "Pagar" lleva al formulario de pago.

3. **Pago (/pay):**

   - Formulario con validaciones (nombre, número de tarjeta, expiración, CVV, dirección).
   - Se valida el tipo de tarjeta (Visa/Mastercard) y el número con el algoritmo de Luhn.
   - Antes de procesar el pago, se muestra un modal de confirmación.
   - Si el pago es exitoso, se redirige a la página de éxito.

4. **Éxito (/pay/success):**

   - Se muestra un resumen de la compra, datos del cliente y productos adquiridos.
   - Permite imprimir la factura (abre `/pay/bills` en un iframe y lanza la impresión).
   - Se actualiza el stock de los productos en la API y se limpia el carrito.

5. **Factura (/pay/bills):**

   - Recibe los datos de la compra por parámetros de la URL.
   - Renderiza una factura lista para imprimir.

6. **Detalle de Producto (/productinfo):**
   - Muestra información ampliada del producto seleccionado.
   - Permite agregar o quitar el producto del carrito.

---

## Comentarios Explicativos y Decisiones de Diseño

- **Persistencia del Carrito:**  
  Se utiliza `localStorage` para mantener el carrito entre sesiones y páginas.

- **Validación de Pago:**  
  El formulario de pago implementa validaciones estrictas para simular un entorno real, incluyendo el algoritmo de Luhn para tarjetas y comprobación de fechas.

- **Actualización de Stock:**  
  Tras una compra exitosa, se actualiza el stock de cada producto en la API mediante una petición `PUT`.

- **Factura Dinámica:**  
  La factura se genera dinámicamente usando parámetros en la URL y se imprime automáticamente desde un iframe oculto.

- **Manejo de Sesión:**  
  Se usan `sessionStorage` y `localStorage` para separar datos temporales (cliente) y persistentes (carrito).

- **Accesibilidad y UX:**  
  Se incluyen mensajes claros, botones deshabilitados cuando corresponde y modales de confirmación para evitar errores de usuario.

- **Estilos Responsivos:**  
  Todos los estilos están preparados para dispositivos móviles y escritorio.

---

## Licencia

Este proyecto es solo para fines educativos.

---

**Autor:**  
Trabajo Práctico Final UNTREF  
Desarrollado por Tiziano Tomas Luzi Ramos
