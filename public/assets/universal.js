if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
  navigator.serviceWorker.register('/serviceworker.js');
  });
}

        var onltext = document.getElementById("connected");
        let onlinechecker = setInterval(() => {
          if (socket.connected == true) {
            onltext.textContent = '🗲'
            onltext.style.color = 'gold'
            onltext.setAttribute("tooltip", "You are connected to the server.");
          } else if (socket.connected == false) {
            onltext.textContent = '!'
            onltext.style.color = 'red'
            onltext.setAttribute("tooltip", "You are not connected to the server.");
          }
        }, 1500);
