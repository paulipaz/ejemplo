function login() {
  const userIn = document.getElementById("usuario").value;
  const passIn = document.getElementById("contrasena").value;
  const res = document.getElementById("resultado");

  // List of authorized users
  const users = [
    { name: "Pauli", pass: "333" },
    { name: "Admin", pass: "1234" },
    { name: "User3", pass: "555" }
  ];

  // Check if the input matches any user in the list
  const authorized = users.find(u => u.name === userIn && u.pass === passIn);

  if (authorized) {
    res.textContent = "¡Inicio de sesión exitoso!";
    res.className = "text-center mt-3 text-success fw-bold";
  } else {
    res.textContent = "Error: Usuario o contraseña incorrectos.";
    res.className = "text-center mt-3 text-danger fw-bold";
  }
}
