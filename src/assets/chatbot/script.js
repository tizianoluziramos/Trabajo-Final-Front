const toggleBtn = document.getElementById("chatbot-toggle");
const chatbotWindow = document.getElementById("chatbot-window");
const sendBtn = document.getElementById("chatbot-send");
const input = document.getElementById("chatbot-input");
const messages = document.getElementById("chatbot-messages");
const suggestions = document.getElementById("chatbot-suggestions");

const responses = {
  hola: "¡Hola! 👋 ¿Cómo estás?",
  buenas: "¡Buenas! ¿Todo bien?",
  "buenos dias": "¡Buenos días ☀️! Espero que tengas un gran día.",
  "buenas tardes": "¡Buenas tardes 🌇! ¿En qué te ayudo?",
  "buenas noches": "¡Buenas noches 🌙! ¿Buscas algo en particular?",
  saludo: "¡Hola! 😃 Bienvenido/a, ¿en qué puedo ayudarte?",
  hi: "Hi! 👋 How can I help you?",
  envio: "Hacemos envíos a todo el país en 24hs 🚚.",
  envios: "Sí, enviamos a todo el país 📦.",
  "cuanto tarda el envio": "El envío tarda entre 24 y 48hs ⏱️.",
  "costo de envio":
    "El costo del envío depende de tu ubicación. En compras mayores a $20.000 es gratis 🎉.",
  "envio internacional":
    "Actualmente solo realizamos envíos dentro del país 🌎.",
  pago: "Aceptamos tarjetas Visa, MasterCard y MercadoPago 💳.",
  "formas de pago":
    "Podés pagar con tarjeta de crédito, débito y MercadoPago ✅.",
  tarjetas: "Aceptamos Visa, MasterCard, American Express y MercadoPago.",
  cuotas:
    "Podés abonar en hasta 24 cuotas sin interés en productos seleccionados 💰.",
  "pago en cuotas":
    "Sí, algunas compras pueden dividirse en varias cuotas sin interés.",
  "pago seguro": "Todas las transacciones son 100% seguras 🔒.",
  contacto: "Podés escribirnos a soporte@ecommerce.com 📧.",
  email: "Nuestro correo de contacto es soporte@ecommerce.com 📬.",
  telefono: "Nuestro teléfono de atención es +54 (800) 555-1234 ☎️.",
  whatsapp: "También podés escribirnos por WhatsApp al +54 (800) 555-1234 💬.",
  "como contacto": "Podés contactarnos por correo, teléfono o WhatsApp 📲.",
  horario: "Nuestro horario de atención es de lunes a viernes de 9 a 18hs 🕘.",
  "abren los sabados": "Sí, abrimos los sábados de 9 a 13hs.",
  "cierran los domingos": "Los domingos descansamos 💤.",
  "horario de atencion":
    "Atendemos de lunes a viernes de 9 a 18hs y sábados de 9 a 13hs.",
  productos:
    "Tenemos una amplia variedad de productos. ¿Qué estás buscando? 🔎",
  "que productos tienen":
    "Podés ver todos nuestros productos en la sección 'Catálogo' 🛒.",
  ofertas: "¡Claro! Tenemos ofertas semanales en la sección 'Promociones' 🎁.",
  descuentos: "Podés ver los descuentos activos en 'Promociones' 💸.",
  novedades: "Las novedades están en la sección 'Nuevos Ingresos' 🌟.",
  "productos nuevos":
    "Revisá 'Nuevos Ingresos' para los últimos lanzamientos 🆕.",

  problema: "¿Qué problema estás teniendo? Intentaremos ayudarte 🔧.",
  falla: "Si algo no funciona, contanos los detalles y te ayudamos 🛠️.",
  "no funciona":
    "Lamentamos el inconveniente. ¿Podés describirnos el problema? 🤔",
  soporte: "Nuestro equipo de soporte te responderá lo antes posible 📨.",
  ayuda: "Estoy acá para ayudarte, preguntame lo que necesites 🙋‍♂️.",

  garantia: "Todos nuestros productos tienen 6 meses de garantía 📜.",
  devolucion: "Podés devolver tu compra dentro de los 7 días hábiles ✅.",
  reembolso: "Si devuelves el producto, te hacemos un reembolso completo 💵.",
  cambio: "Podés cambiar tu producto si no estás satisfecho 🛍️.",
  ubicacion: "Estamos en 101 E. Chapman Ave, Orange, CA 92866 🏬.",
  direccion: "Nuestra dirección es 101 E. Chapman Ave, Orange, CA 92866 📍.",
  empresa:
    "Somos una empresa con más de 10 años de experiencia en e-commerce 💼.",
  "quienes son":
    "Somos un equipo apasionado por ofrecer productos de calidad 👨‍💻👩‍💻.",

  gracias: "¡De nada! 😊 Siempre que necesites algo, aquí estaré.",
  adios: "¡Adiós! 👋 Que tengas un excelente día.",
  "hasta luego": "Hasta luego 👋, ¡vuelve pronto!",
  "nos vemos": "Nos vemos 👋, gracias por visitarnos!",

  default: "No entendí 🤔. ¿Querés que te pase con un agente humano?",
};

toggleBtn.addEventListener("click", () => {
  chatbotWindow.style.display =
    chatbotWindow.style.display === "none" ? "flex" : "none";
});

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

input.addEventListener("input", () => {
  const text = input.value.trim().toLowerCase();
  if (!text) {
    suggestions.style.display = "none";
    return;
  }

  const matches = Object.keys(responses)
    .filter((k) => k !== "default" && k.startsWith(text))
    .slice(0, 5);

  if (matches.length === 0) {
    suggestions.style.display = "none";
    return;
  }

  suggestions.innerHTML = matches.map((k) => `<p>${k}</p>`).join("");
  suggestions.style.display = "block";

  Array.from(suggestions.children).forEach((p) => {
    p.onclick = () => {
      input.value = p.textContent;
      suggestions.style.display = "none";
      input.focus();
    };
  });
});

sendBtn.addEventListener("click", () => {
  suggestions.style.display = "none";
});
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") suggestions.style.display = "none";
});

function sendMessage() {
  const text = input.value.trim().toLowerCase();
  if (!text) return;

  if (text === "/clear") {
    messages.innerHTML = "";
    input.value = "";
    return;
  }

  addMessage("Tú", text);

  let reply;
  if (text === "ayuda") {
    const commands = Object.keys(responses).filter((k) => k !== "default");
    reply =
      "Comandos disponibles:\n- " +
      commands.join("\n- ") +
      "\n- /clear (limpiar chat)";
  } else {
    reply = responses[text];
    if (!reply) {
      for (const key in responses) {
        if (text.includes(key)) {
          reply = responses[key];
          break;
        }
      }
    }
    reply = reply || responses["default"];
  }

  setTimeout(() => addMessage("Bot", reply), 500);
  input.value = "";
}

function addMessage(sender, text) {
  messages.innerHTML += `<p><strong>${sender}:</strong> ${text}</p>`;
  messages.scrollTop = messages.scrollHeight;
}

const chatWindow = document.getElementById("chatbot-window");

toggleBtn.addEventListener("click", () => {
  if (chatWindow.classList.contains("open")) {
    chatWindow.classList.remove("open");
    chatWindow.classList.add("closing");
    setTimeout(() => {
      chatWindow.classList.remove("closing");
    }, 300);
  } else {
    chatWindow.classList.add("open");
  }
});
